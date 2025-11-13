"use strict";
/**
 * Price Wizard API Routes
 *
 * Endpoints for autonomous competitive pricing research
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../db.js");
const PriceScraperService_js_1 = require("../services/PriceScraperService.js");
const CompetitorDiscoveryService_js_1 = require("../services/CompetitorDiscoveryService.js");
const router = (0, express_1.Router)();
const scraper = new PriceScraperService_js_1.PriceScraperService();
const discovery = new CompetitorDiscoveryService_js_1.CompetitorDiscoveryService();
/**
 * POST /api/price-wizard/start
 * Start a new price research session
 */
router.post('/start', async (req, res) => {
    try {
        const { location, services, userId } = req.body;
        if (!location || !services || !Array.isArray(services)) {
            return res.status(400).json({
                error: 'Missing required fields: location, services (array)'
            });
        }
        // Create session
        const result = await db_js_1.pool.query(`
      INSERT INTO price_wizard_sessions (user_id, location, services, status)
      VALUES ($1, $2, $3, 'discovering')
      RETURNING id, created_at
    `, [userId || null, location, services]);
        const session = result.rows[0];
        res.json({
            success: true,
            sessionId: session.id,
            location,
            services,
            status: 'discovering',
            createdAt: session.created_at,
        });
    }
    catch (error) {
        console.error('Error starting price wizard session:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /api/price-wizard/discover
 * Discover competitors for a session
 */
router.post('/discover', async (req, res) => {
    try {
        const { sessionId, maxResults = 10 } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: 'Missing sessionId' });
        }
        // Get session details
        const sessionResult = await db_js_1.pool.query(`
      SELECT location, services FROM price_wizard_sessions WHERE id = $1
    `, [sessionId]);
        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        const { location, services } = sessionResult.rows[0];
        // Discover competitors
        const competitors = await discovery.discoverCompetitors({
            location,
            services,
            maxResults,
        });
        // Save to database
        const saved = [];
        for (const competitor of competitors) {
            const result = await db_js_1.pool.query(`
        INSERT INTO competitor_research (
          session_id, competitor_name, website_url, location, status, discovery_source
        ) VALUES ($1, $2, $3, $4, 'pending', $5)
        RETURNING id, competitor_name, website_url
      `, [
                sessionId,
                competitor.name,
                competitor.website,
                competitor.location || location,
                competitor.source,
            ]);
            saved.push(result.rows[0]);
        }
        // Update session
        await db_js_1.pool.query(`
      UPDATE price_wizard_sessions
      SET status = 'scraping', competitors_found = $2, updated_at = NOW()
      WHERE id = $1
    `, [sessionId, saved.length]);
        res.json({
            success: true,
            sessionId,
            competitorsFound: saved.length,
            competitors: saved,
        });
    }
    catch (error) {
        console.error('Error discovering competitors:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /api/price-wizard/scrape
 * Scrape prices from discovered competitors
 */
router.post('/scrape', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: 'Missing sessionId' });
        }
        // Get pending competitors
        const result = await db_js_1.pool.query(`
      SELECT id, website_url 
      FROM competitor_research 
      WHERE session_id = $1 AND status = 'pending'
      LIMIT 10
    `, [sessionId]);
        const competitors = result.rows;
        if (competitors.length === 0) {
            return res.json({
                success: true,
                message: 'No pending competitors to scrape',
                scrapedCount: 0,
            });
        }
        let scrapedCount = 0;
        let pricesExtracted = 0;
        // Scrape each competitor
        for (const competitor of competitors) {
            try {
                const scrapeResult = await scraper.scrapeWebsite(competitor.website_url);
                if (scrapeResult.success && scrapeResult.prices.length > 0) {
                    // Save prices
                    for (const price of scrapeResult.prices) {
                        await db_js_1.pool.query(`
              INSERT INTO competitor_prices (
                competitor_id, service_type, price_amount, currency, 
                confidence_score, source_url
              ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                            competitor.id,
                            price.serviceType,
                            price.amount,
                            price.currency,
                            price.confidence,
                            price.url,
                        ]);
                        pricesExtracted++;
                    }
                    // Update competitor status
                    await db_js_1.pool.query(`
            UPDATE competitor_research 
            SET status = 'scraped', scraped_at = NOW() 
            WHERE id = $1
          `, [competitor.id]);
                    scrapedCount++;
                }
                else {
                    // Mark as failed
                    await db_js_1.pool.query(`
            UPDATE competitor_research 
            SET status = 'failed', error_message = $2 
            WHERE id = $1
          `, [competitor.id, scrapeResult.error || 'No prices found']);
                }
            }
            catch (error) {
                console.error(`Error scraping ${competitor.website_url}:`, error);
                await db_js_1.pool.query(`
          UPDATE competitor_research 
          SET status = 'failed', error_message = $2 
          WHERE id = $1
        `, [competitor.id, error.message]);
            }
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        // Update session
        await db_js_1.pool.query(`
      UPDATE price_wizard_sessions
      SET status = 'analyzing', prices_extracted = prices_extracted + $2, updated_at = NOW()
      WHERE id = $1
    `, [sessionId, pricesExtracted]);
        res.json({
            success: true,
            sessionId,
            scrapedCount,
            pricesExtracted,
        });
    }
    catch (error) {
        console.error('Error scraping competitors:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/price-wizard/status/:sessionId
 * Get status of a price research session
 */
router.get('/status/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await db_js_1.pool.query(`
      SELECT 
        s.id,
        s.location,
        s.services,
        s.status,
        s.competitors_found,
        s.prices_extracted,
        s.suggestions_generated,
        s.created_at,
        s.updated_at,
        COUNT(DISTINCT cr.id) FILTER (WHERE cr.status = 'scraped') as competitors_scraped,
        COUNT(DISTINCT cp.id) as total_prices,
        COUNT(DISTINCT pl.id) as total_suggestions
      FROM price_wizard_sessions s
      LEFT JOIN competitor_research cr ON cr.session_id = s.id
      LEFT JOIN competitor_prices cp ON cp.competitor_id = cr.id
      LEFT JOIN price_list_suggestions pl ON pl.session_id = s.id
      WHERE s.id = $1
      GROUP BY s.id
    `, [sessionId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error getting session status:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/price-wizard/competitors/:sessionId
 * Get all discovered competitors for a session
 */
router.get('/competitors/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await db_js_1.pool.query(`
      SELECT 
        cr.id,
        cr.competitor_name,
        cr.website_url,
        cr.location,
        cr.status,
        cr.scraped_at,
        COUNT(cp.id) as price_count
      FROM competitor_research cr
      LEFT JOIN competitor_prices cp ON cp.competitor_id = cr.id
      WHERE cr.session_id = $1
      GROUP BY cr.id
      ORDER BY cr.created_at
    `, [sessionId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error getting competitors:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/price-wizard/prices/:sessionId
 * Get all extracted prices for a session
 */
router.get('/prices/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await db_js_1.pool.query(`
      SELECT 
        cp.*,
        cr.competitor_name,
        cr.website_url
      FROM competitor_prices cp
      JOIN competitor_research cr ON cr.id = cp.competitor_id
      WHERE cr.session_id = $1
      ORDER BY cp.service_type, cp.price_amount
    `, [sessionId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error getting prices:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /api/price-wizard/analyze
 * Analyze market prices and generate suggestions (LLM integration point)
 */
router.post('/analyze', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: 'Missing sessionId' });
        }
        // Get all prices for the session
        const pricesResult = await db_js_1.pool.query(`
      SELECT 
        cp.service_type,
        cp.price_amount,
        cp.currency,
        cp.confidence_score
      FROM competitor_prices cp
      JOIN competitor_research cr ON cr.id = cp.competitor_id
      WHERE cr.session_id = $1 AND cp.confidence_score >= 0.5
    `, [sessionId]);
        const prices = pricesResult.rows;
        if (prices.length === 0) {
            return res.status(400).json({
                error: 'No prices found to analyze. Run scraping first.'
            });
        }
        // Group by service type and calculate statistics
        const serviceStats = new Map();
        prices.forEach((price) => {
            if (!serviceStats.has(price.service_type)) {
                serviceStats.set(price.service_type, []);
            }
            serviceStats.get(price.service_type).push(price.price_amount);
        });
        // Generate suggestions for each service type
        const suggestions = [];
        for (const [serviceType, amounts] of serviceStats.entries()) {
            amounts.sort((a, b) => a - b);
            const min = amounts[0];
            const max = amounts[amounts.length - 1];
            const median = amounts[Math.floor(amounts.length / 2)];
            // Three-tier pricing strategy
            const tiers = [
                {
                    tier: 'basic',
                    suggestedPrice: Math.round(min * 1.1), // 10% above min
                    reasoning: `Competitive entry-level pricing. Market minimum: €${min}`,
                },
                {
                    tier: 'standard',
                    suggestedPrice: Math.round(median),
                    reasoning: `Market median pricing. Balanced value proposition. Median: €${median}`,
                },
                {
                    tier: 'premium',
                    suggestedPrice: Math.round(max * 0.9), // 10% below max
                    reasoning: `Premium positioning below market leader. Market maximum: €${max}`,
                },
            ];
            for (const tier of tiers) {
                const result = await db_js_1.pool.query(`
          INSERT INTO price_list_suggestions (
            session_id, service_type, tier, suggested_price, 
            market_min, market_median, market_max, reasoning, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending_review')
          RETURNING id
        `, [
                    sessionId,
                    serviceType,
                    tier.tier,
                    tier.suggestedPrice,
                    min,
                    median,
                    max,
                    tier.reasoning,
                ]);
                suggestions.push({
                    id: result.rows[0].id,
                    serviceType,
                    ...tier,
                    marketMin: min,
                    marketMedian: median,
                    marketMax: max,
                });
            }
        }
        // Update session
        await db_js_1.pool.query(`
      UPDATE price_wizard_sessions
      SET status = 'completed', suggestions_generated = $2, updated_at = NOW()
      WHERE id = $1
    `, [sessionId, suggestions.length]);
        res.json({
            success: true,
            sessionId,
            suggestionsCount: suggestions.length,
            suggestions,
        });
    }
    catch (error) {
        console.error('Error analyzing prices:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/price-wizard/suggestions/:sessionId
 * Get all price suggestions for a session
 */
router.get('/suggestions/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await db_js_1.pool.query(`
      SELECT * FROM price_list_suggestions
      WHERE session_id = $1
      ORDER BY service_type, tier
    `, [sessionId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/price-wizard/sessions
 * Get all research sessions
 */
router.get('/sessions', async (req, res) => {
    try {
        const result = await db_js_1.pool.query(`
      SELECT 
        id,
        location,
        services,
        status,
        competitors_found,
        prices_extracted,
        suggestions_generated,
        created_at,
        updated_at
      FROM price_wizard_sessions
      ORDER BY created_at DESC
      LIMIT 100
    `);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error getting sessions:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /api/price-wizard/activate-suggestion
 * Activate a single suggestion to price list
 */
router.post('/activate-suggestion', async (req, res) => {
    try {
        const { suggestionId, adjustedPrice } = req.body;
        if (!suggestionId) {
            return res.status(400).json({ error: 'Missing suggestionId' });
        }
        // Get suggestion
        const suggestionResult = await db_js_1.pool.query(`
      SELECT * FROM price_list_suggestions WHERE id = $1
    `, [suggestionId]);
        if (suggestionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Suggestion not found' });
        }
        const suggestion = suggestionResult.rows[0];
        if (suggestion.status !== 'pending_review') {
            return res.status(400).json({ error: 'Suggestion is not pending review' });
        }
        const finalPrice = adjustedPrice || suggestion.suggested_price;
        // Create price list entry
        const priceListResult = await db_js_1.pool.query(`
      INSERT INTO price_lists (
        service_name,
        category,
        price,
        description,
        active
      ) VALUES ($1, $2, $3, $4, true)
      RETURNING id, service_name, price
    `, [
            `${suggestion.service_type} (${suggestion.tier})`,
            'Photography',
            finalPrice,
            suggestion.reasoning
        ]);
        const priceListItem = priceListResult.rows[0];
        // Mark suggestion as activated
        await db_js_1.pool.query(`
      UPDATE price_list_suggestions
      SET 
        status = 'activated',
        activated_product_id = $2,
        updated_at = NOW()
      WHERE id = $1
    `, [suggestionId, priceListItem.id]);
        res.json({
            success: true,
            price_list_id: priceListItem.id,
            activated_price: finalPrice
        });
    }
    catch (error) {
        console.error('Error activating suggestion:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /api/price-wizard/reject-suggestion
 * Reject a suggestion
 */
router.post('/reject-suggestion', async (req, res) => {
    try {
        const { suggestionId } = req.body;
        if (!suggestionId) {
            return res.status(400).json({ error: 'Missing suggestionId' });
        }
        await db_js_1.pool.query(`
      UPDATE price_list_suggestions
      SET status = 'rejected', updated_at = NOW()
      WHERE id = $1
    `, [suggestionId]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error rejecting suggestion:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
