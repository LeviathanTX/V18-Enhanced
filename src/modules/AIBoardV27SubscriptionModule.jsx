import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Check, Zap, Crown, Building2, Star, Shield, Users, 
  FileText, MessageCircle, Clock, Settings, ChevronRight, X,
  Maximize2, Minimize2, DollarSign, TrendingUp, BarChart3, Award
} from 'lucide-react';

// ===== AI BOARD V27 - SUBSCRIPTION MANAGEMENT MODULE =====
const AIBoardV27SubscriptionModule = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Subscription Plans
  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for entrepreneurs and small teams',
      icon: Zap,
      color: 'blue',
      features: [
        '2 AI Advisors (CEO, CFO)',
        '10 Documents per month',
        '50 Advisory sessions',
        'Basic meeting summaries',
        'Email support'
      ],
      pricing: {
        monthly: { amount: 49, priceId: 'price_starter_monthly' },
        yearly: { amount: 490, priceId: 'price_starter_yearly', savings: 20 }
      },
      limits: {
        advisors: 2,
        documents: 10,
        sessions: 50
      }
    },
    professional: {
      name: 'Professional',
      description: 'Advanced features for growing businesses',
      icon: Star,
      color: 'purple',
      popular: true,
      features: [
        '4 AI Advisors (CEO, CFO, CTO, CMO)',
        '100 Documents per month',
        'Unlimited advisory sessions',
        'Advanced document analysis',
        'Google Meet integration',
        'Meeting transcripts & summaries',
        'Priority support',
        'Custom advisor training'
      ],
      pricing: {
        monthly: { amount: 149, priceId: 'price_professional_monthly' },
        yearly: { amount: 1490, priceId: 'price_professional_yearly', savings: 25 }
      },
      limits: {
        advisors: 4,
        documents: 100,
        sessions: -1 // unlimited
      }
    },
    enterprise: {
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      icon: Building2,
      color: 'gold',
      features: [
        'Unlimited custom AI Advisors',
        'Unlimited documents',
        'Unlimited advisory sessions',
        'Advanced AI training & customization',
        'All video platform integrations',
        'Team collaboration features',
        'API access & integrations',
        'White-label options',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      pricing: {
        monthly: { amount: 499, priceId: 'price_enterprise_monthly' },
        yearly: { amount: 4990, priceId: 'price_enterprise_yearly', savings: 33 }
      },
      limits: {
        advisors: -1, // unlimited
        documents: -1, // unlimited
        sessions: -1 // unlimited
      }
    }
  };

  // Mock current subscription
  useEffect(() => {
    // Simulate fetching current subscription
    setCurrentSubscription({
      plan: 'professional',
      status: 'active',
      billingCycle: 'monthly',
      nextBilling: new Date('2025-08-14'),
      usage: {
        advisors: 4,
        documents: 23,
        sessions: 156
      }
    });
  }, []);

  const handleStripeCheckout = async (planId, priceId) => {
    setIsProcessing(true);
    
    try {
      // This would integrate with your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          planId: planId,
          billingCycle: billingCycle
        }),
      });

      if (response.ok) {
        const session = await response.json();
        // Redirect to Stripe Checkout
        // window.location.href = session.url;
        
        // For demo purposes, simulate success
        setTimeout(() => {
          setCurrentSubscription({
            plan: planId,
            status: 'active',
            billingCycle: billingCycle,
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          setShowCheckout(false);
          setIsProcessing(false);
          alert('✅ Subscription activated successfully!');
        }, 2000);
      } else {
        throw new Error('Payment processing failed');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
      alert('❌ Error processing subscription. Please try again.');
    }
  };

  const calculateSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.pricing.yearly.savings) {
      return plan.pricing.yearly.savings;
    }
    return 0;
  };

  const getCurrentPrice = (plan) => {
    return plan.pricing[billingCycle];
  };

  const renderPlanCard = (planId, plan) => {
    const price = getCurrentPrice(plan);
    const savings = calculateSavings(plan);
    const Icon = plan.icon;
    const isCurrentPlan = currentSubscription?.plan === planId;

    return (
      <div key={planId} className={`relative bg-white rounded-xl border-2 p-6 transition-all hover:scale-105 ${
        plan.popular ? 'border-purple-500 shadow-xl' : 'border-gray-200 shadow-lg'
      }`}>
        
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <Icon className={`w-12 h-12 mx-auto mb-3 ${
            plan.color === 'blue' ? 'text-blue-600' :
            plan.color === 'purple' ? 'text-purple-600' :
            plan.color === 'gold' ? 'text-yellow-600' : 'text-gray-600'
          }`} />
          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">${price.amount}</span>
            <span className="text-gray-600 ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          {savings > 0 && (
            <p className="text-green-600 text-sm font-medium mt-1">
              Save {savings}% annually
            </p>
          )}
          {billingCycle === 'yearly' && (
            <p className="text-gray-500 text-xs">
              ${(price.amount / 12).toFixed(0)}/month billed annually
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            setSelectedPlan(planId);
            setShowCheckout(true);
          }}
          disabled={isCurrentPlan}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isCurrentPlan
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : plan.popular
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isCurrentPlan ? 'Current Plan' : `Choose ${plan.name}`}
        </button>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50' : 'h-96'
    }`}>
      
      {/* Module Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Subscription Management V27</h3>
            <p className="text-sm text-gray-600">Choose your AI advisory plan</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6 h-full overflow-y-auto">
        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Current Subscription</h3>
                  <p className="text-blue-700">
                    {plans[currentSubscription.plan]?.name} Plan • {currentSubscription.status} • 
                    Next billing: {currentSubscription.nextBilling?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Manage</span>
              </button>
            </div>
            
            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Advisors Used</span>
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {currentSubscription.usage.advisors} / {plans[currentSubscription.plan]?.limits.advisors === -1 ? '∞' : plans[currentSubscription.plan]?.limits.advisors}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents</span>
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {currentSubscription.usage.documents} / {plans[currentSubscription.plan]?.limits.documents === -1 ? '∞' : plans[currentSubscription.plan]?.limits.documents}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {currentSubscription.usage.sessions} / {plans[currentSubscription.plan]?.limits.sessions === -1 ? '∞' : plans[currentSubscription.plan]?.limits.sessions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                Save up to 33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([planId, plan]) => renderPlanCard(planId, plan))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Enterprise Security</h4>
            <p className="text-gray-600 text-sm">SOC 2 compliant with bank-level encryption</p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">24/7 Availability</h4>
            <p className="text-gray-600 text-sm">Your AI advisors never sleep</p>
          </div>
          <div className="text-center">
            <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Trusted by 1000+</h4>
            <p className="text-gray-600 text-sm">CEOs and business leaders worldwide</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Confirm Subscription</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{plans[selectedPlan]?.name} Plan</span>
                <span className="font-bold">${getCurrentPrice(plans[selectedPlan]).amount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Billing cycle</span>
                <span className="capitalize">{billingCycle}</span>
              </div>
              {calculateSavings(plans[selectedPlan]) > 0 && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  You save {calculateSavings(plans[selectedPlan])}% with annual billing
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStripeCheckout(selectedPlan, getCurrentPrice(plans[selectedPlan]).priceId)}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Subscribe Now</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment powered by Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBoardV27SubscriptionModule;