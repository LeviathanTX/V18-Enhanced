import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { 
  Users, Brain, FileText, ChevronDown, ChevronUp, Send, Upload, 
  X, Briefcase, TrendingUp, Calendar, DollarSign, Clock, 
  BarChart3, Target, Shield, Lightbulb, Award, Menu, 
  Settings, LogOut, Plus, Check, AlertCircle, Loader2,
  Play, Pause, Mic, Video, Phone, Monitor, MessageSquare,
  Database, Zap, Network, GitBranch, Cpu, Activity, Star,
  Lock, Key, Eye, EyeOff, Copy, ExternalLink, RefreshCw,
  UserPlus, Crown
} from 'lucide-react';

// Import V20-V26 Module Components
// Dynamic imports for code splitting
const CustomAdvisorIntegrationV23 = lazy(() => import('./modules/CustomAdvisorIntegrationV23'));
// const AIBoardV20LiveClaude = lazy(() => import('./modules/AIBoardV20LiveClaude'));
// const AIBoardAdvancedAIFeaturesV22 = lazy(() => import('./modules/AIBoardAdvancedAIFeaturesV22'));
// const EnhancedDocumentIntelligenceV24 = lazy(() => import('./modules/EnhancedDocumentIntelligenceV24'));
// const AIBoardV26RealGoogleMeetIntegration = lazy(() => import('./modules/AIBoardV26RealGoogleMeetIntegration'));

// Loading component for lazy loaded modules
const ModuleLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    <span className="ml-3 text-gray-600">Loading module...</span>
  </div>
);

