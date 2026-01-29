import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Video, ArrowRight } from 'lucide-react';

const events = [
  {
    type: 'upcoming',
    title: 'CollabX Connect: The Future of AI in Startups',
    date: 'February 15, 2026',
    time: '4:00 PM GMT',
    location: 'Online',
    description: 'Join industry leaders and innovators for a virtual summit on how AI is shaping the startup ecosystem. Featuring keynote speakers, panel discussions, and networking sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=1932&auto=format&fit=crop',
    link: '#',
  },
  {
    type: 'upcoming',
    title: 'Founder & Funder Mixer',
    date: 'March 5, 2026',
    time: '6:00 PM PST',
    location: 'San Francisco, CA',
    description: 'An exclusive, in-person networking event for startup founders to connect with venture capitalists and angel investors. Limited spots available.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2132&auto=format&fit=crop',
    link: '#',
  },
  {
    type: 'past',
    title: 'Dev Day 2025: Building Scalable Applications',
    date: 'December 10, 2025',
    time: '9:00 AM - 5:00 PM EST',
    location: 'Online',
    description: 'A full-day workshop for developers focused on modern architecture, cloud infrastructure, and performance optimization. Recordings available now.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
    {
    type: 'past',
    title: 'Launchpad: Startup Pitch Competition',
    date: 'November 20, 2025',
    time: '2:00 PM GMT',
    location: 'Online',
    description: 'Watch the exciting finale of our annual pitch competition where five startups competed for seed funding and mentorship.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
];

const EventCard = ({ event }: { event: any }) => (
  <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden border border-zinc-700/50 flex flex-col group">
    <div className="relative">
      <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover" />
      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${event.type === 'upcoming' ? 'bg-indigo-600' : 'bg-zinc-600'}`}>
        {event.type === 'upcoming' ? 'Upcoming' : 'Past Event'}
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
      <div className="space-y-2 text-sm text-zinc-400 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          {event.location === 'Online' ? <Video size={14} /> : <MapPin size={14} />}
          <span>{event.location}</span>
        </div>
      </div>
      <p className="text-zinc-400 text-sm mb-6 flex-grow">{event.description}</p>
      <Link href={event.link}>
        <div className="mt-auto inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
          {event.type === 'upcoming' ? 'Register Now' : 'View Recording'}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  </div>
);

const EventsPage = () => {
  const upcomingEvents = events.filter(e => e.type === 'upcoming');
  const pastEvents = events.filter(e => e.type === 'past');

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 mb-4">
            Events & Workshops
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
            Join our community for virtual and in-person events designed to help you learn, connect, and grow.
          </p>
        </header>

        {/* Upcoming Events */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 border-l-4 border-indigo-500 pl-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
              <p className="text-zinc-400">No upcoming events scheduled right now. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-3xl font-bold mb-8 border-l-4 border-zinc-500 pl-4">Past Events</h2>
          {pastEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {pastEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          ) : (
             <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
              <p className="text-zinc-400">No past events to show.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventsPage;