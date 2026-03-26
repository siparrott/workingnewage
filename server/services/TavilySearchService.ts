/**
 * Tavily Search Service
 * 
 * Uses Tavily AI-powered search to find competitors and extract their content.
 * Perfect for price research - searches AND extracts page content in one call.
 */

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface TavilyResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
}

interface CompetitorSearchResult {
  name: string;
  website: string;
  content: string;
  relevanceScore: number;
}

export class TavilySearchService {
  private apiKey: string;
  private baseUrl = 'https://api.tavily.com';

  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ TAVILY_API_KEY not set - search will fail');
    }
  }

  /**
   * Search for photography competitors in a specific location
   */
  async searchCompetitors(
    location: string,
    services: string[],
    maxResults: number = 12
  ): Promise<CompetitorSearchResult[]> {
    console.log(`🔍 Tavily: Searching for photographers in ${location}...`);
    console.log(`   API key configured: ${this.apiKey ? 'Yes (' + this.apiKey.substring(0, 8) + '...)' : 'NO!'}`);

    // Build search queries for different services
    const searchQueries = this.buildSearchQueries(location, services);
    const allResults: CompetitorSearchResult[] = [];
    const seenDomains = new Set<string>();
    const errors: string[] = [];

    for (const query of searchQueries) {
      try {
        console.log(`   🔎 Query: "${query}"`);
        const results = await this.search(query, Math.ceil(maxResults / searchQueries.length) + 2);
        console.log(`   📋 Got ${results.length} results`);
        
        for (const result of results) {
          const domain = this.extractDomain(result.url);
          
          // Skip duplicates and irrelevant sites
          if (seenDomains.has(domain)) continue;
          if (this.isIrrelevantSite(domain)) continue;
          
          seenDomains.add(domain);
          allResults.push({
            name: this.extractBusinessName(result.title),
            website: result.url,
            content: result.content,
            relevanceScore: result.score,
          });
        }

        // Rate limiting
        await this.delay(500);
      } catch (error: any) {
        console.error(`  ❌ Search failed for "${query}":`, error.message);
        errors.push(error.message);
      }
    }

    // If ALL queries failed, throw with details so the session records the reason
    if (allResults.length === 0 && errors.length > 0) {
      throw new Error(`All Tavily searches failed: ${errors[0]}`);
    }

    // Sort by relevance and return top results
    const sorted = allResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);

    console.log(`  ✅ Found ${sorted.length} unique competitors`);
    return sorted;
  }

  /**
   * Deep search a specific competitor website for pricing information
   */
  async searchCompetitorPricing(websiteUrl: string, businessName: string): Promise<string> {
    console.log(`  📄 Fetching pricing for: ${businessName}`);

    const domain = this.extractDomain(websiteUrl);
    const query = `site:${domain} (Preise OR Preis OR pricing OR Pakete OR packages OR investment OR Kosten OR €)`;

    try {
      const results = await this.search(query, 3);
      
      if (results.length > 0) {
        // Combine content from all pricing-related pages
        return results.map(r => r.content).join('\n\n---\n\n');
      }
      
      return '';
    } catch (error: any) {
      console.error(`  ❌ Pricing search failed for ${businessName}:`, error.message);
      return '';
    }
  }

  /**
   * Execute a Tavily search
   */
  private async search(query: string, maxResults: number): Promise<TavilySearchResult[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: 'advanced', // Gets more content from pages
        include_answer: false,
        include_raw_content: false,
        max_results: maxResults,
        include_domains: [],
        exclude_domains: [
          'facebook.com', 'instagram.com', 'pinterest.com', 
          'youtube.com', 'linkedin.com', 'twitter.com', 'tiktok.com',
          'yelp.com', 'tripadvisor.com', 'wikipedia.org',
          'amazon.com', 'ebay.com'
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tavily API error: ${response.status} - ${errorText}`);
    }

    const data: TavilyResponse = await response.json();
    return data.results || [];
  }

  /**
   * Build search queries for different services
   */
  private buildSearchQueries(location: string, services: string[]): string[] {
    const queries: string[] = [];
    
    // German search terms (Austria)
    // Keys support both short IDs (family) and full display names (Family Portrait)
    const serviceTermsDE: Record<string, string[]> = {
      'family': ['Familienfotograf', 'Familienfotografie'],
      'family portrait': ['Familienfotograf', 'Familienfotografie'],
      'portrait': ['Portraitfotograf', 'Porträtfotografie'],
      'portrait photography': ['Portraitfotograf', 'Porträtfotografie'],
      'wedding': ['Hochzeitsfotograf', 'Hochzeitsfotografie'],
      'wedding photography': ['Hochzeitsfotograf', 'Hochzeitsfotografie'],
      'newborn': ['Neugeborenenfotograf', 'Babyfotograf', 'Newborn Fotograf'],
      'newborn photography': ['Neugeborenenfotograf', 'Babyfotograf', 'Newborn Fotograf'],
      'corporate': ['Business Fotograf', 'Unternehmensfotografie'],
      'corporate photography': ['Business Fotograf', 'Unternehmensfotografie'],
      'event': ['Eventfotograf', 'Veranstaltungsfotografie'],
      'event photography': ['Eventfotograf', 'Veranstaltungsfotografie'],
    };

    // Main query with pricing intent
    queries.push(`Fotograf ${location} Preise Pakete`);

    // Service-specific queries
    for (const service of services) {
      const key = service.toLowerCase();
      const terms = serviceTermsDE[key] || [service];
      queries.push(`${terms[0]} ${location} Preise`);
    }

    return queries.slice(0, 4); // Limit to 4 queries for cost efficiency
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  /**
   * Extract business name from search result title
   */
  private extractBusinessName(title: string): string {
    return title
      .replace(/\s*[-–—|:]\s*.*$/, '') // Remove everything after separator
      .replace(/\s*\(.*?\)\s*/g, '')    // Remove parentheses
      .replace(/Fotograf(ie|in)?|Photography|Studio/gi, '')
      .trim() || title.split(/[-–—|]/)[0].trim();
  }

  /**
   * Check if site is irrelevant (directories, social media, etc.)
   */
  private isIrrelevantSite(domain: string): boolean {
    const irrelevant = [
      'facebook.com', 'instagram.com', 'pinterest.com', 'youtube.com',
      'linkedin.com', 'twitter.com', 'tiktok.com', 'yelp.com',
      'tripadvisor.com', 'wikipedia.org', 'amazon.', 'ebay.',
      'herold.at', 'gelbeseiten.', 'wko.at', 'firmenabc.at',
      'kununu.com', 'karriere.at', 'willhaben.at'
    ];
    return irrelevant.some(site => domain.includes(site));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
