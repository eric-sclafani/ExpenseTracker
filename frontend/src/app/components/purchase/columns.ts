import { Purchase } from '../../models/purchase';

export interface Column {
  columnDef: string;
  header: string;
  type?: string;
  cell: Function;
}

export const columns: Column[] = [
  {
    columnDef: 'date',
    header: 'Date',
    type: 'date',
    cell: (elem: Purchase) => elem.date.toString(),
  },
  {
    columnDef: 'description',
    header: 'Description',
    cell: (elem: Purchase) => elem.description,
  },
  {
    columnDef: 'vendor',
    header: 'Vendor',
    cell: (elem: Purchase) => elem.vendor,
  },
  {
    columnDef: 'tag',
    header: 'Tag',
    cell: (elem: Purchase) => elem.tag,
  },
  {
    columnDef: 'type',
    header: 'Type',
    cell: (elem: Purchase) => elem.type,
  },
  {
    columnDef: 'amount',
    header: 'Amount',
    type: 'curr',
    cell: (elem: Purchase) => elem.amount.toString(),
  },
];
