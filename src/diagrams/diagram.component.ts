import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiRingChart} from '@taiga-ui/addon-charts';
import { TransactionStoreService } from 'src/services/transaction.store.service';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [CommonModule, TuiRingChart],
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramComponent {
  private readonly store = inject(TransactionStoreService);
  
  private readonly total = this.store.transactions

  readonly incomeByCategory = computed(() => {
  const sums: Record<string, number> = {};
  for (const tx of this.total()) {
    if (tx.type !== 'income') continue;
    sums[tx.category] = (sums[tx.category] ?? 0) + tx.amount;
  }

  return Object.entries(sums).map(([label, value]) => ({ label, value }));
});


readonly expenseByCategory = computed(() => {
  const sums: Record<string, number> = {};

  for (const tx of this.total()) {
    if (tx.type !== 'expense') continue;
    sums[tx.category] = (sums[tx.category] ?? 0) + tx.amount;
  }

  return Object.entries(sums).map(([label, value]) => ({ label, value }));
});

readonly incomeValues = computed(() => this.incomeByCategory().map(x => x.value));
readonly expenseValues = computed(() => this.expenseByCategory().map(x => x.value));

readonly incomeTotal = computed(() => this.incomeByCategory().reduce((s, x) => s + x.value, 0));
readonly expenseTotal = computed(() => this.expenseByCategory().reduce((s, x) => s + x.value, 0));

readonly incomeActiveIndex = signal<number>(NaN);
readonly expenseActiveIndex = signal<number>(NaN);

readonly activeIncome = computed(() => {
  const i = this.incomeActiveIndex();
  return Number.isNaN(i) ? null : this.incomeByCategory()[i] ?? null;
});

readonly activeExpense = computed(() => {
  const i = this.expenseActiveIndex();
  return Number.isNaN(i) ? null : this.expenseByCategory()[i] ?? null;
});

formatMoney(value: number): string {
  return `${new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ₽`;
}
}
