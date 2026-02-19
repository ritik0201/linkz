import React from "react";
import { Download, Smartphone } from "lucide-react";

const GetAppPage = () => {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-4 py-12 flex flex-col items-center">
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl mb-4 transform -rotate-12">
                        <Smartphone size={40} className="text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold">
                        CollaBharat on the Go
                    </h1>
                    <p className="text-xl text-zinc-300">
                        Keep the conversation going. Search for jobs, connect with founders, and manage your projects from anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors font-bold">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
                            {/* <span className="text-left">
                    <span className="block text-xs font-medium">Download on the</span>
                    <span className="block text-lg leading-none">App Store</span>
                </span> */}
                        </button>
                        <button className="flex items-center gap-3 bg-transparent border border-zinc-600 text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors font-bold">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" />
                        </button>
                    </div>

                    <p className="text-sm text-zinc-500 mt-8">
                        Coming soon to iOS and Android.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default GetAppPage;
