import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './services/expense.service';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this._expenseService.getBudgetData().subscribe((d) => console.log(d));
  }
}
