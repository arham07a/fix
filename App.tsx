
import React, { useState, useMemo, useEffect } from 'react';
import { Search, LayoutGrid, Heart, Share, ChevronUp, Archive } from 'lucide-react';
import { GALLERY_ITEMS } from './constants';
import { Category, MediaItem } from './types';
import MediaCard from './components/MediaCard';
import MediaModal from './components/MediaModal';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('azimian_likes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('azimian_likes', JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShare = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Could not copy text: ', err);
      }
    }
  };

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter(item => {
      const matchesCategory = 
        activeCategory === 'All' || 
        (activeCategory === 'Photos' && item.type === 'photo') ||
        (activeCategory === 'Videos' && item.type === 'video');
      
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFavorites = !showFavoritesOnly || likedIds.has(item.id);

      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [activeCategory, searchQuery, showFavoritesOnly, likedIds]);

  const downloadMedia = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
      window.open(url, '_blank');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSealMemories = () => {
    window.open('https://drive.google.com/file/d/1icGcNI3OcCLqO1i3NCf87oqvVXJF5YPy/view?usp=drivesdk', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col">
      <header className="sticky top-0 z-40 w-full ios-blur bg-white/80 border-b border-gray-200/40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Memories</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight leading-none font-heading">
                Azimians <span className="text-blue-600">2k26</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleShare('Azimian 2k26', 'Check out these amazing memories in the Azimian 2k26 gallery!', window.location.href)}
                className="p-2 bg-gray-100 rounded-full text-blue-600 hover:bg-white hover:shadow-sm active:scale-90 transition-all"
                title="Share Gallery"
              >
                <Share size={18} />
              </button>
              <button 
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2 rounded-full transition-all active:scale-90 shadow-sm ${
                  showFavoritesOnly 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-blue-600 hover:bg-white'
                }`}
                title={showFavoritesOnly ? "Show All" : "Show Favorites"}
              >
                <Heart size={18} fill={showFavoritesOnly ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search moments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-200/60 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['All', 'Photos', 'Videos'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                      : 'bg-white text-gray-600 border border-gray-200/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 pt-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filteredItems.map((item) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              isLiked={likedIds.has(item.id)}
              onClick={() => setSelectedItem(item)}
              onDownload={() => downloadMedia(item.url, `${item.title.replace(/\s+/g, '_')}.${item.type === 'video' ? 'mp4' : 'jpg'}`)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="p-5 bg-white rounded-2xl shadow-sm mb-4">
              <LayoutGrid size={32} strokeWidth={1.5} className="text-gray-200" />
            </div>
            <p className="text-lg font-bold text-gray-900 font-heading">
              {showFavoritesOnly ? "No favorites yet" : "No results found"}
            </p>
            <p className="text-xs mt-1">
              {showFavoritesOnly ? "Heart some items to see them here" : "Try a different search term"}
            </p>
          </div>
        )}
      </main>

      <footer className="w-full py-16 px-6 flex flex-col items-center justify-center relative">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 text-center">
          <p className="text-[#333] font-serif text-[17px] md:text-[19px] tracking-tight">
            © 2026 <a href="https://arhamadib.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Arham Adib</a>. All rights reserved.
          </p>
          <p className="text-black text-sm md:text-base font-medium flex items-center">
            Made with <span className="mx-2 text-[#ff79c6]">💗</span> <span className="text-[#a855f7] font-bold">Aaham.</span>
          </p>
        </div>

        <div className="fixed bottom-6 left-0 right-0 px-6 md:bottom-10 md:px-10 z-50 pointer-events-none flex justify-between">
          <button
            onClick={openSealMemories}
            className="pointer-events-auto h-12 px-5 flex items-center justify-center gap-2 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 text-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
            aria-label="Seal Memories!"
          >
            <Archive size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-tight pr-1">Seal Memories!</span>
          </button>

          <button
            onClick={scrollToTop}
            className={`pointer-events-auto w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 text-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-90 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Back to Top"
          >
            <ChevronUp size={24} strokeWidth={2.5} />
          </button>
        </div>
      </footer>

      {selectedItem && (
        <MediaModal 
          item={selectedItem} 
          isLiked={likedIds.has(selectedItem.id)}
          onToggleLike={() => toggleLike(selectedItem.id)}
          onShare={() => handleShare(selectedItem.title, `Check out this ${selectedItem.type} from Azimian 2k26: ${selectedItem.title}`, selectedItem.url)}
          onClose={() => setSelectedItem(null)} 
          onDownload={() => downloadMedia(selectedItem.url, `${selectedItem.title.replace(/\s+/g, '_')}.${selectedItem.type === 'video' ? 'mp4' : 'jpg'}`)}
        />
      )}
    </div>
  );
};

export default App;
