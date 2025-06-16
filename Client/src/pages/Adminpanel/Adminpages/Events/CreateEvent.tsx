import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

function Event() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/adminpanel');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.warn("Please fill out all required fields.", { position: "bottom-right" });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('imageUrl', image);
    }

    try {
      const res = await axios.post(`${API_URL}/upload_events`, formData, { withCredentials: true });
      setUploadedData(res.data);
      toast.success('Event created successfully!', { position: "bottom-right" });
      navigate('/adminpanel', { state: { activeTab: 1, message: 'Event created successfully!' } });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create event. Please try again.', { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔍 SEO + Social Media Meta Tags */}
      <Helmet>
        <title>Create Event | ESTG-TSS</title>
        <meta key="description" name="description" content="Add new events and activities for ESTG-TSS. Use this admin panel to keep the school community informed about upcoming events and important dates." />

        {/* Open Graph Meta Tags */}
        <meta key="og:title" property="og:title" content="Create Event | ESTG-TSS" />
        <meta key="og:description" property="og:description" content="Create and publish new events and activities for the ESTG-TSS community from the admin panel." />
        <meta key="og:url" property="og:url" content="https://estg-tss.vercel.app/admin/create-event" />
        <meta key="og:image" property="og:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Create Event | ESTG-TSS" />
        <meta key="twitter:description" name="twitter:description" content="Easily add new events and activities for ESTG-TSS using the admin panel." />
        <meta key="twitter:image" name="twitter:image" content="https://estg-tss.vercel.app/assets/hero_image.jpg" />
      </Helmet>
      
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full"
        aria-label="Back to admin panel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-sm dark:shadow-[#333] shadow-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-800">
              Create Event
            </h1>
            <p className="mt-2 text-sm dark:text-gray-100 text-gray-800">
              Fill in the event details below
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="eventTitle"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="eventDesc"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="eventDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="eventImage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Event Image (Optional)
                </label>
                <input
                  type="file"
                  id="eventImage"
                  name="imageUrl"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>

          {uploadedData && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="text-lg font-semibold dark:text-gray-200">Event Created Successfully!</h3>
              <p className="dark:text-gray-300"><strong>Title:</strong> {uploadedData.title}</p>
              <p className="dark:text-gray-300"><strong>Description:</strong> {uploadedData.description}</p>
              {uploadedData.imageUrl && (
                <img 
                  src={uploadedData.imageUrl} 
                  alt="Uploaded event" 
                  className="mt-2 w-full h-auto rounded-md"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Event;