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
    const fg = this.fg.get('update') as FormGroup;
    fg.patchValue(purchase);
  }

  onCancel() {
    this.fg.get('update')?.reset();
    this.currentEditingId.set(null);
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
    const fg = this.fg.get('add')?.value;
    const purchase = {
      date: fg.newDate,
      description: fg.newDescr,
      vendor: fg.newVendor,
      tag: fg.newTag,
      type: fg.newTag,
      amount: fg.newAmount,
    } as Purchase;
    this._expenseService.addPurchase(purchase).subscribe(() => {
      this._expenseService.fetchAllData();
      this.fg.get('add')?.reset();
    });
  }

  private initFormGroup() {
    this.fg = this._fb.group({
      add: this._fb.group({
        newDate: new FormControl(new Date(), Validators.required),
        newDescr: new FormControl('', Validators.required),
        newVendor: new FormControl('', Validators.required),
        newTag: new FormControl('', Validators.required),
        newType: new FormControl(''),
        newAmount: new FormControl<number | null>(null, Validators.required),
      }),
      update: this._fb.group({
        date: new FormControl(new Date(), Validators.required),
        description: new FormControl('', Validators.required),
        vendor: new FormControl('', Validators.required),
        tag: new FormControl('', Validators.required),
        type: new FormControl(''),
        amount: new FormControl<number | null>(null, Validators.required),
      }),
    });
  }
}
