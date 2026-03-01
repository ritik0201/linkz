import Link from "next/link";
import React from "react";

const footerLinks = [
    { label: "About Us", href: "/about" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Help Center", href: "/help" },
    { label: "Privacy & Terms", href: "/privacy" },
    { label: "Ad Choices", href: "/ad-choices" },
    { label: "Advertising", href: "/advertising" },
    { label: "Business Services", href: "/business-services" },
    { label: "Get the CollaBharat app", href: "/get-app" },
];

const DashboardFooter = () => (
    <div className="mt-6 text-center px-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-zinc-500">
            {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-indigo-400 hover:underline">
                    {link.label}
                </Link>
            ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-zinc-400">
            <img src="/logo.png" alt="CollaBharat Logo" className="w-5 h-5" />
            <span className="font-bold text-indigo-500">CollaBharat</span>
            <span>© {new Date().getFullYear()}</span>
        </div>
    </div>
);

export default DashboardFooter;
