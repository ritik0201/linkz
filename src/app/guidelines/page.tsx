import React from 'react';
import { CheckCircle, XCircle, Users, Zap, Heart } from 'lucide-react';

const GuidelineItem = ({ icon, title, children, isDo }: { icon: React.ReactNode, title: string, children: React.ReactNode, isDo: boolean }) => (
  <div className="flex gap-4">
    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-lg text-zinc-100 mb-1">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{children}</p>
    </div>
  </div>
);

const GuidelinesPage = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-24">
        <header className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 mb-4">
            Community Guidelines
          </h1>
          <p className="text-lg md:text-xl text-zinc-400">
            Our mission is to build a professional community where talent and opportunity can connect. These guidelines help us create a safe, respectful, and productive environment for everyone.
          </p>
        </header>

        <div className="bg-[#1c1c1c] border border-zinc-800 rounded-2xl p-8 md:p-12">
          {/* Core Principles */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-100">Our Core Principles</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 mb-4">
                  <Heart size={32} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Be Respectful</h3>
                <p className="text-zinc-400 text-sm">Treat every member with professionalism and courtesy. Healthy debates are fine, but kindness is required.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 mb-4">
                  <Users size={32} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Be Authentic</h3>
                <p className="text-zinc-400 text-sm">Represent yourself and your work honestly. Authenticity builds trust, which is the foundation of our community.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 mb-4">
                  <Zap size={32} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Be Proactive</h3>
                <p className="text-zinc-400 text-sm">Share your knowledge, offer constructive feedback, and help make this a valuable place for everyone.</p>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* The Do's */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-green-400">What To Do</h2>
              <div className="space-y-6">
                <GuidelineItem icon={<CheckCircle />} title="Share Your Work" isDo={true}>
                  Post your projects, research, and insights. This is a platform to showcase your skills and find collaborators.
                </GuidelineItem>
                <GuidelineItem icon={<CheckCircle />} title="Provide Constructive Feedback" isDo={true}>
                  When commenting, focus on providing helpful, specific, and encouraging feedback.
                </GuidelineItem>
                <GuidelineItem icon={<CheckCircle />} title="Network Professionally" isDo={true}>
                  Connect with others, send thoughtful messages, and build your professional network.
                </GuidelineItem>
                <GuidelineItem icon={<CheckCircle />} title="Report Violations" isDo={true}>
                  If you see content that violates our guidelines, please report it so our moderation team can review it.
                </GuidelineItem>
              </div>
            </section>

            {/* The Don'ts */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-red-400">What Not To Do</h2>
              <div className="space-y-6">
                <GuidelineItem icon={<XCircle />} title="No Harassment or Hate Speech" isDo={false}>
                  We have a zero-tolerance policy for harassment, bullying, and any form of hate speech.
                </GuidelineItem>
                <GuidelineItem icon={<XCircle />} title="No Spam or Self-Promotion" isDo={false}>
                  Do not post irrelevant promotional content or spam other users. Your profile and projects are the place for promotion.
                </GuidelineItem>
                <GuidelineItem icon={<XCircle />} title="Don't Share Misinformation" isDo={false}>
                  Ensure that what you share is accurate and not misleading. Do not knowingly spread false information.
                </GuidelineItem>
                <GuidelineItem icon={<XCircle />} title="Respect Privacy" isDo={false}>
                  Do not share other people's private information without their explicit consent.
                </GuidelineItem>
              </div>
            </section>
          </div>

          <div className="text-center mt-16 border-t border-zinc-800 pt-8">
            <p className="text-zinc-400">
              Violating these guidelines may result in content removal, account suspension, or a permanent ban. <br/>Thank you for helping us keep CollabX a professional and welcoming community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPage;

