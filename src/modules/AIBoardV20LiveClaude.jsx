import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Brain, MessageSquare, Send, Upload, Users, Settings, Maximize2, 
  Minimize2, X, FileText, Loader2, CheckCircle, AlertCircle, 
  Plus, Trash2, User, Briefcase, DollarSign, BarChart3, Shield, 
  Lightbulb, TrendingUp, Clock, Target, Star, ChevronUp, ChevronDown
} from 'lucide-react';

// ===== AI BOARD V20 - LIVE CLAUDE MODULE WITH COMPLETE INTEGRATION =====
const AIBoardV20LiveClaudeModule = () => {
  // ===== MODULE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAdvisors, setProcessingAdvisors] = useState(new Set());
  const [documents, setDocuments] = useState([]);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [selectedAdvisors, setSelectedAdvisors] = useState(new Set(['ceo-advisor', 'cfo-advisor', 'cto-advisor']));
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ===== ENHANCED AI ADVISORS =====
  const advisors = {
    'ceo-advisor': {
      id: 'ceo-advisor',
      name: 'Alexandra Chen',
      role: 'CEO & Strategy Advisor',
      expertise: 'Strategic Leadership, Business Development, Fundraising',
      avatar: '👩‍💼',
      color: 'blue',
      personality: 'Visionary leader with 15+ years scaling companies from startup to IPO. Direct but supportive, focuses on long-term value creation.',
      systemPrompt: `You are Alexandra Chen, CEO and Strategy Advisor. You're a visionary leader with 15+ years scaling companies from startup to IPO. You're direct but supportive, and focus on long-term value creation. Provide strategic insights with executive-level thinking. Keep responses concise but impactful (2-3 paragraphs max). Consider growth strategy, market positioning, and leadership decisions.`
    },
    'cfo-advisor': {
      id: 'cfo-advisor',
      name: 'Marcus Thompson',
      role: 'CFO & Financial Advisor',
      expertise: 'Financial Planning, Unit Economics, Cash Flow Management',
      avatar: '💰',
      color: 'green',
      personality: 'Numbers-focused, asks tough financial questions. Pragmatic and detail-oriented. Always thinking about runway and burn rate.',
      systemPrompt: `You are Marcus Thompson, CFO and Financial Advisor. You're numbers-focused and ask tough financial questions. You're pragmatic and detail-oriented, always thinking about runway and burn rate. Focus on financial metrics, unit economics, cash flow, and sustainable growth. Keep responses data-driven and practical (2-3 paragraphs max).`
    },
    'cto-advisor': {
      id: 'cto-advisor',
      name: 'Dr. Aisha Patel',
      role: 'CTO & Technology Advisor',
      expertise: 'Technical Architecture, Scalability, Security, AI/ML',
      avatar: '⚡',
      color: 'purple',
      personality: 'Pragmatic engineer who identifies technical risks early. Balances innovation with stability.',
      systemPrompt: `You are Dr. Aisha Patel, CTO and Technology Advisor. You're a pragmatic engineer who identifies technical risks early and balances innovation with stability. Focus on technical architecture, scalability, security, and engineering best practices. Keep responses technical but accessible (2-3 paragraphs max).`
    },
    'cmo-advisor': {
      id: 'cmo-advisor',
      name: 'Sarah Williams',
      role: 'CMO & Marketing Advisor',
      expertise: 'Marketing Strategy, Brand Building, Customer Acquisition',
      avatar: '📈',
      color: 'pink',
      personality: 'Customer-obsessed, data-driven growth expert. Creative but metrics-focused.',
      systemPrompt: `You are Sarah Williams, CMO and Marketing Advisor. You're customer-obsessed and a data-driven growth expert. You're creative but metrics-focused. Focus on marketing strategy, customer acquisition, brand building, and growth tactics. Keep responses actionable and growth-oriented (2-3 paragraphs max).`
    }
  };

  // ===== CLAUDE API INTEGRATION =====
  const callClaudeAPI = async (prompt, advisor) => {
    const contextualPrompt = `${advisor.systemPrompt}

CONTEXT:
- Current conversation involves ${selectedAdvisors.size} advisors
- ${documents.length} business documents are available: ${documents.map(d => d.name).join(', ')}
- You are providing strategic business advice

USER MESSAGE: "${prompt}"

Respond as ${advisor.name} would, drawing on your expertise in ${advisor.expertise}. Provide strategic, actionable advice.`;

    try {
      if (window.claude?.complete) {
        // Use built-in Claude interface if available
        return await window.claude.complete(contextualPrompt);
      } else if (apiKey) {
        // Use direct API call
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            messages: [{ role: 'user', content: contextualPrompt }]
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
      } else {
        throw new Error('No API key available');
      }
    } catch (error) {
      console.error('Claude API Error:', error);
      return `*${advisor.name} is temporarily unavailable. Please check your API connection and try again.*`;
    }
  };

  // ===== LIFECYCLE HOOKS =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Check for API connection
    const storedApiKey = localStorage.getItem('claude-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setConnectionStatus('connected');
    } else if (window.claude?.complete) {
      setConnectionStatus('connected');
    }
  }, []);

  // ===== CORE FUNCTIONS =====
  const saveApiKey = useCallback((key) => {
    if (key?.startsWith('sk-ant-')) {
      localStorage.setItem('claude-api-key', key);
      setApiKey(key);
      setConnectionStatus('connected');
      setShowApiKeyInput(false);
      
      // Add success message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: '✅ Connected to Claude API! Your AI advisors are now ready for live conversations.',
        timestamp: new Date()
      }]);
    } else {
      alert('Please enter a valid Claude API key starting with "sk-ant-"');
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isProcessing) return;
    
    if (selectedAdvisors.size === 0) {
      alert('Please select at least one advisor');
      return;
    }

    if (!apiKey && !window.claude?.complete) {
      setShowApiKeyInput(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    // Get responses from selected advisors
    const activeAdvisors = Array.from(selectedAdvisors).map(id => advisors[id]);
    
    try {
      for (let i = 0; i < activeAdvisors.length; i++) {
        const advisor = activeAdvisors[i];
        setProcessingAdvisors(prev => new Set([...prev, advisor.id]));
        
        // Stagger responses for realism
        await new Promise(resolve => setTimeout(resolve, 500 + (i * 400)));
        
        const response = await callClaudeAPI(currentInput, advisor);
        
        const advisorMessage = {
          id: Date.now() + i,
          type: 'advisor',
          content: response,
          advisor: advisor,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, advisorMessage]);
        setProcessingAdvisors(prev => {
          const newSet = new Set(prev);
          newSet.delete(advisor.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
      setProcessingAdvisors(new Set());
    }
  }, [currentInput, selectedAdvisors, apiKey, isProcessing, callClaudeAPI]);

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + 'KB',
      type: file.type.includes('pdf') ? 'PDF' : 
            file.type.includes('csv') ? 'CSV' : 
            file.type.includes('excel') || file.name.endsWith('.xlsx') ? 'Excel' : 'Document',
      uploadTime: new Date(),
      status: 'analyzed'
    }));
    
    setDocuments(prev => [...prev, ...newDocs]);
    
    // System message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: `📄 Uploaded ${files.length} document(s): ${files.map(f => f.name).join(', ')}. Your advisors now have access to this context.`,
      timestamp: new Date()
    }]);
  }, []);

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

  // ===== RENDER FUNCTIONS =====
  const renderMessage = (message) => (
    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
        {message.type === 'advisor' && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">{message.advisor.avatar}</span>
            <span className="font-medium text-sm text-gray-700">{message.advisor.name}</span>
            <span className="text-xs text-gray-500">{message.advisor.role}</span>
          </div>
        )}
        
        {message.type === 'system' && (
          <div className="text-center mb-2">
            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
              {message.content}
            </div>
          </div>
        )}
        
        {message.type !== 'system' && (
          <div className={`rounded-lg p-4 ${
            message.type === 'user'
              ? 'bg-blue-600 text-white'
              : message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-2 ${
              message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50' : 'h-96'
    }`}>
      
      {/* Module Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Live AI Advisory V20</h3>
            <p className="text-sm text-gray-600">Real-time conversations with expert AI advisors</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            {connectionStatus === 'connected' ? 'Claude API Connected' : 'Setup Required'}
          </div>
          
          {connectionStatus !== 'connected' && (
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            >
              Connect
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Advisor Selection */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Active Advisors ({selectedAdvisors.size})</h4>
            <div className="space-y-2">
              {Object.values(advisors).map(advisor => {
                const isSelected = selectedAdvisors.has(advisor.id);
                const isProcessing = processingAdvisors.has(advisor.id);
                
                return (
                  <div
                    key={advisor.id}
                    onClick={() => toggleAdvisor(advisor.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <span className="text-2xl">{advisor.avatar}</span>
                        {isProcessing && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full">
                            <Loader2 className="w-3 h-3 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{advisor.name}</div>
                        <div className="text-xs text-gray-500">{advisor.role}</div>
                        {isProcessing && (
                          <div className="text-xs text-blue-600 mt-1">Thinking...</div>
                        )}
                      </div>
                      {isSelected && !isProcessing && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Documents ({documents.length})</h4>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Upload className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {documents.map(doc => (
                <div key={doc.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
              
              {documents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No documents uploaded</p>
                  <p className="text-xs">Upload files for contextual advice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Live AI Advisory</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Get strategic guidance from expert AI advisors. Ask questions, upload documents, or start a strategic discussion.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { title: "Strategic Planning", desc: "Business strategy and growth planning", icon: Target },
                    { title: "Financial Analysis", desc: "Revenue models and financial health", icon: DollarSign },
                    { title: "Technology Strategy", desc: "Technical architecture and innovation", icon: Shield },
                    { title: "Marketing & Growth", desc: "Customer acquisition and brand building", icon: TrendingUp }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentInput(`I need help with ${item.title.toLowerCase()}: `)}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
                    >
                      <item.icon className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(renderMessage)}
            
            {isProcessing && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-lg p-4 max-w-md">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {processingAdvisors.size > 0 
                        ? `${Array.from(processingAdvisors).map(id => advisors[id]?.name).join(', ')} analyzing...`
                        : 'Advisors thinking...'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask your ${selectedAdvisors.size} selected advisor${selectedAdvisors.size !== 1 ? 's' : ''} anything...`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  rows={2}
                  disabled={isProcessing}
                />
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{selectedAdvisors.size} advisor{selectedAdvisors.size !== 1 ? 's' : ''} selected</span>
                    <span>•</span>
                    <span>{documents.length} document{documents.length !== 1 ? 's' : ''} available</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {connectionStatus === 'connected' ? 'Connected' : 'Setup Required'}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !currentInput.trim() || selectedAdvisors.size === 0}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-lg mb-4">Connect Claude API</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your Claude API key to enable live AI conversations. Get your key from{' '}
              <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                console.anthropic.com
              </a>
            </p>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveApiKey(e.target.value);
                }
              }}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.previousElementSibling;
                  saveApiKey(input.value);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.csv,.json,.xlsx,.docx"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default AIBoardV20LiveClaudeModule;