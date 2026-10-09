import React, { useEffect, useState } from "react";
import axios from "axios";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import logo from "../assets/playtube1.png";
import { serverUrl } from "../App";

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

const LikedContentPage = () => {
  const [likedShorts, setLikedShorts] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedContent = async () => {
      try {
        // ✅ Fetch Liked Shorts
        const shortsRes = await axios.get(`${serverUrl}/api/content/likedshorts`, {
          withCredentials: true,
        });
        setLikedShorts(shortsRes.data || []);

        // ✅ Fetch Liked Videos
        const videosRes = await axios.get(`${serverUrl}/api/content/likedvideos`, {
          withCredentials: true,
        });
        setLikedVideos(videosRes.data || []);

        // ✅ Calculate duration for each liked video
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
        console.error("Error fetching liked content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedContent();
  }, []);

  if (loading) {
    return <p className="p-6">Loading liked content...</p>;
  }

  const validShorts = Array.isArray(likedShorts) ? likedShorts.filter(Boolean) : [];
  const validVideos = Array.isArray(likedVideos) ? likedVideos.filter(Boolean) : [];

  return (
    <div className="min-h-screen px-2 sm:px-4 py-4 mb-16">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-[#272727] tracking-tight">
        Liked Content
      </h1>

      {validShorts.length === 0 && validVideos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-lg">You haven't liked any videos or shorts yet.</p>
        </div>
      )}

      {/* Shorts Section */}
      {validShorts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <SiYoutubeshorts className="w-6 h-6 text-[#ff0000]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Liked Shorts</h2>
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
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Liked Videos</h2>
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

export default LikedContentPage;
