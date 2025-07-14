import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  UserPlus, Users, Settings, Maximize2, Minimize2, X, 
  Loader2, CheckCircle, AlertCircle, Plus, Trash2, Clock, Target, 
  Star, ChevronUp, ChevronDown, Brain, Database, Zap, 
  BarChart3, Lightbulb, TrendingUp, FileText, Play, Pause,
  Archive, RotateCcw, Bookmark, Filter, Search, Volume2, VolumeX,
  Eye, EyeOff, RefreshCw, Download, Share2, Copy, Save, History,
  Gauge, Activity, Atom, Network, Cpu, HardDrive, CloudLightning,
  Edit3, Crown, Shield, Briefcase, Upload, Mic, Camera, Palette,
  MessageSquare, Scale, Globe2, DollarSign, Code, Book, User
} from 'lucide-react';

// ===== AI BOARD V23 - CUSTOM ADVISOR INTEGRATION & MANAGEMENT MODULE =====
// Designed to integrate with V18 Core Shell and V22 Advanced AI Features
const CustomAdvisorIntegrationModule = () => {
  // ===== MODULE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('management');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Custom Advisor Management State
  const [customAdvisors, setCustomAdvisors] = useState(new Map());
  const [advisorTemplates, setAdvisorTemplates] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  
  // Creation/Training State
  const [creationStep, setCreationStep] = useState(1);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({
    name: '',
    role: '',
    expertise: [],
    personality: '',
    background: '',
    avatar: '👔',
    color: 'blue',
    specializations: [],
    industries: [],
    decisionMakingStyle: 'analytical',
    communicationStyle: 'direct',
    riskTolerance: 'moderate',
    trainingDocuments: [],
    knowledgeBase: []
  });
  
  // Integration State
  const [integrationStatus, setIntegrationStatus] = useState(new Map());
  const [performanceMetrics, setPerformanceMetrics] = useState(new Map());
  const [advisorUsageStats, setAdvisorUsageStats] = useState({});
  
  // Advanced Management State
  const [advisorConversations, setAdvisorConversations] = useState(new Map());
  const [advisorMemories, setAdvisorMemories] = useState(new Map());
  const [advisorAnalytics, setAdvisorAnalytics] = useState(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Refs
  const fileInputRef = useRef(null);
  const trainingRef = useRef(null);

  // ===== PREDEFINED TEMPLATES AND OPTIONS =====
  const [defaultTemplates] = useState([
    {
      id: 'executive-coach',
      name: 'Executive Coach',
      role: 'Leadership Development Advisor',
      expertise: ['leadership', 'team-building', 'performance-management', 'executive-presence'],
      personality: 'Empathetic yet challenging coach who helps executives unlock their potential and build high-performing teams.',
      background: 'Former Fortune 500 CEO with 20+ years experience scaling organizations and developing leadership talent.',
      avatar: '👔',
      color: 'blue',
      specializations: ['executive-coaching', 'leadership-development', 'team-dynamics'],
      industries: ['technology', 'finance', 'healthcare'],
      category: 'leadership',
      estimatedTrainingTime: '45 minutes'
    },
    {
      id: 'industry-specialist',
      name: 'Industry Specialist',
      role: 'Sector Expert Advisor',
      expertise: ['market-analysis', 'competitive-intelligence', 'regulatory-compliance', 'industry-trends'],
      personality: 'Deep industry expert who provides strategic insights and market intelligence with authoritative knowledge.',
      background: 'Former industry analyst and consultant with comprehensive knowledge of market dynamics and competitive landscapes.',
      avatar: '📊',
      color: 'green',
      specializations: ['market-intelligence', 'competitive-analysis', 'regulatory-affairs'],
      industries: ['healthcare', 'fintech', 'manufacturing', 'energy'],
      category: 'industry',
      estimatedTrainingTime: '60 minutes'
    },
    {
      id: 'innovation-catalyst',
      name: 'Innovation Catalyst',
      role: 'Innovation & Technology Advisor',
      expertise: ['digital-transformation', 'emerging-technologies', 'innovation-management', 'disruptive-strategies'],
      personality: 'Visionary innovator who challenges conventional thinking and identifies breakthrough opportunities.',
      background: 'Former Chief Innovation Officer with expertise in emerging technologies, digital transformation, and disruptive business models.',
      avatar: '🚀',
      color: 'purple',
      specializations: ['digital-transformation', 'emerging-tech', 'innovation-strategy'],
      industries: ['technology', 'media', 'retail', 'manufacturing'],
      category: 'innovation',
      estimatedTrainingTime: '50 minutes'
    },
    {
      id: 'crisis-manager',
      name: 'Crisis Manager',
      role: 'Crisis Management & Recovery Advisor',
      expertise: ['crisis-management', 'risk-assessment', 'business-continuity', 'stakeholder-communication'],
      personality: 'Calm under pressure with systematic approach to crisis resolution and organizational resilience building.',
      background: 'Former crisis management consultant with experience navigating companies through major disruptions and recovery phases.',
      avatar: '🛡️',
      color: 'red',
      specializations: ['crisis-response', 'risk-management', 'business-continuity'],
      industries: ['finance', 'healthcare', 'energy', 'transportation'],
      category: 'risk',
      estimatedTrainingTime: '40 minutes'
    }
  ]);

  const expertiseOptions = [
    'strategy', 'finance', 'marketing', 'technology', 'operations', 'hr', 'legal',
    'sales', 'product', 'design', 'analytics', 'international', 'sustainability',
    'innovation', 'leadership', 'governance', 'risk-management', 'compliance'
  ];

  const specializationOptions = [
    'startup-scaling', 'digital-transformation', 'mergers-acquisitions', 'ipo-preparation',
    'crisis-management', 'market-expansion', 'product-development', 'customer-success',
    'venture-capital', 'private-equity', 'executive-coaching', 'board-governance'
  ];

  const industryOptions = [
    'technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'energy',
    'education', 'media', 'transportation', 'real-estate', 'agriculture', 'aerospace'
  ];

  const avatarOptions = [
    '👔', '💼', '👩‍💼', '👨‍💼', '🎯', '📊', '🚀', '💡', '⚡', '🔥',
    '💎', '🏆', '⭐', '🎪', '🎨', '🔬', '⚖️', '🏭', '🌟', '💫'
  ];

  // ===== SAMPLE DATA FOR DEMONSTRATION =====
  useEffect(() => {
    // Initialize with sample custom advisors
    const sampleAdvisors = new Map([
      ['custom-advisor-001', {
        id: 'custom-advisor-001',
        name: 'Dr. Sarah Chen',
        role: 'Healthcare Innovation Advisor',
        expertise: ['healthcare', 'digital-health', 'regulatory-affairs', 'market-access'],
        personality: 'Strategic healthcare expert focused on innovation and regulatory navigation.',
        background: 'Former FDA advisor and healthcare startup founder with deep regulatory and market expertise.',
        avatar: '🏥',
        color: 'green',
        specializations: ['healthcare-innovation', 'regulatory-strategy', 'digital-health'],
        industries: ['healthcare', 'biotech', 'medtech'],
        status: 'active',
        isCustom: true,
        createdAt: '2025-01-10T14:30:00Z',
        trainingCompleted: true,
        conversations: 23,
        lastActive: '2 hours ago',
        performance: {
          accuracy: 94,
          helpfulness: 97,
          engagement: 89,
          expertise: 96
        },
        integratedWith: ['v22-advanced-ai', 'v20-live-advisory', 'v21-document-intelligence'],
        memoryEntries: 15,
        businessImpact: 'high'
      }],
      ['custom-advisor-002', {
        id: 'custom-advisor-002',
        name: 'Marcus Rodriguez',
        role: 'Fintech Strategy Advisor',
        expertise: ['fintech', 'payments', 'blockchain', 'financial-regulations'],
        personality: 'Results-driven fintech expert with deep understanding of payment systems and emerging financial technologies.',
        background: 'Former fintech executive and blockchain pioneer with extensive experience in financial services innovation.',
        avatar: '💳',
        color: 'blue',
        specializations: ['fintech-strategy', 'payments-innovation', 'blockchain-technology'],
        industries: ['finance', 'fintech', 'cryptocurrency'],
        status: 'training',
        isCustom: true,
        createdAt: '2025-01-12T09:15:00Z',
        trainingCompleted: false,
        trainingProgress: 67,
        conversations: 0,
        lastActive: 'Never',
        performance: null,
        integratedWith: [],
        memoryEntries: 0,
        businessImpact: 'pending'
      }],
      ['custom-advisor-003', {
        id: 'custom-advisor-003',
        name: 'Lisa Kim',
        role: 'Sustainability & ESG Advisor',
        expertise: ['sustainability', 'esg', 'climate-strategy', 'stakeholder-engagement'],
        personality: 'Mission-driven sustainability expert who balances environmental impact with business performance.',
        background: 'Former Chief Sustainability Officer with expertise in ESG reporting, climate strategy, and sustainable business transformation.',
        avatar: '🌱',
        color: 'green',
        specializations: ['esg-strategy', 'climate-action', 'sustainable-operations'],
        industries: ['energy', 'manufacturing', 'retail', 'technology'],
        status: 'active',
        isCustom: true,
        createdAt: '2025-01-08T11:45:00Z',
        trainingCompleted: true,
        conversations: 31,
        lastActive: '1 day ago',
        performance: {
          accuracy: 91,
          helpfulness: 95,
          engagement: 93,
          expertise: 94
        },
        integratedWith: ['v22-advanced-ai', 'v21-document-intelligence'],
        memoryEntries: 22,
        businessImpact: 'high'
      }]
    ]);

    setCustomAdvisors(sampleAdvisors);
    setAdvisorTemplates(defaultTemplates);

    // Sample integration status
    const sampleIntegrationStatus = new Map([
      ['custom-advisor-001', {
        v20Status: 'integrated',
        v21Status: 'integrated',
        v22Status: 'integrated',
        lastSync: '2025-01-13T10:30:00Z',
        syncErrors: 0
      }],
      ['custom-advisor-002', {
        v20Status: 'pending',
        v21Status: 'not-configured',
        v22Status: 'not-configured',
        lastSync: null,
        syncErrors: 0
      }],
      ['custom-advisor-003', {
        v20Status: 'integrated',
        v21Status: 'integrated',
        v22Status: 'pending',
        lastSync: '2025-01-13T08:15:00Z',
        syncErrors: 1
      }]
    ]);

    setIntegrationStatus(sampleIntegrationStatus);

    // Sample usage statistics
    setAdvisorUsageStats({
      totalCustomAdvisors: 3,
      activeAdvisors: 2,
      trainingAdvisors: 1,
      totalConversations: 54,
      avgSatisfactionScore: 93,
      businessImpactHigh: 2,
      businessImpactMedium: 0,
      businessImpactLow: 0
    });
  }, []);

  // ===== CUSTOM ADVISOR MANAGEMENT FUNCTIONS =====
  const createCustomAdvisor = async (advisorData) => {
    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Simulate training process
      const trainingSteps = [
        'Analyzing advisor profile...',
        'Processing expertise areas...',
        'Integrating knowledge base...',
        'Training conversation patterns...',
        'Optimizing response quality...',
        'Finalizing advisor deployment...'
      ];

      for (let i = 0; i < trainingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTrainingProgress(((i + 1) / trainingSteps.length) * 100);
      }

      const newAdvisor = {
        id: `custom-advisor-${Date.now()}`,
        ...advisorData,
        status: 'active',
        isCustom: true,
        createdAt: new Date().toISOString(),
        trainingCompleted: true,
        conversations: 0,
        lastActive: 'Never',
        performance: null,
        integratedWith: [],
        memoryEntries: 0,
        businessImpact: 'pending'
      };

      setCustomAdvisors(prev => new Map(prev.set(newAdvisor.id, newAdvisor)));

      // Auto-integrate with V22 Advanced AI Features
      await integrateWithAdvancedAI(newAdvisor.id);

    } catch (error) {
      console.error('Advisor creation error:', error);
    } finally {
      setIsTraining(false);
      setTrainingProgress(0);
      setShowCreateModal(false);
      setShowTrainingModal(false);
    }
  };

  const integrateWithAdvancedAI = async (advisorId) => {
    // Simulate integration with V22 Advanced AI Features
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIntegrationStatus(prev => new Map(prev.set(advisorId, {
      v20Status: 'integrated',
      v21Status: 'integrated',
      v22Status: 'integrated',
      lastSync: new Date().toISOString(),
      syncErrors: 0
    })));

    // Update advisor integration status
    setCustomAdvisors(prev => {
      const updated = new Map(prev);
      const advisor = updated.get(advisorId);
      if (advisor) {
        advisor.integratedWith = ['v22-advanced-ai', 'v20-live-advisory', 'v21-document-intelligence'];
        updated.set(advisorId, advisor);
      }
      return updated;
    });
  };

  const updateAdvisorForm = (field, value) => {
    setAdvisorForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field, value) => {
    if (!advisorForm[field].includes(value)) {
      updateAdvisorForm(field, [...advisorForm[field], value]);
    }
  };

  const removeFromArray = (field, value) => {
    updateAdvisorForm(field, advisorForm[field].filter(item => item !== value));
  };

  const handleFileUpload = (files) => {
    const uploadedDocs = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      uploadedAt: new Date().toISOString()
    }));
    
    updateAdvisorForm('trainingDocuments', [...advisorForm.trainingDocuments, ...uploadedDocs]);
  };

  const deleteAdvisor = async (advisorId) => {
    if (window.confirm('Are you sure you want to delete this custom advisor?')) {
      setCustomAdvisors(prev => {
        const updated = new Map(prev);
        updated.delete(advisorId);
        return updated;
      });
      
      setIntegrationStatus(prev => {
        const updated = new Map(prev);
        updated.delete(advisorId);
        return updated;
      });
    }
  };

  const cloneAdvisor = (advisorId) => {
    const advisor = customAdvisors.get(advisorId);
    if (advisor) {
      const clonedAdvisor = {
        ...advisor,
        id: `custom-advisor-${Date.now()}`,
        name: `${advisor.name} (Copy)`,
        createdAt: new Date().toISOString(),
        conversations: 0,
        lastActive: 'Never',
        status: 'draft'
      };
      
      setAdvisorForm(clonedAdvisor);
      setShowCreateModal(true);
      setCreationStep(1);
    }
  };

  // ===== UI COMPONENTS =====

  // Advisor Management Interface
  const AdvisorManagementInterface = () => (
    <div className="space-y-6">
      {/* Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Advisor Management</h3>
          <p className="text-sm text-gray-600 mt-1">Manage, train, and integrate your custom AI advisors</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Advisor</span>
          </button>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Total Advisors</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{advisorUsageStats.totalCustomAdvisors}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{advisorUsageStats.activeAdvisors}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Conversations</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{advisorUsageStats.totalConversations}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium">Avg Rating</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{advisorUsageStats.avgSatisfactionScore}%</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search advisors by name, role, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="training">Training</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Advisor List */}
      <div className="space-y-4">
        {Array.from(customAdvisors.values())
          .filter(advisor => {
            if (filterStatus !== 'all' && advisor.status !== filterStatus) return false;
            if (searchQuery && !advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !advisor.role.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
          })
          .map(advisor => (
          <div key={advisor.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {advisor.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold">{advisor.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      advisor.status === 'active' ? 'bg-green-100 text-green-800' :
                      advisor.status === 'training' ? 'bg-blue-100 text-blue-800' :
                      advisor.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {advisor.status}
                    </span>
                    {advisor.isCustom && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{advisor.role}</p>
                  <p className="text-sm text-gray-600 mb-3">{advisor.personality}</p>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {advisor.expertise.slice(0, 4).map(skill => (
                      <span key={skill} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {advisor.expertise.length > 4 && (
                      <span className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded-full">
                        +{advisor.expertise.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  {advisor.performance && (
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{advisor.performance.accuracy}%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{advisor.performance.helpfulness}%</div>
                        <div className="text-xs text-gray-500">Helpfulness</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{advisor.conversations}</div>
                        <div className="text-xs text-gray-500">Conversations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{advisor.memoryEntries}</div>
                        <div className="text-xs text-gray-500">Memories</div>
                      </div>
                    </div>
                  )}

                  {/* Integration Status */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Last active: {advisor.lastActive}</span>
                    <span>•</span>
                    <span>Integrated with: {advisor.integratedWith.length} modules</span>
                    {advisor.status === 'training' && advisor.trainingProgress && (
                      <>
                        <span>•</span>
                        <span>Training: {advisor.trainingProgress}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedAdvisor(advisor)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => cloneAdvisor(advisor.id)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setAdvisorForm(advisor);
                    setShowCreateModal(true);
                    setCreationStep(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteAdvisor(advisor.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {customAdvisors.size === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Custom Advisors</h3>
          <p className="text-gray-600 mb-4">Create your first custom AI advisor to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Advisor
          </button>
        </div>
      )}
    </div>
  );

  // Template Selection Interface
  const TemplateSelectionInterface = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
        <p className="text-gray-600">Start with a pre-built template or create from scratch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advisorTemplates.map(template => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setAdvisorForm({
                ...advisorForm,
                ...template,
                id: undefined
              });
              setCreationStep(2);
            }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {template.avatar}
              </div>
              <div>
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.role}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{template.personality}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {template.expertise.slice(0, 3).map(skill => (
                <span key={skill} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              Estimated training time: {template.estimatedTrainingTime}
            </div>
          </div>
        ))}
        
        {/* Custom from scratch option */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer text-center"
          onClick={() => {
            setAdvisorForm({
              name: '',
              role: '',
              expertise: [],
              personality: '',
              background: '',
              avatar: '👔',
              color: 'blue',
              specializations: [],
              industries: [],
              decisionMakingStyle: 'analytical',
              communicationStyle: 'direct',
              riskTolerance: 'moderate',
              trainingDocuments: [],
              knowledgeBase: []
            });
            setCreationStep(2);
          }}
        >
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Create from Scratch</h4>
          <p className="text-sm text-gray-600">Build a completely custom advisor</p>
        </div>
      </div>
    </div>
  );

  // Create Advisor Modal
  const CreateAdvisorModal = () => (
    showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">
                {creationStep === 1 ? 'Choose Template' : 
                 creationStep === 2 ? 'Configure Advisor' : 
                 'Training & Documents'}
              </h3>
            </div>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setCreationStep(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {creationStep === 1 && <TemplateSelectionInterface />}
            {creationStep === 2 && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advisor Name</label>
                    <input
                      type="text"
                      value={advisorForm.name}
                      onChange={(e) => updateAdvisorForm('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Dr. Sarah Johnson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={advisorForm.role}
                      onChange={(e) => updateAdvisorForm('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Executive Coach & Leadership Advisor"
                    />
                  </div>
                </div>

                {/* Personality & Background */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personality & Approach</label>
                  <textarea
                    value={advisorForm.personality}
                    onChange={(e) => updateAdvisorForm('personality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe the advisor's personality, communication style, and approach to helping clients..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background & Experience</label>
                  <textarea
                    value={advisorForm.background}
                    onChange={(e) => updateAdvisorForm('background', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe the advisor's professional background, experience, and credentials..."
                  />
                </div>

                {/* Expertise Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => 
                          advisorForm.expertise.includes(option) 
                            ? removeFromArray('expertise', option)
                            : addToArray('expertise', option)
                        }
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          advisorForm.expertise.includes(option)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar & Color Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map(avatar => (
                        <button
                          key={avatar}
                          onClick={() => updateAdvisorForm('avatar', avatar)}
                          className={`w-10 h-10 rounded-lg text-xl transition-colors ${
                            advisorForm.avatar === avatar
                              ? 'bg-blue-100 border-2 border-blue-500'
                              : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                    <div className="flex flex-wrap gap-2">
                      {['blue', 'green', 'purple', 'orange', 'red', 'indigo'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateAdvisorForm('color', color)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            advisorForm.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                          }`}
                          style={{
                            backgroundColor: {
                              blue: '#3B82F6',
                              green: '#10B981',
                              purple: '#8B5CF6',
                              orange: '#F97316',
                              red: '#EF4444',
                              indigo: '#6366F1'
                            }[color]
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {creationStep === 3 && (
              <div className="space-y-6">
                {/* Training Documents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Training Documents</label>
                  <div className="border border-gray-300 border-dashed rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload documents to train your advisor</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose Files
                    </button>
                  </div>
                  
                  {advisorForm.trainingDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {advisorForm.trainingDocuments.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <button
                            onClick={() => removeFromArray('trainingDocuments', doc)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="flex space-x-2">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step === creationStep
                      ? 'bg-blue-600 text-white'
                      : step < creationStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < creationStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              {creationStep > 1 && (
                <button
                  onClick={() => setCreationStep(prev => prev - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {creationStep < 3 ? (
                <button
                  onClick={() => setCreationStep(prev => prev + 1)}
                  disabled={
                    (creationStep === 2 && (!advisorForm.name || !advisorForm.role || !advisorForm.personality))
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => createCustomAdvisor(advisorForm)}
                  disabled={isTraining}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isTraining && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isTraining ? 'Creating...' : 'Create Advisor'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Training Progress Modal
  const TrainingProgressModal = () => (
    showTrainingModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Training Your AI Advisor</h3>
            <p className="text-gray-600 mb-6">
              Processing advisor profile and training documents...
            </p>
            
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-2">{Math.round(trainingProgress)}% complete</div>
            </div>
            
            <div className="text-xs text-gray-500">
              This typically takes 2-5 minutes depending on the complexity
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Integration Status Interface
  const IntegrationStatusInterface = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Module Integration Status</h3>
        <p className="text-sm text-gray-600">Monitor integration with other AI Board modules</p>
      </div>

      <div className="space-y-4">
        {Array.from(customAdvisors.values()).map(advisor => {
          const integration = integrationStatus.get(advisor.id);
          return (
            <div key={advisor.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{advisor.avatar}</div>
                  <div>
                    <h4 className="font-semibold">{advisor.name}</h4>
                    <p className="text-sm text-gray-600">{advisor.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  advisor.status === 'active' ? 'bg-green-100 text-green-800' :
                  advisor.status === 'training' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {advisor.status}
                </span>
              </div>

              {integration && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">V20 Live Advisory</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      integration.v20Status === 'integrated' ? 'bg-green-100 text-green-800' :
                      integration.v20Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.v20Status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">V21 Document Intelligence</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      integration.v21Status === 'integrated' ? 'bg-green-100 text-green-800' :
                      integration.v21Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.v21Status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">V22 Advanced AI</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      integration.v22Status === 'integrated' ? 'bg-green-100 text-green-800' :
                      integration.v22Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.v22Status}
                    </span>
                  </div>
                </div>
              )}

              {integration?.lastSync && (
                <div className="mt-4 text-xs text-gray-500">
                  Last synchronized: {new Date(integration.lastSync).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Performance Analytics Interface
  const PerformanceAnalyticsInterface = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
        <p className="text-sm text-gray-600">Track advisor effectiveness and user satisfaction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from(customAdvisors.values())
          .filter(advisor => advisor.performance)
          .map(advisor => (
          <div key={advisor.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">{advisor.avatar}</div>
              <div>
                <h4 className="font-semibold">{advisor.name}</h4>
                <p className="text-sm text-gray-600">{advisor.conversations} conversations</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${advisor.performance.accuracy}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{advisor.performance.accuracy}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Helpfulness</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${advisor.performance.helpfulness}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{advisor.performance.helpfulness}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${advisor.performance.engagement}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{advisor.performance.engagement}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expertise</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${advisor.performance.expertise}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{advisor.performance.expertise}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Business Impact</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  advisor.businessImpact === 'high' ? 'bg-green-100 text-green-800' :
                  advisor.businessImpact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  advisor.businessImpact === 'low' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {advisor.businessImpact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className={`bg-white rounded-lg border-2 border-gray-300 shadow-lg transition-all duration-300 ${
      isExpanded ? 'min-h-screen' : 'h-auto'
    }`}>
      {/* Module Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <Crown className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Custom Advisor Integration</h2>
            <p className="text-sm text-gray-600">Create, manage & integrate custom AI advisors</p>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            V23 Module
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">{customAdvisors.size} advisors</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600">{advisorUsageStats.activeAdvisors} active</span>
            </div>
          </div>
          
          {/* Expand/Minimize Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border-2 border-blue-700"
            aria-label={isExpanded ? "Minimize module" : "Expand module"}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Minimize</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Module Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'management', label: 'Advisor Management', icon: Users },
              { id: 'integration', label: 'Module Integration', icon: Network },
              { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
              { id: 'templates', label: 'Template Library', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === 'management' && <AdvisorManagementInterface />}
            {activeTab === 'integration' && <IntegrationStatusInterface />}
            {activeTab === 'analytics' && <PerformanceAnalyticsInterface />}
            {activeTab === 'templates' && <TemplateSelectionInterface />}
          </div>
        </div>
      )}

      {/* Collapsed State Preview */}
      {!isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{customAdvisors.size}</div>
              <div className="text-xs text-gray-600">Total Advisors</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{advisorUsageStats.activeAdvisors}</div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{advisorUsageStats.totalConversations}</div>
              <div className="text-xs text-gray-600">Conversations</div>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{advisorUsageStats.avgSatisfactionScore}%</div>
              <div className="text-xs text-gray-600">Satisfaction</div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsExpanded(true);
                setActiveTab('management');
                setShowCreateModal(true);
              }}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              Create Advisor
            </button>
            <button
              onClick={() => {
                setIsExpanded(true);
                setActiveTab('analytics');
              }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
            >
              View Analytics
            </button>
            <button
              onClick={() => {
                setIsExpanded(true);
                setActiveTab('integration');
              }}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
            >
              Check Integration
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateAdvisorModal />
      <TrainingProgressModal />
    </div>
  );
};

export default CustomAdvisorIntegrationModule;