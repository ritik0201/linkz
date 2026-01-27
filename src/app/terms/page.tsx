"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, AlertCircle, CheckCircle, HelpCircle, FileText } from "lucide-react";

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6"
                    >
                        <Scale size={32} />
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Please read these terms carefully before using Linkz.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
                    <Section title="1. Acceptance of Terms">
                        <p>
                            By accessing and using the Linkz platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl flex gap-3">
                            <AlertCircle className="text-yellow-600 dark:text-yellow-500 shrink-0" size={20} />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                If you do not agree to these terms, please do not use our Service.
                            </p>
                        </div>
                    </Section>

                    <Section title="2. User Accounts">
                        <p>To access certain features of the platform, you must register for an account. You agree to:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-zinc-600 dark:text-zinc-400">
                            <li>Provide accurate, current, and complete information during the registration process.</li>
                            <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                            <li>Notify us immediately if you discover or suspect any security breaches related to the Service.</li>
                        </ul>
                    </Section>

                    <Section title="3. User Content">
                        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
                        <p className="mt-4">By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.</p>
                    </Section>

                    <Section title="4. Prohibited Activities">
                        <p>You agree not to engage in any of the following prohibited activities:</p>
                        <div className="grid gap-3 mt-4">
                            {[
                                "Copying, distributing, or disclosing any part of the Service in any medium.",
                                "Using any automated system, including 'robots' and 'spiders,' to access the Service.",
                                "Attempting to interfere with, compromise the system integrity or security.",
                                "Taking any action that imposes, or may impose at our sole discretion an unreasonable load on our infrastructure."
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="5. Intellectual Property">
                        <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Linkz and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
                    </Section>

                    <Section title="6. Termination">
                        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                    </Section>

                    <Section title="7. Limitation of Liability">
                        <p>In no event shall Linkz, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                    </Section>

                    <Section title="8. Changes to Terms">
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
                    </Section>
                </div>

                {/* Footer Contact */}
                <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Questions about the Terms?</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                Our legal team is available to clarify any points.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <a 
                                href="/help" 
                                className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                            >
                                <HelpCircle size={18} /> Help Center
                            </a>
                            <a 
                                href="mailto:legal@linkz.com" 
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <FileText size={18} /> Contact Legal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="scroll-mt-24"
    >
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            <CheckCircle className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            {title}
        </h2>
        <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed pl-0 md:pl-8 border-l-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors">
            {children}
        </div>
    </motion.section>
);

export default TermsPage;
