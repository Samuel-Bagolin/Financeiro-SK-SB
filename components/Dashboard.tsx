
import React, { useState } from 'react';
import { YearData } from '../types';

interface DashboardProps {
  yearData: YearData;
  reserve: number;
  onMonthClick: (id: number) => void;
  onCreateYear: () => void;
  years: number[];
  onYearChange: (year: number) => void;
  onUpdateReserve: (value: number) => void;
  onOpenReports: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  yearData, 
  reserve, 
  onMonthClick, 
  onCreateYear, 
  years, 
  onYearChange, 
  onUpdateReserve,
  onOpenReports
}) => {
  const [isEditingReserve, setIsEditingReserve] = useState(false);
  const [editReserveValue, setEditReserveValue] = useState(reserve.toString());

  const handleSaveReserve = () => {
    onUpdateReserve(parseFloat(editReserveValue) || 0);
    setIsEditingReserve(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Financeiro SK/SB</h1>
          <p className="text-zinc-400 text-sm">Controle sua liberdade financeira</p>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={onOpenReports}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 p-2 rounded-lg transition-colors border border-zinc-700"
            title="Ver Relatórios"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </button>
           <select 
            value={yearData.year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button 
            onClick={onCreateYear}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 p-2 rounded-lg transition-colors border border-zinc-700"
            title="Criar novo ano"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      {/* Caixinha Section */}
      <div className="mb-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Caixinha (Reserva)</h2>
            {isEditingReserve ? (
              <div className="flex items-center gap-2 mt-1">
                <input 
                  autoFocus
                  type="number"
                  value={editReserveValue}
                  onChange={(e) => setEditReserveValue(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xl font-bold w-32 outline-none focus:border-emerald-500"
                />
                <button onClick={handleSaveReserve} className="p-1 bg-emerald-500 text-zinc-900 rounded-lg hover:bg-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <p className="text-3xl font-black text-emerald-400">R$ {reserve.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            )}
          </div>
        </div>
        {!isEditingReserve && (
          <button 
            onClick={() => { setIsEditingReserve(true); setEditReserveValue(reserve.toString()); }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-all border border-zinc-700"
          >
            Editar Saldo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {yearData.months.map((month) => {
          const totalBills = month.bills.reduce((acc, curr) => acc + curr.value, 0);
          const totalPaid = month.bills.filter(b => b.paid).reduce((acc, curr) => acc + curr.value, 0);
          const totalIncome = month.income.samuel + month.income.sammia + month.income.others;
          const result = totalIncome - totalBills;
          const isPositive = result >= 0;

          return (
            <button
              key={month.id}
              onClick={() => onMonthClick(month.id)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 text-left hover:border-zinc-700 transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-1 h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">{month.name}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {isPositive ? 'Sobra' : 'Falta'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Contas</span>
                  <span className="text-zinc-300">R$ {totalBills.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Pago</span>
                  <span className="text-emerald-500 font-medium">R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Saldo Final</span>
                  <span className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    R$ {Math.abs(result).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
