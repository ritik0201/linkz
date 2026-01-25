import { motion } from "framer-motion";
import Image from "next/image";

const tools = [
  {
    img: "/images/file-text.jpeg", // put your images here
    title: "Project Tracker",
    desc: "Organize tasks, milestones, and progress with clarity",
  },
  {
    img: "/images/message-square.jpeg",
    title: "Team Chat",
    desc: "Real-time communication for seamless collaboration",
  },
  {
    img: "/images/git-branch.jpeg",
    title: "Version Control",
    desc: "Track changes and manage your projects like Git",
  },
];

export default function WorkspaceSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0, 0, 255, 0.4)",
            }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center cursor-pointer"
          >
            <div className="mb-4 w-32 h-32 relative">
              <Image
                src={tool.img}
                alt={tool.title}
                fill
                className="object-contain rounded-2xl"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {tool.title}
            </h3>
            <p className="text-gray-400">{tool.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
