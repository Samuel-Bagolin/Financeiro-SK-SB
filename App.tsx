
import React, { useState, useEffect, useMemo } from 'react';
import { onValue, set } from "firebase/database";
import { stateRef } from './firebase.ts';
import { YearData, MonthData, ViewState, Bill, AppState } from './types';
import { MONTH_NAMES, INITIAL_BILLS, INITIAL_INCOME } from './constants';
import Dashboard from './components/Dashboard.tsx';
import MonthDetail from './components/MonthDetail.tsx';
import Reports from './components/Reports.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ years: [], reserve: 0 });
  const [viewState, setViewState] = useState<ViewState>({ view: 'dashboard', year: 2026 });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Sync from Firebase on mount
  useEffect(() => {
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setState(data);
      } else {
        // Initialize if first time
        initializeDefault();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync to Firebase on change
  const saveToCloud = async (newState: AppState) => {
    setIsSaving(true);
    try {
      await set(stateRef, newState);
    } catch (e) {
      console.error("Firebase save error:", e);
    } finally {
      // Small timeout for visual feedback
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const initializeDefault = () => {
    const defaultYear: YearData = {
      year: 2026,
      months: MONTH_NAMES.map((name, index) => ({
        id: index,
        name,
        bills: INITIAL_BILLS.map(b => ({ ...b, id: crypto.randomUUID() })),
        income: { ...INITIAL_INCOME }
      }))
    };
    const newState = { years: [defaultYear], reserve: 0 };
    setState(newState);
    saveToCloud(newState);
  };

  const currentYearData = useMemo(() => {
    return state.years.find(y => y.year === viewState.year) || state.years[0];
  }, [state.years, viewState.year]);

  const handleCreateNewYear = () => {
    const lastYear = state.years[state.years.length - 1];
    const newYearNumber = (lastYear?.year || 2026) + 1;
    
    const newYear: YearData = {
      year: newYearNumber,
      months: lastYear ? lastYear.months.map(m => ({
        ...m,
        bills: m.bills.map(b => ({ ...b, paid: false, id: crypto.randomUUID() }))
      })) : MONTH_NAMES.map((name, index) => ({
        id: index,
        name,
        bills: INITIAL_BILLS.map(b => ({ ...b, id: crypto.randomUUID() })),
        income: { ...INITIAL_INCOME }
      }))
    };

    const newState = { ...state, years: [...state.years, newYear] };
    setState(newState);
    setViewState({ view: 'dashboard', year: newYearNumber });
    saveToCloud(newState);
  };

  const updateMonthData = (yearNum: number, monthId: number, updatedMonth: MonthData) => {
    const newState = {
      ...state,
      years: state.years.map(y => {
        if (y.year !== yearNum) return y;
        return {
          ...y,
          months: y.months.map(m => m.id === monthId ? updatedMonth : m)
        };
      })
    };
    setState(newState);
    saveToCloud(newState);
  };

  const deleteBill = (yearNum: number, monthId: number, billId: string) => {
    const newState = {
      ...state,
      years: state.years.map(y => {
        if (y.year !== yearNum) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.id === monthId) {
              return { ...m, bills: m.bills.filter(b => b.id !== billId) };
            }
            return m;
          })
        };
      })
    };
    setState(newState);
    saveToCloud(newState);
  };

  const addFixedBill = (yearNum: number, monthId: number, bill: Omit<Bill, 'id'>, replicate: boolean) => {
    const newState = {
      ...state,
      years: state.years.map(y => {
        if (y.year !== yearNum) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.id === monthId || (replicate && m.id > monthId)) {
              return {
                ...m,
                bills: [...m.bills, { ...bill, id: crypto.randomUUID() }]
              };
            }
            return m;
          })
        };
      })
    };
    setState(newState);
    saveToCloud(newState);
  };

  const updateReserve = (value: number) => {
    const newState = { ...state, reserve: value };
    setState(newState);
    saveToCloud(newState);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="loader mb-4"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Sincronizando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-10">
      {/* Cloud Sync Status Indicator */}
      <div className="fixed top-2 right-4 z-[100] flex items-center gap-2 pointer-events-none transition-opacity duration-300">
        {isSaving ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
            <div className="loader !w-3 !h-3"></div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Nuvem</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 backdrop-blur-md opacity-50">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sincro</span>
          </div>
        )}
      </div>

      {viewState.view === 'dashboard' && currentYearData && (
        <Dashboard 
          yearData={currentYearData} 
          reserve={state.reserve}
          onMonthClick={(id) => setViewState({ ...viewState, view: 'month', monthId: id })}
          onCreateYear={handleCreateNewYear}
          years={state.years.map(d => d.year)}
          onYearChange={(y) => setViewState({ ...viewState, year: y })}
          onUpdateReserve={updateReserve}
          onOpenReports={() => setViewState({ ...viewState, view: 'reports' })}
        />
      )}

      {viewState.view === 'month' && currentYearData && viewState.monthId !== undefined && (
        <MonthDetail 
          month={currentYearData.months[viewState.monthId]}
          reserve={state.reserve}
          onBack={() => setViewState({ ...viewState, view: 'dashboard' })}
          onUpdate={(updated) => updateMonthData(viewState.year, viewState.monthId!, updated)}
          onAddFixedBill={(bill, replicate) => addFixedBill(viewState.year, viewState.monthId!, bill, replicate)}
          onDeleteBill={(id) => deleteBill(viewState.year, viewState.monthId!, id)}
          onAddToReserve={(amount) => updateReserve(state.reserve + amount)}
        />
      )}

      {viewState.view === 'reports' && (
        <Reports 
          allYears={state.years}
          reserve={state.reserve}
          onBack={() => setViewState({ ...viewState, view: 'dashboard' })}
        />
      )}
    </div>
  );
};

export default App;
