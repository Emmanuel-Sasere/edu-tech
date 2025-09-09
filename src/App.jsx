import React, { useState, useEffect } from 'react';
import { Play, Plus, Trash2,  Video } from 'lucide-react';
import logo from '../src/assets/ustackschool.png';

const STORAGE_KEY = "ustackschool_videos";

const VideoLearningPlatform = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', url: '' });

  // Load saved videos on mount
  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedVideos && savedVideos.length > 0) {
      setVideos(savedVideos);
      setCurrentVideo(savedVideos[0]);
    } else {
      // fallback default videos
      const defaults = [
        {
          id: 1,
          name: "Product Management Masterclass",
          description: " Learn how to identify real user needs, run effective user interviews, design powerful surveys, and analyze qualitative and quantitative data to drive smart product decisions",
          url: "https://www.youtube.com/embed/uSz4dQyG9g8?si=3q0u1oD0aQObALZa"
        },
        {
          id: 2,
          name: "Introduction to React",
          description: "Learn the basics of React development and component architecture",
          url: "https://www.youtube.com/embed/bMknfKXIFA8"
        },
        {
          id: 3,
          name: "ES6 Tutorial: Learn Modern JavaScript in 1 Hour",
          description: "Building an app or preparing for a JavaScript interview? Watch this ES6 tutorial to learn ES6 quickly. ",
          url: "https://www.youtube.com/embed/NCwa_xi0Uuc?si=b4vhWSwrrlxYcUuT"
        },
       
      ];
      setVideos(defaults);
      setCurrentVideo(defaults[0]);
    }
  }, []);

  // Save videos to localStorage whenever they change
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    }
  }, [videos]);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatYouTubeUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.url) return;

    const formattedUrl = formatYouTubeUrl(formData.url);
    if (!formattedUrl) return;

    const newVideo = { id: Date.now(), ...formData, url: formattedUrl };
    const updated = [...videos, newVideo];
    setVideos(updated);
    setFormData({ name: '', description: '', url: '' });
    setShowForm(false);
    setCurrentVideo(newVideo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const deleteVideo = (id) => {
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    if (currentVideo?.id === id) {
      setCurrentVideo(updatedVideos[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-start justify-center gap-0">
            <div className="rounded-md">
              {/* <BookOpen className="w-6 h-6 text-white" /> */}
               <img src={logo} alt="UstackSchool Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-3xl font-normal ml-[-7px] text-end text-black">stack<span className='font-semibold'>school</span></h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#6521FF] hover:bg-[#5915fa] text-white px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <section className="lg:col-span-2">
          <div className="bg-white border rounded-md shadow-sm">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-[#6729fa]" />
                Current Lesson
              </h2>

              {currentVideo ? (
                <>
                  <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
                    <iframe
                      src={currentVideo.url}
                      title={currentVideo.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-black">{currentVideo.name}</h3>
                  <p className="text-gray-600 mt-2">{currentVideo.description}</p>
                </>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-md">
                  <p className="text-gray-500">No video selected</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Library */}
        <aside>
          <div className="bg-white border rounded-md shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Library</h2>
            <div className="space-y-3">
              {videos.map(video => (
                <div
                  key={video.id}
                  className={`p-3 border rounded-md  transition hover:scale-[1.01] ${
                    currentVideo?.id === video.id
                      ? 'border-[#6421ffe6] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="text-gray-900 font-medium">{video.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setCurrentVideo(video)}
                      className="flex-1 bg-[#6521FF] hover:bg-[#5915fa] text-white py-1.5 rounded text-sm flex items-center justify-center gap-1 cursor-pointer "
                    >
                      <Play className="w-4 h-4" /> Watch
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Add Video Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Video</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Video name"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Video description"
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="YouTube URL"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded-md py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#6521FF] text-white rounded-md py-2 hover:bg-[#5915fa] cursor-pointer"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLearningPlatform;
