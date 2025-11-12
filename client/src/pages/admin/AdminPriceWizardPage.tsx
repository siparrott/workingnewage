import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, TrendingUp, DollarSign, Eye, CheckCircle, XCircle, RefreshCw, ExternalLink, Filter } from 'lucide-react';

interface PriceSession {
  id: string;
  location: string;
  services: string[];
  status: 'discovering' | 'scraping' | 'analyzing' | 'completed' | 'failed';
  competitors_found: number;
  prices_extracted: number;
  suggestions_generated: number;
  created_at: string;
  updated_at: string;
}

interface Competitor {
  id: string;
  competitor_name: string;
  website_url: string;
  location: string;
  status: 'pending' | 'scraped' | 'failed';
  price_count: number;
  scraped_at?: string;
}

interface Price {
  id: string;
  competitor_name: string;
  service_type: string;
  price_amount: number;
  currency: string;
  confidence_score: number;
  package_name?: string;
  source_url: string;
}

interface Suggestion {
  id: string;
  service_type: string;
  tier: 'basic' | 'standard' | 'premium';
  suggested_price: number;
  market_min: number;
  market_median: number;
  market_max: number;
  reasoning: string;
  status: 'pending_review' | 'activated' | 'rejected';
  activated_product_id?: string;
}

const AdminPriceWizardPage: React.FC = () => {
  const [sessions, setSessions] = useState<PriceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchSessionDetails(selectedSession);
    }
  }, [selectedSession]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/price-wizard/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const [competitorsRes, pricesRes, suggestionsRes] = await Promise.all([
        fetch(`/api/price-wizard/competitors/${sessionId}`),
        fetch(`/api/price-wizard/prices/${sessionId}`),
        fetch(`/api/price-wizard/suggestions/${sessionId}`)
      ]);

      if (competitorsRes.ok) setCompetitors(await competitorsRes.json());
      if (pricesRes.ok) setPrices(await pricesRes.json());
      if (suggestionsRes.ok) setSuggestions(await suggestionsRes.json());
    } catch (err) {
      console.error('Failed to fetch session details:', err);
    }
  };

  const activateSuggestion = async (suggestionId: string, adjustedPrice?: number) => {
    try {
      const response = await fetch('/api/price-wizard/activate-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId,
          adjustedPrice
        })
      });

      if (response.ok) {
        alert('Price activated successfully!');
        if (selectedSession) fetchSessionDetails(selectedSession);
      }
    } catch (err) {
      alert('Failed to activate price');
    }
  };

  const rejectSuggestion = async (suggestionId: string) => {
    try {
      const response = await fetch('/api/price-wizard/reject-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId })
      });

      if (response.ok) {
        if (selectedSession) fetchSessionDetails(selectedSession);
      }
    } catch (err) {
      alert('Failed to reject suggestion');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string }> = {
      discovering: { bg: 'bg-blue-100', text: 'text-blue-800' },
      scraping: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      analyzing: { bg: 'bg-purple-100', text: 'text-purple-800' },
      completed: { bg: 'bg-green-100', text: 'text-green-800' },
      failed: { bg: 'bg-red-100', text: 'text-red-800' }
    };

    const c = config[status] || config.completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {status}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const config: Record<string, { bg: string; text: string }> = {
      basic: { bg: 'bg-gray-100', text: 'text-gray-800' },
      standard: { bg: 'bg-blue-100', text: 'text-blue-800' },
      premium: { bg: 'bg-purple-100', text: 'text-purple-800' }
    };

    const c = config[tier];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {tier}
      </span>
    );
  };

  const filteredSessions = sessions.filter(s => 
    statusFilter === 'all' || s.status === statusFilter
  );

  const selectedSessionData = sessions.find(s => s.id === selectedSession);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Price Wizard</h1>
            <p className="text-gray-600">Competitive pricing intelligence and recommendations</p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/agent-v2?tool=price_wizard_research'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            New Research
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Research Sessions</h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Sessions</option>
                  <option value="completed">Completed</option>
                  <option value="analyzing">Analyzing</option>
                  <option value="scraping">Scraping</option>
                  <option value="discovering">Discovering</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : filteredSessions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No sessions found</div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedSession === session.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">{session.location}</div>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {session.services.join(', ')}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>{session.competitors_found} competitors</span>
                        <span>{session.prices_extracted} prices</span>
                        <span>{session.suggestions_generated} suggestions</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-2">
            {!selectedSession ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a research session to view details</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Session Summary */}
                {selectedSessionData && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedSessionData.location}</h3>
                        <p className="text-sm text-gray-600">{selectedSessionData.services.join(', ')}</p>
                      </div>
                      {getStatusBadge(selectedSessionData.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedSessionData.competitors_found}</div>
                        <div className="text-xs text-gray-600">Competitors</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedSessionData.prices_extracted}</div>
                        <div className="text-xs text-gray-600">Prices</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedSessionData.suggestions_generated}</div>
                        <div className="text-xs text-gray-600">Suggestions</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Suggestions */}
                {suggestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Price Recommendations</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 capitalize">
                                  {suggestion.service_type}
                                </span>
                                {getTierBadge(suggestion.tier)}
                              </div>
                              <div className="text-sm text-gray-600">{suggestion.reasoning}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">
                                €{suggestion.suggested_price}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 text-xs text-gray-600 mb-3">
                            <span>Min: €{suggestion.market_min}</span>
                            <span>Median: €{suggestion.market_median}</span>
                            <span>Max: €{suggestion.market_max}</span>
                          </div>

                          {suggestion.status === 'pending_review' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => activateSuggestion(suggestion.id)}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Activate
                              </button>
                              <button
                                onClick={() => {
                                  const price = prompt('Enter adjusted price:', suggestion.suggested_price.toString());
                                  if (price) activateSuggestion(suggestion.id, parseFloat(price));
                                }}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                              >
                                Adjust & Activate
                              </button>
                              <button
                                onClick={() => rejectSuggestion(suggestion.id)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {suggestion.status === 'activated' && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Activated to price list
                            </div>
                          )}

                          {suggestion.status === 'rejected' && (
                            <div className="text-sm text-red-600">Rejected</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competitors */}
                {competitors.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Discovered Competitors</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prices</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {competitors.map((comp) => (
                            <tr key={comp.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{comp.competitor_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{comp.location}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  comp.status === 'scraped' ? 'bg-green-100 text-green-800' :
                                  comp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {comp.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{comp.price_count}</td>
                              <td className="px-4 py-3">
                                <a
                                  href={comp.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-700"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Extracted Prices */}
                {prices.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Extracted Prices ({prices.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competitor</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {prices.slice(0, 20).map((price) => (
                            <tr key={price.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{price.competitor_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{price.service_type}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {price.currency} {price.price_amount}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{price.package_name || '—'}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${price.confidence_score * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    {Math.round(price.confidence_score * 100)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {prices.length > 20 && (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Showing 20 of {prices.length} prices
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPriceWizardPage;
