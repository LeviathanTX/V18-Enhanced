import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Brain, MessageSquare, Send, Upload, Users, Settings,
  FileText, Loader2, CheckCircle, AlertCircle, 
  Plus, Trash2, User, Briefcase, DollarSign, BarChart3, Shield, 
  Lightbulb, TrendingUp, Clock, Target, Star, ChevronUp, ChevronDown
} from 'lucide-react';

// ===== AI BOARD V20 - SIMPLIFIED FOR SHELL INTEGRATION =====
const AIBoardV20LiveClaudeModule = ({ onAction, sharedContext }) => {
  // ===== MODULE STATE =====
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAdvisors, setProcessingAdvisors] = useState(new Set());
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
      expertise: 'Technical Architecture, AI/ML, Product Development',
      avatar: '⚡',
      color: 'purple',
      personality: 'Technical visionary who balances innovation with practical implementation. Focuses on scalable solutions and emerging technologies.',
      systemPrompt: `You are Dr. Aisha Patel, CTO and Technology Advisor. You're a technical visionary who balances innovation with practical implementation. Focus on scalable solutions and emerging technologies. Provide insights on technical architecture, product development, and technology strategy. Keep responses technically informed but accessible (2-3 paragraphs max).`
    },
    'cmo-advisor': {
      id: 'cmo-advisor',
      name: 'Sarah Williams',
      role: 'CMO & Marketing Advisor',
      expertise: 'Marketing Strategy, Customer Acquisition, Brand Development',
      avatar: '📈',
      color: 'pink',
      personality: 'Growth-focused marketer with deep customer insights. Data-driven but creative, always thinking about customer acquisition and retention.',
      systemPrompt: `You are Sarah Williams, CMO and Marketing Advisor. You're growth-focused with deep customer insights. You're data-driven but creative, always thinking about customer acquisition and retention. Focus on marketing strategy, customer development, and brand building. Keep responses actionable and growth-oriented (2-3 paragraphs max).`
    }
  };

  // ===== INITIALIZATION =====
  useEffect(() => {
    // Check for existing API key
    const savedKey = localStorage.getItem('claude_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setConnectionStatus('connected');
    }

    // Initialize with shared context if available
    if (sharedContext?.conversation && sharedContext.conversation.length > 0) {
      setMessages(sharedContext.conversation.filter(msg => msg.source !== 'shell'));
    }
  }, [sharedContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ===== HANDLERS =====
  const saveApiKey = (key) => {
    if (key.startsWith('sk-ant-')) {
      setApiKey(key);
      localStorage.setItem('claude_api_key', key);
      setConnectionStatus('connected');
      setShowApiKeyInput(false);
    } else {
      alert('Please enter a valid Claude API key (starts with sk-ant-)');
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: currentInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    // Notify shell of message
    if (onAction) {
      onAction('live-advisory', 'send-message', { content: userMessage.content });
    }

    try {
      // Real Claude API call
      if (connectionStatus === 'connected' && apiKey) {
        const selectedAdvisorsList = Array.from(selectedAdvisors);
        setProcessingAdvisors(new Set(selectedAdvisorsList));

        for (const advisorId of selectedAdvisorsList) {
          const advisor = advisors[advisorId];
          if (!advisor) continue;

          try {
            const contextDocs = sharedContext?.documents ? 
              Array.from(sharedContext.documents.values())
                .filter(doc => doc.status === 'analyzed')
                .map(doc => `${doc.name}: ${doc.insights?.join(', ') || 'Analysis available'}`)
                .join('\n') : '';

            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1000,
                messages: [
                  {
                    role: 'user',
                    content: `${advisor.systemPrompt}

Context Documents Available:
${contextDocs}

Recent Conversation:
${messages.slice(-3).map(m => `${m.type}: ${m.content}`).join('\n')}

Current Question: ${currentInput}`
                  }
                ]
              })
            });

            if (response.ok) {
              const data = await response.json();
              const advisorMessage = {
                id: `advisor-${Date.now()}-${advisorId}`,
                type: 'advisor',
                advisorId: advisorId,
                advisorName: advisor.name,
                content: data.content[0].text,
                timestamp: new Date().toISOString(),
                confidence: 0.9
              };

              setMessages(prev => [...prev, advisorMessage]);
              setProcessingAdvisors(prev => {
                const updated = new Set(prev);
                updated.delete(advisorId);
                return updated;
              });
            }
          } catch (error) {
            console.error(`Error from ${advisor.name}:`, error);
            setProcessingAdvisors(prev => {
              const updated = new Set(prev);
              updated.delete(advisorId);
              return updated;
            });
          }
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          const advisorMessage = {
            id: `advisor-${Date.now()}`,
            type: 'advisor',
            advisorId: 'ceo-advisor',
            advisorName: 'Alexandra Chen',
            content: `Thank you for that question. Based on our analysis and the available context, I recommend focusing on sustainable growth strategies that align with your current market position. This approach will help ensure long-term success while managing risk effectively.`,
            timestamp: new Date().toISOString(),
            confidence: 0.85
          };
          setMessages(prev => [...prev, advisorMessage]);
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
      setProcessingAdvisors(new Set());
    }
  }, [currentInput, isProcessing, selectedAdvisors, apiKey, connectionStatus, messages, sharedContext, onAction]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0 && onAction) {
      onAction('live-advisory', 'upload-document', { files });
    }
  };

  const toggleAdvisor = (advisorId) => {
    setSelectedAdvisors(prev => {
      const updated = new Set(prev);
      if (updated.has(advisorId)) {
        updated.delete(advisorId);
      } else {
        updated.add(advisorId);
      }
      return updated;
    });
  };

  // ===== RENDER MESSAGE =====
  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="bg-blue-600 text-white rounded-lg px-4 py-3 max-w-md">
            <p>{message.content}</p>
            <span className="text-xs text-blue-100 mt-1 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    }

    if (message.type === 'advisor') {
      const advisor = advisors[message.advisorId];
      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="flex items-start space-x-3 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">{advisor?.avatar || '🤖'}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">{message.advisorName || advisor?.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700">{message.content}</p>
              {message.confidence && (
                <div className="mt-2 text-xs text-gray-500">
                  Confidence: {Math.round(message.confidence * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ===== RENDER WELCOME =====
  const renderWelcomeInterface = () => (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Live AI Advisory</h3>
        <p className="text-gray-600">
          Get strategic guidance from expert AI advisors. Ask questions, upload documents, or start a strategic discussion.
        </p>
      </div>

      {/* Advisor Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Active Advisors ({selectedAdvisors.size})</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.values(advisors).map(advisor => (
            <button
              key={advisor.id}
              onClick={() => toggleAdvisor(advisor.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedAdvisors.has(advisor.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{advisor.avatar}</div>
              <div className="text-xs font-medium text-gray-900">{advisor.name}</div>
              <div className="text-xs text-gray-500">{advisor.role}</div>
              {selectedAdvisors.has(advisor.id) && (
                <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            <span className="text-sm font-medium">
              {connectionStatus === 'connected' ? 'Claude API Connected' : 'Claude API Setup Required'}
            </span>
          </div>
          {connectionStatus !== 'connected' && (
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Documents Status */}
      {sharedContext?.documents && sharedContext.documents.size > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {sharedContext.documents.size} Document{sharedContext.documents.size !== 1 ? 's' : ''} Available
            </span>
          </div>
          <div className="text-xs text-green-700">
            {Array.from(sharedContext.documents.values()).map(doc => doc.name).join(', ')}
          </div>
        </div>
      )}
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="p-6 h-full">
      {messages.length === 0 ? (
        renderWelcomeInterface()
      ) : (
        <div className="flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4">
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
          <div className="border-t border-gray-200 pt-4">
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
                    <span>{sharedContext?.documents?.size || 0} document{(sharedContext?.documents?.size || 0) !== 1 ? 's' : ''} available</span>
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
      )}

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