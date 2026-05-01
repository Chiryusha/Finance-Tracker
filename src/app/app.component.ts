import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Transaction, TransactionFormComponent } from 'src/forms/TransactionForm.component';
import { TuiRoot } from '@taiga-ui/core';
import { TransactionStoryComponent } from 'src/story/transactionStory.component';
import { DiagramComponent } from 'src/diagrams/diagram.component';

@Component({
  standalone: true,
  imports: [RouterModule, TransactionFormComponent, TuiRoot, TransactionStoryComponent, DiagramComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'FinanceTracker';
  editingTransaction: Transaction | null = null;

  onEditRequested(tx: Transaction): void{
    this.editingTransaction = {...tx};
  }

  editCompleted() : void {
    this.editingTransaction = null;
  }

  
}
