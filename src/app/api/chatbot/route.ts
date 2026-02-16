import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";



const systemPrompt = `You are the official AI assistant for CollaBharat, a premium collaboration platform bridging the gap between students, startups, and researchers.

Your knowledge base includes:
1. **Smart Matching**: An AI-driven algorithm that connects startups with co-founders and employees based on skills and vision.
2. **Verified Profiles**: A secure ecosystem where professionals and startups are rigorously verified.
3. **Global Reach**: A worldwide network for remote and local collaboration.
4. **Launchpad Support**: Essential resources, templates, and guides for contracts, equity splitting, and MVP launches.
5. **Community Events**: Exclusive access to hackathons, pitch days, and networking mixers.
6. **Direct Messaging**: Built-in real-time communication tools.

Your Goals:
- Be the "CollaBharat Expert".
- Explain how users can leverage these services.
- Encourage students to find internships and researchers to share their work.
- Help startups find co-founders or talent.
- Use a professional yet friendly and helpful tone.

Keep responses concise, well-formatted, and strictly focused on CollaBharat. If a user asks something unrelated, politely bring the conversation back to how CollaBharat can help them.`;

let lastWorkingModel = "gemini-1.5-flash";

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API Key is not configured." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Priority list: Put the fasted model (1.5-flash) and the last working one at the top
        const modelNames = Array.from(new Set([lastWorkingModel, "gemini-1.5-flash", "gemini-2.0-flash", "gemini-flash-latest"]));
        let lastError = null;

        for (const modelName of modelNames) {
            try {
                console.log(`>>> Attemping AI response with: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemPrompt }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Understood. I am the CollaBharat AI assistant. How can I help you today?" }],
                        },
                        // Limit history to last 10 messages for maximum speed
                        ...(history || []).slice(-10).map((msg: any) => ({
                            role: msg.role === "user" ? "user" : "model",
                            parts: [{ text: msg.content }],
                        })),
                    ],
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                if (text) {
                    console.log(`>>> Success with model: ${modelName}`);
                    lastWorkingModel = modelName; // Save for next time
                    return NextResponse.json({ text });
                }
            } catch (err: any) {
                console.warn(`>>> Model ${modelName} failed:`, err.message);
                lastError = err;
                continue;
            }
        }

        throw lastError || new Error("All AI models failed to respond. Please check your API key.");
    } catch (error: any) {
        console.error("Chatbot API Final Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get response from AI." },
            { status: 500 }
        );
    }
}
