import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Budget } from '../models/budget';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { FixedExpense } from '../models/fixedExpense';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl = 'http://localhost:5043/api/Expense/';

  budget = signal<Budget | null>(null);
  fixedExpenses = signal<FixedExpense[]>([]);
  purchases = signal<Purchase[]>([]);

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  private get<Type>(url: string): Observable<Type> {
    return this.http.get<Type>(this.baseUrl + url);
  }

  private post<Type>(url: string, data: any): Observable<Type> {
    return this.http
      .post<Type>(this.baseUrl + url, data)
      .pipe(catchError(this.handleError));
  }

  private delete<Type>(url: string): Observable<Type> {
    return this.http
      .delete<Type>(this.baseUrl + url)
      .pipe(catchError(this.handleError));
  }

  private patch<Type>(url: string, data: any): Observable<Type> {
    return this.http.patch<Type>(this.baseUrl + url, data);
  }

  fetchAllData() {
    this.fetchBudget()
      .pipe(
        mergeMap((resp) => {
          this.budget.set(resp);
          return this.fetchFixedExpenses();
        }),

        mergeMap((resp) => {
          this.fixedExpenses.set(resp);
          return this.fetchPurchases();
        })
      )
      .subscribe((resp) => this.purchases.set(resp));
  }

  fetchBudget() {
    return this.get<Budget>('GetBudget');
  }

  setCashIn(budget: Budget) {
    return this.post<Budget>('SetCashIn', budget);
  }

  fetchFixedExpenses() {
    return this.get<FixedExpense[]>('GetFixedExpenses');
  }

  addFixedExpense(fixedExp: FixedExpense) {
    return this.post<FixedExpense>('NewFixedExpense', fixedExp);
  }

  deleteFixedExpense(id: number) {
    return this.delete<FixedExpense>(`DeleteFixedExpense?id=${id}`);
  }

  updateFixedExpense(fixedExp: FixedExpense) {
    return this.patch<FixedExpense>('UpdateFixedExpense', fixedExp);
  }

  fetchPurchases() {
    return this.get<Purchase[]>('GetPurchases');
  }

  addPurchase(purchase: Purchase) {
    return this.post('AddPurchase', purchase);
  }
}
