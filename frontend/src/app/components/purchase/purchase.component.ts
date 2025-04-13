import { Component, OnInit, signal } from '@angular/core';
import { Purchase } from '../../models/purchase';
import { columns } from './columns';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'purchase-table',
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent implements OnInit {
  purchases = signal<Purchase[]>([]);

  columns = columns;

  currentEditingId = signal<number | null>(null);

  fg: FormGroup;

  constructor(
    private _expenseService: ExpenseService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.purchases = this._expenseService.purchases;
  }

  onRowDblClick(purchase: Purchase) {
    this.currentEditingId.set(purchase.id);
  }

  onRowModify(id: number) {
    const fg = this.fg.get('update') as FormGroup;
    const purchase = fg.value as Purchase;
    purchase.id = id;

    this._expenseService.updatePurchase(purchase).subscribe(() => {
      this.currentEditingId.set(null);
      this._expenseService.fetchAllData();
      fg.reset();
    });
  }

  onDelete(purchase: Purchase) {
    this._expenseService.deletePurchase(purchase.id).subscribe(() => {
      this._expenseService.fetchAllData();
    });
  }

  onRowSubmit() {
    const fg = this.fg.get('add') as FormGroup;
    this._expenseService.addPurchase(fg.value).subscribe(() => {
      this._expenseService.fetchAllData();
      fg.reset();
    });
  }

  private initFormGroup() {
    const fg = this._fb.group({
      date: new FormControl(new Date(), Validators.required),
      descr: new FormControl('', Validators.required),
      vendor: new FormControl('', Validators.required),
      tag: new FormControl('', Validators.required),
      type: new FormControl(''),
      amount: new FormControl(0, Validators.required),
    });

    this.fg = this._fb.group({
      add: fg,
      update: fg,
    });
  }
}
