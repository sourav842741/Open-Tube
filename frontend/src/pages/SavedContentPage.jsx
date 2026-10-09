import React, { useEffect, useState } from "react";
import axios from "axios";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import logo from "../assets/playtube1.png";
import { serverUrl } from "../App";
// ✅ apna serverUrl import karna

// Helper to get duration
const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;
  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };
  video.onerror = () => {
    callback("0:00");
  };
};

const SavedContentPage = () => {
  const [savedShorts, setSavedShorts] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        // Parallel request -> shorts + videos
       const shortsRes = await axios.get(`${serverUrl}/api/content/saveshorts`, {
  withCredentials: true,
});
setSavedShorts(shortsRes.data || []);

const videosRes = await axios.get(`${serverUrl}/api/content/savevideos`, {
  withCredentials: true,
});
setSavedVideos(videosRes.data || []);

        // ✅ video duration calculate karo
        if (Array.isArray(videosRes.data)) {
          videosRes.data.forEach((video) => {
            getVideoDuration(video.videoUrl, (formattedTime) => {
              setDurations((prev) => ({
                ...prev,
                [video._id]: formattedTime,
              }));
            });
          });
        }
      } catch (error) {
        console.error("Error fetching saved content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedContent();
  }, []);

  if (loading) {
    return <p className="p-6">Loading saved content...</p>;
  }

  const validShorts = Array.isArray(savedShorts) ? savedShorts.filter(Boolean) : [];
  const validVideos = Array.isArray(savedVideos) ? savedVideos.filter(Boolean) : [];

  return (
    <div className="min-h-screen px-2 sm:px-4 py-4 mb-16">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-[#272727] tracking-tight">
        Saved Content
      </h1>

      {validShorts.length === 0 && validVideos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-lg">No saved content found.</p>
        </div>
      )}

      {/* Shorts Section */}
      {validShorts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <SiYoutubeshorts className="w-6 h-6 text-[#ff0000]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Saved Shorts</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {validShorts.map((short) => (
              <ShortsCard
                key={short._id}
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.channel?.name}
                views={short.views}
                id={short._id}
                avatar={short.channel?.avatar}
              />
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {validVideos.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#272727]">
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Saved Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            {validVideos.map((video) => (
              <VideoCard
                key={video._id}
                thumbnail={video.thumbnail}
                duration={durations[video._id] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={`${video.views}`}
                time={video.createdAt ? new Date(video.createdAt).toLocaleDateString() : ""}
                id={video._id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedContentPage;
