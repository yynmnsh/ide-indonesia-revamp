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
      hero_subtext: "A community of Monash Business School's PhD students."
    };
  }
}

export default async function Home() {
  const events = await getEvents();
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-gray-50 text-slate-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-blue-900 tracking-tight">
              {settings.site_title}
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">About</Link>
              <Link href="#events" className="text-gray-600 hover:text-blue-600 transition">Events</Link>
            </div>
            <Link href="/admin/" className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            {settings.hero_headline}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
            {settings.hero_subtext}
          </p>
          <div className="mt-10">
            <a href="#events" className="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-200">
              View Upcoming Events
            </a>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900 relative">
            Latest Events
            <span className="block h-1 w-20 bg-blue-500 mt-2"></span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <div key={event.slug} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
              {event.thumbnail && (
                <div className="h-48 w-full bg-cover bg-center" style={{backgroundImage: `url(${event.thumbnail})`}}></div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {event.description || "Join us for this insightful session..."}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-sm text-gray-500">
                  <span className="mr-2">📍</span> {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}