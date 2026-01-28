
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, TrendingUp, DollarSign, Eye, CheckCircle, XCircle, RefreshCw, ExternalLink, Filter, X, Loader2, MapPin, Plus } from 'lucide-react';

// Utility to summarize reasoning (first sentence or up to 180 chars)
function summarizeReasoning(reasoning: string): string {
  if (!reasoning) return '';
  // Try to get first sentence
  const match = reasoning.match(/^(.*?[.!?])\s/);
  if (match && match[1].length < 180) return match[1];
  // Otherwise, truncate
  return reasoning.length > 180 ? reasoning.slice(0, 177) + '…' : reasoning;
}

// Available services for price research
const AVAILABLE_SERVICES = [
  { id: 'family', label: 'Family Photography' },
  { id: 'wedding', label: 'Wedding Photography' },
  { id: 'newborn', label: 'Newborn Photography' },
  { id: 'portrait', label: 'Portrait Photography' },
  { id: 'corporate', label: 'Corporate / Business' },

  { id: 'event', label: 'Event Photography' },
];

  /**
   * Start a new competitive pricing research session
   * This uses the new Tavily + OpenAI integration for REAL competitor research
   * Flow: /quick-start → background processing → poll /status for updates
   */
  const startNewResearch = async () => {
    if (newResearchServices.length === 0) {
      alert('Please select at least one service type');
      return;
    }

    setIsResearching(true);
    let sessionId: string | null = null;

    try {
      // Use the new quick-start endpoint that does everything in background
      setResearchProgress('Starting AI-powered competitor research...');
      const startRes = await fetch('/api/price-wizard/quick-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: newResearchLocation,
          services: newResearchServices.map(s => {
            // Map service IDs to full names for better search results
            const serviceMap: Record<string, string> = {
              'family': 'Family Portrait',
              'portrait': 'Portrait Photography',
              'newborn': 'Newborn Photography',
              'wedding': 'Wedding Photography',
              'corporate': 'Corporate Photography',
              'event': 'Event Photography',
            };
            return serviceMap[s] || s;
          })
        })
      });

      if (!startRes.ok) {
        const errorData = await startRes.json();
        throw new Error(errorData.error || 'Failed to start research');
      }
      
      const startData = await startRes.json();
      sessionId = startData.sessionId;
      console.log('✅ Research started:', sessionId);

      // Close modal and select the session - the auto-refresh will show progress
      setShowNewResearchModal(false);
      setNewResearchLocation('Wien');
      setNewResearchServices(['family', 'portrait']);
      await fetchSessions();
      setSelectedSession(sessionId);

      alert(`🚀 Research started!\n\nLocation: ${newResearchLocation}\nServices: ${newResearchServices.join(', ')}\n\nThe AI will search for real competitors, extract prices, and generate recommendations.\n\nThis takes 1-2 minutes. The page will auto-refresh to show progress.`);

    } catch (error: any) {
      console.error('Research failed:', error);
      alert(`Research failed: ${error.message}`);
      
      // Refresh to show partial results if any
      if (sessionId) {
        await fetchSessions();
        setSelectedSession(sessionId);
      }
    } finally {
      setIsResearching(false);
      setResearchProgress('');
    }
  };

  const toggleService = (serviceId: string) => {
    setNewResearchServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  /**
   * Open the manual price entry modal for a competitor
   */
  const openManualPriceModal = (competitor: Competitor) => {
    setManualPriceCompetitor(competitor);
    setManualPriceService('family');
    setManualPriceAmount('');
    setManualPriceNotes('');
    setShowManualPriceModal(true);
  };

  /**
   * Add a manual price entry for a competitor
   */
  const addManualPrice = async () => {
    if (!manualPriceCompetitor || !manualPriceService || !manualPriceAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(manualPriceAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid price amount');
      return;
    }

    setIsAddingPrice(true);
    try {
      const response = await fetch('/api/price-wizard/add-manual-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorId: manualPriceCompetitor.id,
          serviceType: manualPriceService,
          priceAmount: amount,
          currency: 'EUR',
          notes: manualPriceNotes || null
        })
      });

      if (response.ok) {
        alert('Price added successfully!');
        setShowManualPriceModal(false);
        if (selectedSession) {
          fetchSessionDetails(selectedSession);
        }
      } else {
        const data = await response.json();
        alert(`Failed to add price: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding manual price:', err);
      alert('Failed to add price');
    } finally {
      setIsAddingPrice(false);
    }
  };

  /**
   * Re-run research with AI (Tavily + OpenAI)
   * This will clear existing data and perform fresh competitor research
   */
  const retryWithAI = async (sessionId: string) => {
    if (!confirm('This will clear existing competitor data and run fresh AI research.\n\nThis uses Tavily for competitor search and OpenAI for price extraction.\n\nContinue?')) {
      return;
    }

    try {
      const response = await fetch('/api/price-wizard/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        alert('🚀 AI research started!\n\nThe page will auto-refresh to show progress.\nThis takes 1-2 minutes.');
        fetchSessionDetails(sessionId);
        fetchSessions();
      } else {
        const data = await response.json();
                      {suggestions.map((suggestion) => {
                        // Parse reasoning into structured parts
                        const parseReasoning = (reasoning: string) => {
                          const parts = {
                            positioning: '',
                            competitiveAdvantage: '',
                            marketInsight: ''
                          };
                          // Extract different sections from the reasoning
                          const posMatch = reasoning.match(/^(.*?)(?:Competitive advantage:|$)/is);
                          const advMatch = reasoning.match(/Competitive advantage:\s*(.*?)(?:Market insight:|$)/is);
                          const insMatch = reasoning.match(/Market insight:\s*(.*?)$/is);
                          if (posMatch) parts.positioning = posMatch[1].trim();
                          if (advMatch) parts.competitiveAdvantage = advMatch[1].trim();
                          if (insMatch) parts.marketInsight = insMatch[1].trim();
                          if (!parts.positioning && !parts.competitiveAdvantage && !parts.marketInsight) {
                            parts.positioning = reasoning;
                          }
                          return parts;
                        };
                        const reasoningParts = parseReasoning(suggestion.reasoning || '');
                        const percentilePosition = suggestion.market_median > 0 
                          ? Math.round(((suggestion.suggested_price - suggestion.market_min) / (suggestion.market_max - suggestion.market_min)) * 100)
                          : 50;
                        // --- Visual Card Layout ---
                        return (
                          <div key={suggestion.id} className="p-6 mb-6 bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-gray-900 capitalize tracking-tight">
                                  {suggestion.service_type.replace(/_/g, ' ')}
                                </span>
                                {getTierBadge(suggestion.tier)}
                              </div>
                              <div className="text-right">
                                <div className="text-4xl font-extrabold text-purple-700 drop-shadow-sm">
                                  €{Number(suggestion.suggested_price).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-400 mt-1 font-medium">
                                  Recommended price
                                </div>
                              </div>
                            </div>
                            <div className="mb-5 bg-gray-100 rounded-lg p-3 shadow-inner">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Min: €{suggestion.market_min}</span>
                                <span className="font-semibold text-gray-700">Median: €{suggestion.market_median}</span>
                                <span>Max: €{suggestion.market_max}</span>
                              </div>
                              <div className="relative h-2 bg-gray-300 rounded-full">
                                <div className="absolute h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full" style={{ width: '100%' }} />
                                <div className="absolute w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-md transform -translate-y-1/4" style={{ left: `${Math.min(Math.max(percentilePosition, 0), 100)}%`, marginLeft: '-8px' }} title={`Your price: €${suggestion.suggested_price}`} />
                              </div>
                              <div className="text-center text-xs text-purple-700 font-semibold mt-2">
                                Positioned at {percentilePosition}th percentile
                              </div>
                            </div>
                            <ul className="space-y-2 text-base">
                              {reasoningParts.positioning && (
                                <li className="flex items-start gap-2">
                                  <span className="mt-1 text-blue-500">•</span>
                                  <span><span className="font-semibold text-gray-800">Positioning:</span> <span className="text-gray-700">{reasoningParts.positioning}</span></span>
                                </li>
                              )}
                              {reasoningParts.competitiveAdvantage && (
                                <li className="flex items-start gap-2">
                                  <span className="mt-1 text-green-500">•</span>
                                  <span><span className="font-semibold text-gray-800">Competitive Advantage:</span> <span className="text-gray-700">{reasoningParts.competitiveAdvantage}</span></span>
                                </li>
                              )}
                              {reasoningParts.marketInsight && (
                                <li className="flex items-start gap-2">
                                  <span className="mt-1 text-purple-500">•</span>
                                  <span><span className="font-semibold text-gray-800">Market Insight:</span> <span className="text-gray-700">{reasoningParts.marketInsight}</span></span>
                                </li>
                              )}
                            </ul>
                            {suggestion.status === 'pending_review' && (
                              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => openActivateModal(suggestion)}
                                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-base font-semibold transition-colors shadow"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  Activate
                                </button>
                                <button
                                  onClick={() => {
                                    const price = prompt('Enter adjusted price:', suggestion.suggested_price.toString());
                                    if (price) openActivateModal(suggestion, parseFloat(price));
                                  }}
                                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-semibold transition-colors shadow"
                                >
                                  Adjust & Activate
                                </button>
                                <button
                                  onClick={() => rejectSuggestion(suggestion.id)}
                                  className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 flex items-center gap-2 text-base transition-colors shadow"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                            {suggestion.status === 'activated' && (
                              <div className="flex items-center gap-2 text-base text-green-700 mt-6 pt-4 border-t border-gray-200 bg-green-50 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl font-semibold">
                                <CheckCircle className="w-5 h-5" />
                                <span>Activated to price list</span>
                              </div>
                            )}
                            {suggestion.status === 'rejected' && (
                              <div className="text-base text-red-700 mt-6 pt-4 border-t border-gray-200 bg-red-50 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl font-semibold">
                                Rejected
                              </div>
                            )}
                          </div>
                        );
                      })}
                <p className="text-purple-100 text-sm mt-1">
                  Discover competitors and analyze market prices
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Location Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={newResearchLocation}
                    onChange={(e) => setNewResearchLocation(e.target.value)}
                    disabled={isResearching}
                    placeholder="e.g., Wien, Graz, Salzburg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100"
                  />
                </div>

                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Services to Research
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_SERVICES.map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        disabled={isResearching}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          newResearchServices.includes(service.id)
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-400'
                            : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {service.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                {isResearching && researchProgress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-700">{researchProgress}</span>
                    </div>
                  </div>
                )}

                {/* Info Note */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                  <strong>How it works:</strong> The wizard will search for photographers in your area, 
                  scrape their pricing pages, and generate 3-tier pricing recommendations (basic, standard, premium) 
                  based on market analysis.
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewResearchModal(false)}
                  disabled={isResearching}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={startNewResearch}
                  disabled={isResearching || newResearchServices.length === 0 || !newResearchLocation.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Start Research
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Price Entry Modal */}
        {showManualPriceModal && manualPriceCompetitor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Add Price Manually</h2>
                  <button
                    onClick={() => setShowManualPriceModal(false)}
                    disabled={isAddingPrice}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-green-100 text-sm mt-1">
                  {manualPriceCompetitor.competitor_name}
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    value={manualPriceService}
                    onChange={(e) => setManualPriceService(e.target.value)}
                    disabled={isAddingPrice}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100"
                  >
                    {AVAILABLE_SERVICES.map(service => (
                      <option key={service.id} value={service.id}>{service.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (EUR)
                  </label>
                  <input
                    type="number"
                    value={manualPriceAmount}
                    onChange={(e) => setManualPriceAmount(e.target.value)}
                    disabled={isAddingPrice}
                    placeholder="e.g., 350"
                    min="0"
                    step="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={manualPriceNotes}
                    onChange={(e) => setManualPriceNotes(e.target.value)}
                    disabled={isAddingPrice}
                    placeholder="e.g., Includes 10 edited photos, 1 hour session"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 resize-none"
                  />
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-600">
                  <strong>Tip:</strong> Visit the competitor's website to find their pricing. 
                  Look for "Preise", "Pakete", or "Investment" pages.
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowManualPriceModal(false)}
                  disabled={isAddingPrice}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addManualPrice}
                  disabled={isAddingPrice || !manualPriceAmount}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAddingPrice ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Price
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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

                    {/* Progress Indicator for active sessions */}
                    {['discovering', 'scraping', 'analyzing'].includes(selectedSessionData.status) && (
                      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="font-medium text-blue-800">
                            {selectedSessionData.status === 'discovering' && 'Discovering competitors...'}
                            {selectedSessionData.status === 'scraping' && 'Scraping competitor websites...'}
                            {selectedSessionData.status === 'analyzing' && 'Analyzing market prices...'}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <div className={`h-2 flex-1 rounded-full ${selectedSessionData.status === 'discovering' || selectedSessionData.status === 'scraping' || selectedSessionData.status === 'analyzing' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          <div className={`h-2 flex-1 rounded-full ${selectedSessionData.status === 'scraping' || selectedSessionData.status === 'analyzing' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          <div className={`h-2 flex-1 rounded-full ${selectedSessionData.status === 'analyzing' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          <div className={`h-2 flex-1 rounded-full ${selectedSessionData.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Discover</span>
                          <span>Scrape</span>
                          <span>Analyze</span>
                          <span>Done</span>
                        </div>
                        {selectedSessionData.status === 'scraping' && (
                          <p className="text-xs text-blue-700 mt-3">
                            ⚠️ Web scraping may fail for some sites. You can add prices manually using the + button next to each competitor.
                          </p>
                        )}
                      </div>
                    )}

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
                      {suggestions.map((suggestion) => {
                        // Parse reasoning into structured parts
                        const parseReasoning = (reasoning: string) => {
                          const parts = {
                            positioning: '',
                            competitiveAdvantage: '',
                            marketInsight: ''
                          };
                          
                          // Extract different sections from the reasoning
                          const posMatch = reasoning.match(/^(.*?)(?:Competitive advantage:|$)/is);
                          const advMatch = reasoning.match(/Competitive advantage:\s*(.*?)(?:Market insight:|$)/is);
                          const insMatch = reasoning.match(/Market insight:\s*(.*?)$/is);
                          
                          if (posMatch) parts.positioning = posMatch[1].trim();
                          if (advMatch) parts.competitiveAdvantage = advMatch[1].trim();
                          if (insMatch) parts.marketInsight = insMatch[1].trim();
                          
                          // If no structured format, just use the whole thing as positioning
                          if (!parts.positioning && !parts.competitiveAdvantage && !parts.marketInsight) {
                            parts.positioning = reasoning;
                          }
                          
                          return parts;
                        };
                        
                        const reasoningParts = parseReasoning(suggestion.reasoning || '');
                        const percentilePosition = suggestion.market_median > 0 
                          ? Math.round(((suggestion.suggested_price - suggestion.market_min) / (suggestion.market_max - suggestion.market_min)) * 100)
                          : 50;
                        
                        return (
                          <div key={suggestion.id} className="p-5">
                            {/* Header with service type, tier, and price */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold text-gray-900 capitalize">
                                  {suggestion.service_type.replace(/_/g, ' ')}
                                </span>
                                {getTierBadge(suggestion.tier)}
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-bold text-purple-600">
                                  €{Number(suggestion.suggested_price).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Recommended price
                                </div>
                              </div>
                            </div>

                            {/* Market Position Bar */}
                            <div className="mb-4 bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Min: €{suggestion.market_min}</span>
                                <span className="font-medium text-gray-700">Median: €{suggestion.market_median}</span>
                                <span>Max: €{suggestion.market_max}</span>
                              </div>
                              <div className="relative h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="absolute h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"
                                  style={{ width: '100%' }}
                                />
                                <div 
                                  className="absolute w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-md transform -translate-y-0.5"
                                  style={{ left: `${Math.min(Math.max(percentilePosition, 0), 100)}%`, marginLeft: '-6px' }}
                                  title={`Your price: €${suggestion.suggested_price}`}
                                />
                              </div>
                              <div className="text-center text-xs text-purple-600 font-medium mt-2">
                                Positioned at {percentilePosition}th percentile
                              </div>
                            </div>

                            {/* Structured Reasoning */}
                            <div className="space-y-3 text-sm">
                              {reasoningParts.positioning && (
                                <div className="flex gap-2">
                                  <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-blue-600 text-xs">📍</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Positioning: </span>
                                    <span className="text-gray-600">{reasoningParts.positioning}</span>
                                  </div>
                                </div>
                              )}
                              
                              {reasoningParts.competitiveAdvantage && (
                                <div className="flex gap-2">
                                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-green-600 text-xs">✨</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Competitive Advantage: </span>
                                    <span className="text-gray-600">{reasoningParts.competitiveAdvantage}</span>
                                  </div>
                                </div>
                              )}
                              
                              {reasoningParts.marketInsight && (
                                <div className="flex gap-2">
                                  <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-purple-600 text-xs">📊</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Market Insight: </span>
                                    <span className="text-gray-600">{reasoningParts.marketInsight}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            {suggestion.status === 'pending_review' && (
                              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button
                                  onClick={() => openActivateModal(suggestion)}
                                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Activate
                                </button>
                                <button
                                  onClick={() => {
                                    const price = prompt('Enter adjusted price:', suggestion.suggested_price.toString());
                                    if (price) openActivateModal(suggestion, parseFloat(price));
                                  }}
                                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                                >
                                  Adjust & Activate
                                </button>
                                      {/* Activate Modal */}
                                      {showActivateModal && activateModalData.suggestion && (
                                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                              <h2 className="text-lg font-bold text-gray-900">Add to Price List</h2>
                                              <button
                                                onClick={() => setShowActivateModal(false)}
                                                className="text-gray-400 hover:text-gray-700"
                                              >
                                                <X className="w-5 h-5" />
                                              </button>
                                            </div>
                                            <div className="px-6 py-4 space-y-4">
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">Service</div>
                                                <div className="font-semibold text-gray-900">{activateModalData.suggestion.service_type.replace(/_/g, ' ')} ({activateModalData.suggestion.tier})</div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">Price</div>
                                                <div className="font-semibold text-purple-700 text-lg">€{activateModalData.price?.toFixed(2)}</div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">Description (edit before saving)</div>
                                                <textarea
                                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                  rows={3}
                                                  value={activateModalData.description}
                                                  onChange={e => setActivateModalData(d => ({ ...d, description: e.target.value }))}
                                                  maxLength={300}
                                                />
                                                <div className="text-xs text-gray-400 text-right">{activateModalData.description.length}/300</div>
                                              </div>
                                              <div className="flex gap-2 mt-2">
                                                <button
                                                  onClick={confirmActivateSuggestion}
                                                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                                >
                                                  <CheckCircle className="w-4 h-4 inline-block mr-1" />
                                                  Confirm & Add
                                                </button>
                                                <button
                                                  onClick={() => setShowActivateModal(false)}
                                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                <button
                                  onClick={() => rejectSuggestion(suggestion.id)}
                                  className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 flex items-center gap-2 text-sm transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            {suggestion.status === 'activated' && (
                              <div className="flex items-center gap-2 text-sm text-green-600 mt-4 pt-4 border-t border-gray-100 bg-green-50 -mx-5 -mb-5 px-5 py-3 rounded-b-lg">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium">Activated to price list</span>
                              </div>
                            )}

                            {suggestion.status === 'rejected' && (
                              <div className="text-sm text-red-600 mt-4 pt-4 border-t border-gray-100 bg-red-50 -mx-5 -mb-5 px-5 py-3 rounded-b-lg font-medium">
                                Rejected
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Competitors */}
                {competitors.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Discovered Competitors</h3>
                      <div className="flex gap-2 items-center">
                        {competitors.filter(c => c.status === 'pending').length > 0 && (
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            {competitors.filter(c => c.status === 'pending').length} pending
                          </span>
                        )}
                        {competitors.filter(c => c.status === 'failed').length > 0 && (
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            {competitors.filter(c => c.status === 'failed').length} failed - add prices manually
                          </span>
                        )}
                        <button
                          onClick={() => retryWithAI(selectedSession!)}
                          className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center gap-1"
                          title="Re-run with Tavily + OpenAI"
                        >
                          <TrendingUp className="w-3 h-3" />
                          AI Research
                        </button>
                        <button
                          onClick={() => retryScrape(selectedSession!)}
                          className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry Scrape
                        </button>
                      </div>
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
                              <td className="px-4 py-3 flex items-center gap-2">
                                <a
                                  href={comp.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-700"
                                  title="Visit website"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => openManualPriceModal(comp)}
                                  className="text-green-600 hover:text-green-700"
                                  title="Add price manually"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {prices.slice(0, 20).map((price) => (
                            <tr key={price.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {price.website_url ? (
                                  <a
                                    href={price.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700 hover:underline"
                                    title={`View source: ${price.website_url}`}
                                  >
                                    {price.competitor_name}
                                  </a>
                                ) : (
                                  price.competitor_name
                                )}
                              </td>
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
                              <td className="px-4 py-3">
                                {price.website_url ? (
                                  <a
                                    href={price.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-xs"
                                    title={price.website_url}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Verify
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-xs">—</span>
                                )}
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
