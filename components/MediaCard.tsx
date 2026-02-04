
import React, { useState } from 'react';
import { Play, Download, Heart } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCardProps {
  item: MediaItem;
  isLiked: boolean;
  onClick: () => void;
  onDownload: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, isLiked, onClick, onDownload }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-200 cursor-pointer shadow-sm hover:shadow-xl active:scale-95 transition-all duration-300 ease-out"
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
      )}
      
      <img
        src={item.thumbnail}
        alt={item.title}
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } group-hover:scale-105`}
        onLoad={() => setIsLoaded(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <p className="text-white text-sm font-bold truncate font-heading tracking-tight">{item.title}</p>
        {item.location && (
          <p className="text-gray-300 text-[10px] font-medium tracking-wide">
            {item.location}
          </p>
        )}
      </div>

      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
        {item.type === 'video' && (
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full text-white border border-white/20">
            <Play size={12} fill="white" />
          </div>
        )}
        {isLiked && (
          <div className="bg-red-500/90 backdrop-blur-md p-1.5 rounded-full text-white shadow-lg">
            <Heart size={12} fill="white" />
          </div>
        )}
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        className="absolute bottom-2.5 right-2.5 bg-white/20 backdrop-blur-xl hover:bg-white hover:text-blue-600 p-2 rounded-full text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
      >
        <Download size={14} />
      </button>
    </div>
  );
};

export default MediaCard;
