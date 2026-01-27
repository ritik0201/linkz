"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Calendar } from "lucide-react";

const PrivacyPage = () => {
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
                        <Shield size={32} />
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
                        <Calendar size={14} />
                        <span>Last updated: January 27, 2026</span>
                    </div>
                </div>

                {/* Quick Summary Box */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-12"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Eye size={20} className="text-indigo-600 dark:text-indigo-400" />
                        Key Takeaways
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <ul className="space-y-2 list-disc list-inside">
                            <li>We only collect data necessary for the service.</li>
                            <li>We never sell your personal data to third parties.</li>
                        </ul>
                        <ul className="space-y-2 list-disc list-inside">
                            <li>Your data is encrypted in transit and at rest.</li>
                            <li>You have full control to export or delete your data.</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
                    <Section title="1. Introduction">
                        <p>
                            Welcome to Linkz ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at privacy@linkz.com.
                        </p>
                        <p>
                            When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
                        </p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-zinc-600 dark:text-zinc-400">
                            <li><strong>Personal Data:</strong> Name, email address, username, password, and contact preferences.</li>
                            <li><strong>Profile Data:</strong> Professional headline, bio, skills, and portfolio links.</li>
                            <li><strong>Usage Data:</strong> Information about how you use our website, such as access times, pages viewed, and IP address.</li>
                        </ul>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <h4 className="font-semibold mb-2">Service Provision</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">To facilitate account creation, logon processes, and match you with startups or talent.</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <h4 className="font-semibold mb-2">Communication</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">To send you administrative information, product updates, and respond to inquiries.</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="4. Sharing Your Information">
                        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                        <p className="mt-4">We may process or share your data that we hold based on the following legal basis:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2 text-zinc-600 dark:text-zinc-400">
                            <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                            <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                        </ul>
                    </Section>

                    <Section title="5. Data Security">
                        <div className="flex items-start gap-4 mt-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg shrink-0">
                                <Lock size={24} />
                            </div>
                            <div>
                                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="6. Your Privacy Rights">
                        <p>In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
                    </Section>
                </div>

                {/* Footer Contact */}
                <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-center">
                    <h3 className="text-xl font-bold mb-4">Have questions about your data?</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Our Data Protection Officer is here to help.
                    </p>
                    <a 
                        href="mailto:privacy@linkz.com" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                        <FileText size={18} /> Contact Privacy Team
                    </a>
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
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">{title}</h2>
        <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {children}
        </div>
    </motion.section>
);

export default PrivacyPage;
