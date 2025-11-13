"use strict";
// coupons.ts — live-reloading coupons from COUPONS_JSON with a small cache
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceRefreshCoupons = forceRefreshCoupons;
exports.findCoupon = findCoupon;
exports.isCouponActive = isCouponActive;
exports.allowsSku = allowsSku;
const TTL = Math.max(10, Number(process.env.COUPON_RELOAD_SECONDS || 60)) * 1000;
// Built-in safety fallback(s) that should always work even if env misses them
const DEFAULT_FALLBACK_COUPONS = [
    {
        code: 'VCWIEN',
        type: 'percent',
        value: 50,
        // Apply STRICTLY to BASIC vouchers only (case-insensitive)
        skus: ['maternity-basic', 'family-basic', 'newborn-basic'],
    },
];
function parseCouponsFromEnv() {
    try {
        const raw = process.env.COUPONS_JSON || '[]';
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    }
    catch {
        return [];
    }
}
function normalizeCoupon(c) {
    if (!c || !c.code || !c.type || !c.value || !Array.isArray(c.skus))
        return null;
    const type = String(c.type).toLowerCase();
    if (type !== 'percent' && type !== 'amount')
        return null;
    const value = Number(c.value);
    if (!Number.isFinite(value) || value <= 0)
        return null;
    const code = String(c.code).trim().toUpperCase();
    const skus = Array.from(new Set(c.skus.map((s) => String(s))));
    const obj = { code, type, value, skus };
    if (c.startsAt)
        obj.startsAt = String(c.startsAt);
    if (c.endsAt)
        obj.endsAt = String(c.endsAt);
    if (c.minOrderCents)
        obj.minOrderCents = Number(c.minOrderCents) || 0;
    return obj;
}
function loadCouponsSafe() {
    const envCoupons = parseCouponsFromEnv().map(normalizeCoupon).filter(Boolean);
    if (envCoupons.length)
        return envCoupons;
    // Safe fallback if env JSON is empty/bad
    return DEFAULT_FALLBACK_COUPONS;
}
let cache = { coupons: loadCouponsSafe(), ts: 0 };
function getCoupons() {
    const now = Date.now();
    if (now - cache.ts > TTL) {
        cache.coupons = loadCouponsSafe();
        cache.ts = now;
    }
    return cache.coupons;
}
function forceRefreshCoupons() {
    cache = { coupons: loadCouponsSafe(), ts: Date.now() };
    return cache.coupons.length;
}
function findCoupon(code) {
    if (!code)
        return null;
    const needle = String(code).trim().toUpperCase();
    const fromEnv = getCoupons().find((c) => c.code === needle);
    if (fromEnv)
        return fromEnv;
    // Fallback to built-in defaults (e.g., VCWIEN)
    const builtin = DEFAULT_FALLBACK_COUPONS.find((c) => c.code === needle) || null;
    return builtin;
}
function isCouponActive(c) {
    const now = Date.now();
    if (c.startsAt && now < Date.parse(c.startsAt))
        return false;
    if (c.endsAt && now > Date.parse(c.endsAt))
        return false;
    return true;
}
function allowsSku(c, sku) {
    if (!sku)
        return false;
    const s = String(sku).toLowerCase();
    return c.skus.some((k) => {
        const key = String(k).toLowerCase();
        if (key === '*' || key === 'all')
            return true;
        return key === s;
    });
}
