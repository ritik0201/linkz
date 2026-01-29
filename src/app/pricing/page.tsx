import React from 'react';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Talent Starter",
    price: "Free",
    period: "forever",
    description: "For professionals looking to showcase their work and find opportunities.",
    features: [
      "Create a professional profile",
      "Apply to 5 jobs per month",
      "Join community discussions",
      "Basic portfolio showcase",
      "Email support"
    ],
    cta: "Join as Talent",
    highlight: false
  },
  {
    name: "Startup Pro",
    price: "$49",
    period: "/month",
    description: "For growing startups that need to hire quality talent quickly.",
    features: [
      "Post unlimited jobs",
      "Access to verified talent pool",
      "Advanced search filters",
      "Direct messaging with candidates",
      "Priority support",
      "Featured job listings"
    ],
    cta: "Start Hiring",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations requiring dedicated support and custom solutions.",
    features: [
      "Dedicated account manager",
      "Custom contracts & invoicing",
      "API access",
      "Team collaboration tools",
      "Custom onboarding",
      "SLA support"
    ],
    cta: "Contact Sales",
    highlight: false
  }
];

const PricingPage = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <div className="bg-zinc-950 pt-32 pb-20 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Whether you're a solo freelancer or a scaling startup, we have you covered.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col p-8 rounded-2xl border ${plan.highlight ? 'bg-[#1c1c1c] border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-105 z-10' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'} transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="text-indigo-400 shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mt-8">
            <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-800">
              <h4 className="font-bold mb-2">Can I cancel anytime?</h4>
              <p className="text-zinc-400 text-sm">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>
            <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-800">
              <h4 className="font-bold mb-2">Do you offer refunds?</h4>
              <p className="text-zinc-400 text-sm">We offer a 14-day money-back guarantee for all paid plans if you're not satisfied with our service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
