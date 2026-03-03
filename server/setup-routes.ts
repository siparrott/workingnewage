/**
 * Setup Wizard API Routes for TogNinja
 * 
 * These routes power the 5-phase onboarding wizard:
 * 1. Basics - Business info, branding, timezone
 * 2. Integrations - Connect Instagram, Google, Calendar, Payments
 * 3. Scanning - IA scan of existing content
 * 4. Fix First - Quick wins to fix critical issues
 * 5. Drafts - Review and publish auto-generated content
 */

import { Router, Request, Response } from 'express';
import { hubIntegration } from './hub-integration';
import { db } from './db';
import { 
  studioConfigs,
  studioIntegrations,
  blogPosts,
  galleryImages,
  voucherProducts,
  crmClients
} from '../shared/schema';
import { eq, sql, count } from 'drizzle-orm';

const router = Router();

// Local onboarding state cache (in production would be in DB)
let localOnboardingState = {
  step: 'basics',
  progressPct: 0,
  basicsComplete: false,
  integrationsComplete: false,
  scanComplete: false,
  fixFirstComplete: false,
  draftsComplete: false,
  businessInfo: null as any,
  scanResults: null as any,
  fixFirstItems: [] as any[],
  drafts: [] as any[]
};

// ==================== SETUP STATUS ====================

router.get('/status', async (req: Request, res: Response) => {
  try {
    // Try to get onboarding step from Hub, fallback to local state
    const onboardingStep = hubIntegration.isConfigured() 
      ? hubIntegration.getOnboardingStep() 
      : localOnboardingState.step;
    const progress = hubIntegration.isConfigured()
      ? hubIntegration.getOnboardingProgress()
      : localOnboardingState.progressPct;
    
    // Get studio config for business info
    const [studioConfig] = await db
      .select()
      .from(studioConfigs)
      .limit(1);
    
    // Get studio integrations
    const [integrations] = await db
      .select()
      .from(studioIntegrations)
      .limit(1);
    
    // Determine current phase
    const phases = {
      basics: {
        complete: localOnboardingState.basicsComplete || !!studioConfig?.businessName,
        data: localOnboardingState.businessInfo || (studioConfig ? {
          businessName: studioConfig.businessName,
          timezone: studioConfig.timezone,
          currency: 'EUR' // No currency field in studioConfigs yet
        } : null)
      },
      integrations: {
        complete: localOnboardingState.integrationsComplete || !!(integrations?.stripe_account_id),
        instagram: false, // Would check social connections
        stripe: !!(integrations?.stripe_account_id || integrations?.stripe_secret_key_encrypted)
      },
      scanning: {
        complete: localOnboardingState.scanComplete,
        pagesScanned: localOnboardingState.scanResults?.pagesScanned || 0
      },
      fixFirst: {
        complete: localOnboardingState.fixFirstComplete,
        itemsTotal: localOnboardingState.fixFirstItems.length,
        itemsCompleted: localOnboardingState.fixFirstItems.filter((i: any) => i.status === 'completed').length
      },
      drafts: {
        complete: localOnboardingState.draftsComplete,
        draftsGenerated: localOnboardingState.drafts.length,
        draftsPublished: localOnboardingState.drafts.filter((d: any) => d.status === 'published').length
      }
    };
    
    res.json({
      currentStep: onboardingStep || localOnboardingState.step,
      progressPct: progress || localOnboardingState.progressPct,
      phases,
      setupMode: hubIntegration.isSetupMode() || !localOnboardingState.draftsComplete,
      features: hubIntegration.getFeatureFlags()
    });
  } catch (error) {
    console.error('Setup status error:', error);
    res.status(500).json({ error: 'Failed to get setup status' });
  }
});

// ==================== PHASE 1: BASICS ====================

