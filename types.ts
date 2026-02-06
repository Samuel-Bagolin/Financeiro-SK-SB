
export interface Bill {
  id: string;
  name: string;
  dueDate: string; // "10" or "—"
  value: number;
  paid: boolean;
  note: string;
}

export interface Income {
  samuel: number;
  sammia: number;
  others: number;
}

export interface MonthData {
  id: number; // 0-11
  name: string;
  bills: Bill[];
  income: Income;
}

export interface YearData {
  year: number;
  months: MonthData[];
}

export interface AppState {
  years: YearData[];
  reserve: number;
}

export type ViewState = {
  view: 'dashboard' | 'month' | 'reports';
  year: number;
  monthId?: number;
};
