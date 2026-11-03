export type ProductCategory =
  | 'All'
  | 'Wigs'
  | 'Bone Straight'
  | 'Body Wave'
  | 'Deep Wave'
  | 'Curly Wigs'
  | 'Lace Frontals'
  | 'Hair Bundles'
  | 'Accessories & Care';

export interface ProductVariation {
  length: string; // e.g. '18"', '22"', '26"', '30"'
  priceMultiplier: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subtitle: string;
  basePrice: number; // in NGN (Nigerian Naira)
  images: string[];
  description: string;
  origin: string; // Vietnamese, Cambodian, Brazilian, Peruvian
  hairType: string; // 100% Human Hair, Super Double Drawn, Single Drawn
  availableLengths: string[];
  availableDensities: string[];
  laceTypes: string[];
  colors: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSaveToBuyEligible: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedLength: string;
  selectedDensity: string;
  selectedLace: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface InstallmentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: 'paid' | 'due' | 'upcoming' | 'overdue';
  paidAt?: string;
  transactionRef?: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  planId?: string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paidAt: string;
  method: 'Paystack Card' | 'Paystack Transfer' | 'Paystack USSD' | 'Direct Deposit';
  status: 'verified' | 'pending' | 'failed';
  purpose: 'save_to_buy_deposit' | 'save_to_buy_installment' | 'full_order_payment' | 'save_to_buy_payoff';
  note: string;
}

export interface SaveToBuyPlan {
  id: string;
  planNumber: string; // STB-2026-0814
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: Product;
  selectedSpecs: {
    length: string;
    density: string;
    lace: string;
    color: string;
  };
  totalProductPrice: number;
  depositAmount: number;
  amountSaved: number;
  outstandingBalance: number;
  durationMonths: number;
  frequency: PaymentFrequency;
  installmentAmount: number;
  totalInstallments: number;
  installmentsPaid: number;
  startDate: string;
  nextDueDate: string;
  targetCompletionDate: string;
  status: 'active' | 'completed' | 'overdue' | 'cancelled';
  schedule: InstallmentScheduleItem[];
  paymentHistory: PaymentTransaction[];
  remindersSent: Array<{
    id: string;
    type: 'email' | 'whatsapp';
    recipient: string;
    sentAt: string;
    message: string;
  }>;
}

export type OrderStatus =
  | 'order_placed'
  | 'payment_verified'
  | 'styling_preparation'
  | 'dispatched'
  | 'delivered';

export interface CustomerAddress {
  id: string;
  title: string; // e.g. "Home in Lekki", "Office Victoria Island"
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // DRZ-8921
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'paystack_full' | 'savetobuy_completed';
  paymentReference: string;
  paymentStatus: 'verified' | 'pending' | 'failed';
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'admin';
  addresses: CustomerAddress[];
  joinedDate: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'savetobuy' | 'promo' | 'system';
  read: boolean;
  actionUrl?: string;
}
