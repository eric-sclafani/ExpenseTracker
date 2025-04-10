import { Component, input, OnInit } from '@angular/core';
import { Purchase } from '../../models/purchase';
import { columns } from './columns';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'purchase-table',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent implements OnInit {
  purchases = input<Purchase[]>([]);

  columns = columns;
  displayCols = this.columns.map((c) => c.header);

  // TODO: continue styling table https://piccalil.li/blog/styling-tables-the-modern-css-way/
  ngOnInit(): void {}
}
