import test from 'node:test';
import assert from 'node:assert/strict';
import { price, validate, decode, totals, CATEGORIES } from '../pricing.js';
const item = {id:'one', name:'Bourbon', cost:34, bottles:2, category:'Whiskey'};
test('16 pours and 5× markup produce expected sales and profit', () => { assert.deepEqual(price(32), {perPourCost:2, pourPrice:10, bottleRevenue:160, bottleProfit:128}); });
test('fractional prices retain precision until display', () => { assert.equal(price(45).pourPrice, 45 / 16 * 5); });
test('invalid costs rejected', () => { for (const cost of [0,-1,NaN,Infinity,'34',1000001]) assert.throws(() => price(cost)); });
test('all three categories accepted', () => { for (const category of CATEGORIES) assert.equal(validate({...item,category}).category,category); });
test('invalid inventory fields rejected', () => { for (const patch of [{name:''},{category:'X'},{bottles:1.5},{bottles:-1},{cost:0},{id:''}]) assert.throws(() => validate({...item,...patch})); });
test('inventory backup round trip preserves data', () => { assert.deepEqual(decode(JSON.stringify([item])),[item]); assert.deepEqual(decode(null),[]); });
test('corrupted and duplicate backups rejected', () => { for (const raw of ['bad','{}','[null]',JSON.stringify([item,item])]) assert.throws(() => decode(raw)); });
test('dashboard aggregates stocked bottles and ignores zero stock', () => { assert.deepEqual(totals([item,{...item,id:'two',bottles:0}]),{bottles:2,cost:68,revenue:340}); assert.deepEqual(totals([]),{bottles:0,cost:0,revenue:0}); });

test('legacy inventory categories migrate without losing inventory', () => { for (const category of ['1M', '2K', '3J', '4A']) assert.deepEqual(decode(JSON.stringify([{...item, category}])), [{...item, category:'Whiskey'}]); });
test('category choices match the requested types', () => { assert.deepEqual(CATEGORIES, ['Whiskey', 'Scotch', 'Bourbon']); });
