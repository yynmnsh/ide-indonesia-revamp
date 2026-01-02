import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// Helper to get events from the content folder
async function getEvents() {
  const postsDirectory = path.join(process.cwd(), 'content/events');
  // Check if dir exists first (for safety)
  if (!fs.existsSync(postsDirectory)) return [];
  
  const filenames = fs.readdirSync(postsDirectory);
  
  const events = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: filename.replace('.md', ''),
      ...data,
    };
  });
  
  // Sort by date descending
  return events.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Helper to get settings
async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), 'content/settings/global.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    return {
      site_title: "IDE Indonesia",
      hero_headline: "Inspire • Develop • Engage",
      hero_subtext: "A community of Monash Business School's PhD students fostering academic discourse and knowledge exchange focused on Indonesia."
    };
  }
}

export default async function Home() {
  const events = await getEvents();
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
              <span>{settings.site_title}</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition font-medium">Home</Link>
              <Link href="#events" className="text-gray-600 hover:text-blue-600 transition font-medium">Events</Link>
            </div>
            <Link href="/admin/" className="bg-blue-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition shadow-md">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            {settings.hero_headline}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            {settings.hero_subtext}
          </p>
          <div className="flex justify-center gap-4">
            <a href="#events" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-200">
              View Upcoming Events
            </a>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Latest Events
          </h2>
          <span className="text-gray-500 hidden sm:inline-block">Join our next session</span>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No events found. Add one via the Admin panel!</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any) => (
              <div key={event.slug} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
                {event.thumbnail ? (
                  <div className="h-56 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: `url(${event.thumbnail})`}}></div>
                ) : (
                  <div className="h-56 w-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-4xl">📅</span>
                  </div>
                )}
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-3 uppercase tracking-wider">
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center text-sm font-medium text-gray-500">
                    <span className="mr-2">📍</span> {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
