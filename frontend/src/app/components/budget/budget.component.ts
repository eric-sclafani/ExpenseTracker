import { Component, input, model, signal } from '@angular/core';
import { Budget } from '../../models/budget';
import { ExpenseService } from '../../services/expense.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'budget',
  imports: [ReactiveFormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent {
  budget = model<Budget | null>(null);

  fg = new FormGroup({
    cashIn: new FormControl<number | null>(null),
  });
  success: boolean | null = null;

  //TODO:
  // Implement dialog for adding stuff https://itnext.io/angular-and-pure-html-dialogs-da79a37ac1e7
  // Implement snack bar component https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_snackbar

  constructor(private _expenseService: ExpenseService) {}

  onSubmit() {
    const val = this.fg.controls.cashIn.value;
    if (val != null) {
      const budget = new Budget();
      budget.cashIn = val!;

      this._expenseService.setCashIn(budget).subscribe({
        next: () => {
          this.setSuccess(true);
        },
        error: () => this.setSuccess(false),
        complete: () => {
          this._expenseService
            .fetchBudget()
            .subscribe((resp) => this.budget.set(resp.body));
        },
      });
    }
  }

  private setSuccess(val: boolean) {
    this.success = val;
    setTimeout(() => (this.success = null), 2000);
  }
}
