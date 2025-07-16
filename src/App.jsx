import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Users, Brain, FileText, MessageSquare, Video, Settings, Maximize2, Minimize2,
  Loader2, CheckCircle, AlertCircle, Plus, Trash2, Upload, Download, Share2,
  BarChart3, TrendingUp, Clock, Target, Star, Zap, Crown, Shield, Award,
  UserPlus, Database, Network, Activity, Globe2, Mic, Camera, Phone,
  ChevronUp, ChevronDown, Send, MoreHorizontal, Filter, Search, RefreshCw,
  Briefcase, DollarSign, Lightbulb, Eye, PlayCircle, Pause, Volume2, VolumeX
} from 'lucide-react';

// Import the Document Intelligence Module
import DocumentIntelligenceModule from './modules/DocumentIntelligenceModule';

// ===== AI BOARD V18 ENHANCED - WITH INTEGRATED DOCUMENT INTELLIGENCE =====
function App() {
  // ===== CORE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Advisory Board State
  const [selectedAdvisors, setSelectedAdvisors] = useState(['ceo', 'cfo']);
  const [meetingActive, setMeetingActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [documents, setDocuments] = useState([]);
  const [meetingTopic, setMeetingTopic] = useState('');
  
  // Module Integration State
  const [installedModules, setInstalledModules] = useState(new Map());
  const [moduleStatuses, setModuleStatuses] = useState(new Map());
  const [integrationHealth, setIntegrationHealth] = useState('excellent');
  const [documentInsights, setDocumentInsights] = useState([]);
  
  // Subscription & Business State
  const [subscriptionTier, setSubscriptionTier] = useState('professional');
  const [usageMetrics, setUsageMetrics] = useState({
    meetingsThisMonth: 12,
    documentsAnalyzed: 47,
    insightsGenerated: 89,
    timeValue: '$15,200'
  });

  // ===== AI ADVISORS CONFIGURATION =====
  const availableAdvisors = [
    {
      id: 'ceo',
      name: 'Strategic CEO',
      title: 'Chief Executive Officer',
      avatar: '👔',
      color: 'blue',
      expertise: 'Strategic Planning, Leadership, M&A, Vision',
      personality: 'Visionary, decisive, big-picture focused',
      status: 'online'
    },
    {
      id: 'cfo',
      name: 'Financial CFO',
      title: 'Chief Financial Officer', 
      avatar: '📊',
      color: 'green',
      expertise: 'Financial Analysis, Budgeting, Risk Management, Funding',
      personality: 'Analytical, detail-oriented, risk-aware',
      status: 'online'
    },
    {
      id: 'cto',
      name: 'Technical CTO',
      title: 'Chief Technology Officer',
      avatar: '💻',
      color: 'purple',
      expertise: 'Technology Strategy, Architecture, Innovation, Security',
      personality: 'Innovative, technical, forward-thinking',
      status: 'online'
    },
    {
      id: 'marketing',
      name: 'Marketing Director',
      title: 'Chief Marketing Officer',
      avatar: '🎯',
      color: 'pink',
      expertise: 'Brand Strategy, Customer Acquisition, Market Research',
      personality: 'Creative, data-driven, customer-focused',
      status: 'online'
    },
    {
      id: 'legal',
      name: 'Legal Counsel',
      title: 'General Counsel',
      avatar: '⚖️',
      color: 'gray',
      expertise: 'Corporate Law, Compliance, Risk Management, Contracts',
      personality: 'Thorough, cautious, detail-oriented',
      status: 'available'
    },
    {
      id: 'hr',
      name: 'People Director',
      title: 'Chief People Officer',
      avatar: '👥',
      color: 'orange',
      expertise: 'Talent Strategy, Culture, Leadership Development',
      personality: 'Empathetic, strategic, people-focused',
      status: 'available'
    }
  ];

  // ===== MODULE DEFINITIONS =====
  const coreModules = [
    {
      id: 'v20-live-advisory',
      name: 'Live Advisory Sessions',
      icon: MessageSquare,
      status: 'active',
      description: 'Real-time AI advisory conversations',
      tier: 'starter'
    },
    {
      id: 'v21-document-intelligence',
      name: 'Document Intelligence',
      icon: FileText,
      status: 'active', 
      description: 'Advanced document analysis & insights',
      tier: 'professional',
      component: DocumentIntelligenceModule
    },
    {
      id: 'v22-advanced-ai',
      name: 'Advanced AI Features',
      icon: Brain,
      status: 'active',
      description: 'Enhanced AI capabilities & memory',
      tier: 'professional'
    },
    {
      id: 'v23-custom-advisors',
      name: 'Custom Advisors',
      icon: UserPlus,
      status: 'installed',
      description: 'Create custom AI advisors',
      tier: 'enterprise'
    },
    {
      id: 'v24-business-intelligence',
      name: 'Business Intelligence',
      icon: BarChart3,
      status: 'installed',
      description: 'Advanced analytics & KPI tracking',
      tier: 'professional'
    },
    {
      id: 'v25-integration-hub',
      name: 'Integration Hub',
      icon: Network,
      status: 'available',
      description: 'Third-party platform integrations',
      tier: 'enterprise'
    },
    {
      id: 'v26-google-meet',
      name: 'Google Meet Integration',
      icon: Video,
      status: 'available',
      description: 'Live video advisory sessions',
      tier: 'enterprise'
    }
  ];

  // ===== INITIALIZATION =====
  useEffect(() => {
    initializeSampleData();
    initializeModules();
  }, []);

  const initializeSampleData = () => {
    const sampleMessages = [
      {
        id: 'msg-1',
        type: 'advisor',
        advisorId: 'ceo',
        content: 'Welcome to your AI Advisory Board session. I\'ve reviewed your Q4 financial reports and I\'m ready to discuss strategic planning for 2025.',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 'msg-2', 
        type: 'advisor',
        advisorId: 'cfo',
        content: 'I agree with the CEO. The 23% revenue growth is excellent, but I\'d like to discuss our cash flow optimization strategies and potential funding scenarios.',
        timestamp: new Date(Date.now() - 240000).toISOString()
      }
    ];
    setMessages(sampleMessages);
    
    const sampleDocs = [
      {
        id: 'doc-1',
        name: 'Q4 2024 Financial Report.pdf',
        type: 'application/pdf',
        size: 2.4 * 1024 * 1024,
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'analyzed',
        insights: 'Revenue growth 23% YoY, strong market position'
      },
      {
        id: 'doc-2',
        name: 'Market Analysis 2025.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1.8 * 1024 * 1024,
        uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'analyzed',
        insights: 'TAM expansion opportunity 40%, key growth vectors identified'
      }
    ];
    setDocuments(sampleDocs);
  };

  const initializeModules = () => {
    const moduleMap = new Map();
    const statusMap = new Map();
    
    coreModules.forEach(module => {
      moduleMap.set(module.id, module);
      statusMap.set(module.id, {
        lastSync: new Date().toISOString(),
        health: 'good',
        performance: Math.floor(Math.random() * 20) + 80
      });
    });
    
    setInstalledModules(moduleMap);
    setModuleStatuses(statusMap);
  };

  // ===== DOCUMENT INTELLIGENCE INTEGRATION =====
  const handleDocumentInsight = (insight) => {
    setDocumentInsights(prev => [...prev, insight]);
    
    // Notify advisors about new document insights
    if (meetingActive && insight.insights && insight.insights.length > 0) {
      const insightMessage = {
        id: `msg-insight-${Date.now()}`,
        type: 'system',
        content: `📄 Document analyzed: ${insight.insights[0]}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, insightMessage]);
    }
  };

  // ===== AI ADVISORY FUNCTIONS =====
  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    setIsProcessing(true);
    const userMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const question = currentInput.trim();
    setCurrentInput('');
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate responses from selected advisors
      for (const advisorId of selectedAdvisors) {
        const advisor = availableAdvisors.find(a => a.id === advisorId);
        if (advisor) {
          const response = await generateAdvisorResponse(advisor, question);
          const advisorMessage = {
            id: `msg-${Date.now()}-${advisorId}`,
            type: 'advisor',
            advisorId: advisorId,
            content: response,
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, advisorMessage]);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Message processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAdvisorResponse = async (advisor, question) => {
    try {
      // Include document insights in context
      const recentInsights = documentInsights.slice(-3).map(i => i.insights).flat().join('; ');
      
      // Use Claude's completion API for realistic advisor responses
      const prompt = `You are ${advisor.name}, a ${advisor.title} on an AI Board of Advisors. 

Your expertise: ${advisor.expertise}
Your personality: ${advisor.personality}
Documents available: ${documents.map(d => d.name).join(', ')}
Recent document insights: ${recentInsights || 'None yet'}

The user asked: "${question}"

Respond as this advisor would, providing strategic business guidance. Be specific, actionable, and reference the uploaded documents and insights when relevant. Keep your response to 2-3 sentences maximum.`;

      const response = await window.claude.complete(prompt);
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return `As your ${advisor.title}, I understand your question about "${question}". Let me analyze this with our team and get back to you with strategic recommendations.`;
    }
  };

  const startAdvisoryMeeting = () => {
    setMeetingActive(true);
    setMeetingTopic('Strategic Planning Session');
    
    // Add meeting start message
    const startMessage = {
      id: `msg-start-${Date.now()}`,
      type: 'system',
      content: `Advisory meeting started with ${selectedAdvisors.length} advisors. Topic: ${meetingTopic}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, startMessage]);
  };

  const toggleAdvisor = (advisorId) => {
    setSelectedAdvisors(prev => 
      prev.includes(advisorId) 
        ? prev.filter(id => id !== advisorId)
        : [...prev, advisorId]
    );
  };

  // ===== FILE HANDLING =====
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    for (const file of files) {
      const newDoc = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'processing'
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate document processing
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, status: 'analyzed', insights: 'Document analysis complete - key insights extracted' }
              : doc
          )
        );
      }, 2000);
    }
    
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ===== RENDER FUNCTIONS =====
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Meetings This Month</p>
              <p className="text-2xl font-bold text-blue-900">{usageMetrics.meetingsThisMonth}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Documents Analyzed</p>
              <p className="text-2xl font-bold text-green-900">{usageMetrics.documentsAnalyzed}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Insights Generated</p>
              <p className="text-2xl font-bold text-purple-900">{usageMetrics.insightsGenerated}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Time Value Saved</p>
              <p className="text-2xl font-bold text-orange-900">{usageMetrics.timeValue}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* AI Advisory Board Quick Access */}
      <div className="bg-white rounded-lg border-2 border-gray-300 shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-600" />
                <Crown className="w-5 h-5 text-purple-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Advisory Board</h3>
                <p className="text-sm text-gray-600">Your strategic decision-making team</p>
              </div>
            </div>
            
            <button
              onClick={() => setActiveView('advisory')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Advisory Session →
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <h4 className="font-semibold text-gray-800">Active Advisors:</h4>
            <div className="flex space-x-2">
              {selectedAdvisors.map(advisorId => {
                const advisor = availableAdvisors.find(a => a.id === advisorId);
                return (
                  <div key={advisorId} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-lg">{advisor?.avatar}</span>
                    <span className="text-sm font-medium">{advisor?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Recent Documents</h5>
              {documents.slice(0, 3).map(doc => (
                <div key={doc.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.status}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Quick Actions</h5>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveView('advisory')}
                  className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-blue-700">📋 Strategic Planning Session</span>
                </button>
                <button
                  onClick={() => setActiveView('advisory')}
                  className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-green-700">💰 Financial Review</span>
                </button>
                <button
                  onClick={() => setActiveView('advisory')}
                  className="w-full text-left p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-purple-700">🚀 Growth Strategy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Intelligence Module Integration */}
      <DocumentIntelligenceModule
        onIntegrationReady={() => console.log('Document Intelligence Module Ready')}
        selectedAdvisors={selectedAdvisors}
        meetingActive={meetingActive}
        onDocumentInsight={handleDocumentInsight}
      />

      {/* Module Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreModules.map(module => {
          const status = moduleStatuses.get(module.id);
          const IconComponent = module.icon;
          
          return (
            <div key={module.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{module.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.status === 'active' ? 'bg-green-100 text-green-800' :
                  module.status === 'installed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {module.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{module.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{module.tier}</span>
                {status && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-gray-600">{status.performance}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAdvisoryBoard = () => (
    <div className="space-y-6">
      {/* Advisor Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Your Advisory Team</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedAdvisors.length} selected</span>
            <button
              onClick={startAdvisoryMeeting}
              disabled={selectedAdvisors.length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedAdvisors.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {meetingActive ? 'Meeting Active' : 'Start Meeting'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableAdvisors.map(advisor => (
            <div
              key={advisor.id}
              onClick={() => toggleAdvisor(advisor.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAdvisors.includes(advisor.id)
                  ? `border-${advisor.color}-500 bg-${advisor.color}-50`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{advisor.avatar}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{advisor.name}</h4>
                  <p className="text-sm text-gray-600">{advisor.title}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  advisor.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{advisor.expertise}</p>
              <p className="text-xs text-gray-500">{advisor.personality}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Document Intelligence Module for Advisory View */}
      <DocumentIntelligenceModule
        onIntegrationReady={() => console.log('Document Intelligence Module Ready')}
        selectedAdvisors={selectedAdvisors}
        meetingActive={meetingActive}
        onDocumentInsight={handleDocumentInsight}
      />

      {/* Advisory Chat Interface */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Advisory Discussion</h3>
            <div className="flex items-center space-x-2">
              {meetingActive && (
                <span className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Session</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map(message => {
            if (message.type === 'system') {
              return (
                <div key={message.id} className="text-center">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              );
            }
            
            if (message.type === 'user') {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs lg:max-w-md">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            }
            
            const advisor = availableAdvisors.find(a => a.id === message.advisorId);
            return (
              <div key={message.id} className="flex items-start space-x-3">
                <span className="text-xl">{advisor?.avatar}</span>
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{advisor?.name}</span>
                      <span className="text-xs text-gray-500">{advisor?.title}</span>
                    </div>
                    <p className="text-sm text-gray-800">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          
          {isProcessing && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Advisors are responding...</span>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your advisory board anything..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isProcessing}
              className={`px-4 py-3 rounded-lg transition-colors ${
                currentInput.trim() && !isProcessing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className={`bg-gray-50 min-h-screen transition-all duration-300 ${
      isExpanded ? 'p-2' : 'p-4'
    }`}>
      <div className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'h-[calc(100vh-1rem)]' : 'min-h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-yellow-300" />
              <Shield className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Board of Advisors</h1>
              <p className="text-blue-100">V18 Enhanced - Executive Intelligence Platform</p>
            </div>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full">
                {subscriptionTier.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-green-500 text-green-900 text-xs font-bold rounded-full">
                {integrationHealth.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Navigation */}
            <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'dashboard' 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('advisory')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'advisory' 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Advisory Board
              </button>
            </div>
            
            {/* Expand/Minimize */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              aria-label={isExpanded ? "Minimize platform" : "Expand platform"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isExpanded ? 'Exit Fullscreen' : 'Fullscreen'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${isExpanded ? 'h-[calc(100vh-8rem)]' : 'h-auto'} overflow-y-auto`}>
          <div className="p-6">
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'advisory' && renderAdvisoryBoard()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>V18 Enhanced Core Shell</span>
              <span>•</span>
              <span>{coreModules.filter(m => m.status === 'active').length} Active Modules</span>
              <span>•</span>
              <span>Last Sync: {new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;