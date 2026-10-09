import React from "react";
import { useNavigate } from "react-router-dom";

const ShortsCard = ({ shortUrl, title, channelName, avatar, views, id }) => {
  const navigate = useNavigate();

  const formattedViews =
    Number(views) >= 1_000_000
      ? (Number(views) / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
      : Number(views) >= 1_000
      ? (Number(views) / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
      : Number(views) || 0;

  return (
    <div
      className="w-44 sm:w-48 md:w-52 flex-shrink-0 cursor-pointer group flex flex-col transition-transform duration-200"
      onClick={() => navigate(`/watch-short/${id}`)}
    >
      {/* Video box */}
      <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-[#1f1f1f] border border-[#272727]">
        <video
          src={shortUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          muted
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Gradient Overlay & Info */}
        <div className="absolute inset-x-0 bottom-0 p-3 pt-12 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {title}
          </h3>

          {channelName && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {avatar && (
                <img
                  src={avatar}
                  className="w-4 h-4 rounded-full object-cover border border-white/20"
                  alt={channelName}
                />
              )}
              <p className="text-[12px] text-gray-300 truncate">{channelName}</p>
            </div>
          )}

          <p className="text-[11px] text-gray-400 mt-1 font-medium">
            {formattedViews} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortsCard;
