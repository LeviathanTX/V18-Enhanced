import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Brain, MessageSquare, Send, Upload, Users, Settings, Maximize2, 
  Minimize2, X, FileText, Loader2, CheckCircle, AlertCircle, 
  Plus, Trash2, User, Briefcase, DollarSign, BarChart3, Shield, 
  Lightbulb, TrendingUp, Clock, Target, Star, ChevronUp, ChevronDown
} from 'lucide-react';

// ===== AI BOARD V20 - LIVE CLAUDE MODULE =====
// Designed to integrate with V18 Core Shell architecture
const AIBoardV20LiveClaudeModule = () => {
  // ===== MODULE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [documentAnalysis, setDocumentAnalysis] = useState({});
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedAdvisors, setSelectedAdvisors] = useState(new Set(['ceo-advisor', 'cfo-advisor', 'cto-advisor']));
  const [activeSession, setActiveSession] = useState(null);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ===== ENHANCED AI ADVISORS =====
  const [advisors] = useState([
    {
      id: 'ceo-advisor',
      name: 'Alexandra Chen',
      role: 'CEO & Strategy Advisor',
      expertise: 'Strategic Leadership, Business Development, Fundraising',
      avatar: '👩‍💼',
      status: 'active',
      color: 'blue',
      personality: 'Visionary leader with 15+ years scaling companies from startup to IPO. Direct but supportive, focuses on long-term value creation.',
      background: 'Former CEO of three successful startups, took two companies public. Board member at Fortune 500 companies.',
      analysisStyle: 'strategic',
      communicationTone: 'executive'
    },
    {
      id: 'cfo-advisor',
      name: 'Marcus Thompson',
      role: 'CFO & Financial Advisor',
      expertise: 'Financial Planning, Unit Economics, Cash Flow Management',
      avatar: '💰',
      status: 'active',
      color: 'green',
      personality: 'Numbers-focused, asks tough financial questions. Pragmatic and detail-oriented. Always thinking about runway and burn rate.',
      background: 'Former CFO at unicorn startup, managed $500M+ in fundraising. Expert in SaaS metrics and financial modeling.',
      analysisStyle: 'analytical',
      communicationTone: 'data-driven'
    },
    {
      id: 'cto-advisor',
      name: 'Dr. Aisha Patel',
      role: 'CTO & Technology Advisor',
      expertise: 'Technical Architecture, Scalability, Security, AI/ML',
      avatar: '⚡',
      status: 'active',
      color: 'purple',
      personality: 'Pragmatic engineer who identifies technical risks early. Balances innovation with stability.',
      background: 'Former CTO at FAANG company, holds 20+ patents in distributed systems. Expert in scaling engineering teams.',
      analysisStyle: 'systematic',
      communicationTone: 'technical'
    },
    {
      id: 'cmo-advisor',
      name: 'Sarah Williams',
      role: 'CMO & Marketing Advisor',
      expertise: 'Marketing Strategy, Brand Building, Customer Acquisition',
      avatar: '📈',
      status: 'available',
      color: 'pink',
      personality: 'Customer-obsessed, data-driven growth expert. Creative but metrics-focused.',
      background: 'Scaled marketing from 0 to $100M ARR at multiple startups. Pioneer in product-led growth strategies.',
      analysisStyle: 'creative-analytical',
      communicationTone: 'enthusiastic'
    }
  ]);

  // ===== LIFECYCLE HOOKS =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('claude-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // ===== CORE FUNCTIONS =====
  const saveApiKey = useCallback((key) => {
    localStorage.setItem('claude-api-key', key);
    setApiKey(key);
    setShowApiKeyInput(false);
  }, []);

  const generateAdvisorPrompt = useCallback((advisor, userMessage, context) => {
    const documentContext = documents.length > 0 
      ? `\n\nAvailable Documents: ${documents.map(doc => `${doc.name} (${doc.type})`).join(', ')}`
      : '';
    
    const conversationContext = conversationHistory.length > 0
      ? `\n\nRecent Conversation:\n${conversationHistory.slice(-2).map(msg => `${msg.sender}: ${msg.content}`).join('\n')}`
      : '';

    return `You are ${advisor.name}, ${advisor.role} for an AI Board of Advisors platform.

ADVISOR PROFILE:
- Role: ${advisor.role}
- Expertise: ${advisor.expertise}
- Personality: ${advisor.personality}
- Background: ${advisor.background}
- Analysis Style: ${advisor.analysisStyle}
- Communication Tone: ${advisor.communicationTone}

CONTEXT:${documentContext}${conversationContext}

USER MESSAGE: "${userMessage}"

Respond as ${advisor.name} would, drawing on your expertise in ${advisor.expertise}. Keep responses concise but insightful (2-3 sentences max). Use your ${advisor.communicationTone} communication style and ${advisor.analysisStyle} analysis approach.

Focus on providing actionable business advice specific to your role as ${advisor.role}.`;
  }, [documents, conversationHistory]);

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
      sender: 'You',
      avatar: '👤'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    const messageToProcess = currentInput.trim();
    setCurrentInput('');

    // Get responses from selected advisors
    const activeAdvisors = advisors.filter(advisor => selectedAdvisors.has(advisor.id));
    
    for (const advisor of activeAdvisors) {
      try {
        const prompt = generateAdvisorPrompt(advisor, messageToProcess, {});
        let response;

        if (window.claude?.complete) {
          response = await window.claude.complete(prompt);
        } else if (apiKey) {
          // Simulated Claude API call - replace with actual API integration
          response = `Based on my experience as ${advisor.role}, I'd recommend focusing on ${advisor.expertise.split(',')[0].toLowerCase()}. This aligns with current market trends and your strategic objectives. What specific metrics are you tracking for this initiative?`;
        } else {
          response = `I understand your question about "${messageToProcess}". As your ${advisor.role}, I'd recommend analyzing this from a ${advisor.analysisStyle} perspective. What additional context can you provide about your current situation?`;
        }

        const advisorMessage = {
          id: Date.now() + Math.random(),
          type: 'advisor',
          content: response,
          timestamp: new Date(),
          sender: advisor.name,
          avatar: advisor.avatar,
          advisorId: advisor.id,
          role: advisor.role
        };
        
        setMessages(prev => [...prev, advisorMessage]);
        setConversationHistory(prev => [...prev, advisorMessage]);
        
        // Small delay between advisor responses for natural feel
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('Error getting advisor response:', error);
        const errorMessage = {
          id: Date.now() + Math.random(),
          type: 'error',
          content: `Sorry, I encountered an issue responding as ${advisor.name}. Please try again.`,
          timestamp: new Date(),
          sender: advisor.name,
          avatar: advisor.avatar,
          advisorId: advisor.id
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
    
    setIsProcessing(false);
  }, [currentInput, isProcessing, selectedAdvisors, advisors, generateAdvisorPrompt, apiKey]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleAdvisor = useCallback((advisorId) => {
    setSelectedAdvisors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(advisorId)) {
        newSet.delete(advisorId);
      } else {
        newSet.add(advisorId);
      }
      return newSet;
    });
  }, []);

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const newDoc = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date()
      };
      setDocuments(prev => [...prev, newDoc]);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeDocument = useCallback((docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  }, []);

  const startNewSession = useCallback(() => {
    setActiveSession({
      id: Date.now(),
      title: 'Advisory Session',
      startedAt: new Date()
    });
    setMessages([]);
    setConversationHistory([]);
  }, []);

  // ===== MODULE CARD VIEW (COLLAPSED) =====
  if (!isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live AI Advisory</h3>
              <p className="text-sm text-gray-500">V20 - Claude Integration</p>
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
        
        {/* Module Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{advisors.filter(a => selectedAdvisors.has(a.id)).length}</div>
            <div className="text-xs text-gray-500">Active Advisors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{messages.length}</div>
            <div className="text-xs text-gray-500">Messages</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">{documents.length}</div>
            <div className="text-xs text-gray-500">Documents</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              startNewSession();
              setIsExpanded(true);
            }}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-md border-2 border-blue-700 hover:border-blue-800"
          >
            Start Session
          </button>
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-bold shadow-md border-2 border-gray-700 hover:border-gray-800"
          >
            Open
          </button>
        </div>

        {/* Connection Status */}
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${apiKey || window.claude?.complete ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            <span className="text-gray-500">
              {apiKey || window.claude?.complete ? 'Claude Connected' : 'API Setup Required'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ===== EXPANDED MODULE VIEW =====
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">Live AI Advisory</h2>
              <p className="text-blue-100 text-sm">Claude-Powered Board of Advisors</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!apiKey && !window.claude?.complete && (
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-md border-2 border-white hover:border-blue-100"
              >
                Setup API
              </button>
            )}
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
        <div className="w-64 border-r border-gray-200 flex flex-col">
          {/* Advisor Selection */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm mb-2 text-gray-900">Active Advisors</h3>
            <div className="space-y-2">
              {advisors.slice(0, 3).map(advisor => (
                <div
                  key={advisor.id}
                  className={`p-2 rounded-lg border cursor-pointer transition-all ${
                    selectedAdvisors.has(advisor.id)
                      ? `bg-${advisor.color}-50 border-${advisor.color}-200 ring-1 ring-${advisor.color}-300`
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => toggleAdvisor(advisor.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{advisor.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{advisor.name}</p>
                      <p className="text-xs text-gray-600 truncate">{advisor.role}</p>
                    </div>
                    {selectedAdvisors.has(advisor.id) && (
                      <CheckCircle className={`w-4 h-4 text-${advisor.color}-600`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-900">Documents</h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-sm border border-blue-700"
                title="Upload Document"
              >
                <Plus className="w-3 h-3 text-white font-bold" />
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileText className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate">{doc.name}</span>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="w-4 h-4 rounded bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                    title="Remove Document"
                  >
                    <X className="w-2 h-2 text-white" />
                  </button>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-xs text-gray-500 italic">No documents uploaded</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.csv,.json"
            />
          </div>

          {/* Session Control */}
          <div className="p-4">
            <button
              onClick={startNewSession}
              className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-md border-2 border-green-700 hover:border-green-800"
            >
              New Session
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Ready for Advisory Session</h3>
                <p className="text-sm text-gray-600">Ask any business question to get insights from your selected advisors</p>
              </div>
            )}
            
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-gray-100 border border-gray-200 text-gray-800'
                  }`}
                >
                  {message.type === 'advisor' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{message.avatar}</span>
                      <div>
                        <p className="font-semibold text-xs text-gray-900">{message.sender}</p>
                        <p className="text-xs text-gray-600">{message.role}</p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Advisors are thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your advisors any business question..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isProcessing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold shadow-md border-2 border-blue-700 hover:border-blue-800"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Setup Claude API</h3>
            <input
              type="password"
              placeholder="Enter your Claude API key..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveApiKey(e.target.value);
                }
              }}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-bold shadow-md border-2 border-gray-700 hover:border-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.previousElementSibling;
                  saveApiKey(input.value);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md border-2 border-blue-700 hover:border-blue-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBoardV20LiveClaudeModule;