import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ thumbnail, duration, channelLogo, title, channelName, views, id, time }) => {
  const navigate = useNavigate();

  const formattedViews =
    Number(views) >= 1_000_000
      ? (Number(views) / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
      : Number(views) >= 1_000
      ? (Number(views) / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
      : Number(views) || 0;

  return (
    <div
      className="group w-full flex flex-col cursor-pointer transition-all duration-200"
      onClick={() => navigate(`/watch-video/${id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#202020] border border-[#272727]">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/85 text-[#f1f1f1] text-[11px] font-medium px-1.5 py-0.5 rounded-md tracking-wider">
            {duration}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex gap-3 mt-3 px-0.5">
        {/* Channel Avatar */}
        {channelLogo && (
          <img
            src={channelLogo}
            alt={channelName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5 border border-[#303030]"
          />
        )}

        {/* Text Metadata */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-[13px] text-[#aaaaaa] hover:text-[#f1f1f1] transition-colors mt-1 truncate">
            {channelName}
          </p>
          <p className="text-[12px] text-[#aaaaaa] mt-0.5 truncate">
            {formattedViews} views {time ? `• ${time}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

