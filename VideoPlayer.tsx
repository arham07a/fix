import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  thumbnail: string;
  title: string;
  onBufferComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  thumbnail,
  title,
  onBufferComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [bufferPercentage, setBufferPercentage] = useState(0);
  const [isFullyBuffered, setIsFullyBuffered] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        
        if (duration > 0) {
          const percentage = (bufferedEnd / duration) * 100;
          setBufferPercentage(Math.round(percentage));

          // Fully buffered when 99% or more is loaded
          if (percentage >= 99) {
            setIsFullyBuffered(true);
            setIsBuffering(false);
            onBufferComplete?.();
          }
        }
      }
    };

    const handleCanPlayThrough = () => {
      setIsFullyBuffered(true);
      setIsBuffering(false);
      onBufferComplete?.();
    };

    const handlePlay = (e: Event) => {
      if (!isFullyBuffered) {
        e.preventDefault();
        video.pause();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('play', handlePlay);

    // Force full preload
    video.preload = 'auto';
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('play', handlePlay);
    };
  }, [url, isFullyBuffered, onBufferComplete]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={url}
        poster={thumbnail}
        controls={isFullyBuffered}
        controlsList="nodownload"
        className="w-full h-auto cursor-pointer"
      />
      
      {isBuffering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 cursor-not-allowed">
          <div className="text-white text-center px-6">
            <div className="mb-6 text-lg font-semibold">{title}</div>
            
            <div className="mb-4">
              <div className="w-72 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                  style={{ width: `${bufferPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-300 font-medium">
              Loading video: {bufferPercentage}%
            </div>
            
            <div className="mt-3 text-xs text-gray-400">
              {bufferPercentage === 100 ? 'Ready to play' : 'Please wait...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
