import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AnimatedSection from '../components/ui/AnimatedSection';
import axios from 'axios';
import { Search } from 'lucide-react';
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const Announcement = () => {
  const [visibleNewsCount, setVisibleNewsCount] = useState(6);
  const [expandedItems, setExpandedItems] = useState({});
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLoadMore = () => {
    setVisibleNewsCount((prev) => prev + 3);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
    setFiltered(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/all_updates`);
        setData(response.data.data);
        setFiltered(response.data.data);
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchData();
  }, []);

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="rounded-sm border overflow-hidden shadow-md p-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2 animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 🔍 SEO + Social Media Meta Tags */}
      <Helmet>
        <title>Updates | ESTG-TSS</title>
        <meta key="description" name="description" content="Stay informed with the latest updates, announcements, and achievements from ESTG-TSS. Check back regularly for important news and developments." />
        <meta key="og:title" property="og:title" content="Updates | ESTG-TSS" />
        <meta key="og:description" property="og:description" content="Get the latest updates and announcements from ESTG-TSS. Stay connected with our school community and never miss important news." />
        <meta key="og:url" property="og:url" content="https://estg-tss.vercel.app/updates" />
        <meta key="og:image" property="og:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Updates | ESTG-TSS" />
        <meta key="twitter:description" name="twitter:description" content="Read the latest updates and announcements from ESTG-TSS. Stay up to date with our school’s news and achievements." />
        <meta key="twitter:image" name="twitter:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
      </Helmet>

      <Navbar />
      <section className="py-20 text-center">
        <AnimatedSection>
          <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">School Updates</h1>
          <p className="text-black dark:text-white max-w-xl mx-auto mb-12">
            Stay informed with the latest news, events, and achievements from our school community. Check back regularly for important announcements and exciting developments in our learning journey together.
          </p>
        </AnimatedSection>

        {/* Search bar */}
        <div className="relative w-[90%] max-w-xl mx-auto mb-12">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search announcements..."
            className="w-full outline-none px-12 py-3 rounded-md bg-white dark:bg-black border border-gray-300 dark:border-gray-700"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
        </div>

        {isLoading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-[89%] mx-auto px-6">
            {/* Display 6 skeleton cards while loading */}
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : data.length === 0 ? (
          // No announcements in the database
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
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
              No Announcements Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              The announcements database is currently empty.
            </p>
          </div>
        ) : searchTerm && filtered.length === 0 ? (
          // Search term entered but no match
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
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
              No Matching Announcements
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              No announcements found for your search. Try a different keyword.
            </p>
          </div>
        ) : (
          // Matching results found
          <>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-[89%] mx-auto px-6">
              {filtered.slice(0, visibleNewsCount).map((item) => {
                const isExpanded = expandedItems[item._id];
                const description = item.description;
                const shortText =
                  description.length > 150 ? description.slice(0, 150) + '...' : description;

                return (
                  <div
                    key={item._id}
                    className="rounded-sm border overflow-hidden shadow-md hover:shadow-xl transition duration-300 p-6"
                  >
                    <div className="text-left">
                      <p className="text-sm text-black dark:text-white mb-2">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <h3 className="text-lg font-semibold text-black dark:text-white uppercase mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {isExpanded ? description : shortText}
                      </p>
                      {description.length > 150 && (
                        <button
                          onClick={() => toggleExpand(item._id)}
                          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                        >
                          {isExpanded ? 'Show Less' : 'Show More...'}
                        </button>
                      )}
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          download={`${item.title}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm mt-3 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                        >
                          📥 Download Attachment
                        </a>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                        # {item.type}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleNewsCount < filtered.length && (
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
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Announcement;