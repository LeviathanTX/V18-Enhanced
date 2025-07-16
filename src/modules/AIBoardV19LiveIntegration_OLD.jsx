import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Brain, MessageSquare, Send, Upload, Users, Settings, Maximize2, 
  Minimize2, X, FileText, Loader2, CheckCircle, AlertCircle, 
  Mic, MicOff, Volume2, VolumeX, Download, Clock, Target, Star,
  ChevronUp, ChevronDown, Plus, Trash2, Edit3, User
} from 'lucide-react';

// ===== V19 LIVE AI INTEGRATION MODULE =====
// Fixed to work as a module card in V18 Core Shell
const AIBoardV19LiveIntegration = () => {
  // Module State
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [advisors, setAdvisors] = useState([
    {
      id: 'ceo-advisor',
      name: 'Sarah Chen',
      role: 'CEO Advisor',
      expertise: 'Strategic Leadership',
      avatar: '👩‍💼',
      status: 'active',
      color: 'blue'
    },
    {
      id: 'cfo-advisor', 
      name: 'Marcus Rodriguez',
      role: 'CFO Advisor',
      expertise: 'Financial Strategy',
      avatar: '👨‍💻',
      status: 'active',
      color: 'green'
    },
    {
      id: 'cto-advisor',
      name: 'Alex Kim',
      role: 'CTO Advisor', 
      expertise: 'Technology Strategy',
      avatar: '👨‍🔬',
      status: 'active',
      color: 'purple'
    }
  ]);

  // Chat functionality
  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      sender: 'You'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    try {
      // Simulate Claude API call
      const response = await window.claude?.complete(`You are an AI Board of Advisors. The user said: "${message}". Respond as a helpful business advisor providing strategic guidance. Keep responses concise but insightful.`);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'advisor',
        content: response || "I understand your question about business strategy. Based on current market conditions, I'd recommend focusing on three key areas: customer retention, operational efficiency, and strategic partnerships. Would you like me to elaborate on any of these areas?",
        timestamp: new Date(),
        sender: advisors[Math.floor(Math.random() * advisors.length)].name,
        advisorId: advisors[Math.floor(Math.random() * advisors.length)].id
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an issue. Please try again.',
        timestamp: new Date(),
        sender: 'System'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, advisors]);

  // Document upload handling
  const handleDocumentUpload = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: 'uploaded'
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
  }, []);

  // Compact Module Card View (default)
  const renderModuleCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      {/* Module Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live AI Integration</h3>
            <p className="text-sm text-gray-500">V19.0.0 - Real-time AI conversations</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expand module"
        >
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">{advisors.length} Advisors</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <MessageSquare className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">{messages.length} Messages</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">{documents.length} Documents</p>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700">Recent Activity</h4>
        {messages.length > 0 ? (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="line-clamp-2">"{messages[messages.length - 1]?.content.substring(0, 80)}..."</p>
            <p className="text-xs text-gray-500 mt-1">
              {messages[messages.length - 1]?.sender} • {messages[messages.length - 1]?.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No recent conversations</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Start Conversation
        </button>
        <button
          onClick={() => setIsExpanded(true)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );

  // Full Expanded Interface
  const renderExpandedInterface = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Expanded Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Board of Advisors</h2>
                <p className="text-blue-100">Live Intelligence System V19</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Advisors & Documents */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            {/* Active Advisors */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Advisors</h3>
              <div className="space-y-3">
                {advisors.map(advisor => (
                  <div key={advisor.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl">{advisor.avatar}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{advisor.name}</p>
                      <p className="text-sm text-gray-600">{advisor.role}</p>
                      <p className="text-xs text-gray-500">{advisor.expertise}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-${advisor.color}-500`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.json"
                  />
                  <Plus className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                </label>
              </div>
              <div className="space-y-2">
                {documents.length > 0 ? documents.map(doc => (
                  <div key={doc.id} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Your AI Board</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Start a conversation with your AI advisors. Upload documents, ask strategic questions, or discuss business challenges.
                  </p>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white'
                        : message.type === 'error'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.type === 'user' ? 'You' : message.sender}
                        </span>
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(currentInput)}
                  placeholder="Ask your AI board a question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => handleSendMessage(currentInput)}
                  disabled={!currentInput.trim() || isProcessing}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render Logic
  return isExpanded ? renderExpandedInterface() : renderModuleCard();
};

export default AIBoardV19LiveIntegration;