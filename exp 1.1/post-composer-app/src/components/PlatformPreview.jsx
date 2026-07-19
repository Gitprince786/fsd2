import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Globe, Heart as HeartFilled } from 'lucide-react';

/**
 * Helper to render post text with highlighted hashtags, mentions, and links.
 */
function HighlightedText({ text }) {
  if (!text) return <span className="text-zinc-500 italic">Start typing your post...</span>;

  // Regex to detect hashtags, mentions, and URLs
  const regex = /(#\w+|@\w+|(?:https?:\/\/)[^\s]+)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <span key={index} className="text-sky-400 hover:underline cursor-pointer">
              {part}
            </span>
          );
        }
        if (part.startsWith('@')) {
          return (
            <span key={index} className="text-sky-400 hover:underline cursor-pointer">
              {part}
            </span>
          );
        }
        if (part.startsWith('http://') || part.startsWith('https://')) {
          return (
            <span key={index} className="text-sky-400 underline cursor-pointer break-all">
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function PlatformPreview({ platform, content }) {
  // Common avatar placeholder
  const avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  const renderTwitterPreview = () => {
    return (
      <div className="bg-black text-white p-4 rounded-xl border border-zinc-800 font-sans shadow-lg text-left">
        <div className="flex gap-3">
          <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-100 truncate">Jane Doe</span>
              <span className="text-zinc-500 text-xs truncate">@janedoe</span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-zinc-500 text-xs">now</span>
            </div>
            <div className="mt-1 text-[15px] leading-relaxed text-zinc-100 whitespace-pre-wrap break-words">
              <HighlightedText text={content} />
            </div>
            
            {/* Twitter icons */}
            <div className="flex justify-between items-center mt-4 max-w-md text-zinc-500">
              <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors cursor-pointer group">
                <div className="p-2 rounded-full group-hover:bg-sky-500/10">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer group">
                <div className="p-2 rounded-full group-hover:bg-emerald-500/10">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.9 2 2 2h4v2H7.5c-2.48 0-4.5-2.02-4.5-4.5V7.55L.932 9.48-.432 8.02L4.5 3.88zM23.07 14.52l1.362-1.46L20 8.92l-4.432 4.14 1.364 1.46 2.068-1.93V17c0 2.48-2.02 4.5-4.5 4.5H10.5v-2h4c1.1 0 2-.9 2-2V12.59l-2.068 1.93-1.364-1.46 4.432-4.14 4.432 4.14z"/></svg>
                </div>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer group">
                <div className="p-2 rounded-full group-hover:bg-rose-500/10">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors cursor-pointer group">
                <div className="p-2 rounded-full group-hover:bg-sky-500/10">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span className="text-xs">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLinkedInPreview = () => {
    return (
      <div className="bg-[#1d2226] text-zinc-200 p-4 rounded-xl border border-zinc-800 font-sans shadow-lg text-left">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[14px] text-zinc-100 hover:text-sky-400 hover:underline cursor-pointer">Jane Doe</span>
                <span className="text-zinc-400 text-xs">• 1st</span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1">Product Architect & Tech Specialist</p>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                <span>now • </span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>
          <button className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[13px] leading-relaxed text-zinc-200 whitespace-pre-wrap break-words mt-2 mb-4">
          <HighlightedText text={content} />
        </div>

        {/* LinkedIn interactions footer */}
        <div className="flex justify-between items-center border-t border-zinc-800/80 pt-2 text-[13px] text-zinc-400 font-semibold">
          <button className="flex items-center justify-center gap-2 hover:bg-zinc-800/60 py-2.5 px-3 rounded-lg flex-1 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.46 8l-3.4 4.19a3 3 0 01-4.28.36L9.62 10.7a2 2 0 00-2.88 0L3 14.8V21a1 1 0 001 1h16a1 1 0 001-1v-8.21a2 2 0 00-.54-1.39zM8.5 6a1.5 1.5 0 111.5-1.5A1.5 1.5 0 018.5 6z" /></svg>
            <span>Like</span>
          </button>
          <button className="flex items-center justify-center gap-2 hover:bg-zinc-800/60 py-2.5 px-3 rounded-lg flex-1 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>
          <button className="flex items-center justify-center gap-2 hover:bg-zinc-800/60 py-2.5 px-3 rounded-lg flex-1 transition-colors">
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    );
  };

  const renderInstagramPreview = () => {
    return (
      <div className="bg-[#121212] text-zinc-200 rounded-xl border border-zinc-800 font-sans overflow-hidden shadow-lg text-left">
        {/* Instagram Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800/85">
          <div className="flex items-center gap-2.5">
            <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-rose-500/50 p-0.5 object-cover" />
            <span className="font-bold text-[13px] text-zinc-100 cursor-pointer hover:text-zinc-300">janedoe</span>
          </div>
          <button className="text-zinc-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Media Block (Dynamic mockup gradient) */}
        <div className="aspect-square bg-gradient-to-tr from-purple-800 via-pink-800 to-amber-700 flex flex-col items-center justify-center relative p-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="z-10 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-center max-w-[80%] shadow-lg">
            <p className="text-[13px] font-semibold text-zinc-100 select-none italic line-clamp-4">
              {content || "Your post will be rendered on top of this media..."}
            </p>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/50 text-[10px] text-zinc-300 px-2 py-0.5 rounded-full backdrop-blur-sm">
            #instagramPreview
          </div>
        </div>

        {/* Interactions Footer */}
        <div className="p-3">
          <div className="flex justify-between items-center mb-2 text-zinc-100">
            <div className="flex gap-4">
              <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-5 h-5 hover:text-zinc-400 cursor-pointer transition-colors" />
              <Send className="w-5 h-5 hover:text-zinc-400 cursor-pointer transition-colors" />
            </div>
            <Bookmark className="w-5 h-5 hover:text-zinc-400 cursor-pointer transition-colors" />
          </div>

          <div className="text-[13px] text-zinc-100 mt-2">
            <span className="font-bold mr-2 text-zinc-100 cursor-pointer">janedoe</span>
            <span className="text-zinc-200 whitespace-pre-wrap break-words">
              <HighlightedText text={content} />
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderFacebookPreview = () => {
    return (
      <div className="bg-[#242526] text-zinc-200 p-4 rounded-xl border border-zinc-800 font-sans shadow-lg text-left">
        <div className="flex items-center gap-3 mb-3">
          <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <span className="font-bold text-[14px] text-zinc-100 cursor-pointer hover:underline">Jane Doe</span>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
              <span>Just now • </span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="text-[14px] leading-relaxed text-zinc-200 whitespace-pre-wrap break-words mt-1 mb-4">
          <HighlightedText text={content} />
        </div>

        {/* Action icons bar */}
        <div className="flex justify-between items-center border-t border-b border-zinc-800/80 py-1 text-[13px] text-zinc-400 font-semibold mb-1">
          <button className="flex items-center justify-center gap-2 hover:bg-zinc-800 py-2 rounded-lg flex-1 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-1 8h-4v8h-3v-8H9V8h3V6.5A2.5 2.5 0 0114.5 4H17v3h-1.5a.5.5 0 00-.5.5V8h3v3z" /></svg>
            <span>Like</span>
          </button>
          <button className="flex items-center justify-center gap-2 hover:bg-zinc-800 py-2 rounded-lg flex-1 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>
          <button className="flex items-center justify-center gap-2 hover:bg-zinc-800 py-2 rounded-lg flex-1 transition-colors">
            <Send className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    );
  };

  switch (platform) {
    case 'twitter': return renderTwitterPreview();
    case 'linkedin': return renderLinkedInPreview();
    case 'instagram': return renderInstagramPreview();
    case 'facebook': return renderFacebookPreview();
    default: return null;
  }
}
