import { Pipe, PipeTransform } from '@angular/core';
import { OperationType } from 'src/forms/TransactionForm.component';

@Pipe({
  name: 'signPipe',
  standalone: true,
})
export class SignPipePipe implements PipeTransform {
  transform(amount:number | null | undefined, type: OperationType): string {
    if (amount === null || amount === undefined || Number.isNaN(amount))
      return '';


    const sign = type === 'income' ? '+' : '-';
    const formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(Math.abs(amount))
      .replace(/\u00A0|\u202F/g, ' ')
    return ` ${sign} ${formatted} ₽`
  }
}
