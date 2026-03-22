export type OrderStatus = 'EN_COURS' | 'VALIDEE' | 'LIVREE';
export type InvoiceStatus = 'PAYEE' | 'EN_ATTENTE';

export interface Customer {
  id?: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  tenantId?: string;
}

export interface Product {
  id?: number;
  nom: string;
  prix: number;
  quantiteDisponible?: number;
  categorie?: string;
  imageUrl?: string;
  tenantId?: string;
}

export interface OrderItem {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id?: number;
  dateCommande?: string;
  status: OrderStatus;
  totalMontant?: number;
  customer: Customer;
  items?: OrderItem[];
}

export interface Invoice {
  id?: number;
  order?: Order;
  dateFacture?: string;
  montant?: number;
  status: InvoiceStatus;
}
