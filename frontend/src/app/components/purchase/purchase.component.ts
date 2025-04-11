import { Component, OnInit, signal } from '@angular/core';
import { Purchase } from '../../models/purchase';
import { columns } from './columns';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'purchase-table',
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent implements OnInit {
  purchases = signal<Purchase[]>([]);

  columns = columns;
  displayCols = this.columns.map((c) => c.header);

  fg = new FormGroup({
    date: new FormControl(new Date()),
    description: new FormControl<string | null>(''),
    vendor: new FormControl<string | null>(''),
    tag: new FormControl<string | null>(''),
    type: new FormControl<string | null>(''),
    amount: new FormControl(0),
  });

  constructor(private _expenseService: ExpenseService) {}

  // TODO: continue styling table https://piccalil.li/blog/styling-tables-the-modern-css-way/
  ngOnInit(): void {
    this.purchases = this._expenseService.purchases;
  }

  onSubmit() {
    const purchase = this.fg.value as Purchase;
    this._expenseService.addPurchase(purchase).subscribe({
      complete: () => {
        this._expenseService.fetchAllData();
        this.fg.reset();
      },
    });
  }
}
