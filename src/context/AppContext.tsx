import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  SaveToBuyPlan,
  Order,
  UserProfile,
  SystemNotification,
  OrderStatus,
  PaymentFrequency,
  CustomerAddress,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USER,
  INITIAL_SAVE_TO_BUY_PLANS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  repairProductImagePaths,
} from '../data/mockData';
import { generatePaystackRef, calculateInstallments } from '../utils/formatters';
import confetti from 'canvas-confetti';

export type AppView =
  | 'home'
  | 'shop'
  | 'savetobuy_hub'
  | 'product_detail'
  | 'checkout'
  | 'customer_dashboard'
  | 'admin_dashboard';

interface PaystackModalConfig {
  amount: number;
  title: string;
  subtitle?: string;
  purpose: 'save_to_buy_deposit' | 'save_to_buy_installment' | 'full_order_payment' | 'save_to_buy_payoff';
  planId?: string;
  orderId?: string;
  customerEmail: string;
  customerName: string;
  onSuccess: (reference: string, paymentMethod: string) => void;
  onClose?: () => void;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'gold' | 'whatsapp';
}

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedLength: string,
    selectedDensity: string,
    selectedLace: string,
    selectedColor: string,
    quantity?: number,
    priceOverride?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Save to Buy
  saveToBuyPlans: SaveToBuyPlan[];
  selectedPlanForDetail: SaveToBuyPlan | null;
  setSelectedPlanForDetail: (plan: SaveToBuyPlan | null) => void;
  isSaveToBuyModalOpen: boolean;
  setIsSaveToBuyModalOpen: (open: boolean) => void;
  saveToBuyTargetProduct: Product | null;
  setSaveToBuyTargetProduct: (product: Product | null) => void;
  createSaveToBuyPlan: (
    product: Product,
    selectedSpecs: { length: string; density: string; lace: string; color: string },
    totalPrice: number,
    depositAmount: number,
    durationMonths: number,
    frequency: PaymentFrequency,
    paymentRef: string,
    paymentMethod: string
  ) => SaveToBuyPlan;
  contributeToSaveToBuyPlan: (
    planId: string,
    amount: number,
    paymentRef: string,
    paymentMethod: string,
    note?: string
  ) => void;
  sendPlanReminder: (planId: string, type: 'email' | 'whatsapp') => void;

  // Orders
  orders: Order[];
  placeOrder: (
    deliveryType: 'delivery' | 'pickup',
    address: CustomerAddress | undefined,
    paymentRef: string,
    paymentMethod: 'paystack_full' | 'savetobuy_completed',
    notes?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Paystack Modal Integration
  paystackModalConfig: PaystackModalConfig | null;
  openPaystack: (config: PaystackModalConfig) => void;
  closePaystack: () => void;

  // User Profile & Role Switcher
  user: UserProfile;
  switchUserRole: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  updateAddress: (address: CustomerAddress) => void;
  deleteAddress: (id: string) => void;

  // Notifications & Toast
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'gold' | 'whatsapp') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentViewState] = useState<AppView>('home');

  // Browser Back restores the previous storefront view instead of leaving the site.
  useEffect(() => {
    if (!window.history.state?.drozyApp) {
      window.history.replaceState({ drozyApp: true, drozyView: 'home' }, '', window.location.href);
    }
    if (!window.history.state?.drozyRoot) {
      window.history.pushState(
        { drozyApp: true, drozyRoot: true, drozyView: 'home' },
        '',
        window.location.href
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state?.drozyApp && state?.drozyView) {
        setCurrentViewState(state.drozyView as AppView);
        if (state.drozyRoot) {
          window.history.pushState(
            { drozyApp: true, drozyRoot: true, drozyView: state.drozyView },
            '',
            window.location.href
          );
        }
        return;
      }
      setCurrentViewState('home');
      window.history.pushState(
        { drozyApp: true, drozyRoot: true, drozyView: 'home' },
        '',
        window.location.href
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setCurrentView = (view: AppView) => {
    if (view === currentView) return;
    window.history.pushState({ drozyApp: true, drozyView: view }, '', window.location.href);
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSaveToBuyModalOpen, setIsSaveToBuyModalOpen] = useState(false);
  const [saveToBuyTargetProduct, setSaveToBuyTargetProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState<SaveToBuyPlan | null>(null);

  // Paystack Modal State
  const [paystackModalConfig, setPaystackModalConfig] = useState<PaystackModalConfig | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('drozy_products_v2');
    if (saved) {
      try {
        return repairProductImagePaths(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
    localStorage.removeItem('drozy_products');
    localStorage.setItem('drozy_products_v2', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('drozy_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('drozy_wishlist');
    return saved ? JSON.parse(saved) : ['prod-bone-straight-sdd'];
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('drozy_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Save to Buy Plans
  const [saveToBuyPlans, setSaveToBuyPlans] = useState<SaveToBuyPlan[]>(() => {
    const saved = localStorage.getItem('drozy_savetobuy');
    return saved ? JSON.parse(saved) : INITIAL_SAVE_TO_BUY_PLANS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('drozy_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('drozy_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('drozy_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('drozy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('drozy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('drozy_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('drozy_savetobuy', JSON.stringify(saveToBuyPlans));
  }, [saveToBuyPlans]);

  useEffect(() => {
    localStorage.setItem('drozy_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('drozy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helper
  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'gold' | 'whatsapp' = 'gold'
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Paystack Control
  const openPaystack = (config: PaystackModalConfig) => {
    setPaystackModalConfig(config);
  };

  const closePaystack = () => {
    if (paystackModalConfig?.onClose) {
      paystackModalConfig.onClose();
    }
    setPaystackModalConfig(null);
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    selectedLength: string,
    selectedDensity: string,
    selectedLace: string,
    selectedColor: string,
    quantity = 1,
    priceOverride?: number
  ) => {
    const unitPrice = priceOverride !== undefined ? priceOverride : product.basePrice;
    const cartItemId = `${product.id}-${selectedLength}-${selectedDensity}-${selectedLace}-${selectedColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          selectedLength,
          selectedDensity,
          selectedLace,
          selectedColor,
          quantity,
          unitPrice,
        },
      ];
    });

    showToast(
      'Added to Shopping Bag',
      `${product.name} (${selectedLength}) added successfully.`,
      'gold'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'Item removed from your saved items.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'Added to your luxury wishlist.', 'gold');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Save to Buy System
  const createSaveToBuyPlan = (
    product: Product,
    selectedSpecs: { length: string; density: string; lace: string; color: string },
    totalPrice: number,
    depositAmount: number,
    durationMonths: number,
    frequency: PaymentFrequency,
    paymentRef: string,
    paymentMethod: string
  ): SaveToBuyPlan => {
    const planNumber = `STB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { balance, totalInstallments, installmentAmount } = calculateInstallments(
      totalPrice,
      depositAmount,
      durationMonths,
      frequency
    );

    const now = new Date();
    const startDate = now.toISOString().split('T')[0];

    // Compute schedule
    const schedule: SaveToBuyPlan['schedule'] = [];

    // First deposit schedule entry
    schedule.push({
      installmentNumber: 1,
      dueDate: startDate,
      amount: depositAmount,
      status: 'paid',
      paidAt: now.toISOString(),
      transactionRef: paymentRef,
    });

    let nextDueStr = '';
    for (let i = 1; i <= totalInstallments; i++) {
      const dueDate = new Date(now);
      if (frequency === 'daily') {
        dueDate.setDate(dueDate.getDate() + i);
      } else if (frequency === 'weekly') {
        dueDate.setDate(dueDate.getDate() + i * 7);
      } else if (frequency === 'biweekly') {
        dueDate.setDate(dueDate.getDate() + i * 14);
      } else {
        dueDate.setMonth(dueDate.getMonth() + i);
      }
      const dueDateStr = dueDate.toISOString().split('T')[0];
      if (i === 1) nextDueStr = dueDateStr;

      schedule.push({
        installmentNumber: i + 1,
        dueDate: dueDateStr,
        amount: installmentAmount,
        status: i === 1 ? 'due' : 'upcoming',
      });
    }

    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() + durationMonths);

    const newPlan: SaveToBuyPlan = {
      id: `stb-${Date.now()}`,
      planNumber,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      product,
      selectedSpecs,
      totalProductPrice: totalPrice,
      depositAmount,
      amountSaved: depositAmount,
      outstandingBalance: balance,
      durationMonths,
      frequency,
      installmentAmount,
      totalInstallments: totalInstallments + 1, // deposit + remaining installments
      installmentsPaid: 1,
      startDate,
      nextDueDate: nextDueStr,
      targetCompletionDate: targetDate.toISOString().split('T')[0],
      status: 'active',
      schedule,
      paymentHistory: [
        {
          id: `tx-${Date.now()}`,
          reference: paymentRef,
          planId: planNumber,
          customerName: user.name,
          customerEmail: user.email,
          amount: depositAmount,
          paidAt: now.toISOString(),
          method: paymentMethod as any,
          status: 'verified',
          purpose: 'save_to_buy_deposit',
          note: `Initial deposit for ${product.name}`,
        },
      ],
      remindersSent: [
        {
          id: `rem-${Date.now()}`,
          type: 'whatsapp',
          recipient: user.phone,
          sentAt: now.toISOString(),
          message: `Welcome to Save to Buy! Plan #${planNumber} created for ${product.name}. Initial deposit of ₦${depositAmount.toLocaleString()} verified.`,
        },
      ],
    };

    setSaveToBuyPlans((prev) => [newPlan, ...prev]);

    // Send notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Save to Buy Plan Activated',
        message: `Plan #${planNumber} for ${product.name} is now active. Total: ₦${totalPrice.toLocaleString()}.`,
        timestamp: 'Just now',
        type: 'savetobuy',
        read: false,
      },
      ...prev,
    ]);

    showToast(
      'Save to Buy Plan Activated!',
      `Deposit verified via Paystack. Plan #${planNumber} is now live!`,
      'gold'
    );

    return newPlan;
  };

  const contributeToSaveToBuyPlan = (
    planId: string,
    amount: number,
    paymentRef: string,
    paymentMethod: string,
    note = 'Installment Payment'
  ) => {
    setSaveToBuyPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;

        const newAmountSaved = plan.amountSaved + amount;
        const newBalance = Math.max(0, plan.totalProductPrice - newAmountSaved);
        const isFullyPaid = newBalance <= 0;

        // Update schedule
        let remainingAmountToApply = amount;
        const updatedSchedule = plan.schedule.map((item) => {
          if (item.status === 'paid') return item;
          if (remainingAmountToApply >= item.amount) {
            remainingAmountToApply -= item.amount;
            return {
              ...item,
              status: 'paid' as const,
              paidAt: new Date().toISOString(),
              transactionRef: paymentRef,
            };
          }
          return item;
        });

        // Determine next due date from first unpaid item
        const nextUnpaid = updatedSchedule.find((s) => s.status !== 'paid');
        const nextDueDate = nextUnpaid ? nextUnpaid.dueDate : '-';

        const updatedPlan: SaveToBuyPlan = {
          ...plan,
          amountSaved: newAmountSaved,
          outstandingBalance: newBalance,
          installmentsPaid: updatedSchedule.filter((s) => s.status === 'paid').length,
          status: isFullyPaid ? 'completed' : plan.status,
          nextDueDate,
          schedule: updatedSchedule,
          paymentHistory: [
            ...plan.paymentHistory,
            {
              id: `tx-${Date.now()}`,
              reference: paymentRef,
              planId: plan.planNumber,
              customerName: plan.customerName,
              customerEmail: plan.customerEmail,
              amount,
              paidAt: new Date().toISOString(),
              method: paymentMethod as any,
              status: 'verified',
              purpose: isFullyPaid ? 'save_to_buy_payoff' : 'save_to_buy_installment',
              note,
            },
          ],
        };

        if (isFullyPaid) {
          // Trigger celebratory confetti
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#D4AF37', '#E8A598', '#FAF7F2', '#AA821A'],
            });
          } catch (e) {
            // ignore if not supported
          }

          // Automatically initiate order fulfillment
          const fulfillmentOrder: Order = {
            id: `ord-${Date.now()}`,
            orderNumber: `DRZ-FULFILL-${Math.floor(1000 + Math.random() * 9000)}`,
            customerId: plan.customerId,
            customerName: plan.customerName,
            customerEmail: plan.customerEmail,
            customerPhone: plan.customerPhone,
            deliveryType: 'delivery',
            deliveryAddress: user.addresses[0],
            items: [
              {
                cartItemId: `item-stb-${plan.id}`,
                product: plan.product,
                selectedLength: plan.selectedSpecs.length,
                selectedDensity: plan.selectedSpecs.density,
                selectedLace: plan.selectedSpecs.lace,
                selectedColor: plan.selectedSpecs.color,
                quantity: 1,
                unitPrice: plan.totalProductPrice,
              },
            ],
            subtotal: plan.totalProductPrice,
            shippingFee: 0, // Complimentary VIP shipping on completed plans!
            totalAmount: plan.totalProductPrice,
            paymentMethod: 'savetobuy_completed',
            paymentReference: paymentRef,
            paymentStatus: 'verified',
            status: 'styling_preparation',
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            trackingNumber: `DRZ-VIP-${Math.floor(100000 + Math.random() * 900000)}`,
            notes: `Fulfilled via completed Save to Buy plan #${plan.planNumber}. 100% Verified.`,
          };

          setOrders((prevOrders) => [fulfillmentOrder, ...prevOrders]);

          showToast(
            'CONGRATULATIONS! Plan Fully Paid!',
            `Plan #${plan.planNumber} is completed. Order #${fulfillmentOrder.orderNumber} created for VIP dispatch!`,
            'gold'
          );
        } else {
          showToast(
            'Payment Verified',
            `₦${amount.toLocaleString()} received via Paystack. Balance remaining: ₦${newBalance.toLocaleString()}.`,
            'success'
          );
        }

        return updatedPlan;
      })
    );
  };

  const sendPlanReminder = (planId: string, type: 'email' | 'whatsapp') => {
    setSaveToBuyPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;

        const message =
          type === 'whatsapp'
            ? `D’ROZY LUXURY HAIR Alert: Dear ${plan.customerName}, installment of ₦${plan.installmentAmount.toLocaleString()} for ${plan.product.name} is due on ${plan.nextDueDate}. Pay safely via Paystack on your portal!`
            : `Important: Installment Due Date for D’ROZY BEAUTY HAIR Plan #${plan.planNumber} (${plan.nextDueDate})`;

        const newReminder = {
          id: `rem-${Date.now()}`,
          type,
          recipient: type === 'whatsapp' ? plan.customerPhone : plan.customerEmail,
          sentAt: new Date().toISOString(),
          message,
        };

        showToast(
          type === 'whatsapp' ? 'WhatsApp Notification Sent' : 'Email Reminder Sent',
          `Dispatched to ${newReminder.recipient}`,
          type === 'whatsapp' ? 'whatsapp' : 'info'
        );

        return {
          ...plan,
          remindersSent: [...plan.remindersSent, newReminder],
        };
      })
    );
  };

  // Orders
  const placeOrder = (
    deliveryType: 'delivery' | 'pickup',
    address: CustomerAddress | undefined,
    paymentRef: string,
    paymentMethod: 'paystack_full' | 'savetobuy_completed',
    notes?: string
  ): Order => {
    const orderNumber = `DRZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = cartTotal;
    const shippingFee = deliveryType === 'pickup' ? 0 : 5000;
    const totalAmount = subtotal + shippingFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      deliveryType,
      deliveryAddress: address,
      items: [...cart],
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentReference: paymentRef,
      paymentStatus: 'verified',
      status: 'payment_verified',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      trackingNumber: `GIG-DRZ-${Math.floor(1000000 + Math.random() * 9000000)}`,
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#E8A598', '#FAF7F2'],
      });
    } catch (e) {
      // ignore
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Confirmed',
        message: `Order #${orderNumber} placed successfully. Paystack payment verified.`,
        timestamp: 'Just now',
        type: 'order',
        read: false,
      },
      ...prev,
    ]);

    showToast(
      'Order Confirmed!',
      `Order #${orderNumber} placed successfully. We are preparing your luxury hair.`,
      'gold'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status,
          trackingNumber: trackingNumber || ord.trackingNumber,
        };
      })
    );
    showToast('Order Status Updated', `Order status changed to ${status.replace('_', ' ')}`, 'info');
  };

  // Product Management (Admin)
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product Added', `${newProduct.name} added to catalog.`, 'gold');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Product Updated', `${updated.name} updated successfully.`, 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Removed', 'Product has been deleted from catalog.', 'info');
  };

  // User Profile
  const switchUserRole = () => {
    setUser((prev) => {
      const nextRole = prev.role === 'customer' ? 'admin' : 'customer';
      showToast(
        nextRole === 'admin' ? 'Switched to Administrator Mode' : 'Switched to Customer Mode',
        `Current view: ${nextRole.toUpperCase()}`,
        'gold'
      );
      return {
        ...prev,
        role: nextRole,
      };
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const addAddress = (address: Omit<CustomerAddress, 'id'>) => {
    const newAddr: CustomerAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    showToast('Address Saved', 'New delivery address added.', 'info');
  };

  const updateAddress = (address: CustomerAddress) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => (a.id === address.id ? address : a)),
    }));
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        saveToBuyPlans,
        selectedPlanForDetail,
        setSelectedPlanForDetail,
        isSaveToBuyModalOpen,
        setIsSaveToBuyModalOpen,
        saveToBuyTargetProduct,
        setSaveToBuyTargetProduct,
        createSaveToBuyPlan,
        contributeToSaveToBuyPlan,
        sendPlanReminder,
        orders,
        placeOrder,
        updateOrderStatus,
        paystackModalConfig,
        openPaystack,
        closePaystack,
        user,
        switchUserRole,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        notifications,
        markNotificationRead,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
