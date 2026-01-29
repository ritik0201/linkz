"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, User, Settings, Shield, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: 'Getting Started',
    icon: <HelpCircle />,
    questions: [
      {
        q: 'What is CollabX?',
        a: 'CollabX is a platform designed to connect skilled professionals with innovative startups, fostering collaboration on projects and research.',
      },
      {
        q: 'How do I create an account?',
        a: 'You can sign up as a user or a startup by clicking the "Join Now" button on the homepage. You can sign up using your email and password, or via Google/GitHub for a faster process.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: <User />,
    questions: [
      {
        q: 'How do I complete my profile?',
        a: 'Navigate to your dashboard and click on "Edit Profile". We recommend filling out your headline, bio, skills, and adding a professional profile picture to increase your visibility.',
      },
      {
        q: 'Can I change my username?',
        a: 'Usernames are unique and cannot be changed after registration to maintain profile integrity and consistent URLs.',
      },
    ],
  },
  {
    category: 'Settings & Privacy',
    icon: <Settings />,
    questions: [
      {
        q: 'How can I manage my notification preferences?',
        a: 'Go to Settings > Notifications. From there, you can choose which email and push notifications you want to receive.',
      },
      {
        q: 'How do I delete my account?',
        a: 'You can request account deletion from your Settings page. Please note that this action is irreversible.',
      },
    ],
  },
];

const AccordionItem = ({ faq, isOpen, onToggle }: { faq: any, isOpen: boolean, onToggle: () => void }) => {
  return (
    <div className="border-b border-zinc-700/50">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left py-5 px-1"
      >
        <span className="text-base font-semibold text-zinc-100">{faq.q}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="text-zinc-400 pb-5 px-1 text-sm leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
};

const HelpCenterPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <div className="relative pt-32 pb-20 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Help Center</h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Have questions? We're here to help. Find answers to common questions below.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <aside className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-6 text-zinc-100">Categories</h2>
            <ul className="space-y-3">
              {faqData.map((category) => (
                <li key={category.category}>
                  <a href={`#${category.category.replace(' ', '-')}`} className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                    <span className="text-indigo-400">{category.icon}</span>
                    <span>{category.category}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <main className="md:col-span-2">
            {faqData.map((category, catIndex) => (
              <section key={catIndex} id={category.category.replace(' ', '-')} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-zinc-100">
                  <span className="text-indigo-400">{category.icon}</span>
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 100 + faqIndex; // Create a unique index
                    return (
                      <AccordionItem
                        key={globalIndex}
                        faq={faq}
                        isOpen={openIndex === globalIndex}
                        onToggle={() => handleToggle(globalIndex)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;

