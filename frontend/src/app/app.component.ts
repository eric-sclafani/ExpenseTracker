import { Component, OnInit, signal } from '@angular/core';
import { ExpenseService } from './services/expense.service';
import { mergeMap } from 'rxjs';
import { FixedExpense } from './models/fixedExpense';
import { Budget } from './models/budget';
import { Purchase } from './models/purchase';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { BudgetComponent } from './components/budget/budget.component';

@Component({
  selector: 'app-root',
  imports: [PurchaseComponent, BudgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  budget = signal<Budget | null>(null);
  fixedExpenses = signal<FixedExpense[]>([]);
  purchases = signal<Purchase[]>([]);

  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this._expenseService
      .getBudgetData()
      .pipe(
        mergeMap((resp) => {
          this.budget.set(resp.body);
          return this._expenseService.getFixedExpenses();
        }),

        mergeMap((resp) => {
          this.fixedExpenses.set(resp.body!);
          return this._expenseService.getPurchases();
        })
      )
      .subscribe((resp) => this.purchases.set(resp.body!));
  }
}
