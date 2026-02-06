
import { Bill, Income } from './types';

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const INITIAL_BILLS: Bill[] = [
  { id: '1', name: 'Parcela Casa', dueDate: '10', value: 5089.06, paid: false, note: '' },
  { id: '2', name: 'Condomínio', dueDate: '15', value: 607.31, paid: false, note: '' },
  { id: '3', name: 'Luz', dueDate: '16', value: 108.11, paid: false, note: '' },
  { id: '4', name: 'Água', dueDate: '4', value: 99.42, paid: false, note: '' },
  { id: '5', name: 'Internet', dueDate: '8', value: 110.96, paid: false, note: '' },
  { id: '6', name: 'Cartão C6', dueDate: '—', value: 6165.34, paid: false, note: '' },
  { id: '7', name: 'Cartão Nubank', dueDate: '—', value: 1557.77, paid: false, note: '' },
  { id: '8', name: 'Plano de Saúde', dueDate: '—', value: 951.62, paid: false, note: '' },
  { id: '9', name: 'Celular 1', dueDate: '1', value: 49.02, paid: false, note: '' },
  { id: '10', name: 'Celular 2', dueDate: '7', value: 42.99, paid: false, note: '' },
  { id: '11', name: 'Coleta', dueDate: '—', value: 100.00, paid: false, note: '' },
  { id: '12', name: 'Móveis Planejado', dueDate: '10', value: 381.00, paid: false, note: '' },
  { id: '13', name: 'Aluguel', dueDate: '—', value: 1000.00, paid: false, note: '' },
  { id: '14', name: 'Internet Clínica', dueDate: '—', value: 37.00, paid: false, note: '' },
  { id: '15', name: 'Água Clínica', dueDate: '—', value: 20.29, paid: false, note: '' },
  { id: '16', name: 'Conselho', dueDate: '—', value: 79.20, paid: false, note: '' },
  { id: '17', name: 'Dentista', dueDate: '—', value: 200.00, paid: false, note: '' },
  { id: '18', name: 'Seguro', dueDate: '—', value: 101.90, paid: false, note: '' },
  { id: '19', name: 'IPVA', dueDate: '—', value: 22.99, paid: false, note: '' },
];

export const INITIAL_INCOME: Income = {
  samuel: 9000,
  sammia: 5200,
  others: 0
};