router.post('/basics', async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      businessType,
      timezone,
      currency,
      dateFormat,
      logo,
      primaryColor,
      tagline,
      address,
      phone,
      website,
      latitude,
      longitude,
      facebookUrl,
      instagramUrl,
      twitterUrl
    } = req.body;
    
    // Validate required fields
    if (!businessName || !businessType || !timezone) {
      return res.status(400).json({
        error: 'Missing required fields: businessName, businessType, timezone'
      });
    }
    
    const businessInfo = {
      businessName,
      businessType,
      timezone,
      currency: currency || 'EUR',
      dateFormat: dateFormat || 'auto',
      logo: logo || null,
      primaryColor: primaryColor || '#3B82F6',
      tagline: tagline || '',
      address: address || null,
      phone: phone || null,
      website: website || null,
      latitude: latitude || null,
      longitude: longitude || null,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      twitterUrl: twitterUrl || null
    };
    
    // Update or create studio config
    const [existingConfig] = await db.select().from(studioConfigs).limit(1);
    
    if (existingConfig) {
      await db
        .update(studioConfigs)
        .set({
          businessName: businessName,
          timezone: timezone,
          dateFormat: dateFormat || 'auto',
          primaryColor: primaryColor || '#3B82F6',
          metaDescription: tagline || '',
          address: address || null,
          phone: phone || null,
          website: website || null,
          latitude: latitude || null,
          longitude: longitude || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          twitterUrl: twitterUrl || null,
        })
        .where(eq(studioConfigs.id, existingConfig.id));
    } else {
      await db
        .insert(studioConfigs)
        .values({
          studioName: businessName,
          ownerEmail: 'setup@togninja.com',
          businessName: businessName,
          timezone: timezone,
          dateFormat: dateFormat || 'auto',
          primaryColor: primaryColor || '#3B82F6',
          metaDescription: tagline || '',
          address: address || null,
          phone: phone || null,
          website: website || null,
          latitude: latitude || null,
          longitude: longitude || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          twitterUrl: twitterUrl || null,
        });
    }
    
    // Update local state
    localOnboardingState.basicsComplete = true;
    localOnboardingState.businessInfo = businessInfo;
    localOnboardingState.step = 'integrations';
    localOnboardingState.progressPct = 20;
    
    // Report progress to Hub if configured
    if (hubIntegration.isConfigured()) {
      await hubIntegration.reportProgress('integrations', { progressPct: 20 });
    }
    
    res.json({
      success: true,
      nextStep: 'integrations',
      businessInfo
    });
  } catch (error) {
    console.error('Basics save error:', error);
    res.status(500).json({ error: 'Failed to save business information' });
  }
});

// ==================== PHASE 2: INTEGRATIONS ====================

