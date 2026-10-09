import { useEffect, useState } from "react";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";

// ✅ Helper function to get duration
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

const FilterResults = ({ filterResults }) => {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    if (filterResults?.videos?.length > 0) {
      filterResults.videos.forEach((video) => {
        if (!durations[video._id]) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }));
          });
        }
      });
    }
  }, [filterResults]);

  // ✅ Agar videos aur shorts dono empty hain
  const isEmpty =
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0);

  return (
    <div className="mb-10">
      <h1 className="text-xl font-bold text-white mb-6">Filtered Content</h1>

      {isEmpty ? (
        <p className="text-gray-400 text-base py-8">No results found.</p>
      ) : (
        <>
          {/* Videos Section */}
          {filterResults.videos?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4">Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                {filterResults.videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    thumbnail={video.thumbnail}
                    duration={durations[video._id] || "0:00"}
                    channelLogo={video.channel?.avatar}
                    title={video.title}
                    channelName={video.channel?.name}
                    views={`${video.views}`}
                    time={new Date(video.createdAt).toLocaleDateString()}
                    id={video._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shorts Section */}
          {filterResults.shorts?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#272727] mb-10">
              <h3 className="text-lg font-bold text-white mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                {filterResults.shorts.map((short) => (
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
        </>
      )}
    </div>
  );
};

export default FilterResults;
