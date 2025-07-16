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
  Send, Upload, Loader2, DollarSign, Play, Pause, Lightbulb,
  GitBranch
} from 'lucide-react';

// ===== AI BOARD V20 LIVE CLAUDE MODULE =====
const AIBoardV20LiveClaude = ({ isExpanded, crossModuleContext, onContextUpdate, globalDocuments, setGlobalDocuments }) => {
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

  // ===== USE SHARED DOCUMENTS =====
  useEffect(() => {
    // Check for documents from global state
    if (globalDocuments && globalDocuments.length > 0) {
      // Auto-start meeting if documents are loaded
      setMeetingActive(true);
    }
  }, [globalDocuments]);

  // ===== AI RESPONSE GENERATION =====
  const generateAdvisorResponse = async (advisor, question, documents = []) => {
    if (!window.claude) {
      return "I'm currently unable to connect to the AI service. Please ensure Claude API is available.";
    }

    try {
      // Include document content if available
      let docContext = '';
      if (documents.length > 0) {
        docContext = '\n\nAvailable documents and their content:\n';
        documents.forEach(doc => {
          docContext += `\nDocument: ${doc.name}\n`;
          if (doc.extractedText && doc.extractedText.length > 0) {
            // Include actual content for text files
            docContext += `Content: ${doc.extractedText.substring(0, 1000)}...\n`;
          } else {
            // Note limitation for other file types
            docContext += `Content: ${doc.content}\n`;
          }
        });
      }

      const prompt = `${advisor.systemPrompt}

User Question: "${question}"${docContext}

Provide strategic advice as ${advisor.name}. If documents are mentioned, reference their actual content in your response.`;

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

    // Get documents from global state
    const documents = globalDocuments || [];

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
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Pass files to Document Intelligence module via context
      onContextUpdate(prev => {
        const newContext = new Map(prev);
        newContext.set('files_to_process', Array.from(files));
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

        {/* Document Status */}
        {globalDocuments && globalDocuments.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {globalDocuments.length} document{globalDocuments.length > 1 ? 's' : ''} available for analysis
                </span>
              </div>
              <button
                onClick={() => onContextUpdate(prev => {
                  const newContext = new Map(prev);
                  newContext.set('navigate_to', 'intelligence-center');
                  return newContext;
                })}
                className="text-xs text-green-600 hover:text-green-800 underline"
              >
                View documents
              </button>
            </div>
          </div>
        )}
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
const EnhancedDocumentIntelligenceV24 = ({ isExpanded, crossModuleContext, onContextUpdate, globalDocuments, setGlobalDocuments }) => {
  const [processingDoc, setProcessingDoc] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const fileInputRef = useRef(null);

  // Check for files from other modules
  useEffect(() => {
    const filesToProcess = crossModuleContext.get('files_to_process');
    if (filesToProcess && filesToProcess.length > 0) {
      // Process files from other modules
      processFiles(filesToProcess);
      
      // Clear the context
      onContextUpdate(prev => {
        const newContext = new Map(prev);
        newContext.delete('files_to_process');
        return newContext;
      });
    }
  }, [crossModuleContext]);

  // Process files with content reading
  const processFiles = async (files) => {
    for (const file of files) {
      await processDocument(file);
    }
  };

  // Document processing with content extraction
  const processDocument = async (file) => {
    setProcessingDoc(file.name);
    setProcessingStatus('Reading file...');
    
    try {
      let content = '';
      let extractedText = '';
      let documentData = {};
      
      // Read file content based on type
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setProcessingStatus('Extracting text content...');
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        extractedText = content;
        documentData = { type: 'text', wordCount: content.split(/\s+/).length };
        
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setProcessingStatus('Parsing CSV data...');
        const csvText = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        
        // Parse CSV using simple parser (in real app, use Papa Parse)
        const lines = csvText.split('\n');
        const headers = lines[0]?.split(',').map(h => h.trim());
        const rows = lines.slice(1).filter(line => line.trim());
        
        extractedText = `CSV with ${headers?.length || 0} columns and ${rows.length} rows. Headers: ${headers?.join(', ')}`;
        content = csvText;
        documentData = { 
          type: 'csv', 
          headers, 
          rowCount: rows.length,
          preview: rows.slice(0, 3).join('\n')
        };
        
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setProcessingStatus('Extracting PDF content...');
        
        // In a real implementation, we'd use pdf.js here
        // For artifact environment, we'll simulate PDF extraction
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
        
        // Simulated PDF content (in production, use pdf.js)
        extractedText = `[PDF Content - ${file.name}]\n\nThis is a simulation of PDF content extraction. In a production environment, this would contain the actual text extracted from the PDF using pdf.js library.\n\nThe PDF appears to contain information about business strategy, market analysis, and financial projections. Key sections would be extracted and analyzed here.`;
        
        documentData = { 
          type: 'pdf',
          pageCount: 10, // simulated
          hasImages: true,
          hasCharts: true
        };
        
      } else if (file.type.includes('word') || file.name.match(/\.(doc|docx)$/)) {
        setProcessingStatus('Extracting Word document content...');
        
        // In real implementation, we'd use mammoth.js
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
        
        // Simulated Word content
        extractedText = `[Word Document - ${file.name}]\n\nThis is a simulation of Word document content extraction. In production, mammoth.js would extract formatted text, preserving structure like headings, lists, and paragraphs.\n\nThe document would contain your business content with proper formatting preserved.`;
        
        documentData = { 
          type: 'word',
          hasFormatting: true,
          hasTables: true,
          hasImages: false
        };
        
      } else if (file.type.includes('sheet') || file.type.includes('excel') || file.name.match(/\.(xls|xlsx)$/)) {
        setProcessingStatus('Parsing Excel spreadsheet...');
        
        // In real implementation, we'd use SheetJS (xlsx)
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
        
        // Simulated Excel content
        extractedText = `[Excel Spreadsheet - ${file.name}]\n\nThis is a simulation of Excel content extraction. In production, SheetJS would extract:\n- Multiple worksheets\n- Cell values and formulas\n- Charts and pivot tables\n\nExample data: Financial projections, KPIs, budget analysis`;
        
        documentData = { 
          type: 'excel',
          sheetCount: 3,
          hasFormulas: true,
          hasCharts: true,
          sheets: ['Summary', 'Financial Data', 'Projections']
        };
        
      } else {
        content = `[${file.type} Document]`;
        extractedText = `File type ${file.type} uploaded but content extraction not implemented.`;
        documentData = { type: 'unknown' };
      }
      
      setProcessingStatus('Generating AI insights...');
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate insights based on content
      const insights = generateDocumentInsights(file.name, extractedText, documentData);
      
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: content, // Original content
        extractedText: extractedText, // Extracted text for AI
        documentData: documentData, // Structured data
        uploadDate: new Date().toISOString(),
        status: 'processed',
        insights: insights
      };

      // Update global documents
      setGlobalDocuments(prev => [...prev, newDoc]);
      setProcessingDoc(null);
      setProcessingStatus('');
      
      // Notify other modules about new document
      onContextUpdate(prev => {
        const newContext = new Map(prev);
        newContext.set('new_document_processed', {
          id: newDoc.id,
          name: newDoc.name,
          hasContent: extractedText.length > 100
        });
        return newContext;
      });
      
    } catch (error) {
      console.error('Error processing document:', error);
      setProcessingDoc(null);
      setProcessingStatus('');
      
      // Still add the document but mark as error
      const errorDoc = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: '[Error reading file]',
        extractedText: '',
        uploadDate: new Date().toISOString(),
        status: 'error',
        insights: [{ type: 'error', content: `Error processing file: ${error.message}` }]
      };
      
      setGlobalDocuments(prev => [...prev, errorDoc]);
    }
  };

  // Generate document insights based on content
  const generateDocumentInsights = (fileName, content, docData) => {
    const insights = [];
    
    // Basic insights
    insights.push({
      type: 'overview',
      icon: 'FileText',
      content: `Document type: ${docData.type?.toUpperCase() || 'Unknown'}, Size: ${content.length} characters`
    });
    
    // Content-based insights
    if (content.length > 100) {
      // Word frequency analysis
      const words = content.toLowerCase().split(/\s+/);
      const wordCount = words.length;
      
      insights.push({
        type: 'statistics',
        icon: 'BarChart3',
        content: `Contains approximately ${wordCount} words`
      });
      
      // Look for key business terms
      const businessTerms = ['revenue', 'growth', 'market', 'strategy', 'customer', 'profit', 'cost', 'risk', 'opportunity'];
      const foundTerms = businessTerms.filter(term => 
        content.toLowerCase().includes(term)
      );
      
      if (foundTerms.length > 0) {
        insights.push({
          type: 'keywords',
          icon: 'Target',
          content: `Key topics detected: ${foundTerms.join(', ')}`
        });
      }
      
      // Document-specific insights
      if (docData.type === 'excel' || docData.type === 'csv') {
        insights.push({
          type: 'data',
          icon: 'Database',
          content: 'Contains structured data suitable for analysis and visualization'
        });
      }
      
      if (docData.type === 'pdf' || docData.type === 'word') {
        insights.push({
          type: 'document',
          icon: 'FileText',
          content: 'Business document ready for strategic analysis'
        });
      }
    }
    
    // Add preview
    if (content && content.length > 0) {
      insights.push({
        type: 'preview',
        icon: 'Eye',
        content: content.substring(0, 150) + '...'
      });
    }
    
    return insights;
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      await processFiles(Array.from(files));
    }
  };

  const removeDocument = (docId) => {
    setGlobalDocuments(prev => prev.filter(doc => doc.id !== docId));
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
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-blue-700 font-medium">Processing {processingDoc}</span>
          </div>
          {processingStatus && (
            <p className="text-sm text-blue-600 ml-8">{processingStatus}</p>
          )}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {globalDocuments.map(doc => (
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
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Document Insights */}
            <div className="space-y-2">
              {doc.insights.map((insight, idx) => {
                // Map insight types to icons
                const iconMap = {
                  'overview': FileText,
                  'statistics': BarChart3,
                  'keywords': Target,
                  'data': Database,
                  'document': FileText,
                  'preview': Eye,
                  'error': AlertCircle,
                  'summary': Lightbulb,
                  'risk': Shield,
                  'opportunity': TrendingUp
                };
                
                const Icon = iconMap[insight.type] || Lightbulb;
                
                return (
                  <div key={idx} className="flex items-start space-x-2 text-sm">
                    <Icon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700">{insight.content}</span>
                  </div>
                );
              })}
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
const AIBoardAdvancedAIFeaturesV22 = ({ isExpanded, crossModuleContext, onContextUpdate, globalDocuments }) => {
  const [activeTab, setActiveTab] = useState('inter-advisor');
  const [interAdvisorMode, setInterAdvisorMode] = useState(false);
  const [currentDebate, setCurrentDebate] = useState(null);
  const [debateHistory, setDebateHistory] = useState([]);
  const [conversationMemory, setConversationMemory] = useState(new Map());
  const [memoryStats, setMemoryStats] = useState({
    totalEntries: 0,
    strategicDecisions: 0,
    businessInsights: 0,
    actionItems: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Enhanced advisors with debate capabilities
  const enhancedAdvisors = {
    'ceo-advisor': {
      name: 'Alexandra Chen',
      role: 'CEO & Strategic Visionary',
      avatar: '👩‍💼',
      debateStyle: 'strategic-challenger',
      focus: 'long-term value creation and market opportunities'
    },
    'cfo-advisor': {
      name: 'Marcus Thompson', 
      role: 'CFO & Financial Intelligence',
      avatar: '💰',
      debateStyle: 'analytical-skeptic',
      focus: 'financial implications and risk assessment'
    },
    'cto-advisor': {
      name: 'Dr. Aisha Patel',
      role: 'CTO & Technology Strategist',
      avatar: '⚡',
      debateStyle: 'technical-realist',
      focus: 'technical feasibility and scalability'
    },
    'cmo-advisor': {
      name: 'Sarah Williams',
      role: 'CMO & Growth Intelligence',
      avatar: '📈',
      debateStyle: 'customer-advocate',
      focus: 'market dynamics and customer needs'
    }
  };

  // Initialize with sample data
  useEffect(() => {
    // Sample memory entries
    const sampleMemory = new Map([
      ['decision-001', {
        type: 'strategic-decision',
        content: 'Decided to expand into European market Q2 2025',
        context: 'Based on document analysis showing 40% market opportunity',
        participants: ['ceo-advisor', 'cfo-advisor'],
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        importance: 9,
        documentRefs: globalDocuments.map(d => d.id).slice(0, 2)
      }]
    ]);
    
    setConversationMemory(sampleMemory);
    updateMemoryStats(sampleMemory);
  }, [globalDocuments]);

  // Memory management
  const updateMemoryStats = (memory) => {
    const entries = Array.from(memory.values());
    setMemoryStats({
      totalEntries: entries.length,
      strategicDecisions: entries.filter(e => e.type === 'strategic-decision').length,
      businessInsights: entries.filter(e => e.type === 'business-insight').length,
      actionItems: entries.reduce((acc, e) => acc + (e.outcomes?.length || 0), 0)
    });
  };

  // Inter-advisor debate
  const startInterAdvisorDebate = async (topic, participants) => {
    setIsProcessing(true);
    
    try {
      // Get relevant documents
      const relevantDocs = globalDocuments.filter(doc => 
        doc.extractedText && doc.extractedText.toLowerCase().includes(topic.toLowerCase())
      );

      // Build debate prompt with document context
      const docContext = relevantDocs.length > 0 
        ? `\n\nRelevant documents:\n${relevantDocs.map(d => 
            `- ${d.name}: ${d.extractedText.substring(0, 300)}...`
          ).join('\n')}`
        : '';

      const advisorDetails = participants.map(id => enhancedAdvisors[id]);
      
      // Simulate debate (in production, would call Claude API)
      const mockDebate = {
        id: 'debate-' + Date.now(),
        topic,
        participants: advisorDetails,
        content: `**${advisorDetails[0].name}**: "Based on the document analysis, I believe ${topic} presents a significant opportunity. The data shows..."

**${advisorDetails[1].name}**: "I appreciate the optimism, but we need to consider the financial implications. Our analysis indicates..."

**Consensus**: After thorough discussion, both advisors agree on a phased approach with specific milestones and risk mitigation strategies.`,
        timestamp: new Date().toISOString(),
        documentRefs: relevantDocs.map(d => d.id),
        outcome: 'Consensus reached with action plan'
      };

      setCurrentDebate(mockDebate);
      setDebateHistory(prev => [mockDebate, ...prev]);

      // Add to memory
      const memoryEntry = {
        type: 'strategic-decision',
        content: `Debate conclusion: ${mockDebate.outcome}`,
        context: topic,
        participants: participants,
        timestamp: new Date().toISOString(),
        importance: 8,
        documentRefs: relevantDocs.map(d => d.id)
      };

      const newMemory = new Map(conversationMemory);
      newMemory.set('debate-' + Date.now(), memoryEntry);
      setConversationMemory(newMemory);
      updateMemoryStats(newMemory);

      // Update cross-module context
      onContextUpdate(prev => {
        const newContext = new Map(prev);
        newContext.set('v22_last_debate', mockDebate);
        newContext.set('v22_memory_updated', Date.now());
        return newContext;
      });

    } catch (error) {
      console.error('Debate error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick debate starters based on documents
  const suggestedDebates = globalDocuments.length > 0 ? [
    {
      topic: "Strategic implications of uploaded documents",
      participants: ['ceo-advisor', 'cfo-advisor'],
      icon: '🌍'
    },
    {
      topic: "Technical feasibility vs business opportunity",
      participants: ['cto-advisor', 'ceo-advisor'],
      icon: '⚡'
    },
    {
      topic: "Customer impact and market positioning",
      participants: ['cmo-advisor', 'cfo-advisor'],
      icon: '🎯'
    }
  ] : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">Advanced AI Features V22</h4>
        <p className="text-gray-600">Inter-advisor discussions, memory persistence, and deep document analysis</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'inter-advisor', label: 'Inter-Advisor Debates', icon: GitBranch },
          { id: 'memory', label: 'Memory & Context', icon: Database },
          { id: 'insights', label: 'Document Insights', icon: Lightbulb }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Inter-Advisor Debates Tab */}
      {activeTab === 'inter-advisor' && (
        <div className="space-y-4">
          {/* Quick Start Debates */}
          {globalDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestedDebates.map((debate, idx) => (
                <button
                  key={idx}
                  onClick={() => startInterAdvisorDebate(debate.topic, debate.participants)}
                  disabled={isProcessing}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{debate.icon}</span>
                    <span className="font-medium text-sm">{debate.topic}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {debate.participants.map(id => enhancedAdvisors[id].name).join(' vs ')}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Upload documents to enable context-aware advisor debates</p>
            </div>
          )}

          {/* Current Debate */}
          {currentDebate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium">Current Debate: {currentDebate.topic}</h5>
                <span className="text-sm text-gray-500">
                  {currentDebate.participants.map(p => p.name).join(' vs ')}
                </span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {currentDebate.content}
              </div>
              {currentDebate.documentRefs?.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  Referenced {currentDebate.documentRefs.length} document(s)
                </div>
              )}
            </div>
          )}

          {/* Debate History */}
          {debateHistory.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Recent Debates</h5>
              {debateHistory.map(debate => (
                <div key={debate.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{debate.topic}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(debate.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{debate.outcome}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Memory Tab */}
      {activeTab === 'memory' && (
        <div className="space-y-4">
          {/* Memory Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <Database className="w-5 h-5 text-blue-600 mb-1" />
              <div className="text-lg font-semibold">{memoryStats.totalEntries}</div>
              <div className="text-xs text-gray-600">Total Memories</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <Target className="w-5 h-5 text-green-600 mb-1" />
              <div className="text-lg font-semibold">{memoryStats.strategicDecisions}</div>
              <div className="text-xs text-gray-600">Decisions</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <Lightbulb className="w-5 h-5 text-orange-600 mb-1" />
              <div className="text-lg font-semibold">{memoryStats.businessInsights}</div>
              <div className="text-xs text-gray-600">Insights</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <CheckCircle className="w-5 h-5 text-purple-600 mb-1" />
              <div className="text-lg font-semibold">{memoryStats.actionItems}</div>
              <div className="text-xs text-gray-600">Actions</div>
            </div>
          </div>

          {/* Recent Memories */}
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">Recent Memory Entries</h5>
            {Array.from(conversationMemory.entries()).map(([id, entry]) => (
              <div key={id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{entry.content}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-600">{entry.context}</div>
                {entry.documentRefs?.length > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    Linked to {entry.documentRefs.length} document(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {globalDocuments.length > 0 ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900">Cross-Document Analysis</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Analyzing {globalDocuments.length} documents for patterns and strategic insights...
                    </p>
                  </div>
                </div>
              </div>

              {/* Document-based insights */}
              <div className="space-y-3">
                {globalDocuments.map(doc => (
                  <div key={doc.id} className="p-3 border border-gray-200 rounded-lg">
                    <h6 className="font-medium text-sm mb-2">{doc.name}</h6>
                    <div className="space-y-1">
                      {doc.documentData?.type === 'csv' && (
                        <div className="text-xs text-gray-600">
                          📊 Structured data with {doc.documentData.rowCount} rows - ideal for trend analysis
                        </div>
                      )}
                      {doc.documentData?.keywords && (
                        <div className="text-xs text-gray-600">
                          🔍 Key topics: {doc.documentData.keywords.join(', ')}
                        </div>
                      )}
                      <button
                        onClick={() => startInterAdvisorDebate(
                          `Strategic analysis of ${doc.name}`,
                          ['ceo-advisor', 'cfo-advisor']
                        )}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        → Generate advisor analysis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-1">Upload documents to enable deep AI analysis</p>
            </div>
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>AI advisors are analyzing...</span>
        </div>
      )}
    </div>
  );
};

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
  const [moduleStates, setModuleStates] = useState(new Map());
  const [crossModuleContext, setCrossModuleContext] = useState(new Map());
  const [notifications, setNotifications] = useState([]);
  
  // Global Documents State (persists across workspaces)
  const [globalDocuments, setGlobalDocuments] = useState([]);
  
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
        notifications: 0,
        lastActivity: new Date()
      });
    });
    setModuleStates(initialStates);

    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // ===== CONTEXT UPDATES =====
  useEffect(() => {
    // Handle any cross-module context updates here if needed
  }, [crossModuleContext]);

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
          {/* Document Count */}
          {globalDocuments.length > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{globalDocuments.length}</span>
            </div>
          )}

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
    const ModuleComponent = module.component;

    return (
      <div
        key={module.id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
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
          </div>
        </div>

        {/* Module Content */}
        <div className="max-h-[600px] overflow-y-auto">
          <ModuleComponent 
            crossModuleContext={crossModuleContext}
            onContextUpdate={setCrossModuleContext}
            globalDocuments={globalDocuments}
            setGlobalDocuments={setGlobalDocuments}
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
          <div className="grid grid-cols-1 gap-6">
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