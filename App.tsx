
import React, { useState, useEffect, useMemo } from 'react';
import { YearData, MonthData, ViewState, Bill, AppState } from './types';
import { MONTH_NAMES, INITIAL_BILLS, INITIAL_INCOME } from './constants';
import Dashboard from './components/Dashboard.tsx';
import MonthDetail from './components/MonthDetail.tsx';
import Reports from './components/Reports.tsx';

const STORAGE_KEY = 'financeiro_sk_sb_v3_data';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ years: [], reserve: 0 });
  const [viewState, setViewState] = useState<ViewState>({ view: 'dashboard', year: 2026 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setState({ years: parsed, reserve: 0 });
        } else if (parsed && parsed.years) {
          setState(parsed);
        } else {
          initializeDefault();
        }
      } catch (e) {
        console.error("Error parsing storage data", e);
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && state.years.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loading]);

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
    setState({ years: [defaultYear], reserve: 0 });
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

    setState(prev => ({ ...prev, years: [...prev.years, newYear] }));
    setViewState({ view: 'dashboard', year: newYearNumber });
  };

  const updateMonthData = (yearNum: number, monthId: number, updatedMonth: MonthData) => {
    setState(prev => ({
      ...prev,
      years: prev.years.map(y => {
        if (y.year !== yearNum) return y;
        return {
          ...y,
          months: y.months.map(m => m.id === monthId ? updatedMonth : m)
        };
      })
    }));
  };

  const deleteBill = (yearNum: number, monthId: number, billId: string) => {
    setState(prev => ({
      ...prev,
      years: prev.years.map(y => {
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
    }));
  };

  const addFixedBill = (yearNum: number, monthId: number, bill: Omit<Bill, 'id'>, replicate: boolean) => {
    setState(prev => ({
      ...prev,
      years: prev.years.map(y => {
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
    }));
  };

  const updateReserve = (value: number) => {
    setState(prev => ({ ...prev, reserve: value }));
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-10">
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
