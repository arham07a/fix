export type MediaType = 'photo' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail: string;
  title: string;
  date: string;
  location?: string;
  preload?: boolean;
  duration?: number;
  buffered?: boolean;
  bufferPercentage?: number;
}

export type Category = 'All' | 'Photos' | 'Videos';
