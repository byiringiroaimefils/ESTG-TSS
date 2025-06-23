import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Future from '../assets/future.png'
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import axios from "axios";
import NotFound from "./NotFound";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface NewsItem {
  id: number;
  _id: number;
  title: string;
  createdAt: string;
  imageUrl: string;
  description: string;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  console.log("News id from Url", id);
  const navigate = useNavigate();
  const [otherNews, setOtherNews] = useState<NewsItem[]>([]);
  const [visibleNewsCount, setVisibleNewsCount] = useState(3);
  const [data, setData] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/single_event/${id}`);
        setData(response.data);
        console.log("API response:", response.data);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/all_events`);
        const filtered = response.data.data.filter((item: NewsItem) => item.id !== Number(id));
        setOtherNews(filtered);
      } catch (error) {
        console.error("Error fetching all news:", error);
      }
    };

    fetchAllNews();
  }, [id]);

  const handleLoadMore = () => {
    setVisibleNewsCount((prev) => prev + 3);
  };

  // Skeleton Component for Main Event
  const SkeletonMainEvent = () => (
    <div className="max-w-4xl mt-10 mb-20 mx-auto">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
      <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 animate-pulse" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
    </div>
  );

  // Skeleton Component for Other News Card
  const SkeletonNewsCard = () => (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 px-6">
        <Navbar />
        <SkeletonMainEvent />
        <div className="max-w-6xl mx-auto mt-20 mb-10 px-10 ml-20">
          <h2 className="text-2xl font-semibold mb-6">More News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <SkeletonNewsCard key={index} />
            ))}
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  if (!data) return <NotFound />;

  return (
    <section className="py-16 px-6">
      {/* 🔍 SEO + Social Media Meta Tags */}
      <Helmet>
        <title>Event Details | ESTG-TSS</title>
        <meta key="description" name="description" content="View detailed information about this ESTG-TSS event, including date, description, and related news. Stay informed and connected with our school community." />
        <meta key="og:title" property="og:title" content="Event Details | ESTG-TSS" />
        <meta key="og:description" property="og:description" content="Explore details of this event at ESTG-TSS. Learn more about our latest activities, workshops, and celebrations." />
        <meta key="og:url" property="og:url" content="https://estg-tss.vercel.app/events/detail" />
        <meta key="og:image" property="og:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Event Details | ESTG-TSS" />
        <meta key="twitter:description" name="twitter:description" content="Get all the details about this ESTG-TSS event. Stay up to date with our school’s latest happenings." />
        <meta key="twitter:image" name="twitter:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
      </Helmet>
      <Navbar />
      <div className="max-w-4xl mt-10 mb-20 mx-auto">
        <h1 className="text-2xl font-bold mb-2 uppercase">{data.title}</h1>
        <img src={data.imageUrl} alt={data.title} className="w-full rounded-lg mb-6" />
        <p className="text-sm text-black dark:text-white mb-2">
          {new Date(data.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="text-black dark:text-white">{data.description}</p>
      </div>
      <div className="max-w-6xl mx-auto mt-20 mb-10 px-10 md:ml-20">
        <h2 className="text-2xl font-semibold mb-6">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 cursor-pointer gap-6">
          {otherNews.slice(0, visibleNewsCount).map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/Events/${item._id}`)}
              className="cursor-pointer rounded-lg shadow-sm dark:shadow-[#333] transition overflow-hidden"
            >
              <img src={item.imageUrl || Future} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <p className="text-sm text-black dark:text-white">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h3 className="text-lg font-bold mt-1 text-black dark:text-white uppercase">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {visibleNewsCount < otherNews.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              See More →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
}