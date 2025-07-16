                            <p className="text-lg font-semibold text-gray-900">{value.value || value}</p>
                            {value.trend && (
                              <p className={`text-sm ${value.trend === 'up' ? 'text-green-600' : value.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                                {value.change}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Advisor Insights */}
                  {advisorInsights.has(selectedDocument.id) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Advisor Perspectives</h3>
                      <div className="space-y-3">
                        {Array.from(advisorInsights.get(selectedDocument.id).entries()).map(([advisor, insight]) => (
                          <div key={advisor} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 capitalize mb-2">{advisor} Analysis</h4>
                            <p className="text-sm text-gray-600">{insight.perspective}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Document Content Preview */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Document Content</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {selectedDocument.content || 'Content not available'}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">Processing document analysis...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MODULE DEFINITION FOR V18 CORE SHELL =====
export const moduleDefinition = {
  id: 'enhanced-document-intelligence-v21',
  name: 'Enhanced Document Intelligence V21',
  description: 'Advanced AI-powered document analysis with multi-advisor insights and cross-document intelligence',
  version: '21.0.0',
  type: 'professional',
  category: 'Document Intelligence',
  icon: Brain,
  color: 'purple',
  status: 'active',
  component: EnhancedDocumentIntelligenceV21,
  features: [
    'Multi-layer AI document analysis (Financial, Contract, Strategic, Comprehensive)',
    'Six AI advisor perspectives per document (CEO, CFO, CTO, CMO, Legal, HR)',
    'Cross-document pattern recognition and relationship mapping',
    'Semantic search with RAG implementation',
    'Strategic recommendations engine with prioritized actions',
    'Real-time processing with confidence scoring',
    'Entity extraction and relationship graphs',
    'Timeline and trend analysis across documents',
    'Integration with V20 Live Advisory and V22 Advanced AI'
  ],
  requirements: {
    subscription: 'professional',
    apiAccess: ['claude-api', 'document-processing', 'vector-search'],
    storage: 'document-storage',
    integrations: ['v20-live-advisory', 'v22-advanced-ai', 'v23-custom-advisors']
  },
  businessValue: {
    primaryUseCase: 'Transform business documents into comprehensive strategic intelligence with multi-perspective analysis',
    targetMarket: 'Executives and decision-makers requiring deep document insights',
    revenueImpact: 'Core differentiator driving professional subscription upgrades',
    competitiveDifferentiator: 'Only platform offering multi-advisor document analysis with cross-document intelligence'
  },
  integrationPoints: {
    v20Integration: 'Shares document insights and RAG context with live advisory sessions',
    v22Integration: 'Leverages advanced AI memory and learning capabilities',
    v23Integration: 'Supports custom advisor training from analyzed documents',
    coreShellIntegration: 'Receives shared documents and advisors from Core Shell'
  }
};

export default EnhancedDocumentIntelligenceV21;