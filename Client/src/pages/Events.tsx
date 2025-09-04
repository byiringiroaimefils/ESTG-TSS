import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const API_URL = import.meta.env.VITE_API_URL;

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const News = () => {
  const navigate = useNavigate();
  const [visibleNewsCount, setVisibleNewsCount] = useState(6);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const handleLoadMore = () => {
    setVisibleNewsCount((prev) => prev + 3);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const response = await axios.get(`${API_URL}/all_events`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    window.scrollTo(0, 0);
    fetchData();
  }, []);

  // Filter events based on search term (case insensitive)
  const filteredData = data.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="rounded-sm border overflow-hidden shadow-md">
      <div className="relative h-[300px] bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-6 text-left">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 🔍 SEO + Social Media Meta Tags */}
      <Helmet>
        <title>Events | ESTG-TSS</title>
        <meta key="description" name="description" content="Explore upcoming events at ESTG-TSS. Stay updated on school activities, workshops, and celebrations. Join us and be part of our vibrant community!" />
        <meta key="og:title" property="og:title" content="Events | ESTG-TSS" />
        <meta key="og:description" property="og:description" content="Discover the latest events, workshops, and celebrations happening at ESTG-TSS. Stay connected with our school community." />
        <meta key="og:url" property="og:url" content="https://estg-tss.vercel.app/events" />
        <meta key="og:image" property="og:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Events | ESTG-TSS" />
        <meta key="twitter:description" name="twitter:description" content="Stay up to date with all upcoming events and activities at ESTG-TSS. Join our community events and celebrations!" />
        <meta key="twitter:image" name="twitter:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
      </Helmet>
      <Navbar />

      <section className="py-20 text-center">
        <AnimatedSection>
          <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">Upcoming Events</h1>
          <p className="text-black dark:text-white max-w-xl mx-auto mb-12">
            Join us for exciting school activities, workshops, and celebrations! Stay updated on upcoming events and mark your calendars—we can't wait to see you there.
          </p>
        </AnimatedSection>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-10 px-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events...."
            className="w-full px-12 py-3 rounded-md outline-none bg-white dark:bg-black border border-gray-300 dark:border-gray-700"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-[89%] mx-auto px-6">
            {/* Display 6 skeleton cards while loading */}
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredData && filteredData.length > 0 ? (
          <>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3 cursor-pointer max-w-[89%] mx-auto px-6">
              {filteredData.slice(0, visibleNewsCount).map((news) => (
                <div
                  key={news._id}
                  className="rounded-sm border overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                  onClick={() => navigate(`/Event/${news._id}`)}
                >
                  <div className="relative h-[300px]">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 text-left">
                    <p className="text-sm text-black dark:text-white mb-2">
                      {new Date(news.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <h3 className="text-lg font-semibold text-black dark:text-white uppercase">
                      {news.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {visibleNewsCount < filteredData.length && (
              <div className="mt-12">
                <button
                  onClick={handleLoadMore}
                  className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full transition"
                >
                  See More →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center max-w-xl mx-auto">
            <svg
              className="w-20 h-20 mb-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {searchTerm ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
                  No Matching Events
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  No events found for your search. Try a different keyword.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
                  No Events Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  There are currently no events to display. Please check back later for updates.
                </p>
              </>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default News;