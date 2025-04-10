import { Component, OnInit, signal } from '@angular/core';
import { ExpenseService } from './services/expense.service';
import { mergeMap } from 'rxjs';
import { FixedExpense } from './models/fixedExpense';
import { Budget } from './models/budget';
import { Purchase } from './models/purchase';
import { KeyValuePipe } from '@angular/common';
import { PurchaseTableComponent } from './components/purchase-table/purchase-table.component';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe, PurchaseTableComponent],
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
