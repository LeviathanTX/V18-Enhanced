import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, MessageSquare, FileText, Users, Video, Target, 
  Clock, Bell, Search, Command, Send, Upload, Calendar,
  TrendingUp, Lightbulb, Zap, AlertCircle, CheckCircle,
  ChevronDown, ChevronRight, Plus, Settings, Download,
  Globe, Briefcase, DollarSign, BarChart3, PieChart,
  Mic, MicOff, Share2, Eye, Filter, Star, ArrowRight,
  Sparkles, Activity, Shield, Network, Database, Cpu,
  X, UserPlus, Crown, Maximize2, Minimize2, Loader2,
  Hash, Award, Bookmark, RefreshCw, Copy, Save, History
} from 'lucide-react';

// Import your existing modules
import AIBoardV20LiveClaude from './modules/AIBoardV20LiveClaude';
import EnhancedDocumentIntelligence from './modules/EnhancedDocumentIntelligence';
import EnhancedDocumentIntelligenceV24 from './modules/EnhancedDocumentIntelligenceV24';
import AIBoardV26RealGoogleMeetIntegration from './modules/AIBoardV26RealGoogleMeetIntegration';
import AIBoardAdvancedAIFeaturesV22 from './modules/AIBoardAdvancedAIFeaturesV22';
import CustomAdvisorIntegrationV23 from './modules/CustomAdvisorIntegrationV23';
import AIBoardV19LiveIntegration from './modules/AIBoardV19LiveIntegration';
import AIBoardV18V25VideoPlatformIntegration from './modules/AIBoardV18V25VideoPlatformIntegration';
import AIBoardV27SubscriptionModule from './modules/AIBoardV27SubscriptionModule';

