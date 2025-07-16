import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  FileText, Brain, Upload, Maximize2, Minimize2, X, 
  Loader2, CheckCircle, AlertCircle, Plus, Trash2, Search,
  BarChart3, TrendingUp, DollarSign, Target, Clock, 
  Database, Filter, Download, Share2, RefreshCw, Eye,
  Zap, Lightbulb, Globe2, Users, PieChart, LineChart,
  Calendar, ChevronUp, ChevronDown, Star, BookOpen, Briefcase,
  Shield, Award, MessageSquare, Network, Activity,
  Code, Hash, Archive, Bookmark, Tag, Settings
} from 'lucide-react';

// ===== AI BOARD ENHANCED DOCUMENT INTELLIGENCE MODULE =====
// This module integrates with V18 Core Shell to provide advanced document analysis
const DocumentIntelligenceModule = ({ 
  onIntegrationReady, 
  selectedAdvisors = [],
  meetingActive = false,
  onDocumentInsight
}) => {
  // ===== MODULE STATE =====
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Document Management State
  const [documents, setDocuments] = useState(new Map());
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(new Map());
  
  // Analysis State
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [insightsSummary, setInsightsSummary] = useState(null);
  const [crossDocumentInsights, setCrossDocumentInsights] = useState([]);
  
  // Business Intelligence State
  const [kpiMetrics, setKpiMetrics] = useState(new Map());
  const [trendAnalysis, setTrendAnalysis] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const fileInputRef = useRef(null);

  // ===== FILE HANDLING =====
  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const fileId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileData = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'uploading',
        progress: 0,
        category: categorizeDocument(file.name, file.type),
        rawFile: file
      };
      
      setDocuments(prev => new Map(prev).set(fileId, fileData));
      setUploadQueue(prev => [...prev, fileId]);
      
      // Simulate upload progress
      simulateUpload(fileId);
    });
  }, []);

  const categorizeDocument = (filename, mimetype) => {
    const name = filename.toLowerCase();
    if (name.includes('financial') || name.includes('revenue') || name.includes('p&l')) return 'financial';
    if (name.includes('market') || name.includes('competitive')) return 'market';
    if (name.includes('product') || name.includes('roadmap')) return 'product';
    if (name.includes('customer') || name.includes('user')) return 'customer';
    if (name.includes('strategy') || name.includes('plan')) return 'strategy';
    return 'general';
  };

  const simulateUpload = async (fileId) => {
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setDocuments(prev => {
        const updated = new Map(prev);
        const doc = updated.get(fileId);
        if (doc) {
          doc.progress = progress;
          if (progress === 100) {
            doc.status = 'uploaded';
            processDocument(fileId);
          }
        }
        return updated;
      });
    }
  };

  const processDocument = async (fileId) => {
    setDocuments(prev => {
      const updated = new Map(prev);
      const doc = updated.get(fileId);
      if (doc) doc.status = 'processing';
      return updated;
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAnalysis = generateMockAnalysis(fileId);
    setAnalysisResults(prev => new Map(prev).set(fileId, mockAnalysis));
    
    setDocuments(prev => {
      const updated = new Map(prev);
      const doc = updated.get(fileId);
      if (doc) {
        doc.status = 'analyzed';
        doc.confidence = mockAnalysis.confidence;
      }
      return updated;
    });

    // Notify parent component if integrated
    if (onDocumentInsight) {
      onDocumentInsight({
        documentId: fileId,
        insights: mockAnalysis.keyInsights,
        metrics: mockAnalysis.metrics
      });
    }
  };

  const generateMockAnalysis = (fileId) => {
    const doc = documents.get(fileId);
    return {
      documentId: fileId,
      confidence: 0.85 + Math.random() * 0.10,
      timestamp: new Date(),
      keyInsights: [
        "Revenue growth of 23% YoY exceeds industry average",
        "Customer acquisition costs decreasing by 15%",
        "Market expansion opportunities in 3 new segments identified"
      ],
      metrics: {
        revenue: { value: 12.3, unit: "M", trend: "up", change: 23 },
        customers: { value: 2847, unit: "", trend: "up", change: 31 },
        nps: { value: 72, unit: "", trend: "stable", change: 2 },
        burn_rate: { value: 450, unit: "K/mo", trend: "down", change: -12 }
      },
      advisorInsights: generateAdvisorInsights(doc?.category),
      risks: ["Market competition increasing", "Supply chain dependencies"],
      opportunities: ["International expansion", "Product line extension", "Strategic partnerships"],
      recommendations: [
        { priority: "high", action: "Focus on customer retention", timeline: "Q1 2025" },
        { priority: "medium", action: "Explore Series B funding", timeline: "Q2 2025" },
        { priority: "low", action: "Implement advanced analytics", timeline: "Q3 2025" }
      ]
    };
  };

  const generateAdvisorInsights = (category = 'general') => {
    const insights = {
      ceo: {
        name: "Strategic CEO",
        insight: "This document reveals critical strategic opportunities. The 23% growth rate positions us well for Series B discussions. I recommend accelerating our expansion timeline.",
        confidence: 0.92
      },
      cfo: {
        name: "CFO Advisor",
        insight: "Financial metrics are strong but watch the burn rate carefully. The decreasing CAC is excellent - we should model scenarios for increased marketing spend.",
        confidence: 0.88
      },
      cmo: {
        name: "CMO Advisor",
        insight: "Customer metrics show strong product-market fit. The NPS of 72 is exceptional. We should leverage this for case studies and testimonials.",
        confidence: 0.85
      }
    };
    
    return Object.entries(insights)
      .filter(([advisorId]) => selectedAdvisors.includes(advisorId))
      .reduce((acc, [id, data]) => ({ ...acc, [id]: data }), {});
  };

  // ===== AI ANALYSIS WITH CLAUDE =====
  const performAIAnalysis = async (documentId) => {
    const doc = documents.get(documentId);
    if (!doc) return;

    setCurrentAnalysis({ documentId, status: 'running', progress: 0 });
    
    try {
      // Here we would integrate with Claude API for real analysis
      // For now, using enhanced mock analysis
      const analysis = await simulateDeepAnalysis(doc);
      
      setAnalysisResults(prev => new Map(prev).set(documentId, analysis));
      updateCrossDocumentInsights();
      
      setCurrentAnalysis({ documentId, status: 'complete', progress: 100 });
    } catch (error) {
      setCurrentAnalysis({ documentId, status: 'error', progress: 0, error: error.message });
    }
  };

  const simulateDeepAnalysis = async (doc) => {
    // Simulate progressive analysis
    for (let i = 0; i <= 100; i += 20) {
      setCurrentAnalysis(prev => ({ ...prev, progress: i }));
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return {
      ...generateMockAnalysis(doc.id),
      deepInsights: {
        marketPosition: "Strong competitive advantage in core markets",
        growthPotential: "85% probability of achieving 2x growth in 18 months",
        riskProfile: "Moderate risk with clear mitigation strategies",
        strategicOptions: [
          "Aggressive market expansion",
          "Product diversification",
          "Strategic acquisition opportunities"
        ]
      }
    };
  };

  const updateCrossDocumentInsights = () => {
    if (documents.size < 2) return;
    
    const insights = [
      {
        type: 'correlation',
        confidence: 0.87,
        insight: 'Financial performance strongly correlates with customer satisfaction metrics',
        documents: Array.from(documents.keys()).slice(0, 2),
        recommendation: 'Increase investment in customer success initiatives'
      },
      {
        type: 'trend',
        confidence: 0.92,
        insight: 'Consistent growth pattern across all business segments',
        documents: Array.from(documents.keys()),
        recommendation: 'Maintain current strategy while preparing for scale'
      },
      {
        type: 'anomaly',
        confidence: 0.78,
        insight: 'Unusual spike in operational costs requires investigation',
        documents: [Array.from(documents.keys())[0]],
        recommendation: 'Conduct detailed cost analysis for Q4'
      }
    ];
    
    setCrossDocumentInsights(insights);
  };

  // ===== RENDER FUNCTIONS =====
  const renderDocumentList = () => {
    const docArray = Array.from(documents.values());
    
    return (
      <div className="space-y-3">
        {docArray.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No documents uploaded yet</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          docArray.map(doc => (
            <div
              key={doc.id}
              className={`bg-white rounded-lg border-2 p-4 transition-all cursor-pointer hover:shadow-md ${
                selectedDocument?.id === doc.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    doc.category === 'financial' ? 'bg-green-100' :
                    doc.category === 'market' ? 'bg-blue-100' :
                    doc.category === 'product' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    <FileText className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.category}
                    </p>
                    {doc.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.status === 'analyzed' && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-600">
                        {doc.confidence ? `${Math.round(doc.confidence * 100)}%` : ''}
                      </span>
                    </div>
                  )}
                  {doc.status === 'processing' && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      performAIAnalysis(doc.id);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderAnalysisResults = () => {
    if (!selectedDocument || !analysisResults.has(selectedDocument.id)) {
      return (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Select a document to view analysis</p>
        </div>
      );
    }

    const analysis = analysisResults.get(selectedDocument.id);
    
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analysis.metrics).map(([key, data]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {key.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className={`flex items-center ${
                    data.trend === 'up' ? 'text-green-600' :
                    data.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {data.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                     data.trend === 'down' ? <ChevronDown className="w-4 h-4" /> :
                     <span className="w-4 h-4">-</span>}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {data.value}{data.unit}
                </div>
                {data.change !== 0 && (
                  <div className="text-sm text-gray-500">
                    {data.change > 0 ? '+' : ''}{data.change}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
          <div className="space-y-3">
            {analysis.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor Insights */}
        {Object.keys(analysis.advisorInsights).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Advisor Insights</h3>
            <div className="space-y-4">
              {Object.entries(analysis.advisorInsights).map(([advisorId, data]) => (
                <div key={advisorId} className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{data.name}</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(data.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-700">{data.insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  rec.priority === 'high' ? 'bg-red-500' :
                  rec.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <div>
                  <p className="text-gray-700">{rec.action}</p>
                  <p className="text-sm text-gray-500">Timeline: {rec.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCrossDocumentInsights = () => {
    if (crossDocumentInsights.length === 0) {
      return (
        <div className="text-center py-12">
          <Network className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Upload multiple documents to see cross-document insights</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {crossDocumentInsights.map((insight, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                insight.type === 'correlation' ? 'bg-blue-100 text-blue-700' :
                insight.type === 'trend' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {insight.type.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
            <p className="text-gray-700 mb-2">{insight.insight}</p>
            <p className="text-sm text-gray-600">
              <strong>Recommendation:</strong> {insight.recommendation}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Based on {insight.documents.length} documents
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <div className="bg-white rounded-xl border-2 border-gray-300 shadow-lg overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Document Intelligence Module</h2>
              <p className="text-sm text-blue-100">AI-powered document analysis & insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-lg transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Module Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Documents</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              {meetingActive && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Share with Advisors</span>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {documents.size} documents • {analysisResults.size} analyzed
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {['upload', 'analysis', 'insights', 'cross-analysis'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'upload' && renderDocumentList()}
          {activeTab === 'analysis' && renderAnalysisResults()}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Business Intelligence Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">87%</div>
                    <div className="text-sm text-gray-600">Growth Potential</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600">$2.1M</div>
                    <div className="text-sm text-gray-600">Optimization Opportunity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Critical Actions</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium mb-4">Recommended Actions</h4>
                <div className="space-y-3">
                  <button className="w-full text-left bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span>Generate Executive Summary</span>
                    </div>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full text-left bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <span>Create Board Presentation</span>
                    </div>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full text-left bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <span>Schedule Advisory Session</span>
                    </div>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'cross-analysis' && renderCrossDocumentInsights()}

          {/* Processing Status */}
          {currentAnalysis && currentAnalysis.status === 'running' && (
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-200">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium">Analyzing Document...</p>
                  <div className="mt-1 w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${currentAnalysis.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== MODULE DEFINITION FOR V18 CORE SHELL =====
export const moduleDefinition = {
  id: 'document-intelligence',
  name: 'Document Intelligence Module',
  description: 'AI-powered document analysis with business intelligence and advisor insights',
  version: '1.0.0',
  type: 'premium',
  category: 'Business Intelligence',
  icon: FileText,
  color: 'blue',
  status: 'ready',
  component: DocumentIntelligenceModule,
  features: [
    'Advanced document upload and processing',
    'AI-powered content analysis with confidence scoring',
    'Multi-advisor business insights generation',
    'Cross-document intelligence and correlation',
    'Real-time KPI extraction and trend analysis',
    'Business intelligence recommendations',
    'Integration with live advisory sessions',
    'Support for PDF, Word, CSV, Excel files'
  ],
  requirements: {
    subscription: 'professional',
    apiAccess: ['claude-api', 'document-processing'],
    storage: 'document-storage',
    integrations: ['v20-live-advisory', 'v22-advanced-ai']
  },
  businessValue: {
    primaryUseCase: 'Transform business documents into actionable intelligence with AI advisor insights',
    targetMarket: 'Executives, founders, and business leaders who need rapid document analysis',
    revenueImpact: 'Core feature driving professional subscription upgrades and user engagement',
    competitiveDifferentiator: 'Only platform combining document AI with personalized advisor insights'
  }
};

export default DocumentIntelligenceModule;