router.get('/integrations', async (req: Request, res: Response) => {
  try {
    // Get studio integrations
    const [integrations] = await db
      .select()
      .from(studioIntegrations)
      .limit(1);
    
    res.json({
      instagram: {
        connected: false, // Would check social auth
        accounts: []
      },
      google: {
        connected: false, // Would check Google OAuth
        email: null
      },
      calendar: {
        connected: false, // Would check calendar integration
        provider: null
      },
      stripe: {
        connected: !!(integrations?.stripe_account_id || integrations?.stripe_secret_key_encrypted),
        mode: integrations?.stripe_secret_key_encrypted ? 'live' : null
      }
    });
  } catch (error) {
    console.error('Integrations fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

router.post('/integrations/complete', async (req: Request, res: Response) => {
  try {
    // Get integration status
    const [integrations] = await db.select().from(studioIntegrations).limit(1);
    
    const connectedIntegrations = [];
    if (integrations?.stripe_account_id) connectedIntegrations.push('stripe');
    
    // Update local state
    localOnboardingState.integrationsComplete = true;
    localOnboardingState.step = 'scanning';
    localOnboardingState.progressPct = 40;
    
    // Report progress to Hub if configured
    if (hubIntegration.isConfigured()) {
      await hubIntegration.reportProgress('scanning', {
        progressPct: 40,
        integrationsConnected: connectedIntegrations
      });
    }
    
    res.json({
      success: true,
      nextStep: 'scanning',
      integrationsConnected: connectedIntegrations
    });
  } catch (error) {
    console.error('Integrations complete error:', error);
    res.status(500).json({ error: 'Failed to complete integrations phase' });
  }
});

// ==================== PHASE 3: SCANNING ====================

router.post('/scanning/start', async (req: Request, res: Response) => {
  try {
    // Perform actual content scan
    const scanId = `scan_${Date.now()}`;
    
    // Count actual content in database
    const [blogCount] = await db.select({ count: count() }).from(blogPosts);
    const [galleryCount] = await db.select({ count: count() }).from(galleryImages);
    const [productCount] = await db.select({ count: count() }).from(voucherProducts);
    const [clientCount] = await db.select({ count: count() }).from(crmClients);
    
    // Generate fix-first items based on scan
    const fixFirstItems: any[] = [];
    
    // Check for missing meta descriptions in blog posts
    const postsWithoutMeta = await db
      .select()
      .from(blogPosts)
      .where(sql`${blogPosts.metaDescription} IS NULL OR ${blogPosts.metaDescription} = ''`)
      .limit(10);
    
    if (postsWithoutMeta.length > 0) {
      fixFirstItems.push({
        id: 'fix_meta_descriptions',
        type: 'missing_meta',
        severity: 'high',
        title: 'Missing SEO meta descriptions',
        description: `${postsWithoutMeta.length} blog posts are missing meta descriptions`,
        affectedPages: postsWithoutMeta.length,
        autoFixAvailable: true,
        status: 'pending'
      });
    }
    
    // Check for products without descriptions
    const productsWithoutDesc = await db
      .select()
      .from(voucherProducts)
      .where(sql`${voucherProducts.description} IS NULL OR ${voucherProducts.description} = ''`)
      .limit(10);
    
    if (productsWithoutDesc.length > 0) {
      fixFirstItems.push({
        id: 'fix_product_descriptions',
        type: 'missing_description',
        severity: 'medium',
        title: 'Products without descriptions',
        description: `${productsWithoutDesc.length} products need descriptions`,
        affectedProducts: productsWithoutDesc.length,
        autoFixAvailable: false,
        status: 'pending'
      });
    }
    
    // Check for clients without email
    const clientsWithoutEmail = await db
      .select()
      .from(crmClients)
      .where(sql`${crmClients.email} IS NULL OR ${crmClients.email} = ''`)
      .limit(10);
    
    if (clientsWithoutEmail.length > 0) {
      fixFirstItems.push({
        id: 'fix_client_emails',
        type: 'incomplete_data',
        severity: 'low',
        title: 'Clients without email addresses',
        description: `${clientsWithoutEmail.length} clients are missing email addresses`,
        affectedClients: clientsWithoutEmail.length,
        autoFixAvailable: false,
        status: 'pending'
      });
    }
    
    // Store scan results
    localOnboardingState.scanResults = {
      pagesScanned: Number(blogCount?.count || 0) + Number(galleryCount?.count || 0),
      issuesFound: fixFirstItems.length,
      suggestionsGenerated: fixFirstItems.length,
      blogPosts: blogCount?.count || 0,
      galleryImages: galleryCount?.count || 0,
      products: productCount?.count || 0,
      clients: clientCount?.count || 0
    };
    localOnboardingState.fixFirstItems = fixFirstItems;
    
    res.json({
      success: true,
      scanId,
      status: 'complete', // Synchronous scan for MVP
      message: 'Scan completed successfully.'
    });
  } catch (error) {
    console.error('Scan start error:', error);
    res.status(500).json({ error: 'Failed to start scan' });
  }
});

router.get('/scanning/status/:scanId', async (req: Request, res: Response) => {
  try {
    const { scanId } = req.params;
    
    // Return cached scan results
    res.json({
      scanId,
      status: 'complete',
      results: localOnboardingState.scanResults || {
        pagesScanned: 0,
        issuesFound: 0,
        suggestionsGenerated: 0,
        fixFirstItems: []
      }
    });
  } catch (error) {
    console.error('Scan status error:', error);
    res.status(500).json({ error: 'Failed to get scan status' });
  }
});

router.post('/scanning/complete', async (req: Request, res: Response) => {
  try {
    const { pagesScanned, issuesFound } = req.body;
    
    // Update local state
    localOnboardingState.scanComplete = true;
    localOnboardingState.step = 'fix_first';
    localOnboardingState.progressPct = 60;
    
    // Report progress to Hub if configured
    if (hubIntegration.isConfigured()) {
      await hubIntegration.reportProgress('fix_first', {
        progressPct: 60,
        pagesScanned: pagesScanned || localOnboardingState.scanResults?.pagesScanned || 0,
        fixFirstItemsCount: issuesFound || localOnboardingState.fixFirstItems.length
      });
    }
    
    res.json({
      success: true,
      nextStep: 'fix_first'
    });
  } catch (error) {
    console.error('Scanning complete error:', error);
    res.status(500).json({ error: 'Failed to complete scanning phase' });
  }
});

// ==================== PHASE 4: FIX FIRST ====================

router.get('/fix-first/items', async (req: Request, res: Response) => {
  try {
    // Return fix-first items from scan
    const items = localOnboardingState.fixFirstItems.map(item => ({
      ...item,
      impact: item.severity === 'high' ? 'SEO improvement' : 
              item.severity === 'medium' ? 'User experience' : 'Data quality',
      timeEstimate: item.autoFixAvailable ? '1 min' : '5 min'
    }));
    
    res.json({
      items,
      totalCount: items.length,
      completedCount: items.filter(i => i.status === 'completed' || i.status === 'skipped').length,
      canSkip: true
    });
  } catch (error) {
    console.error('Fix-first items error:', error);
    res.status(500).json({ error: 'Failed to get fix-first items' });
  }
});

router.post('/fix-first/apply/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    // Find the item and mark as completed
    const item = localOnboardingState.fixFirstItems.find(i => i.id === itemId);
    if (item) {
      item.status = 'completed';
      
      // Apply actual fixes based on type
      if (item.type === 'missing_meta' && item.autoFixAvailable) {
        // Auto-generate meta descriptions for blog posts
        const postsToFix = await db
          .select()
          .from(blogPosts)
          .where(sql`${blogPosts.metaDescription} IS NULL OR ${blogPosts.metaDescription} = ''`)
          .limit(10);
        
        for (const post of postsToFix) {
          // Generate a simple meta description from title and content
          const metaDesc = post.excerpt || 
            (post.content ? String(post.content).substring(0, 155) + '...' : post.title);
          
          await db
            .update(blogPosts)
            .set({ metaDescription: metaDesc })
            .where(eq(blogPosts.id, post.id));
        }
      }
    }
    
    res.json({
      success: true,
      itemId,
      status: 'completed',
      message: 'Fix applied successfully'
    });
  } catch (error) {
    console.error('Fix apply error:', error);
    res.status(500).json({ error: 'Failed to apply fix' });
  }
});

router.post('/fix-first/skip/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    // Find the item and mark as skipped
    const item = localOnboardingState.fixFirstItems.find(i => i.id === itemId);
    if (item) {
      item.status = 'skipped';
    }
    
    res.json({
      success: true,
      itemId,
      status: 'skipped'
    });
  } catch (error) {
    console.error('Fix skip error:', error);
    res.status(500).json({ error: 'Failed to skip fix' });
  }
});

