import { Component, input, OnInit } from '@angular/core';
import { Purchase } from '../../models/purchase';
import { columns } from './columns';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'purchase-table',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './purchase-table.component.html',
  styleUrl: './purchase-table.component.scss',
})
export class PurchaseTableComponent implements OnInit {
  purchases = input<Purchase[]>([]);

  columns = columns;
  displayCols = this.columns.map((c) => c.header);

  ngOnInit(): void {}
}
