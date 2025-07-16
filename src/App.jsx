import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, Database, Cpu, Shield, Plus, User, X, Puzzle, Grid3X3,
  BarChart3, FileText, Users, Video, Target, Clock, Hash, Zap,
  Settings, Bell, Menu, CheckCircle, AlertCircle, Layers, Star,
  TrendingUp, Activity, Award, Briefcase, Network, Gauge, Eye,
  EyeOff, Maximize2, Minimize2, RotateCcw, Download, Share2,
  ChevronDown, ChevronRight, Search, Filter, MoreVertical,
  ExternalLink, Copy, Edit3, Trash2, UserPlus, Mail, Phone, Crown,
  Command, Home, MessageSquare, Calendar, Archive, BookOpen,
  Sparkles, Monitor, Workflow, LineChart, PieChart, Globe, ChevronLeft,
  Send, Upload, Loader2, DollarSign, Play, Pause, Lightbulb
} from 'lucide-react';

// ===== AI BOARD V20 LIVE CLAUDE MODULE =====
const AIBoardV20LiveClaude = ({ isExpanded, crossModuleContext, onContextUpdate }) => {
  // ===== MODULE STATE =====
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAdvisors, setProcessingAdvisors] = useState(new Set());
  const [selectedAdvisors, setSelectedAdvisors] = useState(new Set(['ceo-advisor', 'cfo-advisor']));
  const [meetingActive, setMeetingActive] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ===== AI ADVISORS CONFIGURATION =====
  const advisors = {
    'ceo-advisor': {
      id: 'ceo-advisor',
      name: 'Alexandra Chen',
      role: 'CEO & Strategy Advisor',
      expertise: 'Strategic Leadership, Business Development, Fundraising',
      avatar: '👩‍💼',
      color: 'blue',
      personality: 'Visionary leader with 15+ years scaling companies. Direct but supportive.',
      systemPrompt: `You are Alexandra Chen, CEO and Strategy Advisor. You're a visionary leader with 15+ years scaling companies. Be direct but supportive, focus on long-term value creation. Keep responses concise (2-3 paragraphs).`
    },
    'cfo-advisor': {
      id: 'cfo-advisor',
      name: 'Marcus Thompson',
      role: 'CFO & Financial Advisor',
      expertise: 'Financial Planning, Unit Economics, Cash Flow Management',
      avatar: '💰',
      color: 'green',
      personality: 'Numbers-focused, asks tough financial questions. Always thinking about runway.',
      systemPrompt: `You are Marcus Thompson, CFO and Financial Advisor. Focus on financial metrics, unit economics, and cash flow. Be pragmatic and data-driven. Keep responses practical (2-3 paragraphs).`
    },
    'cto-advisor': {
      id: 'cto-advisor',
      name: 'Dr. Aisha Patel',
      role: 'CTO & Technology Advisor',
      expertise: 'Technical Architecture, AI/ML, Product Development',
      avatar: '⚡',
      color: 'purple',
      personality: 'Technical visionary who balances innovation with practical implementation.',
      systemPrompt: `You are Dr. Aisha Patel, CTO and Technology Advisor. Balance innovation with practical implementation. Focus on scalable solutions and emerging tech. Keep responses technically informed but accessible (2-3 paragraphs).`
    },
    'cmo-advisor': {
      id: 'cmo-advisor',
      name: 'Sarah Williams',
      role: 'CMO & Marketing Advisor',
      expertise: 'Marketing Strategy, Customer Acquisition, Brand Development',
      avatar: '📈',
      color: 'pink',
      personality: 'Growth-focused marketer with deep customer insights.',
      systemPrompt: `You are Sarah Williams, CMO and Marketing Advisor. Focus on marketing strategy, customer acquisition, and brand building. Be data-driven but creative. Keep responses actionable (2-3 paragraphs).`
    }
  };

  // ===== USE SHARED CONTEXT =====
  useEffect(() => {
    // Check for documents from V24
    const sharedDocs = crossModuleContext.get('v24_documents');
    if (sharedDocs && sharedDocs.length > 0) {
      // Auto-start meeting if documents are loaded
      setMeetingActive(true);
    }
  }, [crossModuleContext]);

  // ===== AI RESPONSE GENERATION =====
  const generateAdvisorResponse = async (advisor, question, documents = []) => {
    if (!window.claude) {
      return "I'm currently unable to connect to the AI service. Please ensure Claude API is available.";
    }

    try {
      // Include document context if available
      const docContext = documents.length > 0 
        ? `\n\nAvailable documents: ${documents.map(d => d.name).join(', ')}`
        : '';

      const prompt = `${advisor.systemPrompt}

User Question: "${question}"${docContext}

Provide strategic advice as ${advisor.name}.`;

      const response = await window.claude.complete(prompt);
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again.";
    }
  };

  // ===== MESSAGE HANDLING =====
  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage = {
      id: Date.now(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    // Get documents from context
    const documents = crossModuleContext.get('v24_documents') || [];

    // Generate responses from selected advisors
    const advisorResponses = await Promise.all(
      Array.from(selectedAdvisors).map(async (advisorId) => {
        setProcessingAdvisors(prev => new Set(prev).add(advisorId));
        
        const advisor = advisors[advisorId];
        const response = await generateAdvisorResponse(advisor, currentInput, documents);
        
        setProcessingAdvisors(prev => {
          const newSet = new Set(prev);
          newSet.delete(advisorId);
          return newSet;
        });

        return {
          id: Date.now() + Math.random(),
          content: response,
          sender: advisorId,
          advisor: advisor,
          timestamp: new Date().toISOString()
        };
      })
    );

    setMessages(prev => [...prev, ...advisorResponses]);
    setIsProcessing(false);

    // Update context for other modules
    onContextUpdate(prev => {
      const newContext = new Map(prev);
      newContext.set('v20_last_question', currentInput);
      newContext.set('v20_advisor_responses', advisorResponses);
      return newContext;
    });
  };

  // ===== FILE HANDLING =====
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Forward to V24 Document Intelligence
      onContextUpdate(prev => {
        const newContext = new Map(prev);
        newContext.set('v20_uploaded_files', Array.from(files));
        return newContext;
      });
    }
  };

  // ===== UI RENDER =====
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Advisory Board Meeting</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time strategic conversations with your AI advisors</p>
          </div>
          <div className="flex items-center space-x-3">
            {meetingActive ? (
              <button 
                onClick={() => setMeetingActive(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>End Meeting</span>
              </button>
            ) : (
              <button 
                onClick={() => setMeetingActive(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Meeting</span>
              </button>
            )}
          </div>
        </div>

        {/* Advisor Selection */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Select Your Advisors:</div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(advisors).map(advisor => (
              <button
                key={advisor.id}
                onClick={() => {
                  setSelectedAdvisors(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(advisor.id)) {
                      newSet.delete(advisor.id);
                    } else {
                      newSet.add(advisor.id);
                    }
                    return newSet;
                  });
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedAdvisors.has(advisor.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{advisor.avatar}</div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{advisor.name}</div>
                    <div className="text-xs text-gray-600">{advisor.role}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Select advisors and start your strategic discussion</p>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl ${message.sender === 'user' ? 'order-2' : ''}`}>
              {message.sender !== 'user' && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{message.advisor.avatar}</span>
                  <span className="font-medium text-gray-700">{message.advisor.name}</span>
                  <span className="text-xs text-gray-500">{message.advisor.role}</span>
                </div>
              )}
              <div className={`rounded-lg p-4 ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Advisors are thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {meetingActive && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Upload documents"
            >
              <Upload className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your advisory board..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isProcessing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== ENHANCED DOCUMENT INTELLIGENCE V24 MODULE =====
const EnhancedDocumentIntelligenceV24 = ({ isExpanded, crossModuleContext, onContextUpdate }) => {
  const [documents, setDocuments] = useState([]);
  const [processingDoc, setProcessingDoc] = useState(null);
  const [insights, setInsights] = useState([]);
  const fileInputRef = useRef(null);

  // Document processing
  const processDocument = async (file) => {
    setProcessingDoc(file.name);
    
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'processed',
      insights: [
        { type: 'summary', content: `Key insights from ${file.name}` },
        { type: 'risk', content: 'Identified 3 potential risks' },
        { type: 'opportunity', content: 'Found 5 growth opportunities' }
      ]
    };

    setDocuments(prev => [...prev, newDoc]);
    setProcessingDoc(null);

    // Share with other modules
    onContextUpdate(prev => {
      const newContext = new Map(prev);
      const existingDocs = newContext.get('v24_documents') || [];
      newContext.set('v24_documents', [...existingDocs, newDoc]);
      return newContext;
    });
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        await processDocument(file);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">Document Intelligence Center</h4>
        <p className="text-gray-600">Upload and analyze business documents with AI-powered insights</p>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex flex-col items-center justify-center space-y-3"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="font-medium text-gray-700">Click to upload documents</p>
            <p className="text-sm text-gray-500">PDF, Word, Excel, CSV supported</p>
          </div>
        </button>
      </div>

      {/* Processing Status */}
      {processingDoc && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center space-x-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-blue-700">Processing {processingDoc}...</span>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map(doc => (
          <div key={doc.id} className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h5 className="font-medium text-gray-900">{doc.name}</h5>
                  <p className="text-sm text-gray-500">
                    {(doc.size / 1024 / 1024).toFixed(2)} MB • Processed
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            
            {/* Document Insights */}
            <div className="space-y-2">
              {doc.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span className="text-gray-700">{insight.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Integration with V20 Advisory</span>
          <span className="text-green-600 font-medium flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Active</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// ===== PLACEHOLDER MODULES =====
const AIBoardAdvancedAIFeaturesV22 = ({ isExpanded }) => (
  <div className="p-6">
    <h4 className="font-semibold text-gray-900 mb-4">Advanced AI Features V22</h4>
    <p className="text-gray-600 mb-4">Enhanced AI capabilities with memory and context awareness</p>
    <div className="bg-green-50 rounded-lg p-4">
      <p className="text-sm text-green-700">Module ready - Advanced features coming soon</p>
    </div>
  </div>
);

const CustomAdvisorIntegrationV23 = ({ isExpanded }) => (
  <div className="p-6">
    <h4 className="font-semibold text-gray-900 mb-4">Custom Advisor Integration V23</h4>
    <p className="text-gray-600 mb-4">Create and manage custom AI advisors</p>
    <div className="bg-orange-50 rounded-lg p-4">
      <p className="text-sm text-orange-700">Module ready - Custom advisor creation coming soon</p>
    </div>
  </div>
);

const AIBoardV27SubscriptionModule = ({ isExpanded }) => (
  <div className="p-6">
    <h4 className="font-semibold text-gray-900 mb-4">Subscription Management V27</h4>
    <p className="text-gray-600 mb-4">Enterprise subscription features</p>
    <div className="bg-yellow-50 rounded-lg p-4">
      <p className="text-sm text-yellow-700">Module ready - Subscription features coming soon</p>
    </div>
  </div>
);

// ===== ENHANCED V18 SHELL - MAIN COMPONENT =====
const EnhancedV18Shell = () => {
  // ===== CORE STATE =====
  const [loading, setLoading] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('advisory-hub');
  const [commandPalette, setCommandPalette] = useState({ open: false, query: '' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Module Management
  const [activeModules, setActiveModules] = useState(new Map());
  const [moduleStates, setModuleStates] = useState(new Map());
  const [crossModuleContext, setCrossModuleContext] = useState(new Map());
  const [notifications, setNotifications] = useState([]);
  
  // User State
  const [currentUser, setCurrentUser] = useState({
    id: 'user-1',
    name: 'Executive User',
    role: 'Founder/CEO',
    company: 'YourCompany',
    avatar: '👤',
    subscription: 'professional'
  });

  // ===== MODULE DEFINITIONS =====
  const allModules = [
    {
      id: 'live-claude-v20',
      name: 'Live AI Advisory V20',
      description: 'Real-time conversations with AI board of advisors',
      version: '20.0.0',
      type: 'core',
      category: 'AI Intelligence',
      icon: Brain,
      color: 'purple',
      status: 'active',
      component: AIBoardV20LiveClaude,
      priority: 1,
      workspace: 'advisory-hub',
      features: ['Claude API Integration', 'Multi-Advisor Conversations', 'Document Analysis'],
      capabilities: ['Strategic Planning', 'Business Analysis', 'Decision Support']
    },
    {
      id: 'enhanced-document-intelligence-v24',
      name: 'Document Intelligence V24',
      description: 'Advanced AI-powered document analysis',
      version: '24.0.0',
      type: 'premium',
      category: 'Business Intelligence',
      icon: FileText,
      color: 'blue',
      status: 'active',
      component: EnhancedDocumentIntelligenceV24,
      priority: 2,
      workspace: 'intelligence-center',
      features: ['Document Upload', 'AI Analysis', 'Insight Generation'],
      capabilities: ['Document Processing', 'Data Extraction', 'Business Intelligence']
    },
    {
      id: 'advanced-ai-features-v22',
      name: 'Advanced AI Features V22',
      description: 'Enhanced AI capabilities with memory',
      version: '22.0.0',
      type: 'premium',
      category: 'AI Intelligence',
      icon: Cpu,
      color: 'green',
      status: 'active',
      component: AIBoardAdvancedAIFeaturesV22,
      priority: 3,
      workspace: 'ai-center',
      features: ['AI Memory', 'Context Awareness', 'Advanced Analytics'],
      capabilities: ['Memory Persistence', 'Pattern Recognition', 'Predictive Analysis']
    },
    {
      id: 'custom-advisor-integration-v23',
      name: 'Custom Advisors V23',
      description: 'Create and manage custom AI advisors',
      version: '23.0.0',
      type: 'enterprise',
      category: 'AI Intelligence',
      icon: UserPlus,
      color: 'orange',
      status: 'installed',
      component: CustomAdvisorIntegrationV23,
      priority: 4,
      workspace: 'advisor-studio',
      features: ['Custom Advisor Creation', 'Training Pipeline', 'Performance Analytics'],
      capabilities: ['Advisor Creation', 'Training Management', 'Performance Tracking']
    },
    {
      id: 'subscription-module-v27',
      name: 'Subscription Module V27',
      description: 'Advanced subscription management',
      version: '27.0.0',
      type: 'enterprise',
      category: 'Business Operations',
      icon: Crown,
      color: 'yellow',
      status: 'active',
      component: AIBoardV27SubscriptionModule,
      priority: 8,
      workspace: 'business-center',
      features: ['Subscription Management', 'Enterprise Features', 'Usage Analytics'],
      capabilities: ['Subscription Management', 'Billing', 'Enterprise Controls']
    }
  ];

  // ===== WORKSPACE CONFIGURATIONS =====
  const workspaces = [
    {
      id: 'advisory-hub',
      name: 'Advisory Hub',
      icon: Brain,
      color: 'purple',
      description: 'AI Board meetings and strategic discussions'
    },
    {
      id: 'intelligence-center',
      name: 'Intelligence Center',
      icon: FileText,
      color: 'blue',
      description: 'Document analysis and business intelligence'
    },
    {
      id: 'ai-center',
      name: 'AI Center',
      icon: Cpu,
      color: 'green',
      description: 'Advanced AI features and configuration'
    },
    {
      id: 'business-center',
      name: 'Business Center',
      icon: Briefcase,
      color: 'gray',
      description: 'Subscription and business management'
    }
  ];

  // ===== INITIALIZATION =====
  useEffect(() => {
    // Initialize module states
    const initialStates = new Map();
    allModules.forEach(module => {
      initialStates.set(module.id, {
        enabled: module.status === 'active',
        expanded: module.priority === 1,
        notifications: 0,
        lastActivity: new Date()
      });
    });
    setModuleStates(initialStates);

    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // ===== MODULE INTERACTION HANDLERS =====
  const handleModuleInteraction = useCallback((moduleId, action) => {
    setModuleStates(prevStates => {
      const newStates = new Map(prevStates);
      const currentState = newStates.get(moduleId) || {};
      
      newStates.set(moduleId, {
        ...currentState,
        expanded: action === 'expand' ? true : action === 'collapse' ? false : currentState.expanded,
        lastActivity: new Date()
      });
      
      return newStates;
    });
  }, []);

  // ===== COMMAND PALETTE COMMANDS =====
  const commandSuggestions = [
    { id: 'advisory-session', label: 'Start Advisory Session', icon: Brain, workspace: 'advisory-hub' },
    { id: 'upload-document', label: 'Upload Document', icon: Upload, workspace: 'intelligence-center' },
    { id: 'create-advisor', label: 'Create Custom Advisor', icon: UserPlus, workspace: 'advisor-studio' },
    { id: 'view-analytics', label: 'View Analytics', icon: BarChart3, workspace: 'business-center' }
  ];

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k') {
          e.preventDefault();
          setCommandPalette(prev => ({ ...prev, open: !prev.open }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ===== RENDER HELPERS =====
  const renderSidebar = () => (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white h-screen flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Brain className="w-8 h-8 text-purple-400" />
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold">AI Board</h1>
                <p className="text-xs text-gray-400">Executive Intelligence</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{currentUser.avatar}</div>
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Workspaces */}
      <div className="flex-1 overflow-y-auto">
        <div className={`p-4 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed && (
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Workspaces</h3>
          )}
          <div className="space-y-2">
            {workspaces.map(workspace => (
              <button
                key={workspace.id}
                onClick={() => setActiveWorkspace(workspace.id)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} space-x-3 p-3 rounded-lg transition-colors ${
                  activeWorkspace === workspace.id
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <workspace.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span>{workspace.name}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => setCommandPalette({ open: true, query: '' })}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Command className="w-4 h-4" />
          {!sidebarCollapsed && <span>Quick Actions</span>}
        </button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {workspaces.find(w => w.id === activeWorkspace)?.name}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {currentUser.subscription} Plan
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderModuleCard = (module) => {
    const moduleState = moduleStates.get(module.id) || {};
    const ModuleComponent = module.component;

    return (
      <div
        key={module.id}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
          moduleState.expanded ? 'col-span-2' : ''
        }`}
      >
        {/* Module Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${module.color}-100 rounded-lg`}>
                <module.icon className={`w-5 h-5 text-${module.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{module.name}</h3>
                <p className="text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleModuleInteraction(module.id, moduleState.expanded ? 'collapse' : 'expand')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {moduleState.expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Module Content */}
        <div className={`transition-all duration-300 ${moduleState.expanded ? 'max-h-[600px]' : 'max-h-32'} overflow-hidden`}>
          <ModuleComponent 
            isExpanded={moduleState.expanded}
            crossModuleContext={crossModuleContext}
            onContextUpdate={setCrossModuleContext}
          />
        </div>
      </div>
    );
  };

  const renderCommandPalette = () => {
    if (!commandPalette.open) return null;

    const filteredCommands = commandSuggestions.filter(cmd => 
      cmd.label.toLowerCase().includes(commandPalette.query.toLowerCase())
    );

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-32">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Command className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={commandPalette.query}
                onChange={(e) => setCommandPalette(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Search commands..."
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button
                onClick={() => setCommandPalette({ open: false, query: '' })}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.map(cmd => (
              <button
                key={cmd.id}
                onClick={() => {
                  if (cmd.workspace) setActiveWorkspace(cmd.workspace);
                  setCommandPalette({ open: false, query: '' });
                }}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <cmd.icon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ===== MAIN RENDER =====
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI Board of Advisors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {renderHeader()}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allModules
              .filter(module => module.workspace === activeWorkspace)
              .sort((a, b) => a.priority - b.priority)
              .map(module => renderModuleCard(module))}
          </div>
        </div>
      </div>

      {/* Command Palette */}
      {renderCommandPalette()}
    </div>
  );
};

export default EnhancedV18Shell;