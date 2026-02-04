
import React, { useState, useEffect } from 'react';
import { X, Download, Share, Heart, MapPin, Calendar, ChevronLeft } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaModalProps {
  item: MediaItem;
  isLiked: boolean;
  onToggleLike: () => void;
  onShare: () => void;
  onClose: () => void;
  onDownload: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ 
  item, 
  isLiked, 
  onToggleLike, 
  onShare, 
  onClose, 
  onDownload 
}) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in overflow-hidden">
      {/* iOS Style Mobile Header */}
      <div className="ios-blur bg-black/50 backdrop-blur-xl sticky top-0 left-0 right-0 z-[110] flex items-center justify-between px-3 md:px-5 py-2 border-b border-white/5">
        <button 
          onClick={onClose}
          className="text-white flex items-center gap-0.5 font-medium text-base active:opacity-50 transition-opacity"
        >
          <ChevronLeft size={24} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={onShare}
            className="text-white/80 hover:text-white transition-colors"
            title="Share"
          >
            <Share size={20} />
          </button>
          <button 
            onClick={onToggleLike}
            className={`${isLiked ? 'text-red-500' : 'text-white/80'} hover:opacity-70 transition-all`}
            title="Like"
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={onDownload}
            className="text-white/80 hover:text-white transition-colors"
            title="Download"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors ml-1"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-6 md:gap-12 overflow-y-auto">
        <div className="relative w-full max-w-3xl flex-1 flex items-center justify-center bg-gray-900/40 rounded-2xl overflow-hidden shadow-2xl min-h-[40vh] md:h-full">
          {!isMediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/10 border-t-white/80 rounded-full animate-spin"></div>
            </div>
          )}
          
          {item.type === 'photo' ? (
            <img 
              src={item.url} 
              alt={item.title}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              onLoad={() => setIsMediaLoaded(true)}
              className={`max-w-full max-h-full object-contain transition-all duration-700 ${isMediaLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}
            />
          ) : (
            <video 
              src={item.url} 
              controls 
              autoPlay 
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              onLoadedData={() => setIsMediaLoaded(true)}
              className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${isMediaLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>

        {/* Info Sidebar */}
        <div className="w-full md:w-72 lg:w-80 text-white space-y-5 flex-shrink-0">
          <div className="space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">{item.title}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar size={12} />
                <span>{item.date}</span>
              </div>
              {item.location && (
                <div className="flex items-center gap-1.5 text-blue-400 text-xs">
                  <MapPin size={12} />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">Device</p>
                <p className="font-medium text-white/90">OnePlus 13R</p>
              </div>
              <div>
                <p className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">Quality</p>
                <p className="font-medium text-white/90">4K Ultra HD</p>
              </div>
              <div>
                <p className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">Format</p>
                <p className="font-medium text-white/90 uppercase">{item.type === 'photo' ? 'JPEG' : 'MP4'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">ISO</p>
                <p className="font-medium text-white/90">Auto</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onDownload}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95 text-sm"
          >
            <Download size={16} />
            <span>Save to Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
