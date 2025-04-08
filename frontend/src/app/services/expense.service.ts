import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Observable } from 'rxjs';
import { FixedExpense } from '../models/fixedExpense';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl = 'http://localhost:5043/api/Expense/';
  constructor(private http: HttpClient) {}

  private makeGetRequest<Type>(url: string): Observable<HttpResponse<Type>> {
    return this.http.get<Type>(this.baseUrl + url, { observe: 'response' });
  }

  getBudgetData() {
    return this.makeGetRequest<Budget>('GetBudget');
  }

  getFixedExpenses() {
    return this.makeGetRequest<FixedExpense>('GetFixedExpenses');
  }

  getPurchases() {
    return this.makeGetRequest<Purchase>('GetPurchases');
  }
}
