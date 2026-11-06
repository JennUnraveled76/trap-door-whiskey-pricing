export const CATEGORIES = ['Whiskey', 'Scotch', 'Bourbon'];
export const STORAGE_KEY = 'trap-door-whiskey-v1';
export function price(cost) {
  if (!Number.isFinite(cost) || cost <= 0 || cost > 1000000) throw new Error('Bottle cost must be greater than $0 and at most $1,000,000.');
  return { perPourCost: cost / 16, pourPrice: cost / 16 * 5, bottleRevenue: cost * 5, bottleProfit: cost * 4 };
}
export function validate(item) {
  if (!item || typeof item.id !== 'string' || !item.id || typeof item.name !== 'string' || !item.name.trim() || item.name.length > 120) throw new Error('Enter a whiskey name (up to 120 characters).');
  price(item.cost);
  if (!CATEGORIES.includes(item.category)) throw new Error('Choose a valid category.');
  if (!Number.isSafeInteger(item.bottles) || item.bottles < 0 || item.bottles > 1000000) throw new Error('Bottle quantity must be a whole number from 0 to 1,000,000.');
  return item;
}
export function decode(raw) {
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Inventory backup must be a list.');
  // Preserve legacy inventory and backups; users can refine the category later.
  for (const item of data) {
    if (item && ['1M', '2K', '3J', '4A'].includes(item.category)) item.category = 'Whiskey';
  }
  data.forEach(validate);
  if (new Set(data.map(x => x.id)).size !== data.length) throw new Error('Duplicate inventory IDs.');
  return data;
}
export function totals(items) {
  return items.reduce((t, item) => ({ bottles: t.bottles + item.bottles, cost: t.cost + item.cost * item.bottles, revenue: t.revenue + price(item.cost).bottleRevenue * item.bottles }), { bottles: 0, cost: 0, revenue: 0 });
}
