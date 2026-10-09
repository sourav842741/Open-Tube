// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";

const getVideoDuration = (url, callback) => {
  if (!url) {
    callback("0:00");
    return;
  }
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

const HistoryPage = () => {
  const { videoHistory, shortHistory } = useSelector((state) => state.user) || {};
  const [durations, setDurations] = useState({});

  // Filter out any deleted/null items
  const validVideos = Array.isArray(videoHistory)
    ? videoHistory.filter((item) => item?.contentId && typeof item.contentId === "object")
    : [];

  const validShorts = Array.isArray(shortHistory)
    ? shortHistory.filter((item) => item?.contentId && typeof item.contentId === "object")
    : [];

  // ✅ calculate durations for videos safely
  useEffect(() => {
    if (validVideos.length > 0) {
      validVideos.forEach((item) => {
        const video = item.contentId;
        if (video?.videoUrl && !durations[video._id]) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }));
          });
        }
      });
    }
  }, [videoHistory]);

  const hasHistory = validVideos.length > 0 || validShorts.length > 0;

  return (
    <div className="min-h-screen px-2 sm:px-4 py-4 mb-16">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#272727]">
        <FaHistory className="text-2xl text-gray-300" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Watch History</h1>
      </div>

      {!hasHistory && (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-lg">No watch history found.</p>
          <p className="text-gray-500 text-sm mt-1">Videos and shorts you watch will appear here.</p>
        </div>
      )}

      {/* Shorts History */}
      {validShorts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <SiYoutubeshorts className="w-6 h-6 text-[#ff0000]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Shorts History</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {validShorts.map((item) => {
              const short = item.contentId;
              return (
                <ShortsCard
                  key={item._id}
                  shortUrl={short.shortUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  views={short.views}
                  id={short._id}
                  avatar={short.channel?.avatar}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Video History */}
      {validVideos.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#272727]">
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
            Videos History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            {validVideos.map((item) => {
              const video = item.contentId;
              return (
                <VideoCard
                  key={item._id}
                  thumbnail={video.thumbnail}
                  duration={durations[video._id] || "0:00"}
                  channelLogo={video.channel?.avatar}
                  title={video.title}
                  channelName={video.channel?.name}
                  views={`${video.views}`}
                  time={video.createdAt ? new Date(video.createdAt).toLocaleDateString() : ""}
                  id={video._id}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