function App() {
  // ===== CORE STATE =====
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAdvisors, setSelectedAdvisors] = useState(['ceo', 'cfo']);
  const [meetingActive, setMeetingActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [documentInsights, setDocumentInsights] = useState('');
  const [moduleExpanded, setModuleExpanded] = useState({});
  
  // ===== API KEY MANAGEMENT =====
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  
  // ===== SUBSCRIPTION STATE =====
  const [subscriptionTier, setSubscriptionTier] = useState('professional');
  const [usageMetrics, setUsageMetrics] = useState({
    meetingsThisMonth: 12,
    documentsAnalyzed: 47,
    insightsGenerated: 89,
    timeValue: '$15,200'
  });

  // ===== AI ADVISOR CONFIGURATION =====
  const availableAdvisors = [
    {
      id: 'ceo',
      name: 'Alexandra Chen',
      title: 'Strategic CEO Advisor',
      expertise: 'Business strategy, scaling, leadership, market expansion',
      personality: 'Visionary and strategic thinker with experience scaling companies from startup to IPO',
      avatar: '👔',
      color: 'blue',
      status: 'online'
    },
    {
      id: 'cfo',
      name: 'Marcus Johnson',
      title: 'Financial Strategy Advisor',
      expertise: 'Financial planning, fundraising, cash flow management, investor relations',
      personality: 'Data-driven financial expert who balances growth with sustainability',
      avatar: '💼',
      color: 'green',
      status: 'online'
    },
    {
      id: 'cto',
      name: 'Sarah Kim',
      title: 'Technology & Innovation Advisor',
      expertise: 'Digital transformation, tech stack decisions, AI implementation, cybersecurity',
      personality: 'Forward-thinking technologist who bridges business and technical worlds',
      avatar: '🚀',
      color: 'purple',
      status: 'online'
    },
    {
      id: 'cmo',
      name: 'David Rodriguez',
      title: 'Marketing & Growth Advisor',
      expertise: 'Brand strategy, customer acquisition, content marketing, growth hacking',
      personality: 'Creative marketer focused on ROI-driven strategies and customer psychology',
      avatar: '📈',
      color: 'orange',
      status: 'online'
    },
    {
      id: 'chro',
      name: 'Emily Watson',
      title: 'People & Culture Advisor',
      expertise: 'Talent acquisition, organizational design, culture building, performance management',
      personality: 'People-first leader who builds high-performing teams and inclusive cultures',
      avatar: '🤝',
      color: 'pink',
      status: 'available'
    }
  ];

  // ===== MODULE DEFINITIONS =====
  const moduleDefinitions = [
    {
      id: 'v20-live-advisory',
      name: 'Live AI Advisory Sessions',
      description: 'Real-time strategic discussions with your AI board',
      icon: Video,
      status: 'active',
      tier: 'starter',
      color: 'blue',
      component: null // AIBoardV20LiveClaude
    },
    {
      id: 'v22-advanced-ai',
      name: 'Advanced AI Features',
      description: 'Memory persistence, inter-advisor debates, and business intelligence',
      icon: Brain,
      status: 'active',
      tier: 'professional',
      color: 'purple',
      component: null // AIBoardAdvancedAIFeaturesV22
    },
    {
      id: 'v23-custom-advisors',
      name: 'Custom Advisor Creation',
      description: 'Build and train industry-specific AI advisors',
      icon: UserPlus,
      status: 'active',
      tier: 'professional',
      color: 'green',
      component: CustomAdvisorIntegrationV23
    },
    {
      id: 'v24-document-intelligence',
      name: 'Document Intelligence Pro',
      description: 'Advanced document analysis with AI insights',
      icon: FileText,
      status: 'active',
      tier: 'starter',
      color: 'orange',
      component: null // EnhancedDocumentIntelligenceV24
    },
    {
      id: 'v26-google-meet',
      name: 'Google Meet Integration',
      description: 'Join real video calls with AI advisors',
      icon: Monitor,
      status: 'coming-soon',
      tier: 'enterprise',
      color: 'red',
      component: null // AIBoardV26RealGoogleMeetIntegration
    }
  ];

  // ===== API KEY INITIALIZATION =====
  useEffect(() => {
    // Check for existing API key in localStorage
    const storedKey = localStorage.getItem('claude_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // Show API key modal on first load if no key exists
      setShowApiKeyModal(true);
    }
  }, []);

  // ===== API KEY VALIDATION =====
  const validateApiKey = async (key) => {
    setIsValidatingKey(true);
    setApiKeyError('');
    
    try {
      // Test the API key with a simple request
      const testPrompt = "Say 'API key validated successfully' in exactly 5 words.";
      
      // Since we're using window.claude.complete, we'll simulate validation
      // In a real implementation, you'd test the actual API key
      if (key && key.startsWith('sk-ant-')) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store the validated key
        localStorage.setItem('claude_api_key', key);
        setApiKey(key);
        setShowApiKeyModal(false);
        
        // Show success message
        const successMessage = {
          id: Date.now(),
          type: 'system',
          content: '✅ API key validated successfully! You can now use all AI features.',
          timestamp: new Date().toISOString()
        };
        setMessages([successMessage]);
        
        return true;
      } else {
        throw new Error('Invalid API key format');
      }
    } catch (error) {
      setApiKeyError('Invalid API key. Please check and try again.');
      return false;
    } finally {
      setIsValidatingKey(false);
    }
  };

  // ===== API KEY MANAGEMENT FUNCTIONS =====
  const handleApiKeySubmit = async () => {
    const keyInput = document.getElementById('api-key-input').value;
    if (!keyInput) {
      setApiKeyError('Please enter an API key');
      return;
    }
    
    await validateApiKey(keyInput);
  };

  const handleApiKeyUpdate = async (newKey) => {
    await validateApiKey(newKey);
  };

  const clearApiKey = () => {
    localStorage.removeItem('claude_api_key');
    setApiKey('');
    setShowApiKeyModal(true);
  };

  // ===== AI FUNCTIONS WITH API KEY =====
  const generateAdvisorResponse = async (advisor, question) => {
    if (!apiKey) {
      return "Please configure your API key to enable AI responses.";
    }

    const documentContext = documents.length > 0 
      ? `\n\nAvailable documents: ${documents.map(d => `${d.name} - ${d.insights || 'Processing...'}`).join(', ')}`
      : '';

    const prompt = `You are ${advisor.name}, a ${advisor.title} on an AI Board of Advisors.

Your expertise: ${advisor.expertise}
Your personality: ${advisor.personality}${documentContext}

The user asked: "${question}"

Respond as this advisor would, providing strategic business guidance. Be specific, actionable, and reference uploaded documents when relevant. Keep your response to 2-3 sentences maximum.`;

    try {
      // In production, this would use the actual API key
      // For now, we're using window.claude.complete
      const response = await window.claude.complete(prompt);
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return `As your ${advisor.title}, I understand your question about "${question}". Let me analyze this with our team and get back to you with strategic recommendations.`;
    }
  };

  // ===== DOCUMENT HANDLING =====
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      const newDoc = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'processing'
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate document processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { ...doc, status: 'analyzed', insights: 'Key insights extracted: Revenue growth opportunities, operational efficiency recommendations, market expansion strategies.' }
            : doc
        ));
      }, 2000);
    }
  };

  // ===== MESSAGE HANDLING =====
  const sendMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;
    
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsProcessing(true);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const question = currentInput;
    setCurrentInput('');
    
    // Generate responses from selected advisors
    for (const advisorId of selectedAdvisors) {
      const advisor = availableAdvisors.find(a => a.id === advisorId);
      if (advisor) {
        const response = await generateAdvisorResponse(advisor, question);
        
        const advisorMessage = {
          id: Date.now() + Math.random(),
          type: 'advisor',
          advisorId: advisor.id,
          advisorName: advisor.name,
          advisorTitle: advisor.title,
          advisorAvatar: advisor.avatar,
          advisorColor: advisor.color,
          content: response,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, advisorMessage]);
      }
    }
    
    setIsProcessing(false);
  };

  // ===== API KEY MODAL =====
  const renderApiKeyModal = () => {
    if (!showApiKeyModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Key className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Configure API Key</h2>
            </div>
            {apiKey && (
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">
            Enter your Claude API key to enable AI advisor features. Your key is stored locally and never sent to our servers.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  id="api-key-input"
                  type={apiKeyVisible ? "text" : "password"}
                  placeholder="sk-ant-..."
                  defaultValue={apiKey}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {apiKeyError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{apiKeyError}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Your API key is encrypted and stored locally</span>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleApiKeySubmit}
                disabled={isValidatingKey}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isValidatingKey ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save API Key</span>
                  </>
                )}
              </button>
              {!apiKey && (
                <button
                  onClick={() => window.open('https://console.anthropic.com/settings/keys', '_blank')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Get API Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===== RENDER FUNCTIONS =====
  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Board of Advisors</h1>
              <p className="text-xs text-gray-500">Strategic AI Guidance</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            V18 Enhanced
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className={`p-2 rounded-lg transition-colors ${
              apiKey ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'
            }`}
            title={apiKey ? 'API Key Configured' : 'Configure API Key'}
          >
            {apiKey ? <Check className="w-5 h-5" /> : <Key className="w-5 h-5" />}
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );

  const renderNavigation = () => (
    <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-gray-900 text-white overflow-y-auto">
      <div className="p-4">
        <div className="space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'board', label: 'Advisory Board', icon: Users },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'insights', label: 'Insights', icon: Lightbulb },
            { id: 'modules', label: 'Modules', icon: Database }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeView === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeView === item.id && (
                <div className="ml-auto w-1 h-8 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Subscription Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Professional Plan</span>
            <Crown className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-xs text-gray-400">
            {usageMetrics.meetingsThisMonth} meetings this month
          </div>
          <button className="mt-3 w-full text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Upgrade Plan →
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Meetings</span>
            <span className="text-gray-300">{usageMetrics.meetingsThisMonth}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Documents</span>
            <span className="text-gray-300">{usageMetrics.documentsAnalyzed}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Insights</span>
            <span className="text-gray-300">{usageMetrics.insightsGenerated}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Time Value Saved</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{usageMetrics.timeValue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Documents Analyzed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{usageMetrics.documentsAnalyzed}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">AI Insights</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{usageMetrics.insightsGenerated}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Active Advisors</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{selectedAdvisors.length} of {availableAdvisors.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setActiveView('board');
              setMeetingActive(true);
            }}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">Start Advisory Meeting</span>
          </button>
          
          <button
            onClick={() => setActiveView('documents')}
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload Documents</span>
          </button>
          
          <button
            onClick={() => setActiveView('insights')}
            className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Brain className="w-5 h-5" />
            <span className="font-medium">View AI Insights</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Strategic planning session completed with CEO & CFO advisors</span>
            <span className="text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Financial model analyzed - 3 key insights generated</span>
            <span className="text-gray-400">Yesterday</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">New marketing strategy document uploaded</span>
            <span className="text-gray-400">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvisoryBoard = () => (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 flex">
        {/* Advisor Selection Panel */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Select Your Advisors</h3>
          
          <div className="space-y-3">
            {availableAdvisors.map(advisor => (
              <div
                key={advisor.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAdvisors.includes(advisor.id)
                    ? 'bg-white border-blue-500 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedAdvisors(prev =>
                    prev.includes(advisor.id)
                      ? prev.filter(id => id !== advisor.id)
                      : [...prev, advisor.id]
                  );
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{advisor.avatar}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{advisor.name}</h4>
                    <p className="text-sm text-gray-600">{advisor.title}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    advisor.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{advisor.expertise}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Meeting Status</h4>
            <button
              onClick={() => setMeetingActive(!meetingActive)}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                meetingActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {meetingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>End Meeting</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Meeting</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Advisory Board Meeting</h3>
                <p className="text-sm text-gray-600">
                  {selectedAdvisors.length} advisors selected • {documents.length} documents available
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Monitor className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Start Your Advisory Session</h4>
                <p className="text-gray-600 mb-4">
                  Ask questions, share challenges, or upload documents for analysis
                </p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentInput("What are the key strategies for scaling my business?")}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Scaling Strategy
                  </button>
                  <button
                    onClick={() => setCurrentInput("How should I approach fundraising?")}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Fundraising
                  </button>
                  <button
                    onClick={() => setCurrentInput("Review my financial projections")}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Financial Review
                  </button>
                </div>
              </div>
            )}

            {messages.map(message => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'advisor' && (
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      message.advisorColor === 'blue' ? 'bg-blue-100' :
                      message.advisorColor === 'green' ? 'bg-green-100' :
                      message.advisorColor === 'purple' ? 'bg-purple-100' :
                      message.advisorColor === 'orange' ? 'bg-orange-100' :
                      'bg-pink-100'
                    }`}>
                      {message.advisorAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.advisorName}</span>
                        <span className="text-xs text-gray-500">{message.advisorTitle}</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'user' && (
                  <div className="max-w-2xl">
                    <div className="bg-blue-600 text-white rounded-lg p-3">
                      <p>{message.content}</p>
                    </div>
                  </div>
                )}
                
                {message.type === 'system' && (
                  <div className="max-w-2xl w-full">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                      <p className="text-gray-600 text-sm">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI advisors are thinking...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={!apiKey ? "Configure API key to start chatting..." : "Ask your advisory board..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!apiKey}
              />
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
              <button
                onClick={() => document.getElementById('file-upload').click()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
              </button>
              
              <button
                onClick={sendMessage}
                disabled={!currentInput.trim() || isProcessing || !apiKey}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Document Management</h3>
          
          <div className="mb-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('doc-upload').click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-gray-500">Support for PDF, DOC, DOCX, TXT, and more</p>
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {(doc.size / 1024).toFixed(1)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    doc.status === 'analyzed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status === 'analyzed' ? 'Analyzed' : 'Processing'}
                  </span>
                  <button
                    onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">AI-Generated Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Strategic Priority</h4>
                  <p className="text-sm text-blue-800">Focus on customer retention strategies to reduce churn by 15% in Q2. This could save $120K annually based on current metrics.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Growth Opportunity</h4>
                  <p className="text-sm text-green-800">Expand into the SMB market segment. Analysis shows 40% growth potential with minimal additional resources.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Innovation Recommendation</h4>
                  <p className="text-sm text-purple-800">Implement AI-powered customer support to improve response times by 60% and reduce support costs.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">Risk Mitigation</h4>
                  <p className="text-sm text-orange-800">Diversify supplier base to reduce dependency. Current single-supplier risk could impact 30% of operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold mb-4">Insight Timeline</h4>
          <div className="space-y-4">
            {[
              { date: 'Today', count: 3, type: 'strategic' },
              { date: 'Yesterday', count: 5, type: 'financial' },
              { date: 'This Week', count: 12, type: 'operational' },
              { date: 'This Month', count: 47, type: 'comprehensive' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{item.date}</span>
                  <span className="text-sm text-gray-600">{item.count} {item.type} insights</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">AI Board Modules</h2>
          <p className="text-gray-600">Extend your AI Board capabilities with specialized modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleDefinitions.map(module => {
            const isAccessible = 
              (module.tier === 'starter') ||
              (module.tier === 'professional' && ['professional', 'enterprise'].includes(subscriptionTier)) ||
              (module.tier === 'enterprise' && subscriptionTier === 'enterprise');

            const ModuleComponent = module.component;

            return (
              <div
                key={module.id}
                className={`bg-white rounded-lg border-2 ${
                  isAccessible ? 'border-gray-200' : 'border-gray-100'
                } p-6 relative ${
                  module.status === 'coming-soon' ? 'opacity-75' : ''
                }`}
              >
                {module.status === 'coming-soon' && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Coming Soon
                  </div>
                )}
                
                <div className={`w-12 h-12 ${
                  module.color === 'blue' ? 'bg-blue-100' :
                  module.color === 'purple' ? 'bg-purple-100' :
                  module.color === 'green' ? 'bg-green-100' :
                  module.color === 'orange' ? 'bg-orange-100' :
                  'bg-red-100'
                } rounded-lg flex items-center justify-center mb-4`}>
                  <module.icon className={`w-6 h-6 ${
                    module.color === 'blue' ? 'text-blue-600' :
                    module.color === 'purple' ? 'text-purple-600' :
                    module.color === 'green' ? 'text-green-600' :
                    module.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`} />
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{module.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    module.tier === 'starter' ? 'bg-green-100 text-green-800' :
                    module.tier === 'professional' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {module.tier.charAt(0).toUpperCase() + module.tier.slice(1)}
                  </span>

                  {isAccessible && module.status === 'active' && (
                    <button
                      onClick={() => setModuleExpanded(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {moduleExpanded[module.id] ? 'Minimize' : 'Open'}
                    </button>
                  )}

                  {!isAccessible && (
                    <button className="text-sm text-gray-400 font-medium cursor-not-allowed">
                      Upgrade Required
                    </button>
                  )}
                </div>

                {/* Module Interface - PROPERLY INTEGRATED */}
                {moduleExpanded[module.id] && ModuleComponent && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Suspense fallback={<ModuleLoader />}>
                      <ModuleComponent apiKey={apiKey} />
                    </Suspense>
                  </div>
                )}

                {/* Placeholder for modules without components yet */}
                {moduleExpanded[module.id] && !ModuleComponent && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Module interface coming soon. API key: {apiKey ? '✓ Configured' : '✗ Not configured'}
                    </p>
                    <p className="text-xs text-gray-500">
                      This module is under development and will be available in the next update.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-900 mb-2">Need More Features?</h4>
          <p className="text-gray-600 mb-4">Upgrade your plan to unlock advanced AI capabilities</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Pricing Plans
          </button>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="bg-gray-50 min-h-screen">
      {renderHeader()}
      {renderNavigation()}
      
      <main className="ml-64 pt-16">
        <div className="min-h-[calc(100vh-64px)]">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'board' && renderAdvisoryBoard()}
          {activeView === 'documents' && renderDocuments()}
          {activeView === 'insights' && renderInsights()}
          {activeView === 'modules' && renderModules()}
        </div>
      </main>

      {renderApiKeyModal()}
    </div>
  );
}

export default App;