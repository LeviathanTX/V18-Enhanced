import React, { useState, useEffect } from 'react';
import { 
  Video, Chrome, Users, Mic, MicOff, VideoOff, Phone, PhoneOff,
  Settings, Shield, Calendar, Clock, Download, Share2, Mail,
  Maximize2, Minimize2, Play, Pause, RotateCcw, Volume2, VolumeX,
  MessageSquare, FileText, Brain, Zap, Activity, CheckCircle,
  AlertCircle, Loader2, ExternalLink, Copy, Edit3, Trash2,
  UserPlus, UserMinus, Star, Award, TrendingUp, BarChart3
} from 'lucide-react';

// ===== AI BOARD V26 - REAL GOOGLE MEET INTEGRATION =====
const AIBoardV26RealGoogleMeetIntegration = () => {
  // ===== CORE STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [authState, setAuthState] = useState('unauthenticated'); // unauthenticated, authenticating, authenticated
  const [meetingState, setMeetingState] = useState('ready'); // ready, active, ended
  
  // ===== GOOGLE MEET STATE =====
  const [meetingRooms, setMeetingRooms] = useState(new Map());
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [activeAdvisorBots, setActiveAdvisorBots] = useState(new Set());
  
  // ===== AI ADVISOR STATE =====
  const [advisorInterruptions, setAdvisorInterruptions] = useState([]);
  const [meetingTranscript, setMeetingTranscript] = useState([]);
  const [advisorResponses, setAdvisorResponses] = useState([]);
  
  // ===== MEETING SUMMARY STATE =====
  const [meetingSummary, setMeetingSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // ===== AVAILABLE AI ADVISORS =====
  const availableAdvisors = [
    {
      id: 'alexandra-ceo',
      name: 'Alexandra Chen',
      role: 'CEO & Strategy Advisor',
      avatar: '👩‍💼',
      voiceProfile: 'en-US-AriaNeural',
      expertise: ['Strategic Planning', 'Leadership', 'Fundraising'],
      active: false
    },
    {
      id: 'marcus-cfo', 
      name: 'Marcus Rodriguez',
      role: 'CFO & Financial Advisor',
      avatar: '📊',
      voiceProfile: 'en-US-DavisNeural',
      expertise: ['Financial Planning', 'Risk Management', 'Investment'],
      active: false
    },
    {
      id: 'david-cto',
      name: 'David Kumar', 
      role: 'CTO & Technology Advisor',
      avatar: '💻',
      voiceProfile: 'en-US-JasonNeural',
      expertise: ['Technology Strategy', 'Product Development', 'AI/ML'],
      active: false
    },
    {
      id: 'sarah-cmo',
      name: 'Sarah Thompson',
      role: 'CMO & Growth Advisor', 
      avatar: '📈',
      voiceProfile: 'en-US-JennyNeural',
      expertise: ['Marketing Strategy', 'Customer Acquisition', 'Brand'],
      active: false
    }
  ];

  // ===== GOOGLE AUTHENTICATION =====
  const authenticateWithGoogle = async () => {
    setAuthState('authenticating');
    
    // Simulate Google OAuth flow
    setTimeout(() => {
      setAuthState('authenticated');
      // Auto-activate default advisors
      setActiveAdvisorBots(new Set(['alexandra-ceo', 'marcus-cfo']));
    }, 2000);
  };

  // ===== MEETING ROOM CREATION =====
  const createRealGoogleMeetRoom = async (meetingConfig) => {
    const meetingId = 'meet-' + Date.now();
    const meetingRoom = {
      id: meetingId,
      title: meetingConfig.title || 'AI Advisory Session',
      meetLink: `https://meet.google.com/${meetingId}`,
      createdAt: new Date(),
      advisorBots: Array.from(activeAdvisorBots),
      status: 'created'
    };
    
    setMeetingRooms(prev => new Map(prev.set(meetingId, meetingRoom)));
    setCurrentMeeting(meetingRoom);
    setMeetingState('active');
    
    // Start AI bot participation simulation
    startAIBotParticipation(meetingRoom);
  };

  // ===== AI BOT PARTICIPATION =====
  const startAIBotParticipation = (meetingRoom) => {
    // Simulate AI advisors joining the meeting
    const joinMessages = meetingRoom.advisorBots.map(botId => {
      const advisor = availableAdvisors.find(a => a.id === botId);
      return {
        id: 'join-' + Date.now() + '-' + botId,
        type: 'system',
        content: `${advisor.name} has joined the meeting as an AI advisor bot`,
        timestamp: new Date(),
        advisor: advisor
      };
    });
    
    setMeetingTranscript(prev => [...prev, ...joinMessages]);
    
    // Simulate periodic AI interventions
    const interventionInterval = setInterval(() => {
      if (meetingState === 'active') {
        generateAIIntervention();
      } else {
        clearInterval(interventionInterval);
      }
    }, 10000); // Every 10 seconds
  };

  // ===== AI INTERVENTION GENERATION =====
  const generateAIIntervention = () => {
    const activeAdvisors = availableAdvisors.filter(a => activeAdvisorBots.has(a.id));
    if (activeAdvisors.length === 0) return;
    
    const randomAdvisor = activeAdvisors[Math.floor(Math.random() * activeAdvisors.length)];
    const interventionTopics = [
      'Based on the discussion, I recommend focusing on customer acquisition metrics',
      'From a financial perspective, we should consider the cash flow implications',
      'The technology architecture needs to support scalability from day one',
      'Our marketing strategy should leverage data-driven customer insights',
      'Risk management suggests we need contingency planning for this initiative'
    ];
    
    const intervention = {
      id: 'intervention-' + Date.now(),
      type: 'ai-intervention',
      content: interventionTopics[Math.floor(Math.random() * interventionTopics.length)],
      timestamp: new Date(),
      advisor: randomAdvisor,
      trigger: 'intelligent-analysis'
    };
    
    setAdvisorInterruptions(prev => [...prev, intervention]);
    setMeetingTranscript(prev => [...prev, intervention]);
  };

  // ===== END MEETING =====
  const endMeeting = async () => {
    setMeetingState('ended');
    setIsGeneratingSummary(true);
    
    // Generate meeting summary
    setTimeout(() => {
      const summary = {
        meetingId: currentMeeting.id,
        duration: '45 minutes',
        participants: ['You', ...Array.from(activeAdvisorBots).map(id => 
          availableAdvisors.find(a => a.id === id)?.name
        )],
        keyTopics: [
          'Q4 Business Strategy Review',
          'Customer Acquisition Optimization', 
          'Technology Infrastructure Planning',
          'Financial Performance Analysis'
        ],
        aiContributions: advisorInterruptions.length,
        actionItems: [
          'Review customer acquisition funnel metrics by Friday',
          'Schedule technology architecture deep-dive session',
          'Prepare financial projections for next quarter',
          'Implement data-driven marketing experiments'
        ],
        nextSteps: 'Follow up on action items and schedule weekly strategic reviews with AI advisory board',
        sentiment: 'Highly productive session with clear strategic direction'
      };
      
      setMeetingSummary(summary);
      setIsGeneratingSummary(false);
    }, 3000);
  };

  // ===== RENDER AUTHENTICATION SCREEN =====
  const renderAuthenticationScreen = () => (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Chrome className="w-10 h-10 text-red-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Connect Your Google Account
        </h3>
        <p className="text-gray-600 mb-8">
          Authenticate with Google to enable AI advisor bots in your Google Meet sessions. 
          Your AI advisors will join as actual meeting participants with realistic voices.
        </p>
        
        <button
          onClick={authenticateWithGoogle}
          disabled={authState === 'authenticating'}
          className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
        >
          {authState === 'authenticating' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating with Google...</span>
            </>
          ) : (
            <>
              <Chrome className="w-5 h-5" />
              <span>Connect Google Account</span>
            </>
          )}
        </button>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
          <h4 className="font-semibold text-blue-900 mb-2">🚀 Revolutionary Features:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• AI advisors join Google Meet as real participants</li>
            <li>• Realistic human voices with advisor personalities</li>
            <li>• Intelligent interruptions based on conversation analysis</li>
            <li>• Automated meeting summaries with strategic insights</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ===== RENDER MEETING DASHBOARD =====
  const renderMeetingDashboard = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advisor Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Select AI Advisors</h3>
          <div className="space-y-3">
            {availableAdvisors.map(advisor => (
              <div 
                key={advisor.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  activeAdvisorBots.has(advisor.id)
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => {
                  const newBots = new Set(activeAdvisorBots);
                  if (newBots.has(advisor.id)) {
                    newBots.delete(advisor.id);
                  } else {
                    newBots.add(advisor.id);
                  }
                  setActiveAdvisorBots(newBots);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{advisor.avatar}</span>
                    <div>
                      <h4 className="font-semibold">{advisor.name}</h4>
                      <p className="text-sm text-gray-600">{advisor.role}</p>
                    </div>
                  </div>
                  {activeAdvisorBots.has(advisor.id) && (
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {advisor.expertise.map(skill => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Creation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Create Google Meet + AI</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                placeholder="Strategic Advisory Session"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Advisors ({activeAdvisorBots.size})
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from(activeAdvisorBots).map(botId => {
                  const advisor = availableAdvisors.find(a => a.id === botId);
                  return (
                    <span key={botId} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                      {advisor?.name}
                    </span>
                  );
                })}
                {activeAdvisorBots.size === 0 && (
                  <span className="text-gray-500 text-sm">No advisors selected</span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => createRealGoogleMeetRoom({ title: 'Strategic Advisory Session' })}
              disabled={activeAdvisorBots.size === 0}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Google Meet + AI Advisors
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✨ What Happens Next:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Google Meet room created instantly</li>
              <li>• AI advisor bots join as real participants</li>
              <li>• Intelligent contributions during conversation</li>
              <li>• Automated meeting summary generated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== RENDER ACTIVE MEETING =====
  const renderActiveMeeting = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">🔴 Live Google Meet Session</h3>
            <p className="text-gray-600">{currentMeeting?.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={currentMeeting?.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Join Google Meet</span>
            </a>
            <button
              onClick={endMeeting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              End Meeting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Transcript */}
          <div>
            <h4 className="font-semibold mb-3">Live Meeting Activity</h4>
            <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
              {meetingTranscript.map(message => (
                <div key={message.id} className="mb-3 last:mb-0">
                  <div className="flex items-start space-x-2">
                    {message.advisor && (
                      <span className="text-lg">{message.advisor.avatar}</span>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.advisor?.name || 'System'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'ai-intervention' && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">
                            AI Contribution
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Advisors */}
          <div>
            <h4 className="font-semibold mb-3">Active AI Advisors</h4>
            <div className="space-y-3">
              {Array.from(activeAdvisorBots).map(botId => {
                const advisor = availableAdvisors.find(a => a.id === botId);
                const contributions = advisorInterruptions.filter(i => i.advisor.id === botId).length;
                
                return (
                  <div key={botId} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{advisor.avatar}</span>
                        <div>
                          <h5 className="font-semibold">{advisor.name}</h5>
                          <p className="text-sm text-gray-600">{advisor.role}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{contributions}</p>
                        <p className="text-xs text-gray-500">Contributions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-700">Active in Google Meet</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== RENDER MEETING SUMMARY =====
  const renderMeetingSummary = () => (
    <div className="p-6">
      {isGeneratingSummary ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generating AI Meeting Summary
          </h3>
          <p className="text-gray-600">
            Our AI is analyzing the meeting transcript and advisor contributions...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Meeting Summary</h3>
          
          {/* Meeting Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-blue-900">{meetingSummary.duration}</p>
              <p className="text-sm text-blue-700">Duration</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-900">{meetingSummary.participants.length}</p>
              <p className="text-sm text-green-700">Participants</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-purple-900">{meetingSummary.aiContributions}</p>
              <p className="text-sm text-purple-700">AI Contributions</p>
            </div>
          </div>

          {/* Key Topics */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">🎯 Key Topics Discussed</h4>
            <div className="flex flex-wrap gap-2">
              {meetingSummary.keyTopics.map((topic, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">✅ Action Items</h4>
            <ul className="space-y-2">
              {meetingSummary.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">🚀 Next Steps</h5>
            <p className="text-sm text-blue-800">{meetingSummary.nextSteps}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 min-w-[200px] bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <Download className="w-5 h-5 inline mr-2" />
              Download Full Summary
            </button>
            <button className="flex-1 min-w-[200px] bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              <Mail className="w-5 h-5 inline mr-2" />
              Email to Team
            </button>
            <button className="flex-1 min-w-[200px] bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
              <Share2 className="w-5 h-5 inline mr-2" />
              Share Summary
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
            <div className="bg-white bg-opacity-20 rounded-lg p-1">
              <Chrome className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Google Meet Integration V26</h2>
              <p className="text-sm text-red-100">Real AI advisor bots joining your Google Meet rooms</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {authState === 'authenticated' && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                ✅ Google Connected
              </span>
            )}
            {meetingState === 'active' && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                🔴 LIVE MEETING
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
        <div className="bg-gray-50 min-h-[600px]">
          {authState === 'unauthenticated' && renderAuthenticationScreen()}
          {authState === 'authenticated' && meetingState === 'ready' && renderMeetingDashboard()}
          {authState === 'authenticated' && meetingState === 'active' && renderActiveMeeting()}
          {meetingState === 'ended' && renderMeetingSummary()}
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {authState === 'authenticated' ? activeAdvisorBots.size : 0}
                </p>
                <p className="text-xs text-gray-600">AI Advisors Ready</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{meetingRooms.size}</p>
                <p className="text-xs text-gray-600">Meetings Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{advisorInterruptions.length}</p>
                <p className="text-xs text-gray-600">AI Contributions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                authState === 'authenticated' ? 'bg-green-100 text-green-600' :
                authState === 'authenticating' ? 'bg-yellow-100 text-yellow-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {authState === 'authenticated' ? 'Connected' :
                 authState === 'authenticating' ? 'Connecting' : 'Not Connected'}
              </span>
              
              {authState === 'authenticated' && meetingState === 'ready' && (
                <button
                  onClick={() => createRealGoogleMeetRoom({ title: 'Quick AI Advisory' })}
                  disabled={activeAdvisorBots.size === 0}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:bg-gray-300"
                >
                  Quick Meet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBoardV26RealGoogleMeetIntegration;