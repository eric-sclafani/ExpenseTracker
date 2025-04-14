import { Component, OnInit, signal } from '@angular/core';
import { Budget } from '../../models/budget';
import { ExpenseService } from '../../services/expense.service';
import { FormControl, FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'budget',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
  budget = signal<Budget | null>(null);

  cashIn: number | null = null;
  success: boolean | null = null;

  isEditing = false;

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.budget = this._expenseService.budget;
  }

  onDoubleClick() {
    this.isEditing = true;
    this.cashIn = this.budget()?.cashIn!;
  }

  onCancel() {
    this.isEditing = false;
  }

  onSubmit() {
    if (this.cashIn != null) {
      const budget = new Budget();
      budget.cashIn = this.cashIn;

      this._expenseService.setCashIn(budget).subscribe({
        next: (d) => console.log(d),
        error: (e) => console.log(e),
        complete: () => {
          this._expenseService.fetchAllData();
          this.cashIn = null;
          this.isEditing = false;
        },
      });
    }
  }
}
