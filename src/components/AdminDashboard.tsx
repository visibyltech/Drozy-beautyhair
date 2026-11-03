import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, OrderStatus } from '../types';
import { formatNGN, formatDate } from '../utils/formatters';
import {
  TrendingUp,
  Package,
  Sparkles,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Truck,
  Eye,
  Layers,
  Percent,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    saveToBuyPlans,
    orders,
    updateOrderStatus,
    sendPlanReminder,
    user,
    switchUserRole,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'savetobuy' | 'products' | 'orders' | 'transactions' | 'promotions'
  >('overview');

  // Filter states
  const [stbFilter, setStbFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // New product modal state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Bone Straight');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formPrice, setFormPrice] = useState(350000);
  const [formStock, setFormStock] = useState(10);
  const [formOrigin, setFormOrigin] = useState('Vietnamese Raw Hair');
  const [formDescription, setFormDescription] = useState('');
  const [formSaveToBuy, setFormSaveToBuy] = useState(true);

  // Business overview calculations
  const totalDirectRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalSavedInEscrow = saveToBuyPlans.reduce((sum, p) => sum + p.amountSaved, 0);
  const totalCombinedRevenue = totalDirectRevenue + totalSavedInEscrow;
  const activePlansCount = saveToBuyPlans.filter((p) => p.status === 'active').length;
  const completedPlansCount = saveToBuyPlans.filter((p) => p.status === 'completed').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 8);

  // Filtered Save to Buy plans
  const filteredPlans = saveToBuyPlans.filter((plan) => {
    if (stbFilter === 'all') return true;
    return plan.status === stbFilter;
  });

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'all') return true;
    return ord.status === orderFilter;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Bone Straight');
    setFormSubtitle('100% Raw Virgin Human Hair');
    setFormPrice(350000);
    setFormStock(12);
    setFormOrigin('Vietnamese Raw Hair');
    setFormDescription('Super double drawn hair with natural shine and full ends.');
    setFormSaveToBuy(true);
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormSubtitle(prod.subtitle);
    setFormPrice(prod.basePrice);
    setFormStock(prod.stockCount);
    setFormOrigin(prod.origin);
    setFormDescription(prod.description);
    setFormSaveToBuy(prod.isSaveToBuyEligible);
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formName,
        category: formCategory,
        subtitle: formSubtitle,
        basePrice: Number(formPrice),
        stockCount: Number(formStock),
        inStock: Number(formStock) > 0,
        origin: formOrigin,
        description: formDescription,
        isSaveToBuyEligible: formSaveToBuy,
      });
    } else {
      addProduct({
        name: formName,
        category: formCategory,
        subtitle: formSubtitle,
        basePrice: Number(formPrice),
        stockCount: Number(formStock),
        inStock: Number(formStock) > 0,
        origin: formOrigin,
        description: formDescription,
        isSaveToBuyEligible: formSaveToBuy,
        images: ['/src/assets/images/luxury_bone_straight_hair_1793692289793.jpg'],
        hairType: '100% Raw Virgin Human Hair',
        availableLengths: ['18"', '22"', '26"', '30"'],
        availableDensities: ['180%', '250% Extra Full'],
        laceTypes: ['13x6 HD Lace Frontal', '5x5 HD Closure'],
        colors: ['Natural Jet Black (#1B)'],
        rating: 5.0,
        reviewCount: 1,
        isBestSeller: false,
        isNewArrival: true,
      });
    }

    setIsAddProductModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
                Executive Control Centre
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] mt-1">
              D’ROZY Administrator Portal
            </h1>
            <p className="text-xs text-[#9E9AA6] mt-0.5">
              Manage luxury inventory, orders, customer Save to Buy escrow, and Paystack transactions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddProduct}
              className="py-2.5 px-4 rounded-xl font-semibold text-xs text-[#0B0B0C] bg-[#D4AF37] hover:bg-[#F3E0A3] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hair Piece</span>
            </button>
            <button
              onClick={switchUserRole}
              className="py-2.5 px-4 rounded-xl text-xs text-[#9E9AA6] hover:text-[#FAF7F2] bg-[#1F1E24] border border-[#2C2933] transition-colors"
            >
              Switch to Store View
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 p-1 bg-[#141417] border border-[#2C2933] rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Business Overview</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('savetobuy')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === 'savetobuy'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Save to Buy Plans ({saveToBuyPlans.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('products')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === 'products'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Products & Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Fulfillment ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('transactions')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === 'transactions'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Paystack Transactions</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('promotions')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === 'promotions'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Banners & Promotions</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-lg">
                <span className="text-[11px] text-[#9E9AA6] uppercase font-semibold">
                  Total Combined Sales
                </span>
                <div className="text-2xl font-bold font-serif text-[#D4AF37] tabular-nums mt-1">
                  {formatNGN(totalCombinedRevenue)}
                </div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+28.4% this quarter</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-lg">
                <span className="text-[11px] text-[#9E9AA6] uppercase font-semibold">
                  Save to Buy Escrow
                </span>
                <div className="text-2xl font-bold font-serif text-[#E8A598] tabular-nums mt-1">
                  {formatNGN(totalSavedInEscrow)}
                </div>
                <div className="text-[11px] text-[#9E9AA6] mt-2">
                  {activePlansCount} active customer plans
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-lg">
                <span className="text-[11px] text-[#9E9AA6] uppercase font-semibold">
                  Direct Store Orders
                </span>
                <div className="text-2xl font-bold font-serif text-[#FAF7F2] tabular-nums mt-1">
                  {orders.length} Orders
                </div>
                <div className="text-[11px] text-emerald-400 mt-2">
                  100% Paystack verified
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-lg">
                <span className="text-[11px] text-[#9E9AA6] uppercase font-semibold">
                  VIP Hair Catalog
                </span>
                <div className="text-2xl font-bold font-serif text-[#FAF7F2] tabular-nums mt-1">
                  {products.length} Units
                </div>
                <div className="text-[11px] text-[#D4AF37] mt-2">
                  {lowStockProducts.length} items low in stock
                </div>
              </div>
            </div>

            {/* Quick Actions & Low Stock Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders in Processing */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#FAF7F2] flex items-center justify-between">
                  <span>Recent Customer Orders</span>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    View All
                  </button>
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-[#0F0F12] border border-[#2C2933] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#FAF7F2]">#{ord.orderNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                            {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#9E9AA6] mt-0.5">
                          {ord.customerName} · {ord.items.length} items
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-serif text-[#D4AF37] tabular-nums">
                          {formatNGN(ord.totalAmount)}
                        </div>
                        <div className="text-[10px] text-[#9E9AA6]">{formatDate(ord.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#FAF7F2] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Inventory Restock Warnings</span>
                </h3>
                <div className="space-y-3">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-[#0F0F12] border border-[#2C2933] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold text-[#FAF7F2] truncate max-w-[150px]">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[#9E9AA6]">{p.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-400">{p.stockCount} left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Save to Buy Management */}
        {activeAdminTab === 'savetobuy' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                  Customer Installment Savings Overseer
                </h3>
                <p className="text-xs text-[#9E9AA6]">
                  Monitor locked products, installments, and dispatch alerts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'active', 'completed', 'overdue'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStbFilter(filter)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      stbFilter === filter
                        ? 'bg-[#D4AF37] text-[#0B0B0C]'
                        : 'bg-[#141417] text-[#9E9AA6] border border-[#2C2933]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredPlans.map((plan) => {
                const percentSaved = Math.round((plan.amountSaved / plan.totalProductPrice) * 100);

                return (
                  <div
                    key={plan.id}
                    className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-lg space-y-4"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={plan.product.images[0]}
                          alt={plan.product.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#2C2933]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#D4AF37]">
                              #{plan.planNumber}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] uppercase">
                              {plan.status}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-[#FAF7F2] mt-0.5">
                            {plan.product.name}
                          </h4>
                          <div className="text-xs text-[#9E9AA6]">
                            Customer: <strong className="text-[#FAF7F2]">{plan.customerName}</strong>{' '}
                            ({plan.customerPhone})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => sendPlanReminder(plan.id, 'whatsapp')}
                          className="py-2 px-3 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Alert</span>
                        </button>
                        <button
                          onClick={() => sendPlanReminder(plan.id, 'email')}
                          className="py-2 px-3 rounded-xl text-xs text-[#FAF7F2] bg-[#1F1E24] border border-[#2C2933] hover:border-[#D4AF37]/50 transition-all"
                        >
                          Email Alert
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Financials */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#9E9AA6]">
                          Saved:{' '}
                          <strong className="text-emerald-400 tabular-nums">
                            {formatNGN(plan.amountSaved)}
                          </strong>{' '}
                          of {formatNGN(plan.totalProductPrice)}
                        </span>
                        <span className="text-[#D4AF37] font-semibold">{percentSaved}%</span>
                      </div>
                      <div className="w-full bg-[#2C2933] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] to-[#E8A598] h-full"
                          style={{ width: `${percentSaved}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-[#2C2933]">
                      <div>
                        <span className="text-[#9E9AA6] block text-[10px] uppercase">
                          Outstanding
                        </span>
                        <span className="font-mono font-bold text-[#E8A598] tabular-nums">
                          {formatNGN(plan.outstandingBalance)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#9E9AA6] block text-[10px] uppercase">Next Due</span>
                        <span className="font-semibold text-[#FAF7F2]">{plan.nextDueDate}</span>
                      </div>
                      <div>
                        <span className="text-[#9E9AA6] block text-[10px] uppercase">
                          Installments
                        </span>
                        <span className="font-semibold text-[#FAF7F2]">
                          {plan.installmentsPaid} / {plan.totalInstallments} paid
                        </span>
                      </div>
                      <div>
                        <span className="text-[#9E9AA6] block text-[10px] uppercase">
                          Target Completion
                        </span>
                        <span className="font-semibold text-[#FAF7F2]">
                          {plan.targetCompletionDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Products Management */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                  Hair Catalog & Inventory Control
                </h3>
                <p className="text-xs text-[#9E9AA6]">Manage pricing, variations, and stock levels.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#9E9AA6] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-[#141417] border border-[#2C2933] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FAF7F2] focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C] flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-[#2C2933] bg-[#141417]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2C2933] text-[#9E9AA6] uppercase font-semibold bg-[#16161A]">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Base Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Save to Buy</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2933]">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#1A191E]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#2C2933]"
                            />
                            <div>
                              <div className="font-semibold text-[#FAF7F2] line-clamp-1">
                                {prod.name}
                              </div>
                              <div className="text-[11px] text-[#9E9AA6]">{prod.origin}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#FAF7F2]">{prod.category}</td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#D4AF37] tabular-nums">
                          {formatNGN(prod.basePrice)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-mono font-bold ${
                              prod.stockCount <= 8 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {prod.stockCount} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {prod.isSaveToBuyEligible ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                              Enabled
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#9E9AA6]">Disabled</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-[#2A2832] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-[#2A2832] text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Orders & Fulfillment Management */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
              Order Fulfillment Pipeline
            </h3>

            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#2C2933]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#D4AF37]">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#9E9AA6] mt-0.5">
                        Client: <strong className="text-[#FAF7F2]">{ord.customerName}</strong> ·{' '}
                        {ord.customerPhone} · {ord.deliveryAddress?.city || 'Lagos'}
                      </div>
                    </div>

                    {/* Status updater dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9E9AA6]">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#1F1E24] border border-[#2C2933] rounded-xl px-3 py-1.5 text-xs text-[#FAF7F2] focus:outline-none"
                      >
                        <option value="order_placed">Order Placed</option>
                        <option value="payment_verified">Payment Verified</option>
                        <option value="styling_preparation">Styling Preparation</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-[#9E9AA6]">
                    Items:{' '}
                    {ord.items.map((i) => `${i.product.name} (${i.selectedLength})`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2C2933] text-xs">
                    <span className="text-[#9E9AA6]">
                      Paystack Ref: <strong className="font-mono text-[#FAF7F2]">{ord.paymentReference}</strong>
                    </span>
                    <span className="font-serif font-bold text-[#D4AF37] text-sm tabular-nums">
                      {formatNGN(ord.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Paystack Transactions Audit */}
        {activeAdminTab === 'transactions' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
              Paystack Live Settlement Audit
            </h3>
            <p className="text-xs text-[#9E9AA6]">
              All payments verified on Paystack webhook backend before updating customer records.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2C2933] text-[#9E9AA6] uppercase font-semibold">
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2933]">
                  {saveToBuyPlans
                    .flatMap((p) => p.paymentHistory)
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#1A191E]">
                        <td className="py-3 px-3 font-mono text-[#D4AF37]">{tx.reference}</td>
                        <td className="py-3 px-3 text-[#FAF7F2]">{tx.customerName}</td>
                        <td className="py-3 px-3 text-[#9E9AA6]">{tx.method}</td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-serif font-bold text-[#FAF7F2] tabular-nums">
                          {formatNGN(tx.amount)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Banners & Promotions */}
        {activeAdminTab === 'promotions' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
              Promotions, Banners & Brand Messaging
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#0F0F12] border border-[#2C2933] space-y-3">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase">Top Marquee Text</span>
                <input
                  type="text"
                  defaultValue="HOME OF LUXURY HAIR · Free VIP Delivery in Nigeria on Orders Over ₦300,000 · WhatsApp: +234 706 172 8749"
                  className="w-full bg-[#18171C] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                />
                <button className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C]">
                  Update Banner
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F0F12] border border-[#2C2933] space-y-3">
                <span className="text-xs font-semibold text-[#E8A598] uppercase">
                  Save to Buy Minimum Deposit Policy
                </span>
                <p className="text-xs text-[#9E9AA6]">
                  Current minimum initial deposit required: <strong>20%</strong>
                </p>
                <div className="text-xs text-emerald-400 font-medium">
                  0% Interest, fully automated WhatsApp due-date notifications active.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Product */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-[#141417] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#FAF7F2]">
              <h3 className="font-serif text-xl font-bold">
                {editingProduct ? 'Edit Hair Product' : 'Add New Luxury Hair Piece'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                      placeholder="e.g. Vietnamese Bone Straight 30 Inches"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    >
                      <option value="Bone Straight">Bone Straight</option>
                      <option value="Wigs">Wigs</option>
                      <option value="Curly Wigs">Curly Wigs</option>
                      <option value="Body Wave">Body Wave</option>
                      <option value="Deep Wave">Deep Wave</option>
                      <option value="Lace Frontals">Lace Frontals</option>
                      <option value="Hair Bundles">Hair Bundles</option>
                      <option value="Accessories & Care">Accessories & Care</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Price (₦ NGN)</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Stock Count</label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Hair Origin</label>
                    <input
                      type="text"
                      value={formOrigin}
                      onChange={(e) => setFormOrigin(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                      placeholder="e.g. Vietnamese Raw Hair"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#9E9AA6] mb-1">Subtitle / Luster</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    placeholder="e.g. Piano Gloss Mirror Finish · Super Double Drawn"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#9E9AA6] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="saveToBuyCheck"
                    checked={formSaveToBuy}
                    onChange={(e) => setFormSaveToBuy(e.target.checked)}
                    className="rounded text-[#D4AF37]"
                  />
                  <label htmlFor="saveToBuyCheck" className="text-xs text-[#FAF7F2] cursor-pointer">
                    Enable Save to Buy Installment Plan for this product
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#2C2933]">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl text-xs text-[#9E9AA6] hover:text-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#0B0B0C] cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
