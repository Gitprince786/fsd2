import React from 'react';
import { Share2, RefreshCw, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { validationStrategies } from '../utils/validationStrategies';

export function PostComposer({ 
  values, 
  errors, 
  isValid, 
  onChange, 
  onSave, 
  onReset,
  isLoading,
  retryAttempt,
  isEditing
}) {
  const currentStrategy = validationStrategies[values.platform];
  const charCount = values.content.length;
  const charLimit = currentStrategy.limit;
  const percentage = Math.min((charCount / charLimit) * 100, 100);
  const isNearLimit = charLimit - charCount <= 20 && charCount <= charLimit;
  const isOverLimit = charCount > charLimit;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = () => {
    if (isOverLimit) return 'stroke-rose-500';
    if (isNearLimit) return 'stroke-amber-500';
    return 'stroke-indigo-500';
  };

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Background glow matching the selected platform */}
      <div 
        className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-[0.08] pointer-events-none transition-all duration-500"
        style={{ backgroundColor: currentStrategy.color }}
      ></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">
              {isEditing ? 'Edit Post Draft' : 'Compose Social Post'}
            </h2>
            <p className="text-xs text-zinc-400">Select platforms & write content</p>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="flex bg-black/45 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          {Object.values(validationStrategies).map((p) => {
            const isSelected = values.platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange('platform', p.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected 
                    ? 'text-white border shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                style={{ 
                  backgroundColor: isSelected ? p.bgColor : 'transparent',
                  borderColor: isSelected ? `${p.color}35` : 'transparent'
                }}
              >
                {p.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Space */}
      <div className="relative">
        <textarea
          value={values.content}
          onChange={(e) => onChange('content', e.target.value)}
          placeholder={currentStrategy.placeholder}
          rows={6}
          className="custom-editor"
        />

        {/* Floating circular progress indicator for character count tracking */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-[#0d0d12]/95 py-1.5 px-3 rounded-full border border-white/5 shadow-xl backdrop-blur-md">
          <span className={`text-[10px] font-mono font-bold ${
            isOverLimit ? 'text-rose-400' : isNearLimit ? 'text-amber-400' : 'text-zinc-400'
          }`}>
            {charCount} / {charLimit}
          </span>

          <svg className="w-5 h-5 transform -rotate-90">
            <circle
              cx="10"
              cy="10"
              r="8"
              className="stroke-white/5"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="10"
              cy="10"
              r="8"
              className={`transition-all duration-100 ${getProgressColor()}`}
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 8}
              strokeDashoffset={2 * Math.PI * 8 - (percentage / 100) * (2 * Math.PI * 8)}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Real-time Dynamic Validation Error Message */}
      <div className={`mt-3 transition-all duration-300 overflow-hidden ${
        errors.content ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {errors.content && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-350 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-450" />
            <span className="font-medium">{errors.content}</span>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 disabled:opacity-40 transition-colors focus:outline-none uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={!isValid || isLoading || values.content.trim() === ''}
          className={isValid && values.content.trim() !== '' ? 'btn-premium-primary' : 'btn-premium-primary disabled'}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>
                {retryAttempt > 0 ? `Retry (${retryAttempt}/3)...` : 'Saving...'}
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Draft' : 'Save Draft'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
