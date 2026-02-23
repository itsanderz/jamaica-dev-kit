'use client';

import { useState, useMemo } from 'react';
import { formatJMD, formatUSD, jmdToUSD, addGCT, GCT_RATE } from 'jamaica-currency';
import { parseAddress, extractParish } from 'jamaica-addresses';
import {
  getAllParishes,
  getParishByName,
  getDistanceKm,
  type ParishCode,
  type Parish,
} from 'jamaica-parishes';
import { isValidJamaicanNumber, formatNational } from 'jamaica-phone';

// ---------------------------------------------------------------------------
// Product catalog
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'coffee',
    name: 'Blue Mountain Coffee',
    description: 'Premium 100% Jamaica Blue Mountain, whole bean, 1 lb bag',
    price: 4500,
    emoji: '\u2615',
  },
  {
    id: 'rumcake',
    name: 'Jamaican Rum Cake',
    description: 'Traditional dark rum-soaked fruit cake, 24 oz tin',
    price: 3200,
    emoji: '\uD83C\uDF70',
  },
  {
    id: 'pepper',
    name: 'Scotch Bonnet Pepper Sauce',
    description: 'Authentic fiery hot sauce, 5 oz bottle',
    price: 850,
    emoji: '\uD83C\uDF36\uFE0F',
  },
  {
    id: 'towel',
    name: 'Jamaica Flag Beach Towel',
    description: 'Oversized 60x30" cotton terry towel with flag design',
    price: 2100,
    emoji: '\uD83C\uDDEF\uD83C\uDDF2',
  },
];

// ---------------------------------------------------------------------------
// Delivery zone helpers
// ---------------------------------------------------------------------------

interface DeliveryZone {
  zone: number;
  label: string;
  fee: number;
}

function getDeliveryZone(distanceKm: number): DeliveryZone {
  if (distanceKm <= 30) return { zone: 1, label: 'Zone 1 (0-30 km)', fee: 500 };
  if (distanceKm <= 80) return { zone: 2, label: 'Zone 2 (30-80 km)', fee: 800 };
  if (distanceKm <= 150) return { zone: 3, label: 'Zone 3 (80-150 km)', fee: 1200 };
  return { zone: 4, label: 'Zone 4 (150+ km)', fee: 1800 };
}

function getParishCode(parishName: string): ParishCode | null {
  const parish = getParishByName(parishName);
  return parish ? parish.code : null;
}