router.post('/fix-first/complete', async (req: Request, res: Response) => {
  try {
    const { itemsCompleted, itemsSkipped } = req.body;
    
    // Update local state
    localOnboardingState.fixFirstComplete = true;
    localOnboardingState.step = 'drafts';
    localOnboardingState.progressPct = 80;
    
    // Generate draft content
    localOnboardingState.drafts = [
      {
        id: 'draft_welcome_email',
        type: 'email_template',
        title: 'Welcome Email',
        description: 'Automated welcome email for new clients',
        previewText: `Hi {firstName},\n\nThank you for choosing ${localOnboardingState.businessInfo?.businessName || 'our studio'}! We're excited to work with you.\n\nBest regards,\nThe Team`,
        status: 'draft',
        generatedAt: new Date().toISOString()
      },
      {
        id: 'draft_booking_confirmation',
        type: 'email_template',
        title: 'Booking Confirmation',
        description: 'Sent automatically when a session is booked',
        previewText: `Hi {firstName},\n\nYour booking for {sessionType} on {date} has been confirmed!\n\nWe look forward to seeing you.`,
        status: 'draft',
        generatedAt: new Date().toISOString()
      },
      {
        id: 'draft_about_page',
        type: 'about_page',
        title: 'About Page Content',
        description: 'Professional bio and studio information',
        previewText: `Welcome to ${localOnboardingState.businessInfo?.businessName || 'our studio'}! ${localOnboardingState.businessInfo?.tagline || 'We specialize in capturing your most precious moments.'}\n\nBased in ${localOnboardingState.businessInfo?.timezone?.replace('Europe/', '') || 'your city'}, we bring passion and expertise to every session.`,
        status: 'draft',
        generatedAt: new Date().toISOString()
      }
    ];
    
    // Report progress to Hub if configured
    if (hubIntegration.isConfigured()) {
      await hubIntegration.reportProgress('drafts', {
        progressPct: 80,
        fixFirstItemsCompleted: itemsCompleted || 
          localOnboardingState.fixFirstItems.filter(i => i.status === 'completed').length
      });
    }
    
    res.json({
      success: true,
      nextStep: 'drafts'
    });
  } catch (error) {
    console.error('Fix-first complete error:', error);
    res.status(500).json({ error: 'Failed to complete fix-first phase' });
  }
});

