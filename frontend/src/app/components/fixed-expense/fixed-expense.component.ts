import { Component, model, OnInit } from '@angular/core';
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
    category: new FormControl(''),
    amount: new FormControl(0),
  });

  fixedExpenses = model<FixedExpense[]>([]);

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {}

  onSubmit() {
    const fixedExp = this.fg.value as FixedExpense;
  }
}
