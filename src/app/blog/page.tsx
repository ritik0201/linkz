import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

const blogPosts = [
  {
    slug: 'the-future-of-collaboration',
    title: 'The Future of Collaboration: Trends to Watch in 2026',
    excerpt: 'Explore the upcoming trends in remote work, team dynamics, and the technology that will shape how we collaborate.',
    author: 'Jane Doe',
    date: 'Jan 28, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    featured: true,
  },
  {
    slug: 'building-your-startup-dream-team',
    title: 'Building Your Startup\'s Dream Team',
    excerpt: 'A guide to finding, hiring, and retaining top talent that aligns with your company\'s vision and culture.',
    author: 'John Smith',
    date: 'Jan 22, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'from-idea-to-mvp',
    title: 'From Idea to MVP: A Developer\'s Journey',
    excerpt: 'Follow the step-by-step process of turning a concept into a Minimum Viable Product, with tips and tricks from a seasoned developer.',
    author: 'Alex Johnson',
    date: 'Jan 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
    {
    slug: 'networking-in-the-digital-age',
    title: 'Networking in the Digital Age: Beyond the Handshake',
    excerpt: 'Learn how to build meaningful professional relationships online using platforms like CollabX.',
    author: 'Emily White',
    date: 'Jan 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
];

const featuredPost = blogPosts.find(p => p.featured);
const otherPosts = blogPosts.filter(p => !p.featured);

const BlogPage = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 mb-4">
            The CollabX Blog
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
            Insights, stories, and advice on collaboration, innovation, and career growth from the CollabX team and community.
          </p>
        </header>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-700/50 transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10">
                <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-64 md:h-full object-cover" />
                <div className="p-8">
                  <p className="text-sm text-indigo-400 mb-2 font-semibold">Featured Article</p>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">{featuredPost.title}</h2>
                  <p className="text-zinc-400 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-zinc-500 gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Other Posts */}
        <section>
          <h3 className="text-3xl font-bold mb-8 border-l-4 border-indigo-500 pl-4">Latest Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="group bg-[#2b2b2b] rounded-2xl overflow-hidden border border-zinc-700/50 h-full flex flex-col transition-transform hover:-translate-y-1">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4 flex-grow">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-700/50">
                       <div className="flex items-center gap-2">
                         <User size={12} />
                         <span>{post.author}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Calendar size={12} />
                         <span>{post.date}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;