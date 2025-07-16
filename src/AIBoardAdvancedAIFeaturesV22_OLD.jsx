import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Brain, MessageSquare, Users, Settings, Maximize2, Minimize2, X, 
  Loader2, CheckCircle, AlertCircle, Plus, Trash2, Clock, Target, 
  Star, ChevronUp, ChevronDown, GitBranch, Database, Zap, 
  BarChart3, Lightbulb, TrendingUp, FileText, Play, Pause,
  Archive, RotateCcw, Bookmark, Filter, Search, Volume2, VolumeX,
  Eye, EyeOff, RefreshCw, Download, Share2, Copy, Save, History,
  Gauge, Activity, Atom, Network, Cpu, HardDrive, CloudLightning
} from 'lucide-react';

// ===== AI BOARD V22 - ADVANCED AI FEATURES MODULE =====
// Designed to integrate with V18 Core Shell architecture
const AIBoardAdvancedAIFeaturesModule = () => {
  // ===== MODULE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('inter-advisor');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Inter-Advisor Discussion State
  const [interAdvisorMode, setInterAdvisorMode] = useState(false);
  const [currentDebate, setCurrentDebate] = useState(null);
  const [debateHistory, setDebateHistory] = useState([]);
  const [advisorPairings, setAdvisorPairings] = useState([]);
  const [debateTopics, setDebateTopics] = useState([]);
  const [isDebateRunning, setIsDebateRunning] = useState(false);
  
  // Memory Persistence State
  const [conversationMemory, setConversationMemory] = useState(new Map());
  const [memoryIndex, setMemoryIndex] = useState(new Map());
  const [memoryStats, setMemoryStats] = useState({
    totalEntries: 0,
    strategicDecisions: 0,
    businessInsights: 0,
    actionItems: 0
  });
  const [memorySearch, setMemorySearch] = useState('');
  const [memoryResults, setMemoryResults] = useState([]);
  
  // Meeting Templates State
  const [meetingTemplates, setMeetingTemplates] = useState([]);
  const [activeMeetingTemplate, setActiveMeetingTemplate] = useState(null);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [templateBuilder, setTemplateBuilder] = useState({
    name: '',
    description: '',
    agenda: [],
    advisors: [],
    documents: [],
    duration: 60
  });
  
  // Business Intelligence State
  const [aiInsights, setAiInsights] = useState([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({});
  const [businessMetrics, setBusinessMetrics] = useState({});
  const [contextualRecommendations, setContextualRecommendations] = useState([]);
  
  // Advanced AI Configuration
  const [aiConfiguration, setAiConfiguration] = useState({
    memoryRetention: 'high',
    interAdvisorFrequency: 'moderate',
    contextualDepth: 'deep',
    predictiveAccuracy: 'balanced',
    businessIntelligence: 'enabled'
  });

  // Refs
  const debateRef = useRef(null);
  const memoryRef = useRef(null);

  // ===== ENHANCED AI ADVISORS WITH ADVANCED CAPABILITIES =====
  const [enhancedAdvisors] = useState([
    {
      id: 'ceo-advisor-enhanced',
      name: 'Alexandra Chen',
      role: 'CEO & Strategic Visionary',
      expertise: 'Strategic Leadership, Business Development, Fundraising, Market Expansion',
      avatar: '👩‍💼',
      status: 'active',
      color: 'blue',
      personality: 'Visionary leader with predictive market intelligence. Challenges conventional thinking and focuses on long-term value creation.',
      aiEnhancements: {
        memoryCapacity: 'strategic-decisions',
        debateStyle: 'strategic-challenger',
        contextAwareness: 'market-trends',
        predictiveAbility: 'business-outcomes',
        knowledgeIntegration: 'cross-functional'
      },
      specializedPrompts: {
        debate: "Challenge assumptions and provide strategic counterpoints",
        memory: "Focus on strategic decisions and long-term implications",
        prediction: "Forecast market trends and business outcomes"
      }
    },
    {
      id: 'cfo-advisor-enhanced',
      name: 'Marcus Thompson',
      role: 'CFO & Financial Intelligence',
      expertise: 'Financial Planning, Unit Economics, Cash Flow, Investment Strategy',
      avatar: '💰',
      status: 'active',
      color: 'green',
      personality: 'Numbers-focused with predictive financial modeling. Challenges financial assumptions and identifies hidden costs.',
      aiEnhancements: {
        memoryCapacity: 'financial-metrics',
        debateStyle: 'analytical-skeptic',
        contextAwareness: 'financial-health',
        predictiveAbility: 'financial-projections',
        knowledgeIntegration: 'quantitative-analysis'
      },
      specializedPrompts: {
        debate: "Question financial assumptions and provide data-driven alternatives",
        memory: "Track financial decisions and their outcomes",
        prediction: "Model financial scenarios and risk assessments"
      }
    },
    {
      id: 'cto-advisor-enhanced',
      name: 'Dr. Aisha Patel',
      role: 'CTO & Technology Strategist',
      expertise: 'Technical Architecture, AI/ML, Scalability, Security, Innovation',
      avatar: '⚡',
      status: 'active',
      color: 'purple',
      personality: 'Pragmatic engineer with advanced AI understanding. Balances innovation with technical debt and security.',
      aiEnhancements: {
        memoryCapacity: 'technical-decisions',
        debateStyle: 'technical-realist',
        contextAwareness: 'technology-trends',
        predictiveAbility: 'technical-risks',
        knowledgeIntegration: 'system-architecture'
      },
      specializedPrompts: {
        debate: "Identify technical risks and propose scalable solutions",
        memory: "Remember technical decisions and architecture choices",
        prediction: "Forecast technical challenges and emerging technologies"
      }
    },
    {
      id: 'cmo-advisor-enhanced',
      name: 'Sarah Martinez',
      role: 'CMO & Growth Intelligence',
      expertise: 'Digital Marketing, Customer Analytics, Brand Strategy, Growth Hacking',
      avatar: '🎯',
      status: 'active',
      color: 'orange',
      personality: 'Data-driven growth expert with customer behavior prediction. Challenges marketing assumptions with AI-powered insights.',
      aiEnhancements: {
        memoryCapacity: 'customer-insights',
        debateStyle: 'customer-advocate',
        contextAwareness: 'market-dynamics',
        predictiveAbility: 'customer-behavior',
        knowledgeIntegration: 'behavioral-analytics'
      },
      specializedPrompts: {
        debate: "Advocate for customer needs and challenge growth assumptions",
        memory: "Track customer insights and marketing performance",
        prediction: "Predict customer behavior and market responses"
      }
    }
  ]);

  // ===== DEFAULT MEETING TEMPLATES =====
  const [defaultTemplates] = useState([
    {
      id: 'quarterly-board-review',
      name: 'Quarterly Board Review',
      description: 'Comprehensive quarterly business review with all advisors',
      category: 'governance',
      duration: 90,
      agenda: [
        'Financial Performance Review',
        'Strategic Initiative Updates',
        'Market Analysis & Competitive Landscape',
        'Technical Infrastructure & Security',
        'Customer Growth & Retention',
        'Risk Assessment & Mitigation',
        'Q+1 Planning & Resource Allocation'
      ],
      advisors: ['ceo-advisor-enhanced', 'cfo-advisor-enhanced', 'cto-advisor-enhanced', 'cmo-advisor-enhanced'],
      aiFeatures: ['inter-advisor-debate', 'memory-integration', 'predictive-analytics'],
      documents: ['financial-statements', 'strategic-plan', 'customer-metrics'],
      expectedOutcomes: ['strategic-decisions', 'resource-allocation', 'risk-mitigation-plan']
    },
    {
      id: 'fundraising-strategy',
      name: 'Fundraising Strategy Session',
      description: 'Strategic fundraising planning with investor readiness assessment',
      category: 'fundraising',
      duration: 75,
      agenda: [
        'Valuation Analysis & Market Positioning',
        'Financial Projections & Unit Economics',
        'Technical Due Diligence Preparation',
        'Growth Story & Market Opportunity',
        'Investor Targeting & Deck Strategy',
        'Timeline & Milestone Planning'
      ],
      advisors: ['ceo-advisor-enhanced', 'cfo-advisor-enhanced', 'cto-advisor-enhanced'],
      aiFeatures: ['scenario-modeling', 'competitive-analysis', 'predictive-outcomes'],
      documents: ['pitch-deck', 'financial-model', 'competitive-analysis'],
      expectedOutcomes: ['fundraising-strategy', 'investor-targets', 'timeline-milestones']
    },
    {
      id: 'product-launch-review',
      name: 'Product Launch Strategy',
      description: 'Cross-functional product launch planning and execution review',
      category: 'product',
      duration: 60,
      agenda: [
        'Product-Market Fit Validation',
        'Go-to-Market Strategy',
        'Technical Launch Readiness',
        'Marketing & Customer Acquisition',
        'Financial Impact & Revenue Projections',
        'Risk Assessment & Contingency Planning'
      ],
      advisors: ['ceo-advisor-enhanced', 'cmo-advisor-enhanced', 'cto-advisor-enhanced'],
      aiFeatures: ['market-prediction', 'customer-behavior-analysis', 'technical-risk-assessment'],
      documents: ['product-specs', 'market-research', 'technical-architecture'],
      expectedOutcomes: ['launch-strategy', 'marketing-plan', 'technical-roadmap']
    },
    {
      id: 'crisis-management',
      name: 'Crisis Management & Response',
      description: 'Rapid response planning for business crises and emergencies',
      category: 'crisis',
      duration: 45,
      agenda: [
        'Situation Assessment & Impact Analysis',
        'Immediate Response Planning',
        'Communication Strategy',
        'Financial Impact & Cash Flow Protection',
        'Technical System Stability',
        'Recovery & Continuity Planning'
      ],
      advisors: ['ceo-advisor-enhanced', 'cfo-advisor-enhanced', 'cto-advisor-enhanced', 'cmo-advisor-enhanced'],
      aiFeatures: ['rapid-analysis', 'scenario-planning', 'real-time-monitoring'],
      documents: ['crisis-protocols', 'financial-reserves', 'technical-backups'],
      expectedOutcomes: ['crisis-response-plan', 'communication-strategy', 'recovery-timeline']
    }
  ]);

  // ===== SAMPLE DATA FOR DEMONSTRATION =====
  useEffect(() => {
    // Initialize with sample data for immediate testing
    const sampleMemory = new Map([
      ['strategic-decision-001', {
        type: 'strategic-decision',
        content: 'Decided to expand into European market Q2 2025',
        context: 'Board discussion on international expansion',
        participants: ['ceo-advisor-enhanced', 'cfo-advisor-enhanced'],
        timestamp: '2025-01-10T14:30:00Z',
        importance: 9,
        tags: ['expansion', 'international', 'q2-2025'],
        outcomes: ['hire-eu-team', 'setup-eu-entity', 'market-research-eu']
      }],
      ['financial-insight-002', {
        type: 'financial-insight',
        content: 'Unit economics improved 23% with new pricing model',
        context: 'Q4 financial review and pricing optimization',
        participants: ['cfo-advisor-enhanced', 'cmo-advisor-enhanced'],
        timestamp: '2025-01-08T10:15:00Z',
        importance: 8,
        tags: ['pricing', 'unit-economics', 'optimization'],
        outcomes: ['pricing-implementation', 'revenue-increase', 'margin-improvement']
      }],
      ['technical-risk-003', {
        type: 'technical-risk',
        content: 'Identified security vulnerabilities in payment processing',
        context: 'Security audit and technical review',
        participants: ['cto-advisor-enhanced', 'ceo-advisor-enhanced'],
        timestamp: '2025-01-05T16:45:00Z',
        importance: 10,
        tags: ['security', 'payments', 'vulnerability'],
        outcomes: ['security-patch', 'audit-compliance', 'process-improvement']
      }]
    ]);

    setConversationMemory(sampleMemory);
    setMemoryStats({
      totalEntries: sampleMemory.size,
      strategicDecisions: 1,
      businessInsights: 1,
      actionItems: 3
    });

    setMeetingTemplates(defaultTemplates);

    // Sample AI insights
    setAiInsights([
      {
        id: 'insight-001',
        type: 'opportunity',
        content: 'Customer retention increased 18% after product feature X launch',
        confidence: 92,
        impact: 'high',
        source: 'customer-data-analysis',
        timestamp: '2025-01-13T09:00:00Z'
      },
      {
        id: 'insight-002',
        type: 'risk',
        content: 'Competitor Y launching similar feature next month',
        confidence: 78,
        impact: 'medium',
        source: 'market-intelligence',
        timestamp: '2025-01-13T11:30:00Z'
      },
      {
        id: 'insight-003',
        type: 'prediction',
        content: 'Q1 revenue likely to exceed target by 12% based on current trends',
        confidence: 87,
        impact: 'high',
        source: 'financial-modeling',
        timestamp: '2025-01-13T14:15:00Z'
      }
    ]);

    setContextualRecommendations([
      {
        id: 'rec-001',
        title: 'Accelerate EU Expansion Timeline',
        description: 'Based on strong Q4 performance, consider moving EU launch from Q2 to Q1',
        priority: 'high',
        advisors: ['ceo-advisor-enhanced', 'cfo-advisor-enhanced'],
        confidence: 85,
        impact: 'revenue-growth'
      },
      {
        id: 'rec-002',
        title: 'Implement Advanced Security Monitoring',
        description: 'Proactive security measures recommended based on recent vulnerability assessment',
        priority: 'critical',
        advisors: ['cto-advisor-enhanced'],
        confidence: 95,
        impact: 'risk-mitigation'
      }
    ]);

    setDebateHistory([
      {
        id: 'debate-001',
        topic: 'EU Market Entry Strategy',
        participants: ['ceo-advisor-enhanced', 'cfo-advisor-enhanced'],
        duration: '12 minutes',
        outcome: 'Consensus on Q1 launch with phased approach',
        timestamp: '2025-01-10T14:45:00Z',
        keyPoints: [
          'CEO: Aggressive timeline for competitive advantage',
          'CFO: Conservative approach to manage cash flow',
          'Resolution: Phased launch with milestone gates'
        ]
      }
    ]);
  }, []);

  // ===== INTER-ADVISOR DISCUSSION FUNCTIONS =====
  const startInterAdvisorDebate = async (topic, participants) => {
    setIsDebateRunning(true);
    setIsProcessing(true);

    try {
      // Simulate Claude API call for inter-advisor debate
      const debatePrompt = `Generate an intelligent debate between ${participants.map(a => a.name).join(' and ')} about: "${topic}"

Each advisor should:
1. Present their perspective based on their expertise
2. Challenge other advisors' assumptions
3. Reference relevant business context
4. Maintain their unique personality and communication style
5. Work toward a practical resolution

${participants.map(advisor => `
${advisor.name} (${advisor.role}):
- Expertise: ${advisor.expertise}
- Debate Style: ${advisor.aiEnhancements.debateStyle}
- Should focus on: ${advisor.specializedPrompts.debate}
`).join('')}

Format as a structured debate with clear exchanges and a final consensus or action plan.`;

      // Mock API response - in production, this would call Claude
      const mockDebateResponse = await simulateClaudeResponse(debatePrompt);
      
      const newDebate = {
        id: 'debate-' + Date.now(),
        topic,
        participants,
        content: mockDebateResponse,
        timestamp: new Date().toISOString(),
        duration: '8 minutes',
        status: 'completed',
        outcome: 'Practical consensus reached with actionable next steps'
      };

      setCurrentDebate(newDebate);
      setDebateHistory(prev => [newDebate, ...prev]);

    } catch (error) {
      console.error('Debate generation error:', error);
    } finally {
      setIsDebateRunning(false);
      setIsProcessing(false);
    }
  };

  // ===== MEMORY MANAGEMENT FUNCTIONS =====
  const addToMemory = (type, content, context, participants = []) => {
    const memoryId = `${type}-${Date.now()}`;
    const importance = calculateMemoryImportance(type, content, context);
    
    const memoryEntry = {
      type,
      content,
      context,
      participants,
      timestamp: new Date().toISOString(),
      importance,
      tags: extractTags(content),
      outcomes: []
    };

    setConversationMemory(prev => new Map(prev.set(memoryId, memoryEntry)));
    updateMemoryStats();
  };

  const searchMemory = (query) => {
    if (!query.trim()) {
      setMemoryResults([]);
      return;
    }

    const results = Array.from(conversationMemory.entries())
      .filter(([id, entry]) => {
        const searchText = `${entry.content} ${entry.context} ${entry.tags.join(' ')}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
      .sort((a, b) => b[1].importance - a[1].importance)
      .slice(0, 10);

    setMemoryResults(results);
  };

  const calculateMemoryImportance = (type, content, context) => {
    let importance = 5; // Base importance

    // Type-based scoring
    if (type === 'strategic-decision') importance += 3;
    if (type === 'financial-insight') importance += 2;
    if (type === 'technical-risk') importance += 3;

    // Content analysis
    const highValueKeywords = ['revenue', 'strategy', 'security', 'expansion', 'funding'];
    highValueKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) importance += 1;
    });

    return Math.min(importance, 10);
  };

  const extractTags = (content) => {
    // Simple tag extraction - in production, this would use NLP
    const keywords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    return [...new Set(keywords)].slice(0, 5);
  };

  const updateMemoryStats = () => {
    const entries = Array.from(conversationMemory.values());
    setMemoryStats({
      totalEntries: entries.length,
      strategicDecisions: entries.filter(e => e.type === 'strategic-decision').length,
      businessInsights: entries.filter(e => e.type === 'business-insight').length,
      actionItems: entries.reduce((acc, e) => acc + e.outcomes.length, 0)
    });
  };

  // ===== MEETING TEMPLATE FUNCTIONS =====
  const createCustomTemplate = () => {
    if (!templateBuilder.name.trim()) return;

    const newTemplate = {
      id: 'custom-' + Date.now(),
      ...templateBuilder,
      category: 'custom',
      createdBy: 'user',
      timestamp: new Date().toISOString()
    };

    setCustomTemplates(prev => [newTemplate, ...prev]);
    setTemplateBuilder({
      name: '',
      description: '',
      agenda: [],
      advisors: [],
      documents: [],
      duration: 60
    });
  };

  const startTemplatedMeeting = (template) => {
    setActiveMeetingTemplate(template);
    // In production, this would initialize a meeting with the template structure
    console.log('Starting templated meeting:', template.name);
  };

  // ===== UTILITY FUNCTIONS =====
  const simulateClaudeResponse = async (prompt) => {
    // Mock response for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `**Alexandra Chen (CEO):** "I believe we should accelerate our EU expansion. The market opportunity is significant, and our Q4 performance gives us the confidence to move faster than originally planned."

**Marcus Thompson (CFO):** "I appreciate the optimism, Alexandra, but we need to consider the financial implications. Accelerating the timeline could strain our cash flow and increase burn rate by 30%. Have we fully analyzed the regulatory compliance costs?"

**Alexandra Chen:** "Valid concerns, Marcus. However, our competitor analysis shows two major players planning EU launches in Q3. If we wait until Q2, we'll be third to market. That's a significant disadvantage."

**Marcus Thompson:** "I understand the competitive pressure. Perhaps we could consider a phased approach? Launch in 2-3 key markets first, validate the model, then expand. This would reduce initial capital requirements while still giving us first-mover advantage in select markets."

**Consensus:** Implement phased EU expansion starting Q1 with 3 pilot markets (Germany, UK, Netherlands), with full rollout contingent on hitting specific milestones for user acquisition and unit economics.

**Next Steps:**
1. Detailed financial modeling for phased approach
2. Regulatory compliance assessment for pilot markets
3. Technical infrastructure planning for EU data requirements`;
  };

  // ===== UI COMPONENTS =====
  
  // Inter-Advisor Discussion Interface
  const InterAdvisorInterface = () => (
    <div className="space-y-6">
      {/* Quick Start Debate */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <GitBranch className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Start Inter-Advisor Discussion</h3>
          </div>
          {isDebateRunning && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Debate in progress...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => startInterAdvisorDebate(
              "European Market Entry Strategy", 
              [enhancedAdvisors[0], enhancedAdvisors[1]]
            )}
            disabled={isDebateRunning}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">🌍</span>
              <span className="font-medium">Market Expansion</span>
            </div>
            <p className="text-sm text-gray-600">CEO vs CFO on expansion strategy</p>
          </button>

          <button
            onClick={() => startInterAdvisorDebate(
              "Technical Debt vs Feature Development", 
              [enhancedAdvisors[2], enhancedAdvisors[0]]
            )}
            disabled={isDebateRunning}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">⚡</span>
              <span className="font-medium">Tech Strategy</span>
            </div>
            <p className="text-sm text-gray-600">CTO vs CEO on technical priorities</p>
          </button>

          <button
            onClick={() => startInterAdvisorDebate(
              "Customer Acquisition vs Retention Investment", 
              [enhancedAdvisors[3], enhancedAdvisors[1]]
            )}
            disabled={isDebateRunning}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">🎯</span>
              <span className="font-medium">Growth Focus</span>
            </div>
            <p className="text-sm text-gray-600">CMO vs CFO on growth investment</p>
          </button>
        </div>

        {/* Current Debate Display */}
        {currentDebate && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Current Debate: {currentDebate.topic}</h4>
              <span className="text-sm text-gray-500">{currentDebate.duration}</span>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line max-h-60 overflow-y-auto">
              {currentDebate.content}
            </div>
          </div>
        )}
      </div>

      {/* Debate History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Debates</h3>
        <div className="space-y-3">
          {debateHistory.map(debate => (
            <div key={debate.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">{debate.topic}</div>
                <div className="text-sm text-gray-600">
                  {debate.participants.map(p => p.name).join(' vs ')} • {debate.duration}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Resolved
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Memory Persistence Interface
  const MemoryInterface = () => (
    <div className="space-y-6">
      {/* Memory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Total Memories</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{memoryStats.totalEntries}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Strategic Decisions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{memoryStats.strategicDecisions}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium">Business Insights</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{memoryStats.businessInsights}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Action Items</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{memoryStats.actionItems}</div>
        </div>
      </div>

      {/* Memory Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Search Memory</h3>
        </div>
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            placeholder="Search conversations, decisions, insights..."
            value={memorySearch}
            onChange={(e) => {
              setMemorySearch(e.target.value);
              searchMemory(e.target.value);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {memoryResults.length > 0 && (
          <div className="space-y-3">
            {memoryResults.map(([id, entry]) => (
              <div key={id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    entry.type === 'strategic-decision' ? 'bg-blue-100 text-blue-800' :
                    entry.type === 'financial-insight' ? 'bg-green-100 text-green-800' :
                    entry.type === 'technical-risk' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {entry.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      Importance: {entry.importance}/10
                    </span>
                    <div className="flex space-x-1">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${
                          i < entry.importance / 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="font-medium mb-1">{entry.content}</div>
                <div className="text-sm text-gray-600 mb-2">{entry.context}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Participants: {entry.participants.join(', ')}</span>
                  <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memory Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Memory Entries</h3>
        <div className="space-y-4">
          {Array.from(conversationMemory.entries())
            .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
            .slice(0, 5)
            .map(([id, entry]) => (
            <div key={id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                entry.type === 'strategic-decision' ? 'bg-blue-500' :
                entry.type === 'financial-insight' ? 'bg-green-500' :
                entry.type === 'technical-risk' ? 'bg-red-500' :
                'bg-gray-500'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{entry.content}</div>
                <div className="text-sm text-gray-600 mt-1">{entry.context}</div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  <span>Importance: {entry.importance}/10</span>
                  <span>{entry.participants.length} participants</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Meeting Templates Interface
  const MeetingTemplatesInterface = () => (
    <div className="space-y-6">
      {/* Template Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                template.category === 'governance' ? 'bg-blue-100 text-blue-800' :
                template.category === 'fundraising' ? 'bg-green-100 text-green-800' :
                template.category === 'product' ? 'bg-purple-100 text-purple-800' :
                template.category === 'crisis' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {template.category}
              </span>
              <span className="text-xs text-gray-500">{template.duration}min</span>
            </div>
            <h4 className="font-medium mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {template.advisors.length} advisors • {template.agenda.length} topics
              </div>
              <button
                onClick={() => startTemplatedMeeting(template)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Builder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Create Custom Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <input
              type="text"
              value={templateBuilder.name}
              onChange={(e) => setTemplateBuilder(prev => ({...prev, name: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Monthly Product Review"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={templateBuilder.duration}
              onChange={(e) => setTemplateBuilder(prev => ({...prev, duration: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="15"
              max="180"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={templateBuilder.description}
            onChange={(e) => setTemplateBuilder(prev => ({...prev, description: e.target.value}))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Describe the purpose and expected outcomes of this meeting template"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={createCustomTemplate}
            disabled={!templateBuilder.name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Template
          </button>
        </div>
      </div>

      {/* Custom Templates */}
      {customTemplates.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Your Custom Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{template.duration}min</span>
                  <button
                    onClick={() => startTemplatedMeeting(template)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Business Intelligence Interface
  const BusinessIntelligenceInterface = () => (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
          <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        <div className="space-y-4">
          {aiInsights.map(insight => (
            <div key={insight.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  insight.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                  insight.type === 'risk' ? 'bg-red-100 text-red-800' :
                  insight.type === 'prediction' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {insight.type.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Confidence: {insight.confidence}%</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact} impact
                  </span>
                </div>
              </div>
              <div className="font-medium mb-1">{insight.content}</div>
              <div className="text-xs text-gray-500">
                Source: {insight.source} • {new Date(insight.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Contextual Recommendations</h3>
        <div className="space-y-4">
          {contextualRecommendations.map(rec => (
            <div key={rec.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{rec.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Recommended by: {rec.advisors.join(', ')} • Confidence: {rec.confidence}%
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 transition-colors">
                    Defer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">AI Enhancement Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Memory Retention</label>
            <select
              value={aiConfiguration.memoryRetention}
              onChange={(e) => setAiConfiguration(prev => ({...prev, memoryRetention: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low (30 days)</option>
              <option value="medium">Medium (90 days)</option>
              <option value="high">High (1 year)</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inter-Advisor Frequency</label>
            <select
              value={aiConfiguration.interAdvisorFrequency}
              onChange={(e) => setAiConfiguration(prev => ({...prev, interAdvisorFrequency: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low (Manual only)</option>
              <option value="moderate">Moderate (When relevant)</option>
              <option value="high">High (Frequent debates)</option>
              <option value="maximum">Maximum (Constant discussion)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className={`bg-white rounded-lg border-2 border-gray-300 shadow-lg transition-all duration-300 ${
      isExpanded ? 'min-h-screen' : 'h-auto'
    }`}>
      {/* Module Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <Atom className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Advanced AI Features</h2>
            <p className="text-sm text-gray-600">Inter-advisor discussions, memory persistence & intelligent templates</p>
          </div>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
            V22 Module
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* AI Status Indicators */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">{memoryStats.totalEntries} memories</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitBranch className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600">{debateHistory.length} debates</span>
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
              { id: 'inter-advisor', label: 'Inter-Advisor Discussions', icon: GitBranch },
              { id: 'memory', label: 'Memory Persistence', icon: Database },
              { id: 'templates', label: 'Meeting Templates', icon: FileText },
              { id: 'intelligence', label: 'Business Intelligence', icon: BarChart3 }
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
            {activeTab === 'inter-advisor' && <InterAdvisorInterface />}
            {activeTab === 'memory' && <MemoryInterface />}
            {activeTab === 'templates' && <MeetingTemplatesInterface />}
            {activeTab === 'intelligence' && <BusinessIntelligenceInterface />}
          </div>
        </div>
      )}

      {/* Collapsed State Preview */}
      {!isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <GitBranch className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{debateHistory.length}</div>
              <div className="text-xs text-gray-600">Debates</div>
            </div>
            <div className="text-center">
              <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{memoryStats.totalEntries}</div>
              <div className="text-xs text-gray-600">Memories</div>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{meetingTemplates.length}</div>
              <div className="text-xs text-gray-600">Templates</div>
            </div>
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{aiInsights.length}</div>
              <div className="text-xs text-gray-600">AI Insights</div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsExpanded(true);
                setActiveTab('inter-advisor');
              }}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
            >
              Start Debate
            </button>
            <button
              onClick={() => {
                setIsExpanded(true);
                setActiveTab('templates');
              }}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              Quick Meeting
            </button>
            <button
              onClick={() => {
                setIsExpanded(true);
                setActiveTab('intelligence');
              }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
            >
              View Insights
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MODULE DEFINITION FOR V18 CORE SHELL =====
export const moduleDefinition = {
  id: 'advanced-ai-features-v22',
  name: 'Advanced AI Features V22',
  description: 'Inter-advisor discussions, memory persistence, meeting templates, and business intelligence',
  version: '22.0.0',
  type: 'enterprise',
  category: 'AI Intelligence',
  icon: Brain,
  color: 'purple',
  status: 'installed',
  component: AIBoardAdvancedAIFeaturesModule,
  features: [
    'Inter-advisor debates and discussions',
    'Persistent conversation memory',
    'Customizable meeting templates',
    'AI-powered business intelligence',
    'Contextual recommendations',
    'Memory search and analytics'
  ],
  requirements: {
    subscription: 'enterprise',
    apiAccess: ['claude-api'],
    storage: 'vector-database'
  }
};

export default AIBoardAdvancedAIFeaturesModule;