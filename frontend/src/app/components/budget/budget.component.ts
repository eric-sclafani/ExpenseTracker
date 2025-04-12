import { Component, OnInit, signal } from '@angular/core';
import { Budget } from '../../models/budget';
import { ExpenseService } from '../../services/expense.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'budget',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
  budget = signal<Budget | null>(null);

  fg = new FormGroup({
    cashIn: new FormControl<number | null>(null),
  });
  success: boolean | null = null;

  //TODO:
  // Implement dialog for adding stuff https://itnext.io/angular-and-pure-html-dialogs-da79a37ac1e7
  // Implement snack bar component https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_snackbar

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.budget = this._expenseService.budget;
  }

  onSubmit() {
    const val = this.fg.controls.cashIn.value;
    if (val != null) {
      const budget = new Budget();
      budget.cashIn = val!;

      this._expenseService.setCashIn(budget).subscribe({
        next: (d) => console.log(d),
        error: (e) => console.log(e),
        complete: () => {
          this._expenseService.fetchAllData();
          this.fg.reset();
        },
      });
    }
  }
}
