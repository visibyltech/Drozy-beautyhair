export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generatePaystackRef(prefix = 'PAY_DRZ'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateInstallments(
  totalPrice: number,
  depositAmount: number,
  durationMonths: number,
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
) {
  const balance = Math.max(0, totalPrice - depositAmount);
  let totalInstallments = 1;

  if (frequency === 'daily') {
    totalInstallments = durationMonths * 30;
  } else if (frequency === 'weekly') {
    totalInstallments = durationMonths * 4;
  } else if (frequency === 'biweekly') {
    totalInstallments = durationMonths * 2;
  } else if (frequency === 'monthly') {
    totalInstallments = durationMonths;
  }

  const installmentAmount = Math.ceil(balance / totalInstallments);

  return {
    balance,
    totalInstallments,
    installmentAmount,
  };
}
