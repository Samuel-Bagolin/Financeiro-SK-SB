
import React from 'react';
import { YearData } from '../types';

interface ReportsProps {
  allYears: YearData[];
  reserve: number;
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ allYears, reserve, onBack }) => {
  const currentYear = allYears[allYears.length - 1];
  
  const annualStats = allYears.map(y => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let monthsProcessed = 0;

    y.months.forEach(m => {
      const monthIncome = m.income.samuel + m.income.sammia + m.income.others;
      const monthExpenses = m.bills.reduce((acc, b) => acc + b.value, 0);
      
      if (monthIncome > 0 || monthExpenses > 0) {
        totalIncome += monthIncome;
        totalExpenses += monthExpenses;
        monthsProcessed++;
      }
    });

    return {
      year: y.year,
      totalIncome,
      totalExpenses,
      net: totalIncome - totalExpenses,
      avgMonthlyNet: monthsProcessed > 0 ? (totalIncome - totalExpenses) / monthsProcessed : 0
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white">Relatórios Financeiros</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Desempenho Anual</p>
        </div>
      </header>

      {/* Global Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-2">Saldo em Reserva</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">R$ {reserve.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="text-xs text-zinc-500 font-medium">Total Acumulado</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Performance {currentYear.year}</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${annualStats[annualStats.length - 1].net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              R$ {Math.abs(annualStats[annualStats.length - 1].net).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-zinc-500 font-medium">{annualStats[annualStats.length - 1].net >= 0 ? 'Superavit' : 'Deficit'}</span>
          </div>
        </div>
      </div>

      {/* Yearly Tables */}
      <div className="space-y-10">
        {annualStats.slice().reverse().map(stat => (
          <div key={stat.year} className="overflow-hidden bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full block"></span>
              Resumo Ano {stat.year}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-500 uppercase">Receita Total</p>
                <p className="text-xl font-bold text-zinc-100">R$ {stat.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-500 uppercase">Gasto Total</p>
                <p className="text-xl font-bold text-zinc-100">R$ {stat.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-500 uppercase">Média Mensal</p>
                <p className={`text-xl font-bold ${stat.avgMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {Math.abs(stat.avgMonthlyNet).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-600 mb-2 px-1">
                <span>Gasto</span>
                <span>Receita</span>
              </div>
              <div className="h-4 w-full bg-zinc-950 rounded-full flex overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-rose-500/80 transition-all duration-1000" 
                  style={{ width: `${(stat.totalExpenses / (stat.totalIncome + stat.totalExpenses)) * 100}%` }}
                />
                <div 
                  className="h-full bg-emerald-500/80 transition-all duration-1000" 
                  style={{ width: `${(stat.totalIncome / (stat.totalIncome + stat.totalExpenses)) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 text-center italic">A barra mostra a proporção entre o que entra e o que sai do seu caixa.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
