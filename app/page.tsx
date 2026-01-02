import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

async function getEvents() {
  const postsDirectory = path.join(process.cwd(), 'content/events');
  if (!fs.existsSync(postsDirectory)) return [];
  
  const filenames = fs.readdirSync(postsDirectory);
  const events = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return { slug: filename.replace('.md', ''), ...data };
  });
  
  return events.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function getSettings() {
  return {
    site_title: "IDE Indonesia",
    hero_headline: "Inspire • Develop • Engage",
    hero_subtext: "A community of Monash Business School's PhD students fostering academic discourse and knowledge exchange focused on Indonesia."
  };
}

export default async function Home() {
  const events = await getEvents();
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-900">{settings.site_title}</div>
          <Link href="/admin/" className="bg-blue-900 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-800">
            Admin Login
          </Link>
        </div>
      </nav>

      <div className="bg-blue-900 text-white py-32 text-center px-4">
        <h1 className="text-5xl font-bold mb-6">{settings.hero_headline}</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">{settings.hero_subtext}</p>
        <a href="#events" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold shadow-lg">View Events</a>
      </div>

      <div id="events" className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 border-b pb-4">Latest Events</h2>
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed rounded-xl">
            <p className="text-gray-500">No events found. Add one via /admin!</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {events.map((event: any) => (
              <div key={event.slug} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 bg-cover bg-center" style={{backgroundImage: `url(${event.thumbnail})`}}></div>
                <div className="p-6">
                  <div className="text-sm font-bold text-blue-600 mb-2">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
