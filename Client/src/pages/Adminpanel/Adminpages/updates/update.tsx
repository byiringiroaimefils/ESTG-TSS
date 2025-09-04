import React, { useEffect, useState } from 'react';
import Card from './cards'; // Update card component
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

const API_URL = import.meta.env.VITE_API_URL;

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

function Update() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/updates`, {
        withCredentials: true,
      });
      setData(response.data.data);
      setFiltered(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch updates', { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredData = data.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
    setFiltered(filteredData);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete_update/${id}`, {
        withCredentials: true,
      });
      toast.success('Update deleted successfully!', { position: "bottom-right" });
      fetchData();
    } catch (error) {
      console.error('Error deleting update:', error);
      toast.error('Failed to delete the update. Please try again.', { position: "bottom-right" });
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  return (
    <div className="p-6 mt-5 bg-gray-100 dark:bg-black min-h-screen">
       {/* 🔍 SEO + Social Media Meta Tags */}
            <Helmet>
        <title>Admin Updates | ESTG-TSS</title>
        <meta key="description" name="description" content="Manage and review all school updates, announcements, and important information from the ESTG-TSS admin panel. Stay organized and informed as an administrator." />

        {/* Open Graph Meta Tags */}
        <meta key="og:title" property="og:title" content="Admin Updates | ESTG-TSS" />
        <meta key="og:description" property="og:description" content="Access and manage the latest school updates and announcements from the ESTG-TSS admin panel." />
        <meta key="og:url" property="og:url" content="https://estg-tss.vercel.app/admin/updates" />
        <meta key="og:image" property="og:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Admin Updates | ESTG-TSS" />
        <meta key="twitter:description" name="twitter:description" content="Stay up to date and manage all school updates and announcements from the ESTG-TSS admin panel." />
        <meta key="twitter:image" name="twitter:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
      </Helmet>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Link to="/createupdate">
          <button 
              className="flex bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 w-40 h-8 items-center justify-center rounded-sm text-white transition-colors"
        >
             <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>Add Updates
          </button>
        </Link>

        <div className="relative w-full sm:w-96 mt-5 sm:mt-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search updates..."
            className="w-full px-12 py-3 rounded-md outline-none shadow-sm shadow-gray-400 dark:shadow-[#333] bg-white dark:bg-black border border-gray-300 dark:border-gray-700"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-black dark:text-white mb-5 mt-5">Update Cards</h1>

      {/* === Conditional Rendering === */}
      {loading ? (
        // Loading state
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <svg
            className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500"
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
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">No Updates Available</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            You haven't added any updates yet. Click "Add Updates" to get started.
          </p>
        </div>
      ) : searchTerm !== '' && filtered.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <svg
            className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">No Matching Results</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            No updates matched your search. Try different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item, index) => (
            <Card
              key={index}
              id={item._id || index}
              title={item.title}
              author={item.author?.username}
              description={item.description}
              updatestype={item.type}
              fileUrl={item.fileUrl}
              onUpdate={() => handleUpdate(item._id)}
              onDelete={() => handleDelete(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Update;
