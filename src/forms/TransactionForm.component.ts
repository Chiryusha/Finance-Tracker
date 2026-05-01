import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiTextfield, 
  TuiNumberFormat, 
  TuiButton, 
  TuiAlertService,
  TuiError} from '@taiga-ui/core';

import {
  TuiFieldErrorPipe,
  tuiValidationErrorsProvider,
  TuiBlock, 
  TuiCheckbox, 
  TuiSelect, 
  TuiInputNumber, 
  tuiInputNumberOptionsProvider,
  TuiDataListWrapper,
  TuiChevron,
  TuiInputDate,
  TuiTextarea
} from '@taiga-ui/kit';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiCurrencyPipe} from '@taiga-ui/addon-commerce';
import {TuiDay} from '@taiga-ui/cdk';
import { CommentDirective } from '../directives/comment.directive';
import { TransactionStoreService } from '../services/transaction.store.service';

export type OperationType = 'income' | 'expense';
export type Category = string;

export type Transaction = {
  id: string
  type: OperationType,
  category: Category,
  amount: number
  date: string,
  comment?: string
};

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    TuiBlock, 
    TuiCheckbox,
    ReactiveFormsModule,
    TuiTextfield,
    TuiSelect,
    TuiNumberFormat,
    TuiInputNumber,
    TuiDataListWrapper,
    TuiChevron,
    TuiCurrencyPipe,
    TuiInputDate,
    TuiButton,
    TuiTextarea,
    CommentDirective,
    TuiError,
    TuiFieldErrorPipe
  ],
  templateUrl: './TransactionForm.component.html',
  styleUrl: './TransactionForm.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    tuiInputNumberOptionsProvider({
    }),

    tuiValidationErrorsProvider({
      required: 'Это поле обязательное. Заполните его',
      min: ({min}) => `Введите число не меньше ${min}`,
      max: ({max}) => `Введите число не больше ${max}`,
      maxlength: ({requiredLength}) => `Максимум ${requiredLength} символов`,
      commentRequired:"Комментарий обязателен, если чекбокс включен"
    })
  ]
})
export class TransactionFormComponent implements OnChanges {
 readonly form = new FormGroup({
  type: new FormControl<OperationType | null> (null, {validators: [Validators.required]}),
  category: new FormControl<Category | ""> ("", {validators: [Validators.required]}),
  accumulation: new FormControl<number | null> (null, {validators: [Validators.required, Validators.min(0), Validators.max(10**7)]}),
  date: new FormControl<TuiDay | null> (null, {validators: [Validators.required]}),
  addComment: new FormControl<boolean>(false, {nonNullable: true}),
  comment: new FormControl<string | ""> ("", {nonNullable: true})
 }) 

readonly incomes: Category[] = ['Зарплата', 'Фриланс', 'Подарок', 'Кэшбэк'];
readonly expenses: Category[] = ['Еда', 'Транспорт', 'Жилье', 'Развлечения'];
protected readonly today = TuiDay.currentLocal();
private readonly alerts = inject(TuiAlertService);
private readonly store = inject<TransactionStoreService>(TransactionStoreService);
@Input() editingTransaction: Transaction | null = null;
@Output() editCompleted = new EventEmitter<Transaction>();

private editingId: string | null = null;

constructor() {
  this.form.controls.type.valueChanges.subscribe((type) => {
    this.form.controls.category.reset('', {emitEvent: false});

    if (type) {
      this.form.controls.category.enable({ emitEvent: false });
    }
    else {
       this.form.controls.category.disable({ emitEvent: false });
    }
    });
}

get currentCategories(): readonly Category[] {
  const type = this.form.controls.type.value;
  if (type === "income") return this.incomes
  else if (type === "expense") return this.expenses
  return []
}

get categoryError(): string | null {
  const type = this.form.controls.type;
  const category = this.form.controls.category;
  if ((!type.value && type.touched) || (!type.value && category.touched)) {
    return 'Сначала выберите тип транзакции';
  }

  return null;
}


ngOnChanges(changes: SimpleChanges): void {
  const tx = changes['editingTransaction']?.currentValue as Transaction | null;
  if (!tx) return;

  this.editingId = tx.id
  this.form.patchValue({
      type: tx.type,
      category: tx.category,
      accumulation: tx.amount,
      date: TuiDay.jsonParse(tx.date),
      addComment: !!tx.comment,
      comment: tx.comment ?? '',
    });

  this.form.controls.category.enable({ emitEvent: false });
}


onSubmit(): void {
  this.form.markAllAsTouched();
  if (this.form.invalid) return;

  const v = this.form.getRawValue();
  
  if (!v.type || !v.date || !v.category || v.accumulation === null) return;
  const transaction: Transaction = {
    id: this.editingId ?? crypto.randomUUID(),
    type: v.type,
    category: v.category,
    amount: v.accumulation,
    date: v.date.toJSON(),
    comment: v.addComment ? v.comment.trim() : '',
  };

  if (this.editingId) {
      this.store.update(this.editingId!, transaction);
    } else {
      this.store.add(transaction);
    }

    this.editingId = null;
    this.editCompleted.emit();
    this.form.reset({
      type: null,
      category: '',
      accumulation: null,
      date: null,
      addComment: false,
      comment: '',
    });
    this.form.controls.category.disable({ emitEvent: false });

  this.alerts
    .open('Транзакция успешно сохранена', {
      label: 'Успех',
      appearance: 'positive',
      autoClose: 3000,
    })
    .subscribe();

}
}
