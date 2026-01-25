"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

/* ---------------- animations ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------- page ---------------- */
export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-yellow-400 origin-left z-50"
      />

      {/* NAVBAR */}
      <Navbar />

      <main className="bg-zinc-950 text-white px-6 py-20 overflow-hidden">
        {/* ---------------- HERO ---------------- */}
        <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-snug">
              Collaboration, <br />
              designed to actually <span className="text-yellow-400">work</span>
              .
            </h1>

            <p className="mt-4 text-zinc-400 text-lg max-w-lg">
              CollabX is a collaboration-first platform for people who want to
              move beyond connections and actually build projects, research,
              ideas, and experiments together.
            </p>
          </motion.div>

          {/* IMAGE 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-80 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            <Image
              src="/images/about-hero.jpeg"
              alt="CollabX overview"
              fill
              className="object-cover opacity-80"
            />
          </motion.div>
        </section>

        {/* ---------------- WHY ---------------- */}
        <section className="max-w-6xl mx-auto mt-20 grid lg:grid-cols-2 gap-8 items-start">
          {/* IMAGE 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-64 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            <Image
              src="/images/about-problem.png"
              alt="Collaboration problem"
              fill
              className="object-cover opacity-75"
            />
          </motion.div>

          {/* TEXT ON RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Why CollabX Exists</h2>
            <p className="text-zinc-400 leading-relaxed">
              Collaboration today is scattered across platforms.
              <br />
              Ideas are posted in one place, teammates searched in another,
              discussions happen elsewhere, and progress often gets lost.
              <br />
              <br />
              CollabX brings all of that into a single, intentional
              collaboration flow.
            </p>
          </motion.div>
        </section>

        {/* ---------------- WHAT WE'RE BUILDING ---------------- */}
        <section className="max-w-6xl mx-auto mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-semibold mb-8 text-center"
          >
            What We’re Building
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Project-First Collaboration",
                desc: "Everything starts with what you want to build.",
              },
              {
                title: "Intent-Driven Matching",
                desc: "Find collaborators based on shared goals and commitment.",
              },
              {
                title: "Focused Workspaces",
                desc: "Dedicated spaces for real collaboration without distractions.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-6"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- IMAGE + VISION ---------------- */}
        <section className="max-w-6xl mx-auto mt-16 grid lg:grid-cols-2 gap-8 items-center">
          {/* IMAGE 3 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-72 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            <Image
              src="/images/about-flow.png"
              alt="Collaboration flow"
              fill
              className="object-cover opacity-80"
            />
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-4">
              The Direction We’re Moving In
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              CollabX isn’t trying to replace social networks. It’s focused on
              creating a space where collaboration is structured, intentional,
              and productive — without unnecessary noise.
              <br />
              <br />
              The platform will evolve based on how people actually collaborate,
              not trends.
            </p>
          </motion.div>
        </section>

        {/* ---------------- BUILT IN PUBLIC ---------------- */}
        <section className="max-w-6xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Built in Public</h2>
            <p className="text-zinc-400 leading-relaxed">
              CollabX is actively being developed. Features are shaped, ideas
              evolve, and feedback matters. Early users help define the
              platform.
            </p>
          </motion.div>

          {/* IMAGE 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 h-64 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            <Image
              src="/images/about-community.jpeg"
              alt="CollabX community"
              fill
              className="object-cover opacity-75"
            />
          </motion.div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold mb-3">
            Build With the Right People
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            CollabX grows with its community. Join early to be part of a
            platform built around real collaboration.
          </p>
          <button className="px-8 py-3 rounded-full bg-yellow-400 text-black font-medium hover:scale-105 transition">
            Join CollabX
          </button>
        </motion.section>
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