// ==================== PHASE 5: DRAFTS ====================

router.get('/drafts', async (req: Request, res: Response) => {
  try {
    res.json({
      drafts: localOnboardingState.drafts,
      totalCount: localOnboardingState.drafts.length,
      publishedCount: localOnboardingState.drafts.filter(d => d.status === 'published').length
    });
  } catch (error) {
    console.error('Drafts fetch error:', error);
    res.status(500).json({ error: 'Failed to get drafts' });
  }
});

router.post('/drafts/:draftId/publish', async (req: Request, res: Response) => {
  try {
    const { draftId } = req.params;
    const { content } = req.body;
    
    // Find and update draft status
    const draft = localOnboardingState.drafts.find(d => d.id === draftId);
    if (draft) {
      draft.status = 'published';
      if (content) {
        draft.previewText = content;
      }
    }
    
    res.json({
      success: true,
      draftId,
      status: 'published'
    });
  } catch (error) {
    console.error('Draft publish error:', error);
    res.status(500).json({ error: 'Failed to publish draft' });
  }
});

router.post('/drafts/:draftId/skip', async (req: Request, res: Response) => {
  try {
    const { draftId } = req.params;
    
    // Find and update draft status
    const draft = localOnboardingState.drafts.find(d => d.id === draftId);
    if (draft) {
      draft.status = 'skipped';
    }
    
    res.json({
      success: true,
      draftId,
      status: 'skipped'
    });
  } catch (error) {
    console.error('Draft skip error:', error);
    res.status(500).json({ error: 'Failed to skip draft' });
  }
});

// ==================== COMPLETE SETUP ====================

router.post('/complete', async (req: Request, res: Response) => {
  try {
    // Update local state
    localOnboardingState.draftsComplete = true;
    localOnboardingState.step = 'ready';
    localOnboardingState.progressPct = 100;
    
    // Mark onboarding as complete in Hub
    if (hubIntegration.isConfigured()) {
      await hubIntegration.completeOnboarding();
    }
    
    res.json({
      success: true,
      message: 'Setup complete! Your studio management system is ready.',
      redirectTo: '/admin/dashboard'
    });
  } catch (error) {
    console.error('Setup complete error:', error);
    res.status(500).json({ error: 'Failed to complete setup' });
  }
});

export default router;
