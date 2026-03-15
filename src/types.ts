export type OrderStatus = 'draft' | 'submitted' | 'approved' | 'completed' | 'flagged' | 'shipped' | 'forwarded to osl';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryLabel: string;
  price: number;
  stock: number;
  stockCount: number;
  useCase: string;
  shelfLife: string;
  shape: 'kit' | 'mask' | 'glove';
  description: string;
  usage: string;
  dosage: string;
  included: string;
  storage: string;
  list: string[];
  image: string;
  contents: string[];
  weight: string;
  dimensions: string;
  features: string[];
}

export interface Order {
  id: string;
  ref: string;
  name: string;
  address: string;
  date: string;
  value: number;
  status: OrderStatus;
  initiator: string;
  shipmentMode: string;
  pteao: string;
  consignee: string;
  notify: string;
  readyDate: string;
  weight: number;
  volume: number;
  remarks: string;
  items: { product: Product, qty: number }[];
}
