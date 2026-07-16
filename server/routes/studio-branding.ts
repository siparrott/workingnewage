/**
 * Studio Branding routes
 *
 * Powers the admin "Studio Customization" page. Persists studio branding
 * (logo, business info, brand colours, active template) and — crucially —
 * mirrors the LOGO and BUSINESS INFO into `manual_page_content` so they
 * actually drive the public website Header (`site-settings` → `site.logo`)
 * and the invoice/PDF template (`contact` → `contact.*`). Without that mirror
 * the settings would be orphan data that never appears on the site.
 *
 * `studio_configs` (single-row for a self-hosted studio) is the authoritative
 * store for the form; the manual_page_content rows are the render-time source
 * the public site already reads.
 *
 * Note on colours: the public site is painted with ~2000 hardcoded Tailwind
 * `purple/violet` literals and defines no `:root` theme tokens, so brand
 * colours are persisted (for invoice/template surfaces + future theming) but
 * do NOT restyle the whole public site today. The UI says so honestly.
 */

import express from 'express';
import { db } from '../db';
import { studioConfigs, manualPageContent } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../auth';

const router = express.Router();

const getStudioId = (req: any): string =>
  req.user?.studioId || (process.env.STUDIO_ID || '550e8400-e29b-41d4-a716-446655440000');

// Languages the public site / invoice may render in — write branding to both so
// the logo + business info appear regardless of the visitor's language toggle.
const LANGS = ['de', 'en'];

/** Merge a patch of keys into a manual_page_content page, publishing immediately. */
async function upsertPageContent(studioId: string, pageId: string, patch: Record<string, string>) {
  for (const language of LANGS) {
    const [rec] = await db
      .select()
      .from(manualPageContent)
      .where(
        and(
          eq(manualPageContent.studioId, studioId),
          eq(manualPageContent.pageId, pageId),
          eq(manualPageContent.language, language)
        )
      )
      .limit(1);

    // Preserve any other keys already stored on this page.
    const merged = {
      ...(rec?.publishedContent as Record<string, string> | undefined),
      ...(rec?.draftContent as Record<string, string> | undefined),
      ...patch,
    };

    if (rec) {
      await db
        .update(manualPageContent)
        .set({
          draftContent: merged,
          publishedContent: merged,
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(manualPageContent.id, rec.id));
    } else {
      await db.insert(manualPageContent).values({
        studioId,
        pageId,
        language,
        draftContent: merged,
        publishedContent: merged,
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}

/**
 * GET /api/studio/branding
 * Load current branding for the admin form. Logo prefers the live
 * `site-settings` value (what the public header actually shows).
 */
router.get('/branding', requireAuth, async (req, res) => {
  try {
    const studioId = getStudioId(req);
    const [sc] = await db.select().from(studioConfigs).limit(1);

    // Logo: the public header reads manual_page_content site.logo first.
    let logoUrl: string | null = sc?.logoUrl || null;
    const [siteSettings] = await db
      .select()
      .from(manualPageContent)
      .where(
        and(
          eq(manualPageContent.studioId, studioId),
          eq(manualPageContent.pageId, 'site-settings'),
          eq(manualPageContent.language, 'de')
        )
      )
      .limit(1);
    const siteLogo = (siteSettings?.publishedContent as any)?.['site.logo'];
    if (siteLogo && siteLogo !== 'site.logo') logoUrl = siteLogo;

    return res.json({
      studioName: sc?.studioName || '',
      ownerEmail: sc?.ownerEmail || '',
      businessName: sc?.businessName || sc?.studioName || '',
      address: sc?.address || '',
      city: sc?.city || '',
      phone: sc?.phone || '',
      email: sc?.email || sc?.ownerEmail || '',
      logoUrl,
      primaryColor: sc?.primaryColor || '#7C3AED',
      secondaryColor: sc?.secondaryColor || '#F59E0B',
      activeTemplate: sc?.activeTemplate || 'template-01-modern-minimal',
    });
  } catch (error: any) {
    console.error('[studio-branding] GET failed:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/studio/branding
 * Persist branding to studio_configs AND mirror logo + business info into
 * manual_page_content so the public site + invoices reflect the changes.
 */
router.put('/branding', requireAuth, async (req, res) => {
  try {
    const studioId = getStudioId(req);
    const {
      studioName,
      businessName,
      address,
      city,
      phone,
      email,
      logoUrl,
      primaryColor,
      secondaryColor,
      activeTemplate,
    } = req.body || {};

    // 1) Authoritative store: studio_configs (single row).
    const set: any = { updatedAt: new Date() };
    if (studioName !== undefined) set.studioName = studioName;
    if (businessName !== undefined) set.businessName = businessName;
    if (address !== undefined) set.address = address;
    if (city !== undefined) set.city = city;
    if (phone !== undefined) set.phone = phone;
    if (email !== undefined) set.email = email;
    if (logoUrl !== undefined) set.logoUrl = logoUrl;
    if (primaryColor !== undefined) set.primaryColor = primaryColor;
    if (secondaryColor !== undefined) set.secondaryColor = secondaryColor;
    if (activeTemplate !== undefined) set.activeTemplate = activeTemplate;

    const [existing] = await db.select().from(studioConfigs).limit(1);
    if (existing) {
      await db.update(studioConfigs).set(set).where(eq(studioConfigs.id, existing.id));
    } else {
      await db.insert(studioConfigs).values({
        studioName: studioName || 'My Studio',
        ownerEmail: email || 'admin@localhost',
        ...set,
      });
    }

    // 2) Mirror the logo into the store the public Header + invoice read.
    if (logoUrl !== undefined && logoUrl) {
      await upsertPageContent(studioId, 'site-settings', { 'site.logo': logoUrl });
    }

    // 3) Mirror business info into the `contact` page (invoice footer + contact).
    const contactPatch: Record<string, string> = {};
    if (studioName !== undefined && studioName) contactPatch['contact.studioName'] = studioName;
    if (address !== undefined && address) {
      contactPatch['contact.studioAddress'] = city ? `${address}, ${city}` : address;
    }
    if (phone !== undefined && phone) contactPatch['contact.phone'] = phone;
    if (email !== undefined && email) contactPatch['contact.email'] = email;
    if (Object.keys(contactPatch).length > 0) {
      await upsertPageContent(studioId, 'contact', contactPatch);
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error('[studio-branding] PUT failed:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
