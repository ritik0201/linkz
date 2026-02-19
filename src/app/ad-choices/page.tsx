import React from "react";

const AdChoicesPage = () => {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-indigo-500">Ad Choices</h1>
                <div className="prose prose-invert max-w-none space-y-6 text-zinc-300">
                    <p>
                        CollaBharat believes in transparency regarding the advertisements you see. This page explains how we and our partners use data to select ads for you and your choices regarding those ads.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8">Personalized Advertising</h2>
                    <p>
                        We use information about your activity on CollaBharat to show you ads that may be more relevant to your interests. This is often called "interest-based advertising" or "personalized advertising."
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8">Your Choices</h2>
                    <p>
                        You can control how we use your data for advertising.
                    </p>
                    <div className="bg-[#2b2b2b] p-6 rounded-xl border border-zinc-700 mt-4">
                        <h3 className="text-lg font-bold text-white mb-2">Manage Preferences</h3>
                        <p className="mb-4 text-sm text-zinc-400">Toggle personalized ads on or off.</p>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                            Manage Ad Settings
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdChoicesPage;
