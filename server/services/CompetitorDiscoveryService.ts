/**
 * Competitor Discovery Service
 * 
 * Discovers competitor photography businesses using search engines and local directories.
 * Filters results to find legitimate competitors with pricing information.
 */

import * as cheerio from 'cheerio';

interface DiscoveryResult {
  name: string;
  website: string;
  location?: string;
  description?: string;
  source: 'google' | 'bing' | 'manual';
  confidence: number;
}

interface DiscoveryOptions {
  location: string;
  services: string[];
  maxResults?: number;
  excludeDomains?: string[];
}

export class CompetitorDiscoveryService {
  private readonly TIMEOUT_MS = 15000;
  private readonly DEFAULT_MAX_RESULTS = 10;

  /**
   * Discover competitors for given location and services
   */
  async discoverCompetitors(options: DiscoveryOptions): Promise<DiscoveryResult[]> {
    const {
      location,
      services,
      maxResults = this.DEFAULT_MAX_RESULTS,
      excludeDomains = [],
    } = options;

    console.log(`🔍 Discovering competitors in ${location} for services: ${services.join(', ')}`);

    // Build search queries
    const queries = this.buildSearchQueries(location, services);
    
    // Execute searches (using a scraping approach since we don't have API keys)
    const allResults: DiscoveryResult[] = [];

    for (const query of queries) {
      try {
        const results = await this.searchGoogle(query, excludeDomains);
        allResults.push(...results);
      } catch (error: any) {
        console.warn(`Search failed for "${query}": ${error.message}`);
      }

      // Rate limiting
      await this.delay(2000);
    }

    // Deduplicate and filter
    const uniqueResults = this.deduplicateResults(allResults);
    const filtered = this.filterResults(uniqueResults, excludeDomains);

    console.log(`  ✅ Found ${filtered.length} unique competitors`);

    return filtered.slice(0, maxResults);
  }

  /**
   * Build search queries for different service combinations
   */
  private buildSearchQueries(location: string, services: string[]): string[] {
    const queries: string[] = [];

    // Generic photography query
    queries.push(`fotograf ${location} preise`);
    queries.push(`photographer ${location} prices`);

    // Service-specific queries
    services.forEach(service => {
      queries.push(`${service} fotografie ${location} kosten`);
      queries.push(`${service} fotograf ${location} preis`);
    });

    return queries.slice(0, 5); // Limit to 5 queries to avoid rate limiting
  }

