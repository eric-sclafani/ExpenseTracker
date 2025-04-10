import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { catchError, Observable, throwError } from 'rxjs';
import { FixedExpense } from '../models/fixedExpense';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl = 'http://localhost:5043/api/Expense/';
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  private makeGetRequest<Type>(url: string): Observable<any> {
    return this.http.get<Type>(this.baseUrl + url, { observe: 'response' });
  }

  private makePostRequest<Type>(url: string, data: any): Observable<Type> {
    return this.http
      .post<Type>(this.baseUrl + url, data)
      .pipe(catchError(this.handleError));
  }

  getBudgetData() {
    return this.makeGetRequest<Budget>('GetBudget');
  }

  getFixedExpenses() {
    return this.makeGetRequest<FixedExpense[]>('GetFixedExpenses');
  }

  getPurchases() {
    return this.makeGetRequest<Purchase[]>('GetPurchases');
  }

  setCashIn(budget: Budget) {
    return this.makePostRequest<Budget>('SetCashIn', budget);
  }
}