// ===== ENHANCED AI BOARD PLATFORM - PRODUCTION UX =====
const EnhancedAIBoardPlatform = () => {
  // ===== CORE STATE =====
  const [currentUser] = useState({
    id: 'exec-1',
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechCorp Inc.',
    avatar: '👩‍💼',
    subscription: 'professional',
    credits: 750,
    maxCredits: 1000
  });

  // ===== MODULE SYSTEM STATE =====
  const [loadedModules, setLoadedModules] = useState(new Map());
  const [moduleStates, setModuleStates] = useState(new Map());
  const [activeModules, setActiveModules] = useState(new Set());
  const [minimizedModules, setMinimizedModules] = useState(new Set());
  const [systemHealth, setSystemHealth] = useState(100);

  // ===== AI ORCHESTRATION STATE =====
  const [aiSystemStatus, setAISystemStatus] = useState('optimal');
  const [activeAdvisors, setActiveAdvisors] = useState(new Set(['alexandra-ceo', 'david-cfo']));
  const [conversationContext, setConversationContext] = useState(new Map());
  const [recentInsights, setRecentInsights] = useState([]);

  // ===== UX ENHANCEMENT STATE =====
  const [commandPalette, setCommandPalette] = useState({ open: false, query: '' });
  const [notifications, setNotifications] = useState([]);
  const [quickActions, setQuickActions] = useState(true);
  const [contextPanel, setContextPanel] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // ===== MODULE DEFINITIONS =====
  const moduleDefinitions = [
    {
      id: 'live-claude-v20',
      name: 'Live AI Advisory',
      icon: Brain,
      color: 'blue',
      priority: 1,
      status: 'active',
      description: 'Real-time conversations with expert AI advisors',
      subscription: 'starter',
      stats: { conversations: 47, insights: 156, satisfaction: 4.8 },
      component: AIBoardV20LiveClaude
    },
    {
      id: 'subscription-v27',
      name: 'Subscription Management',
      icon: Crown,
      color: 'purple',
      priority: 2,
      status: 'active',
      description: 'Professional billing and usage tracking',
      subscription: 'all',
      stats: { mrr: 15400, customers: 103, churn: 2.1 },
      component: AIBoardV27SubscriptionModule
    },
    {
      id: 'document-intelligence-v24',
      name: 'Document Intelligence',
      icon: FileText,
      color: 'green',
      priority: 3,
      status: 'active',
      description: 'Advanced document analysis and insights',
      subscription: 'professional',
      stats: { processed: 2847, insights: 892, accuracy: 94.7 },
      component: EnhancedDocumentIntelligenceV24
    },
    {
      id: 'google-meet-v26',
      name: 'Meeting AI Participants',
      icon: Video,
      color: 'red',
      priority: 4,
      status: 'beta',
      description: 'Revolutionary AI advisors in video meetings',
      subscription: 'professional',
      stats: { meetings: 156, participants: 412, engagement: 87.3 },
      component: AIBoardV26RealGoogleMeetIntegration
    },
    {
      id: 'custom-advisors-v23',
      name: 'Custom Advisor Creator',
      icon: UserPlus,
      color: 'indigo',
      priority: 5,
      status: 'active',
      description: 'Create industry-specific AI advisors',
      subscription: 'enterprise',
      stats: { advisors: 23, training: 156, effectiveness: 91.2 },
      component: CustomAdvisorIntegrationV23
    },
    {
      id: 'advanced-ai-v22',
      name: 'Advanced AI Features',
      icon: Sparkles,
      color: 'yellow',
      priority: 6,
      status: 'active',
      description: 'Sophisticated multi-agent orchestration',
      subscription: 'professional',
      stats: { predictions: 1247, accuracy: 89.4, insights: 3456 },
      component: AIBoardAdvancedAIFeaturesV22
    },
    {
      id: 'business-intelligence',
      name: 'Business Intelligence',
      icon: BarChart3,
      color: 'emerald',
      priority: 7,
      status: 'active',
      description: 'Comprehensive business analytics and reporting',
      subscription: 'professional',
      stats: { reports: 89, kpis: 247, alerts: 23 },
      component: null
    },
    {
      id: 'api-integration',
      name: 'API & Integrations',
      icon: Network,
      color: 'orange',
      priority: 8,
      status: 'enterprise',
      description: 'External system integrations and API access',
      subscription: 'enterprise',
      stats: { integrations: 12, calls: 15600, uptime: 99.97 },
      component: null
    }
  ];

  // ===== MOCK DATA INITIALIZATION =====
  useEffect(() => {
    initializeProductionData();
    simulateRealTimeUpdates();
  }, []);

  const initializeProductionData = () => {
    // Initialize notifications
    setNotifications([
      {
        id: 'insight-1',
        type: 'insight',
        title: 'AI Advisor Recommendation',
        message: 'Alexandra suggests reviewing Q4 expansion strategy based on market trends',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'high',
        actionable: true
      },
      {
        id: 'meeting-1',
        type: 'meeting',
        title: 'AI Meeting Scheduled',
        message: 'Google Meet with AI advisors starting in 30 minutes',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'medium',
        actionable: true
      },
      {
        id: 'document-1',
        type: 'document',
        title: 'Document Analysis Complete',
        message: 'Financial model analysis revealed 3 optimization opportunities',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        priority: 'medium',
        actionable: false
      }
    ]);

    // Initialize recent insights
    setRecentInsights([
      {
        id: 'insight-ceo-1',
        advisor: 'Alexandra Chen',
        type: 'strategic',
        content: 'Market expansion to Asia-Pacific should be prioritized based on competitor analysis',
        confidence: 0.94,
        impact: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'insight-cfo-1',
        advisor: 'David Rodriguez',
        type: 'financial',
        content: 'Current burn rate allows for 18-month runway with recommended optimizations',
        confidence: 0.89,
        impact: 'critical',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'insight-cto-1',
        advisor: 'Marcus Johnson',
        type: 'technical',
        content: 'Infrastructure scaling needed by Q2 to support projected user growth',
        confidence: 0.91,
        impact: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]);

    // Auto-load priority modules
    const priorityModules = moduleDefinitions
      .filter(mod => mod.priority <= 4)
      .map(mod => mod.id);
    
    setActiveModules(new Set(priorityModules));
  };

  const simulateRealTimeUpdates = () => {
    setInterval(() => {
      setSystemHealth(prev => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      
      // Simulate AI processing
      if (Math.random() < 0.1) {
        setAISystemStatus(prev => {
          const statuses = ['optimal', 'processing', 'learning'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        });
      }
    }, 5000);
  };

  // ===== MODULE MANAGEMENT =====
  const toggleModule = useCallback((moduleId) => {
    setActiveModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  }, []);

  const minimizeModule = useCallback((moduleId) => {
    setMinimizedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  }, []);

  // ===== COMMAND PALETTE =====
  const commandRef = useRef(null);
  const [commandSuggestions] = useState([
    { id: 'start-advisory', label: 'Start Advisory Session', icon: Brain, module: 'live-claude-v20' },
    { id: 'analyze-document', label: 'Analyze Document', icon: FileText, module: 'document-intelligence-v24' },
    { id: 'schedule-meeting', label: 'Schedule AI Meeting', icon: Video, module: 'google-meet-v26' },
    { id: 'create-advisor', label: 'Create Custom Advisor', icon: UserPlus, module: 'custom-advisors-v23' },
    { id: 'view-insights', label: 'View AI Insights', icon: Lightbulb, module: 'advanced-ai-v22' },
    { id: 'upgrade-subscription', label: 'Upgrade Subscription', icon: Crown, module: 'subscription-v27' }
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(prev => ({ ...prev, open: !prev.open }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ===== ENHANCED UX COMPONENTS =====
  const EnhancedTopBar = () => (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Board of Advisors</h1>
              <p className="text-sm text-gray-500">Executive Advisory Platform</p>
            </div>
          </div>
          
          {/* System Health Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
            <div className={`w-2 h-2 rounded-full ${
              systemHealth > 95 ? 'bg-green-500' :
              systemHealth > 85 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs font-medium text-green-700">{Math.round(systemHealth)}% optimal</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPalette(prev => ({ ...prev, open: true }))}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Command className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">⌘K</span>
          </button>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
              <div className="text-xs text-gray-500">{currentUser.role} • {currentUser.subscription}</div>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">{currentUser.avatar}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const CommandPalette = () => (
    commandPalette.open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Command className="w-5 h-5 text-gray-400" />
              <input
                ref={commandRef}
                type="text"
                placeholder="Search commands..."
                className="flex-1 outline-none text-lg"
                value={commandPalette.query}
                onChange={(e) => setCommandPalette(prev => ({ ...prev, query: e.target.value }))}
                autoFocus
              />
              <button
                onClick={() => setCommandPalette(prev => ({ ...prev, open: false, query: '' }))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {commandSuggestions
              .filter(cmd => cmd.label.toLowerCase().includes(commandPalette.query.toLowerCase()))
              .map(command => (
              <button
                key={command.id}
                onClick={() => {
                  toggleModule(command.module);
                  setCommandPalette({ open: false, query: '' });
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <command.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{command.label}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {activeModules.has(command.module) ? 'Active' : 'Activate'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  );

  const SmartInsightsPanel = () => (
    contextPanel && (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
            <button
              onClick={() => setContextPanel(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recent Insights */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Insights</h4>
            <div className="space-y-3">
              {recentInsights.map(insight => (
                <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600">{insight.advisor}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'critical' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{insight.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI System Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">AI System Status</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Processing Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  aiSystemStatus === 'optimal' ? 'bg-green-100 text-green-700' :
                  aiSystemStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {aiSystemStatus}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Advisors</span>
                  <span className="font-medium">{activeAdvisors.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits Used</span>
                  <span className="font-medium">{currentUser.credits}/{currentUser.maxCredits}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Start Advisory Session</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Upload className="w-4 h-4 text-green-500" />
                <span className="text-sm">Upload Document</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Video className="w-4 h-4 text-red-500" />
                <span className="text-sm">Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const ModuleCard = ({ module }) => {
    const isActive = activeModules.has(module.id);
    const isMinimized = minimizedModules.has(module.id);
    const IconComponent = module.icon;

    return (
      <div className={`bg-white rounded-xl border-2 transition-all duration-300 ${
        isActive ? 'border-blue-200 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}>
        {/* Module Header */}
        <div className={`p-4 border-b border-gray-200 ${
          module.color === 'blue' ? 'bg-blue-50' :
          module.color === 'purple' ? 'bg-purple-50' :
          module.color === 'green' ? 'bg-green-50' :
          module.color === 'red' ? 'bg-red-50' :
          module.color === 'indigo' ? 'bg-indigo-50' :
          module.color === 'yellow' ? 'bg-yellow-50' :
          module.color === 'emerald' ? 'bg-emerald-50' :
          'bg-orange-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                module.color === 'blue' ? 'bg-blue-600' :
                module.color === 'purple' ? 'bg-purple-600' :
                module.color === 'green' ? 'bg-green-600' :
                module.color === 'red' ? 'bg-red-600' :
                module.color === 'indigo' ? 'bg-indigo-600' :
                module.color === 'yellow' ? 'bg-yellow-600' :
                module.color === 'emerald' ? 'bg-emerald-600' :
                'bg-orange-600'
              }`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{module.name}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                module.status === 'active' ? 'bg-green-100 text-green-700' :
                module.status === 'beta' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {module.status}
              </span>
              
              {isActive && (
                <button
                  onClick={() => minimizeModule(module.id)}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
              )}
              
              <button
                onClick={() => toggleModule(module.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>

        {/* Module Content */}
        {isActive && !isMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(module.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof value === 'number' && value > 1000 
                      ? `${(value / 1000).toFixed(1)}k`
                      : value
                    }
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  if (module.component) {
                    // Open module in full screen
                    setActiveModules(new Set([module.id]));
                  }
                }}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium">Open {module.name}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              
              {module.id === 'live-claude-v20' && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">AI Advisors Ready</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    4 expert advisors online and ready for strategic discussions
                  </p>
                </div>
              )}
              
              {module.id === 'subscription-v27' && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Professional Plan</span>
                  </div>
                  <p className="text-xs text-purple-700">
                    Full access to all AI advisors and premium features
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Minimized State */}
        {isActive && isMinimized && (
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Running in background</span>
              </div>
              <span className="text-xs text-gray-500">
                {Object.values(module.stats)[0]} active
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER FULL MODULE INTERFACE =====
  const renderFullModuleInterface = () => {
    if (activeModules.size !== 1) return null;
    
    const moduleId = Array.from(activeModules)[0];
    const module = moduleDefinitions.find(m => m.id === moduleId);
    
    if (!module || !module.component) return null;
    
    const ModuleComponent = module.component;
    
    return (
      <div className="fixed inset-0 bg-gray-50 z-40">
        <div className="h-full flex flex-col">
          {/* Module Header Bar */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveModules(new Set(moduleDefinitions.slice(0, 4).map(m => m.id)))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
              </button>
              <module.icon className="w-6 h-6 text-gray-700" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{module.name}</h2>
                <p className="text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-3 py-1 rounded-full ${
                module.status === 'active' ? 'bg-green-100 text-green-700' :
                module.status === 'beta' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {module.status}
              </span>
            </div>
          </div>
          
          {/* Module Content */}
          <div className="flex-1 overflow-hidden">
            <ModuleComponent />
          </div>
        </div>
      </div>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedTopBar />
      <CommandPalette />
      
      {/* Check if single module is active in full screen */}
      {activeModules.size === 1 && renderFullModuleInterface()}
      
      {/* Normal dashboard view */}
      {activeModules.size !== 1 && (
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}</h2>
                    <p className="text-blue-100 mb-4">Your AI advisory board is ready to help drive strategic decisions</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>{activeAdvisors.size} advisors online</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>{activeModules.size} modules active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>{Math.round(systemHealth)}% performance</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-6xl opacity-20">🚀</div>
                </div>
              </div>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {moduleDefinitions.map(module => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>

            {/* Demo Mode Toggle */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-yellow-900">Demo Mode</h4>
                  <p className="text-sm text-yellow-700">
                    Experience the platform with sample data and simulated AI responses
                  </p>
                </div>
                <button
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDemoMode 
                      ? 'bg-yellow-200 text-yellow-900' 
                      : 'bg-white text-yellow-700 border border-yellow-300'
                  }`}
                >
                  {isDemoMode ? 'Exit Demo' : 'Try Demo'}
                </button>
              </div>
            </div>
          </div>

          {/* Smart Insights Panel */}
          <SmartInsightsPanel />
        </div>
      )}
    </div>
  );
};

export default EnhancedAIBoardPlatform;