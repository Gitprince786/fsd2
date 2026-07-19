import React from 'react';
import { FileText, Edit3, Trash2, Calendar } from 'lucide-react';
import { validationStrategies } from '../utils/validationStrategies';

export function DraftList({ drafts, onEdit, onDelete, activeEditId }) {
  
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + 
             date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-100">
            Saved Drafts ({drafts.length})
          </h2>
          <p className="text-xs text-zinc-400">Offline persisted drafts history</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 flex flex-col gap-3">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 border border-dashed border-white/5 rounded-xl text-center">
            <p className="text-zinc-500 text-xs italic">
              No drafts saved yet.
            </p>
            <p className="text-zinc-650 text-[10px] mt-1 uppercase tracking-wider font-semibold">
              Write some content above and click Save Draft
            </p>
          </div>
        ) : (
          drafts.map((draft) => {
            const platformConfig = validationStrategies[draft.platform] || {
              name: 'Unknown',
              color: '#71717a',
              bgColor: 'rgba(113, 113, 122, 0.1)'
            };

            const isActiveEdit = activeEditId === draft.id;

            return (
              <div
                key={draft.id}
                className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isActiveEdit
                    ? 'bg-white/[0.04] border-white/20 shadow-xl shadow-black/40'
                    : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/35'
                }`}
              >
                {/* Visual left colored platform bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[3px] transition-all"
                  style={{ backgroundColor: platformConfig.color }}
                ></div>

                <div className="flex items-start justify-between gap-3 mb-2.5 pl-1">
                  {/* Platform tag badge */}
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border"
                    style={{
                      color: platformConfig.color,
                      backgroundColor: platformConfig.bgColor,
                      borderColor: `${platformConfig.color}20`
                    }}
                  >
                    {platformConfig.name}
                  </span>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <Calendar className="w-3 h-3 text-zinc-650" />
                    <span>{formatTime(draft.updatedAt)}</span>
                  </div>
                </div>

                {/* Content snippet */}
                <p className="text-zinc-350 text-xs leading-relaxed break-words line-clamp-3 pl-1 pr-2 mb-3">
                  {draft.content}
                </p>

                {/* Action buttons */}
                <div className="flex justify-end gap-2 border-t border-white/5 pt-2.5 pl-1">
                  <button
                    onClick={() => onEdit(draft)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      isActiveEdit
                        ? 'bg-zinc-100 text-zinc-950 font-black'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isActiveEdit ? 'Editing' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => onDelete(draft.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
