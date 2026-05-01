import { ChangeDetectionStrategy, Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiHint} from '@taiga-ui/core';
import { TransactionStoreService } from 'src/services/transaction.store.service';
import { SignPipePipe } from 'src/pipes/signPipe.pipe';
import { Transaction } from 'src/forms/TransactionForm.component';
@Component({
  selector: 'app-transaction-story',
  standalone: true,
  imports: [CommonModule, TuiHint, SignPipePipe],
  templateUrl: './transactionStory.component.html',
  styleUrl: './transactionStory.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionStoryComponent {
  @Output() edit = new EventEmitter<Transaction>();
  private readonly store = inject(TransactionStoreService);

  readonly transactions = this.store.transactions;
}
