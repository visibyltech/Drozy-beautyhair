import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SaveToBuyPlan, Order } from '../types';
import { formatNGN, formatDate } from '../utils/formatters';
import { WHATSAPP_CONTACT } from '../data/mockData';
import {
  Sparkles,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Truck,
  ExternalLink,
  ShieldCheck,
  User,
  Plus,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    user,
    saveToBuyPlans,
    orders,
    wishlist,
    products,
    notifications,
    sendPlanReminder,
    openPaystack,
    contributeToSaveToBuyPlan,
    setSelectedProduct,
    addToCart,
    addAddress,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'savetobuy' | 'orders' | 'wishlist' | 'payments' | 'addresses' | 'notifications'
  >('savetobuy');

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    saveToBuyPlans[0]?.id || ''
  );

  // Address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState(user.phone);
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Lagos');
  const [newAddrState, setNewAddrState] = useState('Lagos State');

  // Custom installment amount input
  const [customPayAmount, setCustomPayAmount] = useState<string>('');

  const currentPlan = saveToBuyPlans.find((p) => p.id === selectedPlanId) || saveToBuyPlans[0];

  // Pay next installment helper
  const handlePayInstallment = (plan: SaveToBuyPlan, amountToPay?: number) => {
    const payAmount = amountToPay || plan.installmentAmount;
    openPaystack({
      amount: Math.min(payAmount, plan.outstandingBalance),
      title: `Save to Buy Contribution - Plan #${plan.planNumber}`,
      subtitle: plan.product.name,
      purpose: 'save_to_buy_installment',
      customerEmail: user.email,
      customerName: user.name,
      onSuccess: (paymentRef, method) => {
        contributeToSaveToBuyPlan(
          plan.id,
          Math.min(payAmount, plan.outstandingBalance),
          paymentRef,
          method,
          `Installment contribution for ${plan.product.name}`
        );
      },
    });
  };

  // Pay off balance in full helper
  const handleEarlyPayoff = (plan: SaveToBuyPlan) => {
    openPaystack({
      amount: plan.outstandingBalance,
      title: `Early Full Payoff - Plan #${plan.planNumber}`,
      subtitle: plan.product.name,
      purpose: 'save_to_buy_payoff',
      customerEmail: user.email,
      customerName: user.name,
      onSuccess: (paymentRef, method) => {
        contributeToSaveToBuyPlan(
          plan.id,
          plan.outstandingBalance,
          paymentRef,
          method,
          `Early 100% Full Payoff for ${plan.product.name}`
        );
      },
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity) return;
    addAddress({
      title: newAddrTitle || 'Delivery Address',
      recipientName: user.name,
      phone: newAddrPhone,
      address: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      isDefault: user.addresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewAddrStreet('');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-[#1F1E24] flex items-center justify-center">
              <User className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#FAF7F2]">{user.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase">
                  VIP Client
                </span>
              </div>
              <div className="text-xs text-[#9E9AA6] mt-1 space-x-2">
                <span>{user.email}</span>
                <span>·</span>
                <span>{user.phone}</span>
                <span>·</span>
                <span>Member since {user.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#2C2933]">
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#9E9AA6]">Active Savings Plans</span>
              <div className="text-xl font-bold font-serif text-[#D4AF37] tabular-nums">
                {saveToBuyPlans.filter((p) => p.status === 'active').length}
              </div>
            </div>
            <div className="text-right pl-4 border-l border-[#2C2933]">
              <span className="text-[10px] uppercase text-[#9E9AA6]">Total Orders</span>
              <div className="text-xl font-bold font-serif text-[#E8A598] tabular-nums">
                {orders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-[#141417] border border-[#2C2933] rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('savetobuy')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'savetobuy'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Save to Buy Plans ({saveToBuyPlans.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Tracking ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment History</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md font-bold'
                : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.length})</span>
          </button>
        </div>

        {/* Tab 1: Save to Buy Deep Dive */}
        {activeTab === 'savetobuy' && (
          <div className="space-y-6">
            {/* Plan Selector Pills if multiple */}
            {saveToBuyPlans.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {saveToBuyPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-w-[240px] ${
                      currentPlan?.id === plan.id
                        ? 'bg-[#1C1B22] border-[#D4AF37] shadow-lg'
                        : 'bg-[#141417] border-[#2C2933] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase font-semibold mb-1">
                      <span className="text-[#9E9AA6]">{plan.planNumber}</span>
                      <span
                        className={
                          plan.status === 'completed'
                            ? 'text-emerald-400 font-bold'
                            : 'text-[#D4AF37]'
                        }
                      >
                        {plan.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#FAF7F2] truncate">
                      {plan.product.name}
                    </div>
                    <div className="text-[11px] text-[#9E9AA6] mt-1">
                      Saved:{' '}
                      <strong className="text-[#D4AF37] tabular-nums">
                        {formatNGN(plan.amountSaved)}
                      </strong>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentPlan ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Plan Overview & Actions (Left 7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-xl space-y-6">
                    {/* Plan Top Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2C2933]">
                      <div className="flex items-center gap-4">
                        <img
                          src={currentPlan.product.images[0]}
                          alt={currentPlan.product.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-[#2C2933]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#D4AF37] font-semibold">
                              #{currentPlan.planNumber}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                currentPlan.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                              }`}
                            >
                              {currentPlan.status}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-[#FAF7F2] mt-0.5">
                            {currentPlan.product.name}
                          </h3>
                          <p className="text-xs text-[#9E9AA6] mt-0.5">
                            {currentPlan.selectedSpecs.length} · {currentPlan.selectedSpecs.density} ·{' '}
                            {currentPlan.selectedSpecs.lace}
                          </p>
                        </div>
                      </div>

                      {currentPlan.status === 'active' && (
                        <button
                          onClick={() => handleEarlyPayoff(currentPlan)}
                          className="py-2 px-3 rounded-xl text-xs font-semibold text-[#E8A598] hover:text-[#0B0B0C] border border-[#E8A598]/50 hover:bg-[#E8A598] transition-all whitespace-nowrap cursor-pointer"
                        >
                          Pay Off Balance Early
                        </button>
                      )}
                    </div>

                    {/* Progress Bar & KPI Numbers */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span className="text-[#9E9AA6]">Savings Progress</span>
                        <span className="text-[#D4AF37] font-mono">
                          {Math.round((currentPlan.amountSaved / currentPlan.totalProductPrice) * 100)}
                          % Completed
                        </span>
                      </div>
                      <div className="w-full bg-[#2C2933] h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] via-[#F3E0A3] to-[#E8A598] h-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (currentPlan.amountSaved / currentPlan.totalProductPrice) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0F0F12] border border-[#2C2933] text-center">
                      <div>
                        <span className="text-[10px] text-[#9E9AA6] uppercase">Total Hair Price</span>
                        <div className="text-sm font-bold font-serif text-[#FAF7F2] tabular-nums mt-0.5">
                          {formatNGN(currentPlan.totalProductPrice)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                          Total Saved
                        </span>
                        <div className="text-sm font-bold font-serif text-emerald-400 tabular-nums mt-0.5">
                          {formatNGN(currentPlan.amountSaved)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#E8A598] uppercase">Outstanding</span>
                        <div className="text-sm font-bold font-serif text-[#E8A598] tabular-nums mt-0.5">
                          {formatNGN(currentPlan.outstandingBalance)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#D4AF37] uppercase font-semibold">
                          Next Due Date
                        </span>
                        <div className="text-sm font-bold text-[#FAF7F2] mt-0.5">
                          {currentPlan.nextDueDate}
                        </div>
                      </div>
                    </div>

                    {/* Payment Trigger Buttons if active */}
                    {currentPlan.status === 'active' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            onClick={() => handlePayInstallment(currentPlan)}
                            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4 text-[#0B0B0C]" />
                            <span>
                              Pay Next Installment ({formatNGN(currentPlan.installmentAmount)})
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => sendPlanReminder(currentPlan.id, 'whatsapp')}
                            className="py-3 px-4 rounded-xl text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                            title="Simulate sending WhatsApp reminder"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span>Send WhatsApp Reminder</span>
                          </button>
                        </div>

                        {/* Custom Extra Contribution Input */}
                        <div className="p-3 bg-[#0F0F12] rounded-xl border border-[#2C2933] flex items-center gap-2">
                          <span className="text-xs text-[#9E9AA6] whitespace-nowrap">
                            Custom Contribution: ₦
                          </span>
                          <input
                            type="number"
                            placeholder="e.g. 20000"
                            value={customPayAmount}
                            onChange={(e) => setCustomPayAmount(e.target.value)}
                            className="flex-1 bg-transparent text-xs text-[#FAF7F2] font-mono focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={!customPayAmount || Number(customPayAmount) <= 0}
                            onClick={() => {
                              handlePayInstallment(currentPlan, Number(customPayAmount));
                              setCustomPayAmount('');
                            }}
                            className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#2C2933] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            Pay Extra
                          </button>
                        </div>
                      </div>
                    )}

                    {currentPlan.status === 'completed' && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold">100% Paid Off & Ready for Crown Delivery!</h4>
                          <p className="text-xs text-[#9E9AA6] mt-0.5">
                            Congratulations! Your unit was styled by our master artisan and passed to VIP dispatch.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 5 Cols: Full Schedule Breakdown & Reminders */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Schedule Card */}
                  <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-xl space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#FAF7F2] flex items-center justify-between">
                      <span>Installment Schedule</span>
                      <span className="text-xs text-[#9E9AA6] font-normal capitalize">
                        {currentPlan.frequency} schedule
                      </span>
                    </h3>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {currentPlan.schedule.map((item) => (
                        <div
                          key={item.installmentNumber}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                            item.status === 'paid'
                              ? 'bg-emerald-500/5 border-emerald-500/30'
                              : item.status === 'due'
                              ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50'
                              : 'bg-[#18171C] border-[#2C2933]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.status === 'paid' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : item.status === 'due' ? (
                              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-[#2C2933] flex items-center justify-center text-[9px] text-[#9E9AA6]">
                                {item.installmentNumber}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-[#FAF7F2]">
                                Installment #{item.installmentNumber}
                              </div>
                              <div className="text-[10px] text-[#9E9AA6]">
                                {item.status === 'paid'
                                  ? `Paid on ${formatDate(item.paidAt || item.dueDate)}`
                                  : `Due: ${item.dueDate}`}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-bold text-[#FAF7F2] tabular-nums">
                              {formatNGN(item.amount)}
                            </div>
                            <span
                              className={`text-[9px] uppercase font-bold ${
                                item.status === 'paid'
                                  ? 'text-emerald-400'
                                  : item.status === 'due'
                                  ? 'text-[#D4AF37]'
                                  : 'text-[#9E9AA6]'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reminders Log Card */}
                  <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-3">
                    <h3 className="font-serif text-base font-bold text-[#FAF7F2]">
                      Notifications & Reminders Log
                    </h3>
                    {currentPlan.remindersSent.length === 0 ? (
                      <p className="text-xs text-[#9E9AA6]">No reminders sent yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {currentPlan.remindersSent.map((rem) => (
                          <div
                            key={rem.id}
                            className="p-3 rounded-xl bg-[#0F0F12] border border-[#2C2933] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {rem.type} Sent
                              </span>
                              <span className="text-[#9E9AA6]">{formatDate(rem.sentAt)}</span>
                            </div>
                            <p className="text-[#9E9AA6] text-[11px] leading-relaxed">
                              {rem.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 2: Orders & Order Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#141417] rounded-3xl border border-[#2C2933] space-y-3">
                <Package className="w-12 h-12 text-[#2C2933] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">No Orders Yet</h3>
                <p className="text-xs text-[#9E9AA6]">Start shopping or activate a Save to Buy plan!</p>
              </div>
            ) : (
              orders.map((order) => {
                const stepIdx =
                  order.status === 'order_placed'
                    ? 0
                    : order.status === 'payment_verified'
                    ? 1
                    : order.status === 'styling_preparation'
                    ? 2
                    : order.status === 'dispatched'
                    ? 3
                    : 4;

                return (
                  <div
                    key={order.id}
                    className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] shadow-xl space-y-6"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2C2933]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold font-serif text-[#D4AF37]">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="text-xs text-[#9E9AA6] mt-0.5">
                          Placed on {formatDate(order.createdAt)} · Paystack Ref:{' '}
                          <span className="font-mono text-[#FAF7F2]">{order.paymentReference}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#9E9AA6] uppercase">Total Paid</span>
                        <div className="text-xl font-bold font-serif text-[#FAF7F2] tabular-nums">
                          {formatNGN(order.totalAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Visual Tracker */}
                    <div className="py-2">
                      <span className="text-xs font-semibold text-[#FAF7F2] block mb-3">
                        Live Tracking: {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {[
                          { title: 'Order Placed', step: 0 },
                          { title: 'Payment Verified', step: 1 },
                          { title: 'Hair Styling & Prep', step: 2 },
                          { title: 'Dispatched (GIG)', step: 3 },
                          { title: 'Delivered', step: 4 },
                        ].map((s) => (
                          <div key={s.step} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                stepIdx >= s.step
                                  ? 'bg-[#D4AF37]'
                                  : 'bg-[#2C2933]'
                              }`}
                            />
                            <span
                              className={`text-[10px] block font-medium ${
                                stepIdx >= s.step ? 'text-[#FAF7F2]' : 'text-[#9E9AA6]'
                              }`}
                            >
                              {s.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-4 p-3 rounded-xl bg-[#0F0F12] border border-[#2C2933] flex items-center justify-between text-xs">
                          <span className="text-[#9E9AA6] flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#D4AF37]" />
                            GIG Logistics Courier Tracking ID:
                          </span>
                          <span className="font-mono text-[#FAF7F2] font-bold">
                            {order.trackingNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="space-y-3 pt-2">
                      {order.items.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-[#0F0F12] border border-[#2C2933]"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#FAF7F2] truncate">
                              {item.product.name}
                            </h4>
                            <div className="text-[11px] text-[#9E9AA6] mt-0.5 space-x-1">
                              <span>{item.selectedLength}</span>
                              <span>·</span>
                              <span>{item.selectedDensity}</span>
                              <span>·</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="font-mono text-sm font-bold text-[#D4AF37] tabular-nums">
                            {formatNGN(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#141417] rounded-3xl border border-[#2C2933]">
                <Heart className="w-12 h-12 text-[#2C2933] mx-auto mb-2" />
                <h3 className="font-serif text-base font-bold text-[#FAF7F2]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#9E9AA6]">Save your dream hair products here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {wishlistProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2.5 sm:p-4 rounded-2xl bg-[#141417] border border-[#2C2933] space-y-2 sm:space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full aspect-[4/5] sm:aspect-[4/3] rounded-xl object-cover object-top"
                      />
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#FAF7F2] mt-2 line-clamp-1">
                        {prod.name}
                      </h4>
                      <div className="text-xs font-serif font-bold text-[#D4AF37] tabular-nums mt-0.5">
                        {formatNGN(prod.basePrice)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 pt-1">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C] hover:bg-[#F3E0A3] transition-colors text-center"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          addToCart(
                            prod,
                            prod.availableLengths[0] || '20"',
                            prod.availableDensities[0] || '180%',
                            prod.laceTypes[0] || 'HD Lace',
                            prod.colors[0] || 'Natural'
                          )
                        }
                        className="py-1.5 px-2 rounded-lg bg-[#2A2832] text-[#FAF7F2] hover:text-[#D4AF37] text-[10px] sm:text-xs flex items-center justify-center gap-1"
                        title="Add to Bag"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span className="sm:hidden">Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Payment History */}
        {activeTab === 'payments' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
              Verified Transaction History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2C2933] text-[#9E9AA6] uppercase font-semibold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Paystack Reference</th>
                    <th className="py-3 px-3">Purpose & Description</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2933]/60">
                  {currentPlan?.paymentHistory.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#1A191E]/60 transition-colors">
                      <td className="py-3 px-3 text-[#FAF7F2] whitespace-nowrap">
                        {formatDate(tx.paidAt)}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#D4AF37] whitespace-nowrap">
                        {tx.reference}
                      </td>
                      <td className="py-3 px-3 text-[#FAF7F2]">{tx.note}</td>
                      <td className="py-3 px-3 text-[#9E9AA6]">{tx.method}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-serif font-bold text-[#FAF7F2] tabular-nums whitespace-nowrap">
                        {formatNGN(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                Delivery Addresses (Nigeria)
              </h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C] flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <form
                onSubmit={handleSaveAddress}
                className="p-6 rounded-3xl bg-[#141417] border border-[#D4AF37]/50 space-y-4"
              >
                <h4 className="text-sm font-bold text-[#FAF7F2]">Add Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Salon, Office"
                      value={newAddrTitle}
                      onChange={(e) => setNewAddrTitle(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">Recipient Phone</label>
                    <input
                      type="text"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9E9AA6] mb-1">City</label>
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#9E9AA6] mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="House number, street name, landmark"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="py-2 px-4 rounded-xl text-xs text-[#9E9AA6] hover:text-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#FAF7F2]">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#9E9AA6]">{addr.recipientName}</div>
                  <div className="text-xs text-[#FAF7F2] leading-relaxed">
                    {addr.address}, {addr.city}, {addr.state}
                  </div>
                  <div className="text-xs text-[#9E9AA6] font-mono">{addr.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Notifications */}
        {activeTab === 'notifications' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
              Customer Notifications & Alerts
            </h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-colors ${
                    n.read ? 'bg-[#18171C] border-[#2C2933]' : 'bg-[#1C1B22] border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#FAF7F2]">{n.title}</span>
                    <span className="text-[10px] text-[#9E9AA6]">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#9E9AA6] leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