  /**
   * Search Google for competitors (web scraping approach)
   * Note: This is a basic implementation. In production, use Google Custom Search API.
   */
  private async searchGoogle(query: string, excludeDomains: string[]): Promise<DiscoveryResult[]> {
    const results: DiscoveryResult[] = [];

    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=10`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Parse Google search results
      // Note: Google's HTML structure changes frequently, this is a basic implementation
      $('div.g').each((_, element) => {
        const $result = $(element);
        
        // Extract title and URL
        const $link = $result.find('a[href]').first();
        const url = $link.attr('href');
        const title = $result.find('h3').first().text();
        const description = $result.find('.VwiC3b, .yXK7lf').first().text();

        if (url && title && this.isValidCompetitorUrl(url, excludeDomains)) {
          results.push({
            name: this.cleanBusinessName(title),
            website: this.normalizeUrl(url),
            description: description || undefined,
            source: 'google',
            confidence: 0.7,
          });
        }
      });

      console.log(`  📊 Google search for "${query}": ${results.length} results`);

    } catch (error: any) {
      // Google might block scraping, this is expected
      console.warn(`  ⚠️  Google search blocked or failed: ${error.message}`);
      
      // Fallback: Return manually curated competitors for Austrian market
      if (query.includes('wien') || query.includes('vienna')) {
        results.push(...this.getFallbackCompetitors('Wien'));
      } else if (query.includes('salzburg')) {
        results.push(...this.getFallbackCompetitors('Salzburg'));
      } else if (query.includes('graz')) {
        results.push(...this.getFallbackCompetitors('Graz'));
      }
    }

    return results;
  }

  /**
   * Validate competitor URL (exclude directories, social media, etc.)
   */
  private isValidCompetitorUrl(url: string, excludeDomains: string[]): boolean {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      // Exclude common non-competitor sites
      const blacklist = [
        'google.com',
        'facebook.com',
        'instagram.com',
        'pinterest.com',
        'youtube.com',
        'yelp.com',
        'tripadvisor.com',
        'wikipedia.org',
        ...excludeDomains,
      ];

      return !blacklist.some(bl => domain.includes(bl));
    } catch {
      return false;
    }
  }

  /**
   * Clean business name from search result title
   */
  private cleanBusinessName(title: string): string {
    // Remove common suffixes
    return title
      .replace(/\s*[-–—|]\s*.*$/, '') // Remove everything after dash/pipe
      .replace(/\s*\(.*?\)\s*/g, '') // Remove parentheses
      .replace(/fotografie|photography|fotograf|photographer/gi, '')
      .trim();
  }

  /**
   * Normalize URL to consistent format
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  /**
   * Deduplicate results by domain
   */
  private deduplicateResults(results: DiscoveryResult[]): DiscoveryResult[] {
    const seen = new Map<string, DiscoveryResult>();

    results.forEach(result => {
      try {
        const domain = new URL(result.website).hostname;
        const existing = seen.get(domain);

        if (!existing || result.confidence > existing.confidence) {
          seen.set(domain, result);
        }
      } catch {}
    });

    return Array.from(seen.values());
  }

  /**
   * Filter results to ensure quality
   */
  private filterResults(results: DiscoveryResult[], excludeDomains: string[]): DiscoveryResult[] {
    return results.filter(result => {
      // Must have valid website
      if (!result.website || !result.website.startsWith('http')) {
        return false;
      }

      // Must not be in exclude list
      if (excludeDomains.some(domain => result.website.includes(domain))) {
        return false;
      }

      // Must have reasonable confidence
      if (result.confidence < 0.3) {
        return false;
      }

      return true;
    });
  }

  /**
   * Fallback competitors for Austrian cities (when search fails)
   */
  private getFallbackCompetitors(city: string): DiscoveryResult[] {
    const fallbacks: Record<string, DiscoveryResult[]> = {
      'Wien': [
        {
          name: 'Studio Vienna',
          website: 'https://example-vienna-photo.at',
          location: 'Wien',
          source: 'manual',
          confidence: 0.5,
          description: 'Fallback competitor - verify manually',
        },
      ],
      'Salzburg': [
        {
          name: 'Salzburg Fotografie',
          website: 'https://example-salzburg-photo.at',
          location: 'Salzburg',
          source: 'manual',
          confidence: 0.5,
          description: 'Fallback competitor - verify manually',
        },
      ],
      'Graz': [
        {
          name: 'Graz Photos',
          website: 'https://example-graz-photo.at',
          location: 'Graz',
          source: 'manual',
          confidence: 0.5,
          description: 'Fallback competitor - verify manually',
        },
      ],
    };

    return fallbacks[city] || [];
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract location from competitor website
   */
  async enrichWithLocation(competitor: DiscoveryResult): Promise<DiscoveryResult> {
    try {
      const response = await fetch(competitor.website, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(10000),
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      // Look for location indicators
      const text = $('body').text();
      const cities = ['Wien', 'Salzburg', 'Graz', 'Linz', 'Innsbruck', 'Klagenfurt'];
      
      for (const city of cities) {
        if (text.includes(city)) {
          competitor.location = city;
          break;
        }
      }

      // Extract business name if not set
      if (!competitor.name || competitor.name.length < 3) {
        competitor.name = $('title').text().split('|')[0].trim();
      }

    } catch (error: any) {
      console.warn(`Failed to enrich ${competitor.website}: ${error.message}`);
    }

    return competitor;
  }
}