// ---------------------------------------------------------------------------
// Main checkout component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  // Cart state: map of product id -> quantity
  const [cart, setCart] = useState<Record<string, number>>({});

  // Delivery form state
  const [addressText, setAddressText] = useState('');
  const [phoneText, setPhoneText] = useState('');

  // Derived: all parishes for the delivery table
  const allParishes = useMemo(() => getAllParishes(), []);

  // ---------------------------------------------------------------------------
  // Cart helpers
  // ---------------------------------------------------------------------------

  function addToCart(id: string) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const qty = (prev[id] || 0) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  }

  const cartItems = PRODUCTS.filter((p) => cart[p.id] && cart[p.id] > 0);
  const subtotal = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const totalWithGCT = addGCT(subtotal);
  const gctAmount = totalWithGCT - subtotal;

  // ---------------------------------------------------------------------------
  // Address parsing (live)
  // ---------------------------------------------------------------------------

  const parsed = useMemo(() => parseAddress(addressText), [addressText]);
  const detectedParish = useMemo(() => extractParish(addressText), [addressText]);
  const parishCode = detectedParish ? getParishCode(detectedParish) : null;

  const deliveryDistance = useMemo(() => {
    if (!parishCode) return null;
    if (parishCode === 'KIN') return 0;
    try {
      return getDistanceKm('KIN', parishCode);
    } catch {
      return null;
    }
  }, [parishCode]);

  const deliveryZone = deliveryDistance !== null ? getDeliveryZone(deliveryDistance) : null;
  const deliveryFee = deliveryZone?.fee ?? 0;

  const grandTotal = totalWithGCT + deliveryFee;
  const grandTotalUSD = jmdToUSD(grandTotal);

  // ---------------------------------------------------------------------------
  // Phone validation
  // ---------------------------------------------------------------------------

  const phoneValid = phoneText.trim() ? isValidJamaicanNumber(phoneText) : null;
  let formattedPhone = '';
  if (phoneValid) {
    try {
      formattedPhone = formatNational(phoneText);
    } catch {
      formattedPhone = '';
    }
  }

  // ---------------------------------------------------------------------------
  // Parsed address chips
  // ---------------------------------------------------------------------------

  const addressChips: { label: string; value: string; green?: boolean }[] = [];
  if (parsed.streetNumber) addressChips.push({ label: 'Street #', value: parsed.streetNumber });
  if (parsed.streetName) addressChips.push({ label: 'Street', value: parsed.streetName });
  if (parsed.unit) addressChips.push({ label: 'Unit', value: parsed.unit });
  if (parsed.community) addressChips.push({ label: 'Community', value: parsed.community });
  if (parsed.district) addressChips.push({ label: 'District', value: parsed.district });
  if (parsed.parish) addressChips.push({ label: 'Parish', value: parsed.parish, green: true });
  if (parsed.kingstonSector) addressChips.push({ label: 'Kingston Sector', value: String(parsed.kingstonSector), green: true });

  // ---------------------------------------------------------------------------
  // Can we "place" an order?
  // ---------------------------------------------------------------------------

  const hasItems = cartItems.length > 0;
  const hasValidAddress = !!detectedParish;
  const hasValidPhone = phoneValid === true;

  // ---------------------------------------------------------------------------
  // Render: parish distance table data
  // ---------------------------------------------------------------------------

  const parishTableRows = useMemo(() => {
    return allParishes.map((p: Parish) => {
      let dist = 0;
      if (p.code !== 'KIN') {
        try {
          dist = getDistanceKm('KIN', p.code);
        } catch {
          dist = 0;
        }
      }
      const zone = getDeliveryZone(dist);
      return { parish: p, distance: dist, zone };
    });
  }, [allParishes]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-10">
      {/* Page title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Jamaican E-Commerce Checkout</h2>
        <p className="text-[var(--text-secondary)] mt-1">
          A demo checkout powered by jamaica-currency, jamaica-addresses, jamaica-parishes, and jamaica-phone.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Product catalog + Cart */}
        <div className="lg:col-span-3 space-y-8">
          {/* Product catalog */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Product Catalog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCTS.map((product) => {
                const qty = cart[product.id] || 0;
                return (
                  <div
                    key={product.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-3">{product.emoji}</div>
                    <h4 className="font-semibold text-[15px]">{product.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-[var(--brand)]">
                        {formatJMD(product.price)}
                      </span>
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(product.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--bg)] text-sm font-medium flex items-center justify-center hover:bg-[var(--bg-mute)] transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-mono font-medium w-5 text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--bg)] text-sm font-medium flex items-center justify-center hover:bg-[var(--bg-mute)] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cart summary */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">Your cart is empty. Add some products above.</p>
            ) : (
              <div className="space-y-4">
                {/* Line items */}
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.emoji} {item.name} <span className="text-[var(--text-muted)]">x{cart[item.id]}</span>
                      </span>
                      <span className="font-mono">{formatJMD(item.price * cart[item.id])}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-[var(--border)]" />

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                    <span className="font-mono">{formatJMD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">GCT ({(GCT_RATE * 100).toFixed(0)}%)</span>
                    <span className="font-mono">{formatJMD(gctAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Delivery{deliveryZone ? ` (${deliveryZone.label})` : ''}
                    </span>
                    <span className="font-mono">
                      {deliveryZone ? formatJMD(deliveryFee) : (
                        <span className="text-[var(--text-muted)]">Enter address</span>
                      )}
                    </span>
                  </div>

                  <hr className="border-[var(--border)]" />

                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="font-mono text-[var(--brand)]">{formatJMD(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-muted)]">
                    <span>Approx. USD</span>
                    <span className="font-mono">{formatUSD(grandTotalUSD)}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right column: Delivery form + Phone */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery address form */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-6 shadow-sm lg:sticky lg:top-20">
            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
            <textarea
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="e.g. Apt 4, 20 Barbican Road, Kingston 8"
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent resize-none"
            />

            {/* Live parsed chips */}
            {addressChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {addressChips.map((chip) => (
                  <span
                    key={chip.label}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      chip.green
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-[var(--bg-mute)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="opacity-60">{chip.label}:</span> {chip.value}
                  </span>
                ))}
              </div>
            )}

            {/* Delivery zone info */}
            {deliveryZone && deliveryDistance !== null && (
              <div className="mt-4 rounded-lg bg-[var(--brand-soft)] border border-[var(--brand)]/20 p-3">
                <div className="text-xs font-medium text-[var(--brand)] mb-1">{deliveryZone.label}</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {Math.round(deliveryDistance)} km from Kingston &middot; Delivery fee:{' '}
                  <span className="font-mono font-semibold">{formatJMD(deliveryZone.fee)}</span>
                </div>
              </div>
            )}

            {/* Phone validation */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Delivery Phone</label>
              <input
                type="tel"
                value={phoneText}
                onChange={(e) => setPhoneText(e.target.value)}
                placeholder="e.g. 876-555-1234"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:border-transparent bg-[var(--bg)] ${
                  phoneValid === false
                    ? 'border-red-400 focus:ring-red-400'
                    : phoneValid === true
                      ? 'border-emerald-400 focus:ring-emerald-400'
                      : 'border-[var(--border)] focus:ring-[var(--brand)]'
                }`}
              />
              {phoneValid === true && formattedPhone && (
                <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  Valid: {formattedPhone}
                </p>
              )}
              {phoneValid === false && (
                <p className="mt-1.5 text-xs text-red-500">
                  Invalid Jamaican phone number. Use format: 876-XXX-XXXX
                </p>
              )}
            </div>

            {/* Order summary */}
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <h4 className="text-sm font-semibold mb-3">Order Summary</h4>
              {cartItems.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No items in cart.</p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">
                        {item.name} x{cart[item.id]}
                      </span>
                      <span className="font-mono">{formatJMD(item.price * cart[item.id])}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>GCT</span>
                    <span className="font-mono">{formatJMD(gctAmount)}</span>
                  </div>
                  {deliveryZone && (
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Delivery</span>
                      <span className="font-mono">{formatJMD(deliveryFee)}</span>
                    </div>
                  )}
                  <hr className="border-[var(--border)]" />
                  <div className="flex justify-between font-semibold text-sm pt-1">
                    <span>Total</span>
                    <span className="font-mono text-[var(--brand)]">{formatJMD(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>USD equivalent</span>
                    <span className="font-mono">{formatUSD(grandTotalUSD)}</span>
                  </div>
                  {detectedParish && (
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Delivering to</span>
                      <span>{detectedParish}</span>
                    </div>
                  )}
                  {phoneValid && formattedPhone && (
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Phone</span>
                      <span className="font-mono">{formattedPhone}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={!hasItems || !hasValidAddress || !hasValidPhone}
                className={`mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  hasItems && hasValidAddress && hasValidPhone
                    ? 'bg-[var(--brand)] text-white hover:opacity-90 cursor-not-allowed'
                    : 'bg-[var(--bg-mute)] text-[var(--text-muted)] cursor-not-allowed'
                }`}
                title="Demo only — order placement is not functional"
              >
                Place Order (Demo)
              </button>
              {(!hasItems || !hasValidAddress || !hasValidPhone) && (
                <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
                  {!hasItems && 'Add items to cart. '}
                  {!hasValidAddress && 'Enter a valid delivery address. '}
                  {!hasValidPhone && 'Enter a valid phone number.'}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Delivery Zone Table */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Delivery Zones by Parish</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Delivery fees are calculated based on haversine distance from Kingston.
        </p>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-mute)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Parish</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Capital</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Distance (km)</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Zone</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Fee</th>
                </tr>
              </thead>
              <tbody>
                {parishTableRows.map(({ parish, distance, zone }) => {
                  const isSelected = detectedParish === parish.name;
                  return (
                    <tr
                      key={parish.code}
                      className={`border-t border-[var(--border)] ${
                        isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-[var(--bg-soft)]'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium">
                        {parish.name}
                        {isSelected && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            selected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-[var(--text-secondary)]">{parish.capital}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{Math.round(distance)}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            zone.zone === 1
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : zone.zone === 2
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : zone.zone === 3
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          Zone {zone.zone}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-[var(--brand)]">
                        {formatJMD(zone.fee)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
