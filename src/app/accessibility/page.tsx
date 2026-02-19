import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const AccessibilityPage = () => {
    return (
        <main className="min-h-screen bg-black text-white">
            {/* <Navbar /> */}
            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-indigo-500">Accessibility Statement</h1>
                <div className="prose prose-invert max-w-none space-y-6 text-zinc-300">
                    <p>
                        At CollaBharat, we are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8">Conformance Status</h2>
                    <p>
                        The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. CollaBharat is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8">Feedback</h2>
                    <p>
                        We welcome your feedback on the accessibility of CollaBharat. Please let us know if you encounter accessibility barriers on CollaBharat:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>E-mail: accessibility@collabharat.com</li>
                        <li>Postal Address: 123 CollaBharat Way, Tech City, TC 90210</li>
                    </ul>
                </div>
            </div>
            {/* <Footer /> */}
        </main>
    );
};

export default AccessibilityPage;
