import { Injectable, signal, computed } from '@angular/core';
import { Transaction } from '../forms/TransactionForm.component';

const STORAGE_KEY = 'finance-tracker-transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactionStoreService {
  private readonly _transactions = signal<Transaction[]>(this.load());

  readonly transactions = computed(() =>
    [...this._transactions()].sort((a, b) => b.date.localeCompare(a.date)),
  );

  getAll(): Transaction[] {
    return this.transactions();
  }

  add(transaction: Transaction): void{
    this._transactions.update(prev => [transaction, ...prev] )
    this.save()
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._transactions()))
  }

  update(id: string, next: Transaction): void {
    this._transactions.update(prev => prev.map(t => (t.id === id ? next: t)));
    this.save();
  }

  private load(): Transaction[]{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try{
      return JSON.parse(raw) as Transaction[]
    } catch{
      return[]
    }
  }
}
