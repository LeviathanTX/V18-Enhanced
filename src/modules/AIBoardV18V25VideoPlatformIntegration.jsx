import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Users, FileText, 
  Maximize2, Minimize2, X, Settings, Share2, Circle, 
  Calendar, Clock, Play, Pause, Download, MessageSquare,
  Brain, BarChart3, Shield, AlertCircle, CheckCircle,
  Loader2, Plus, Monitor, Camera, Volume2, VolumeX,
  Grid3X3, User, UserCheck, Zap, Star, Archive,
  RefreshCw, Bell, Send, ChevronUp, ChevronDown,
  PresentationChart, FileImage, Upload, Eye, Hash
} from 'lucide-react';

// ===== AI BOARD V18-V25 - VIDEO PLATFORM INTEGRATION MODULE =====
// Designed to integrate with V18 Core Shell, V20 Live Advisory, and V24 Document Intelligence
const AIBoardV18V25VideoPlatformModule = () => {
  // ===== MODULE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [meetingState, setMeetingState] = useState('lobby'); // lobby, connecting, active, ended
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [meetings, setMeetings] = useState(new Map());
  
  // Video/Audio Controls
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Meeting Management
  const [participants, setParticipants] = useState(new Map());
  const [activeAdvisors, setActiveAdvisors] = useState(new Set());
  const [meetingDocuments, setMeetingDocuments] = useState([]);
  const [meetingChat, setMeetingChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Platform Integration
  const [platformIntegrations, setPlatformIntegrations] = useState({
    zoom: { connected: false, status: 'disconnected' },
    teams: { connected: false, status: 'disconnected' },
    meet: { connected: true, status: 'active' }, // Sample: Google Meet connected
    webrtc: { connected: true, status: 'active' }
  });
  
  // Meeting Analytics & Intelligence
  const [meetingTranscript, setMeetingTranscript] = useState([]);
  const [realTimeInsights, setRealTimeInsights] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [meetingSummary, setMeetingSummary] = useState(null);
  
  // ===== SAMPLE DATA INITIALIZATION =====
  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    // Sample AI Advisors
    const sampleAdvisors = [
      {
        id: 'alexandra-chen',
        name: 'Alexandra Chen',
        role: 'CEO & Strategy Advisor',
        avatar: '👩‍💼',
        status: 'active',
        videoEnabled: true,
        audioEnabled: true,
        expertise: ['Strategic Planning', 'Fundraising', 'Leadership']
      },
      {
        id: 'marcus-thompson',
        name: 'Marcus Thompson',
        role: 'CFO & Financial Advisor',
        avatar: '💰',
        status: 'active',
        videoEnabled: true,
        audioEnabled: true,
        expertise: ['Financial Planning', 'Unit Economics', 'Cash Flow']
      },
      {
        id: 'aisha-patel',
        name: 'Dr. Aisha Patel',
        role: 'CTO & Technology Advisor',
        avatar: '⚡',
        status: 'available',
        videoEnabled: false,
        audioEnabled: true,
        expertise: ['Technical Architecture', 'Scalability', 'AI/ML']
      }
    ];

    // Sample Meetings
    const sampleMeetings = new Map([
      ['meeting-1', {
        id: 'meeting-1',
        title: 'Q1 Strategy Review',
        description: 'Quarterly business review with AI advisory board',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        duration: 60,
        participants: ['alexandra-chen', 'marcus-thompson'],
        documents: ['Q4 Financial Report.pdf', 'Market Research - AI Industry 2025.pdf'],
        platform: 'meet',
        status: 'scheduled',
        meetingRoom: 'meet.google.com/abc-def-ghi'
      }],
      ['meeting-2', {
        id: 'meeting-2',
        title: 'Technical Architecture Review',
        description: 'Deep dive into platform scalability and AI infrastructure',
        scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        duration: 90,
        participants: ['aisha-patel', 'alexandra-chen'],
        documents: ['Technical Architecture Plan.pdf'],
        platform: 'zoom',
        status: 'completed',
        recording: 'Available',
        summary: 'Discussed scaling challenges and AI integration roadmap'
      }]
    ]);

    // Sample Real-time Insights
    const sampleInsights = [
      {
        id: 'insight-1',
        type: 'financial',
        title: 'Revenue Growth Discussion',
        content: 'Strong Q4 performance with 23% YoY growth mentioned',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        advisor: 'marcus-thompson',
        actionSuggestion: 'Document specific growth drivers for Q1 planning'
      },
      {
        id: 'insight-2',
        type: 'strategic',
        title: 'Market Expansion Opportunity',
        content: 'Enterprise segment showing strong demand signals',
        confidence: 0.88,
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        advisor: 'alexandra-chen',
        actionSuggestion: 'Schedule follow-up to define enterprise strategy'
      }
    ];

    // Sample Action Items
    const sampleActionItems = [
      {
        id: 'action-1',
        title: 'Finalize Q1 Budget Allocation',
        description: 'Review and approve departmental budgets based on growth projections',
        assignee: 'Executive Team',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        relatedDocument: 'Q4 Financial Report.pdf'
      },
      {
        id: 'action-2',
        title: 'Technical Infrastructure Assessment',
        description: 'Evaluate current architecture for enterprise scaling requirements',
        assignee: 'Engineering Team',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        status: 'pending',
        relatedDocument: 'Technical Architecture Plan.pdf'
      }
    ];

    setParticipants(new Map(sampleAdvisors.map(advisor => [advisor.id, advisor])));
    setMeetings(sampleMeetings);
    setRealTimeInsights(sampleInsights);
    setActionItems(sampleActionItems);
  };

  // ===== MEETING CONTROL HANDLERS =====
  const startMeeting = useCallback(async (meetingId = null) => {
    setMeetingState('connecting');
    
    // Simulate platform connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const meeting = meetingId ? meetings.get(meetingId) : {
      id: `meeting-${Date.now()}`,
      title: 'AI Board Advisory Session',
      description: 'Real-time advisory meeting with AI board members',
      startTime: new Date(),
      platform: 'webrtc',
      status: 'active'
    };

    setCurrentMeeting(meeting);
    setMeetingState('active');
    setActiveAdvisors(new Set(['alexandra-chen', 'marcus-thompson']));
    
    // Start simulated real-time features
    startRealTimeFeatures();
  }, [meetings]);

  const endMeeting = useCallback(async () => {
    setMeetingState('ended');
    
    // Generate meeting summary
    const summary = await generateMeetingSummary();
    setMeetingSummary(summary);
    
    // Stop recording if active
    if (isRecording) {
      setIsRecording(false);
    }
    
    // Reset meeting state after showing summary
    setTimeout(() => {
      setMeetingState('lobby');
      setCurrentMeeting(null);
      setActiveAdvisors(new Set());
      setMeetingChat([]);
      setMeetingTranscript([]);
      setRealTimeInsights([]);
    }, 5000);
  }, [isRecording]);

  const startRealTimeFeatures = () => {
    // Simulate real-time transcript updates
    const transcriptInterval = setInterval(() => {
      if (meetingState === 'active') {
        const sampleTranscriptEntries = [
          { speaker: 'Executive User', text: 'Let\'s review our Q4 performance and discuss Q1 strategy.', timestamp: new Date() },
          { speaker: 'Alexandra Chen', text: 'The revenue growth of 23% is impressive. How are we planning to sustain this momentum?', timestamp: new Date() },
          { speaker: 'Marcus Thompson', text: 'We need to optimize our cash flow management while investing in growth initiatives.', timestamp: new Date() }
        ];
        
        const randomEntry = sampleTranscriptEntries[Math.floor(Math.random() * sampleTranscriptEntries.length)];
        setMeetingTranscript(prev => [...prev.slice(-10), randomEntry]); // Keep last 10 entries
      }
    }, 8000);

    // Cleanup interval when meeting ends
    setTimeout(() => clearInterval(transcriptInterval), 300000); // 5 minutes max
  };

  const generateMeetingSummary = async () => {
    // Simulate AI-powered meeting summary generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      title: currentMeeting?.title || 'AI Board Meeting',
      duration: '45 minutes',
      participants: Array.from(activeAdvisors).map(id => participants.get(id)?.name).join(', '),
      keyDiscussions: [
        'Q4 financial performance review - 23% revenue growth achieved',
        'Q1 strategic priorities and resource allocation',
        'Enterprise market expansion opportunities',
        'Technical infrastructure scaling requirements'
      ],
      decisions: [
        'Approve increased marketing budget for enterprise segment',
        'Initiate technical architecture review for scaling',
        'Schedule weekly executive team check-ins for Q1'
      ],
      actionItems: actionItems.length,
      nextSteps: 'Follow-up meetings scheduled for technical review and budget finalization',
      confidence: 0.94
    };
  };

  // ===== PLATFORM INTEGRATION HANDLERS =====
  const connectPlatform = async (platform) => {
    setPlatformIntegrations(prev => ({
      ...prev,
      [platform]: { ...prev[platform], status: 'connecting' }
    }));

    // Simulate platform connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPlatformIntegrations(prev => ({
      ...prev,
      [platform]: { connected: true, status: 'active' }
    }));
  };

  const addChatMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'Executive User',
        message: chatInput,
        timestamp: new Date(),
        type: 'user'
      };
      
      setMeetingChat(prev => [...prev, newMessage]);
      setChatInput('');
      
      // Simulate AI advisor response
      setTimeout(() => {
        const advisorResponses = [
          'That\'s an excellent point about market positioning.',
          'I agree with this strategic direction.',
          'We should consider the financial implications of this decision.',
          'This aligns well with our technical roadmap.'
        ];
        
        const randomAdvisor = Array.from(activeAdvisors)[0];
        const advisor = participants.get(randomAdvisor);
        
        if (advisor) {
          const advisorMessage = {
            id: Date.now() + 1,
            sender: advisor.name,
            message: advisorResponses[Math.floor(Math.random() * advisorResponses.length)],
            timestamp: new Date(),
            type: 'advisor'
          };
          setMeetingChat(prev => [...prev, advisorMessage]);
        }
      }, 2000);
    }
  };

  // ===== RENDER COMPONENTS =====
  const renderMeetingLobby = () => (
    <div className="p-6">
      <div className="text-center mb-8">
        <Video className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Board Meeting Room</h3>
        <p className="text-gray-600">Connect with your AI advisory board for strategic guidance</p>
      </div>

      {/* Quick Start Meeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Start Immediate Meeting</h4>
          <p className="text-sm text-gray-600 mb-4">Begin an impromptu advisory session</p>
          <button
            onClick={() => startMeeting()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Start Meeting Now
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Schedule Meeting</h4>
          <p className="text-sm text-gray-600 mb-4">Plan a future advisory session</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Schedule New Meeting
          </button>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Upcoming Meetings</h4>
        <div className="space-y-3">
          {Array.from(meetings.values()).filter(m => m.status === 'scheduled').map(meeting => (
            <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{meeting.title}</h5>
                  <p className="text-sm text-gray-600">{meeting.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {meeting.scheduledTime.toLocaleTimeString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {meeting.participants.length} advisors
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => startMeeting(meeting.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                >
                  Join Meeting
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Integration Status */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Platform Integrations</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(platformIntegrations).map(([platform, config]) => (
            <div key={platform} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">
                {platform === 'zoom' && '🔵'}
                {platform === 'teams' && '🟣'}
                {platform === 'meet' && '🟢'}
                {platform === 'webrtc' && '🔴'}
              </div>
              <p className="text-xs font-medium text-gray-900 capitalize">{platform}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                config.status === 'active' ? 'bg-green-100 text-green-600' :
                config.status === 'connecting' ? 'bg-yellow-100 text-yellow-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {config.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveMeeting = () => (
    <div className="h-[600px] flex flex-col">
      {/* Meeting Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">{currentMeeting?.title}</h3>
          {isRecording && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              REC
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-lg transition-colors ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Record className="w-4 h-4" />
          </button>
          
          <button
            onClick={endMeeting}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            End Meeting
          </button>
        </div>
      </div>

      {/* Meeting Content */}
      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* User Video */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {isVideoEnabled ? (
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    EU
                  </div>
                ) : (
                  <VideoOff className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Executive User
              </div>
            </div>

            {/* AI Advisors Grid */}
            {Array.from(activeAdvisors).slice(0, 3).map(advisorId => {
              const advisor = participants.get(advisorId);
              return (
                <div key={advisorId} className="bg-gray-800 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {advisor?.videoEnabled ? (
                      <div className="text-6xl">{advisor.avatar}</div>
                    ) : (
                      <VideoOff className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {advisor?.name}
                  </div>
                  <div className="absolute top-2 right-2">
                    {advisor?.audioEnabled ? (
                      <Mic className="w-4 h-4 text-green-400" />
                    ) : (
                      <MicOff className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button className="flex-1 py-2 px-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Chat
              </button>
              <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900">
                Insights
              </button>
              <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900">
                Documents
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {meetingChat.map(message => (
              <div key={message.id} className={`${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block max-w-[80%] p-2 rounded-lg text-sm ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-xs font-medium mb-1">{message.sender}</p>
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addChatMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addChatMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Controls */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Monitor className="w-5 h-5" />
          </button>
          
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMeetingSummary = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Meeting Completed</h3>
        <p className="text-gray-600">Your AI advisory session has been summarized</p>
      </div>

      {meetingSummary && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">{meetingSummary.title}</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium">{meetingSummary.duration}</p>
              <p className="text-xs text-gray-600">Duration</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium">{meetingSummary.actionItems}</p>
              <p className="text-xs text-gray-600">Action Items</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Key Discussions</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {meetingSummary.keyDiscussions.map((discussion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{discussion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Decisions Made</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {meetingSummary.decisions.map((decision, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <Download className="w-4 h-4 inline mr-2" />
              Download Summary
            </button>
            <button className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
              <Share2 className="w-4 h-4 inline mr-2" />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="bg-white rounded-xl border-2 border-gray-300 shadow-lg overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Video className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Video Platform Integration V25</h2>
              <p className="text-sm text-red-100">AI-powered board meetings with real-time insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {meetingState === 'connecting' && <Loader2 className="w-5 h-5 animate-spin" />}
            {meetingState === 'active' && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                LIVE
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-lg border-2 border-red-300 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Module Content */}
      {isExpanded && (
        <div className="bg-gray-50">
          {meetingState === 'lobby' && renderMeetingLobby()}
          {meetingState === 'connecting' && (
            <div className="p-8 text-center">
              <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting to Meeting</h3>
              <p className="text-gray-600">Setting up your AI advisory session...</p>
            </div>
          )}
          {meetingState === 'active' && renderActiveMeeting()}
          {meetingState === 'ended' && renderMeetingSummary()}
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{meetings.size}</p>
                <p className="text-xs text-gray-600">Total Meetings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{participants.size}</p>
                <p className="text-xs text-gray-600">AI Advisors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(platformIntegrations).filter(p => p.connected).length}
                </p>
                <p className="text-xs text-gray-600">Platforms</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                meetingState === 'active' ? 'bg-red-100 text-red-600' :
                meetingState === 'connecting' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {meetingState === 'active' ? 'Meeting Active' :
                 meetingState === 'connecting' ? 'Connecting' : 'Ready'}
              </span>
              
              {meetingState === 'lobby' && (
                <button
                  onClick={() => startMeeting()}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                >
                  Start Meeting
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MODULE DEFINITION FOR V18 CORE SHELL =====
export const moduleDefinition = {
  id: 'video-platform-integration-v25',
  name: 'Video Platform Integration V25',
  description: 'Comprehensive video meeting platform with AI advisor integration and real-time insights',
  version: '25.0.0',
  type: 'enterprise',
  category: 'Collaboration',
  icon: Video,
  color: 'red',
  status: 'ready',
  component: AIBoardV18V25VideoPlatformModule,
  features: [
    'Multi-platform video integration (Zoom, Teams, Meet, WebRTC)',
    'AI advisor video participation with realistic avatars',
    'Real-time meeting transcription and insights',
    'Document sharing during meetings',
    'Meeting recording and automated summaries',
    'Action item tracking with AI suggestions',
    'Cross-platform compatibility and seamless handoffs',
    'Integration with V20 Live Advisory and V24 Document Intelligence'
  ],
  requirements: {
    subscription: 'enterprise',
    apiAccess: ['claude-api', 'video-platforms', 'transcription-service'],
    storage: 'meeting-recordings',
    integrations: ['v20-live-advisory', 'v24-document-intelligence', 'zoom-api', 'teams-api', 'meet-api']
  },
  businessValue: {
    primaryUseCase: 'Enable professional AI-powered board meetings with video, documents, and real-time insights',
    targetMarket: 'Executives and business leaders who need high-quality advisory meetings with AI board members',
    revenueImpact: 'Premium enterprise feature driving highest-tier subscription adoption',
    competitiveDifferentiator: 'Only platform combining video meetings with AI advisors and document intelligence'
  },
  integrationPoints: {
    v20Integration: 'AI advisors participate directly in video meetings with contextual responses',
    v24Integration: 'Documents are shared and analyzed in real-time during meetings',
    platformAPIs: 'Native integration with Zoom, Microsoft Teams, and Google Meet APIs',
    recordingSystem: 'Automated recording, transcription, and summary generation'
  }
};

export default AIBoardV18V25VideoPlatformModule;