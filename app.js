import { price, validate, decode, totals, STORAGE_KEY } from './pricing.js';
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
let items = [], editing = null, storageHealthy = true;
try { items = decode(localStorage.getItem(STORAGE_KEY)); $('save-status').textContent = 'Auto-save on · stored on this device'; }
catch { storageHealthy = false; $('save-status').textContent = 'Saved inventory could not be read. Original data is preserved. Download or recover it before making changes.'; }
function persist(next) {
  if (!storageHealthy) throw new Error('Saving is blocked to protect unreadable data. Recover browser storage before continuing.');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  items = next;
  $('save-status').textContent = `Saved on this device at ${new Date().toLocaleTimeString()}`;
  render();
}
function quote() {
  try { const p = price(Number($('cost').value)); $('pour-price').textContent = money(p.pourPrice); $('cost-detail').textContent = `${money(p.perPourCost)} cost per pour · ${money(p.bottleRevenue)} sales per bottle`; }
  catch { $('pour-price').textContent = '—'; $('cost-detail').textContent = 'Enter a valid bottle cost to calculate.'; }
}
function reset() { editing = null; $('whiskey-form').reset(); $('submit').textContent = 'Add to inventory'; $('cancel').hidden = true; $('form-error').textContent = ''; quote(); }
function render() {
  const t = totals(items); $('total-bottles').textContent = t.bottles; $('total-cost').textContent = money(t.cost); $('total-revenue').textContent = money(t.revenue); $('item-count').textContent = `${items.length} whiskeys`;
  const shown = items.filter(x => x.name.toLowerCase().includes($('search').value.toLowerCase()) && (!$('filter').value || x.category === $('filter').value));
  $('rows').replaceChildren(); $('empty').hidden = shown.length > 0; $('empty').textContent = items.length ? 'No whiskeys match your filters.' : 'Your shelf is empty. Add your first whiskey using the calculator.';
  for (const item of shown) {
    const row = document.createElement('tr');
    for (const value of [item.name, item.category, money(item.cost), money(price(item.cost).pourPrice), item.bottles]) { const td = document.createElement('td'); td.textContent = value; row.append(td); }
    const actions = document.createElement('td');
    for (const action of ['Edit', 'Delete']) { const b = document.createElement('button'); b.className = 'small secondary'; b.textContent = action; b.setAttribute('aria-label', `${action} ${item.name}`); b.onclick = () => {
      if (action === 'Edit') { editing = item.id; for (const key of ['name', 'cost', 'category', 'bottles']) $(key).value = item[key]; $('submit').textContent = 'Save changes'; $('cancel').hidden = false; quote(); $('name').focus(); }
      else if (confirm(`Delete ${item.name} from inventory?`)) { try { persist(items.filter(x => x.id !== item.id)); if (editing === item.id) reset(); } catch (e) { $('form-error').textContent = `Could not save: ${e.message}`; } }
    }; actions.append(b); } row.append(actions); $('rows').append(row);
  }
}
$('cost').addEventListener('input', quote);
$('cancel').onclick = reset;
$('search').oninput = render; $('filter').onchange = render;
$('whiskey-form').onsubmit = event => { event.preventDefault(); try { const item = validate({ id: editing || crypto.randomUUID(), name: $('name').value.trim(), cost: Number($('cost').value), bottles: Number($('bottles').value), category: $('category').value }); persist(editing ? items.map(x => x.id === editing ? item : x) : [...items, item]); reset(); } catch (e) { $('form-error').textContent = `Could not save: ${e.message}`; } };
$('export').onclick = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'trap-door-inventory.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
$('import').onchange = async event => { try { const file = event.target.files[0]; if (!file) return; if (file.size > 5000000) throw new Error('Backup must be smaller than 5 MB.'); const next = decode(await file.text()); if (!confirm(`Replace your inventory with ${next.length} whiskeys? Download a backup first if needed.`)) return; persist(next); reset(); $('backup-status').textContent = 'Backup imported and saved.'; } catch (e) { $('backup-status').textContent = `Import failed: ${e.message}`; } finally { event.target.value = ''; } };
render(); quote();
