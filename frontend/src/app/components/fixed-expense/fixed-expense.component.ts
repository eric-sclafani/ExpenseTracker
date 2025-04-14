import { Component, OnInit, signal } from '@angular/core';
import { FixedExpense } from '../../models/fixedExpense';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'fixed-expense',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './fixed-expense.component.html',
  styleUrl: './fixed-expense.component.scss',
})
export class FixedExpenseComponent implements OnInit {
  fg = new FormGroup({
    category: new FormControl<string | null>(null),
    amount: new FormControl<number | null>(null),
    note: new FormControl<string | null>(null),
  });

  fixedExpenses = signal<FixedExpense[]>([]);
  editingId = signal<number | null>(null);

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.fixedExpenses = this._expenseService.fixedExpenses;
  }

  onDoubleClick(id: number) {
    this.editingId.set(id);
  }

  onCancel() {
    this.editingId.set(null);
  }

  onDelete(id: number) {
    this._expenseService.deleteFixedExpense(id).subscribe({
      complete: () => {
        this._expenseService.fetchAllData();
      },
    });
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
