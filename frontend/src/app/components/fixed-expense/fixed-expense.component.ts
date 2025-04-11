import { Component, OnInit, signal } from '@angular/core';
import { FixedExpense } from '../../models/fixedExpense';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'fixed-expense',
  imports: [ReactiveFormsModule],
  templateUrl: './fixed-expense.component.html',
  styleUrl: './fixed-expense.component.scss',
})
export class FixedExpenseComponent implements OnInit {
  // TODO: add validation
  fg = new FormGroup({
    category: new FormControl<string | null>(null),
    amount: new FormControl<number | null>(null),
  });

  fixedExpenses = signal<FixedExpense[]>([]);

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.fixedExpenses = this._expenseService.fixedExpenses;
  }

  onDelete(id: number) {
    this._expenseService.deleteFixedExpense(id).subscribe({
      complete: () => {
        this._expenseService.fetchAllData();
      },
    });
  }

  onUpdate(id: number) {
    const fixedExp = this.fixedExpenses().find((f) => f.id == id);
    if (fixedExp) {
    }
  }

  onSubmit() {
    const fixedExp = this.fg.value as FixedExpense;

    this._expenseService.addFixedExpense(fixedExp).subscribe({
      next: (d) => console.log(d),
      error: (e) => console.log(e),
      complete: () => {
        this._expenseService.fetchAllData();
        this.fg.reset();
      },
    });
  }
}
