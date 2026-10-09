import React from "react";
import { useSelector } from "react-redux";
import ShortsCard from "./ShortsCard";
import { SiYoutubeshorts } from "react-icons/si";

const ShortsPage = () => {
  const { allShortData } = useSelector((state) => state.content) || {};
  const latestShorts = allShortData?.slice(0, 10) || [];

  return (
    <div className="mt-8 pt-6 border-t border-[#272727]">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-4">
        <SiYoutubeshorts className="w-6 h-6 text-[#ff0000]" />
        <h2 className="text-xl font-bold text-white tracking-tight">Shorts</h2>
      </div>

      {/* Horizontal scroll with fixed width cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        {latestShorts.map((short) => (
          <ShortsCard
            key={short._id}
            shortUrl={short.shortUrl}
            title={short.title}
            channelName={short.channel?.name}
            views={short.views}
            id={short?._id}
            avatar={short.channel?.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default ShortsPage;
