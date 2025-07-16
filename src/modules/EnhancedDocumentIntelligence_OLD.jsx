import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  FileText, Upload, Brain, BarChart3, TrendingUp, AlertTriangle,
  CheckCircle, Loader2, Download, Eye, Trash2, Plus, Search,
  PieChart, Target, DollarSign, Calendar, Users, Zap, Star,
  Maximize2, Minimize2, Filter, SortDesc, RefreshCw, BookOpen
} from 'lucide-react';

const EnhancedDocumentIntelligence = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [insights, setInsights] = useState([]);
  const fileInputRef = useRef(null);

  // Sample analyzed documents
  useEffect(() => {
    setDocuments([
      {
        id: 'doc-1',
        name: 'Q3_Financial_Report.pdf',
        type: 'financial',
        size: '2.3MB',
        uploadDate: '2025-07-10',
        status: 'analyzed',
        icon: DollarSign,
        color: 'green'
      },
      {
        id: 'doc-2', 
        name: 'Product_Roadmap_2025.pdf',
        type: 'strategic',
        size: '1.8MB',
        uploadDate: '2025-07-09',
        status: 'analyzing',
        icon: Target,
        color: 'blue'
      },
      {
        id: 'doc-3',
        name: 'Customer_Research_Study.csv',
        type: 'market',
        size: '892KB',
        uploadDate: '2025-07-08',
        status: 'analyzed',
        icon: Users,
        color: 'purple'
      }
    ]);

    setAnalyses({
      'doc-1': {
        summary: 'Strong Q3 performance with 34% revenue growth and improving margins.',
        keyMetrics: {
          revenue: { value: '$2.4M', change: '+34%', trend: 'up' },
          margin: { value: '28%', change: '+5%', trend: 'up' },
          cashFlow: { value: '$640K', change: '+12%', trend: 'up' }
        },
        risks: ['Increasing customer acquisition costs', 'Seasonal revenue dependency'],
        opportunities: ['Enterprise market expansion', 'Product line extension'],
        recommendations: [
          'Focus on enterprise customer retention',
          'Diversify revenue streams',
          'Optimize marketing spend efficiency'
        ]
      },
      'doc-3': {
        summary: 'Customer satisfaction high (4.6/5) but onboarding friction identified.',
        keyMetrics: {
          satisfaction: { value: '4.6/5', change: '+0.3', trend: 'up' },
          nps: { value: '67', change: '+12', trend: 'up' },
          churn: { value: '3.2%', change: '-1.1%', trend: 'down' }
        },
        risks: ['Onboarding complexity', 'Support response times'],
        opportunities: ['Referral program potential', 'Upsell readiness'],
        recommendations: [
          'Streamline onboarding process',
          'Implement proactive support',
          'Launch customer referral program'
        ]
      }
    });

    setInsights([
      {
        id: 'insight-1',
        type: 'financial',
        priority: 'high',
        title: 'Cash Flow Optimization Opportunity',
        description: 'Analysis shows 15% improvement possible through payment terms optimization',
        impact: '$180K annually',
        confidence: 94
      },
      {
        id: 'insight-2',
        type: 'strategic',
        priority: 'medium', 
        title: 'Market Expansion Ready',
        description: 'Customer data indicates strong product-market fit for enterprise segment',
        impact: '40% TAM increase',
        confidence: 87
      }
    ]);
  }, []);

  const handleFileUpload = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    setIsAnalyzing(true);

    for (const file of files) {
      const newDoc = {
        id: `doc-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: detectDocumentType(file.name),
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'analyzing',
        icon: getDocumentIcon(file.name),
        color: getDocumentColor(file.name)
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate AI analysis
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, status: 'analyzed' }
              : doc
          )
        );
        
        // Add mock analysis results
        setAnalyses(prev => ({
          ...prev,
          [newDoc.id]: generateMockAnalysis(newDoc.type)
        }));
      }, 3000);
    }

    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const detectDocumentType = (filename) => {
    const ext = filename.toLowerCase();
    if (ext.includes('financial') || ext.includes('p&l') || ext.includes('revenue')) return 'financial';
    if (ext.includes('strategy') || ext.includes('roadmap') || ext.includes('plan')) return 'strategic';
    if (ext.includes('customer') || ext.includes('market') || ext.includes('research')) return 'market';
    if (ext.includes('legal') || ext.includes('contract') || ext.includes('terms')) return 'legal';
    return 'general';
  };

  const getDocumentIcon = (filename) => {
    const type = detectDocumentType(filename);
    const icons = {
      financial: DollarSign,
      strategic: Target,
      market: Users,
      legal: BookOpen,
      general: FileText
    };
    return icons[type] || FileText;
  };

  const getDocumentColor = (filename) => {
    const type = detectDocumentType(filename);
    const colors = {
      financial: 'green',
      strategic: 'blue', 
      market: 'purple',
      legal: 'orange',
      general: 'gray'
    };
    return colors[type] || 'gray';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const generateMockAnalysis = (type) => {
    const analyses = {
      financial: {
        summary: 'Document analyzed for financial trends and performance indicators.',
        keyMetrics: {
          growth: { value: '25%', change: '+8%', trend: 'up' },
          efficiency: { value: '82%', change: '+3%', trend: 'up' },
          risk: { value: 'Low', change: '-15%', trend: 'down' }
        },
        risks: ['Market volatility', 'Regulatory changes'],
        opportunities: ['Cost optimization', 'Revenue diversification'],
        recommendations: ['Monitor cash flow closely', 'Hedge against market risks']
      },
      strategic: {
        summary: 'Strategic document reveals key business priorities and growth vectors.',
        keyMetrics: {
          completion: { value: '68%', change: '+12%', trend: 'up' },
          timeline: { value: 'On Track', change: '0%', trend: 'stable' },
          resources: { value: '85%', change: '-5%', trend: 'down' }
        },
        risks: ['Resource constraints', 'Timeline pressures'],
        opportunities: ['Market timing', 'Competitive advantage'],
        recommendations: ['Prioritize high-impact initiatives', 'Secure additional resources']
      },
      market: {
        summary: 'Market analysis shows strong customer sentiment and growth potential.',
        keyMetrics: {
          satisfaction: { value: '4.7/5', change: '+0.2', trend: 'up' },
          retention: { value: '94%', change: '+6%', trend: 'up' },
          growth: { value: '28%', change: '+15%', trend: 'up' }
        },
        risks: ['Competition increase', 'Market saturation'],
        opportunities: ['Geographic expansion', 'Product innovation'],
        recommendations: ['Enhance customer experience', 'Accelerate product development']
      }
    };
    return analyses[type] || analyses.financial;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedDocType === 'all' || doc.type === selectedDocType;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const DocumentTypeStats = () => {
    const typeStats = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(typeStats).map(([type, count]) => (
          <div key={type} className="bg-gray-50 p-2 rounded text-center">
            <div className="text-lg font-bold text-gray-800">{count}</div>
            <div className="text-xs text-gray-600 capitalize">{type}</div>
          </div>
        ))}
      </div>
    );
  };

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Document Intelligence</h3>
              <p className="text-sm text-gray-600">AI-powered document analysis</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-md border-2 border-blue-700 hover:border-blue-800"
            title="Expand Module"
          >
            <Maximize2 className="w-5 h-5 text-white font-bold" />
          </button>
        </div>

        <DocumentTypeStats />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Documents Analyzed</span>
            <span className="font-semibold">{documents.filter(d => d.status === 'analyzed').length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Insights Generated</span>
            <span className="font-semibold">{insights.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Processing</span>
            <span className="font-semibold">{documents.filter(d => d.status === 'analyzing').length}</span>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 text-sm font-bold shadow-md border-2 border-blue-700 hover:border-blue-800"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Upload Documents
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.csv,.json,.txt"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">Document Intelligence</h2>
              <p className="text-blue-100 text-sm">AI-Powered Document Analysis & Insights</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-md border-2 border-white hover:border-blue-100"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Upload
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-md border-2 border-red-700 hover:border-red-800"
              title="Minimize Module"
            >
              <Minimize2 className="w-5 h-5 text-white font-bold" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Controls */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Document Types</option>
                  <option value="financial">Financial</option>
                  <option value="strategic">Strategic</option>
                  <option value="market">Market Research</option>
                  <option value="legal">Legal</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {filteredDocuments.map(doc => {
                const IconComponent = doc.icon;
                return (
                  <div
                    key={doc.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 bg-${doc.color}-100 rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-4 h-4 text-${doc.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size} • {doc.uploadDate}</p>
                        <div className="flex items-center mt-1">
                          {doc.status === 'analyzed' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Analyzed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Processing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Insights Overview */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-900">Key Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              {insights.slice(0, 2).map(insight => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.priority === 'high' 
                      ? 'border-l-red-400 bg-red-50' 
                      : 'border-l-yellow-400 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${
                      insight.priority === 'high' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {insight.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-xs text-gray-600 font-medium">{insight.confidence}% confidence</span>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">{insight.title}</h4>
                  <p className="text-xs text-gray-700 mt-1">{insight.description}</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1">Impact: {insight.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Details */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredDocuments.length > 0 && analyses[filteredDocuments[0]?.id] && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900">Analysis: {filteredDocuments[0].name}</h3>
                  <p className="text-gray-700 text-sm mb-4">{analyses[filteredDocuments[0].id].summary}</p>
                </div>

                {/* Key Metrics */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Key Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(analyses[filteredDocuments[0].id].keyMetrics).map(([key, metric]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize font-medium">{key}</span>
                          {metric.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : metric.trend === 'down' ? (
                            <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                        <div className={`text-xs font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks & Opportunities */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-gray-900">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      Risks
                    </h4>
                    <div className="space-y-2">
                      {analyses[filteredDocuments[0].id].risks.map((risk, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg text-sm text-red-800 border border-red-100">
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-gray-900">
                      <Star className="w-4 h-4 text-green-600 mr-2" />
                      Opportunities
                    </h4>
                    <div className="space-y-2">
                      {analyses[filteredDocuments[0].id].opportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg text-sm text-green-800 border border-green-100">
                          {opportunity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center text-gray-900">
                    <Target className="w-4 h-4 text-blue-600 mr-2" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {analyses[filteredDocuments[0].id].recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                        <p className="text-sm text-blue-800 font-medium">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.csv,.json,.txt,.xlsx"
      />
    </div>
  );
};

export default EnhancedDocumentIntelligence;