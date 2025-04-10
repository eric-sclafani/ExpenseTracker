import { Component, OnInit, signal } from '@angular/core';
import { ExpenseService } from './services/expense.service';
import { mergeMap } from 'rxjs';
import { FixedExpense } from './models/fixedExpense';
import { Budget } from './models/budget';
import { Purchase } from './models/purchase';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { BudgetComponent } from './components/budget/budget.component';
import { FixedExpenseComponent } from './components/fixed-expense/fixed-expense.component';

@Component({
  selector: 'app-root',
  imports: [PurchaseComponent, BudgetComponent, FixedExpenseComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  budget = signal<Budget | null>(null);
  fixedExpenses = signal<FixedExpense[]>([]);
  purchases = signal<Purchase[]>([]);

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this._expenseService
      .fetchBudget()
      .pipe(
        mergeMap((resp) => {
          this.budget.set(resp.body);
          return this._expenseService.fetchFixedExpenses();
        }),

        mergeMap((resp) => {
          this.fixedExpenses.set(resp.body!);
          return this._expenseService.fetchPurchases();
        })
      )
      .subscribe((resp) => this.purchases.set(resp.body!));
  }
}
