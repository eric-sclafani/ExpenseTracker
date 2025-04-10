import { Component, input, model, signal } from '@angular/core';
import { Budget } from '../../models/budget';
import { ExpenseService } from '../../services/expense.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'budget',
  imports: [FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent {
  budget = model<Budget | null>(null);
  cashIn = signal<number | null>(null);

  success: boolean | null = null;

  //TODO:
  // Implement dialog for adding stuff https://itnext.io/angular-and-pure-html-dialogs-da79a37ac1e7
  // Implement snack bar component https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_snackbar

  constructor(private _expenseService: ExpenseService) {}

  onSubmit() {
    if (this.cashIn() != null) {
      const budget = new Budget();
      budget.cashIn = this.cashIn()!;

      this._expenseService.setCashIn(budget).subscribe({
        next: () => this.setSuccess(true),
        error: () => this.setSuccess(false),
      });
    }
  }

  private setSuccess(val: boolean) {
    this.success = val;
    setTimeout(() => (this.success = null), 2000);
  }
}
