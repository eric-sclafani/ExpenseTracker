import { Component, OnInit, signal } from '@angular/core';
import { ExpenseService } from './services/expense.service';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { BudgetComponent } from './components/budget/budget.component';
import { FixedExpenseComponent } from './components/fixed-expense/fixed-expense.component';

@Component({
  selector: 'app-root',
  imports: [PurchaseComponent, BudgetComponent, FixedExpenseComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this._expenseService.fetchAllData();
  }
}
