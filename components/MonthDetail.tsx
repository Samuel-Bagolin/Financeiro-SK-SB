
import React, { useState } from 'react';
import { MonthData, Bill } from '../types';

interface MonthDetailProps {
  month: MonthData;
  reserve: number;
  onBack: () => void;
  onUpdate: (updatedMonth: MonthData) => void;
  onAddFixedBill: (bill: Omit<Bill, 'id'>, replicate: boolean) => void;
  onDeleteBill: (id: string) => void;
  onAddToReserve: (amount: number) => void;
}

const MonthDetail: React.FC<MonthDetailProps> = ({ 
  month, 
  reserve,
  onBack, 
  onUpdate, 
  onAddFixedBill, 
  onDeleteBill,
  onAddToReserve
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBill, setNewBill] = useState<Omit<Bill, 'id'>>({
    name: '',
    dueDate: '—',
    value: 0,
    paid: false,
    note: ''
  });
  const [replicate, setReplicate] = useState(false);

  const totalBills = month.bills.reduce((acc, curr) => acc + curr.value, 0);
  const totalPaid = month.bills.filter(b => b.paid).reduce((acc, curr) => acc + curr.value, 0);
  const totalPending = totalBills - totalPaid;
  const totalIncome = month.income.samuel + month.income.sammia + month.income.others;
  const finalResult = totalIncome - totalBills;
  const isPositive = finalResult >= 0;

  const handleTogglePaid = (billId: string) => {
    const updatedBills = month.bills.map(b => 
      b.id === billId ? { ...b, paid: !b.paid } : b
    );
    onUpdate({ ...month, bills: updatedBills });
  };

  const handleUpdateBill = (billId: string, field: keyof Bill, value: any) => {
    const updatedBills = month.bills.map(b => 
      b.id === billId ? { ...b, [field]: value } : b
    );
    onUpdate({ ...month, bills: updatedBills });
  };

  const handleIncomeChange = (field: keyof typeof month.income, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0;
    onUpdate({
      ...month,
      income: { ...month.income, [field]: numValue }
    });
  };

  const handleAddBill = () => {
    if (!newBill.name) return;
    onAddFixedBill(newBill, replicate);
    setNewBill({ name: '', dueDate: '—', value: 0, paid: false, note: '' });
    setShowAddModal(false);
  };

  const today = new Date().getDate();

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <header className="flex items-center gap-4 mb-6 sticky top-0 bg-zinc-950/80 backdrop-blur-md py-4 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold">{month.name}</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Visão Detalhada</p>
        </div>
      </header>

      {/* Summary Banner */}
      <div className={`mb-8 p-6 rounded-3xl border ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} text-center overflow-hidden relative`}>
        <span className={`text-sm font-medium mb-1 block ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '🟢 VAI SOBRAR' : '🔴 VAI FALTAR'}
        </span>
        <h3 className={`text-4xl font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          R$ {Math.abs(finalResult).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>

        {isPositive && finalResult > 0 && (
          <button 
            onClick={() => onAddToReserve(finalResult)}
            className="mt-4 px-4 py-2 bg-emerald-500 text-zinc-950 font-bold text-sm rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Investir na Caixinha
          </button>
        )}
      </div>

      {/* Area 1: Contas */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-lg">Contas do Mês</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold bg-zinc-800 px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            + Adicionar
          </button>
        </div>
        
        <div className="space-y-3">
          {month.bills.length === 0 && (
            <div className="py-10 text-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-3xl">
              Nenhuma conta cadastrada para este mês.
            </div>
          )}
          {month.bills.map((bill) => {
            const dueDateNum = parseInt(bill.dueDate);
            const isNearDue = !bill.paid && !isNaN(dueDateNum) && (dueDateNum - today <= 3 && dueDateNum - today >= 0);
            
            return (
              <div 
                key={bill.id}
                className={`p-4 rounded-2xl border transition-all group ${
                  bill.paid 
                  ? 'bg-emerald-500/5 border-emerald-500/30' 
                  : isNearDue 
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={bill.paid}
                      onChange={() => handleTogglePaid(bill.id)}
                      className="w-6 h-6 rounded-full border-zinc-700 text-emerald-500 bg-zinc-800 focus:ring-emerald-500 focus:ring-offset-zinc-950 appearance-none border checked:bg-emerald-500 checked:border-transparent transition-all cursor-pointer"
                    />
                    {bill.paid && (
                      <svg className="absolute w-4 h-4 text-zinc-950 left-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <input 
                        className="bg-transparent font-bold text-zinc-100 w-full outline-none focus:text-white"
                        value={bill.name}
                        onChange={(e) => handleUpdateBill(bill.id, 'name', e.target.value)}
                      />
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                         <span className="text-[10px] text-zinc-500 font-bold uppercase">Venc.</span>
                         <input 
                           className="bg-zinc-800/50 text-[11px] font-bold w-10 text-center rounded py-0.5 outline-none focus:bg-zinc-700"
                           value={bill.dueDate}
                           onChange={(e) => handleUpdateBill(bill.id, 'dueDate', e.target.value)}
                         />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-zinc-400">R$</span>
                        <input 
                          type="number"
                          className="bg-transparent text-lg font-bold text-zinc-200 outline-none w-28 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={bill.value}
                          onChange={(e) => handleUpdateBill(bill.id, 'value', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isNearDue && (
                          <span className="text-[10px] font-black bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full animate-pulse">
                            VENCE LOGO
                          </span>
                        )}
                        <button 
                          onClick={() => onDeleteBill(bill.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <input 
                  placeholder="Observação..."
                  className="mt-3 w-full bg-zinc-950/50 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 outline-none focus:border-zinc-700 text-zinc-400"
                  value={bill.note}
                  onChange={(e) => handleUpdateBill(bill.id, 'note', e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Area 2: Receitas */}
      <section className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
        <h3 className="font-bold text-lg mb-4 px-2">Receitas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Samuel</label>
            <input 
              type="number"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 font-bold text-emerald-400 focus:border-emerald-500 outline-none"
              value={month.income.samuel}
              onChange={(e) => handleIncomeChange('samuel', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Sammia</label>
            <input 
              type="number"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 font-bold text-emerald-400 focus:border-emerald-500 outline-none"
              value={month.income.sammia}
              onChange={(e) => handleIncomeChange('sammia', e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Outros Recebimentos</label>
            <input 
              type="number"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 font-bold text-emerald-400 focus:border-emerald-500 outline-none"
              value={month.income.others}
              onChange={(e) => handleIncomeChange('others', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Area 3: Resumo Automático */}
      <section className="mb-20 p-6 bg-zinc-950 border border-zinc-800 rounded-3xl">
        <h3 className="font-bold text-lg mb-4 px-2">Resumo do Mês</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-zinc-900">
            <span className="text-zinc-500 font-medium">Total de Contas</span>
            <span className="font-bold text-zinc-300">R$ {totalBills.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-900">
            <span className="text-zinc-500 font-medium">Total Pago</span>
            <span className="font-bold text-emerald-500">R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-900">
            <span className="text-zinc-500 font-medium">Pendente</span>
            <span className="font-bold text-rose-500">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-zinc-100 font-black uppercase text-xs tracking-widest">Resultado Final</span>
            <span className={`text-xl font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              R$ {finalResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </section>

      {/* Modal Adicionar Conta */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-3xl p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6">Nova Conta</h2>
            
            <div className="space-y-4 mb-6">
              <input 
                placeholder="Nome da conta"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
                value={newBill.name}
                onChange={(e) => setNewBill({...newBill, name: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  placeholder="Dia (Venc)"
                  className="w-1/3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                />
                <input 
                  type="number"
                  placeholder="Valor"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700 font-bold text-emerald-400"
                  onChange={(e) => setNewBill({...newBill, value: parseFloat(e.target.value) || 0})}
                />
              </div>

              <label className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={replicate}
                  onChange={(e) => setReplicate(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 text-emerald-500 bg-zinc-800"
                />
                <span className="text-sm font-medium text-zinc-300">Replicar para os próximos meses</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddBill}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthDetail;
