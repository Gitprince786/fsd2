import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Cpu, AlertCircle, RefreshCw } from 'lucide-react';

// Components
import { PostComposer } from './components/PostComposer';
import { DraftList } from './components/DraftList';
import { PlatformPreview } from './components/PlatformPreview';
import { NetworkConsole } from './components/NetworkConsole';
import { ToastContainer } from './components/Toast';

// Hooks & Utils
import { useForm } from './hooks/useForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import { validatePost, validationStrategies } from './utils/validationStrategies';
import { saveDraftMock, mockApiConfig } from './utils/mockApi';
import { retry } from './utils/retry';

// Stale Closure Laboratory components
function StaleClosureLab({ addLog, addToast }) {
  const [labMode, setLabMode] = useState(null); // 'broken' | 'fixed' | null
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!labMode) {
      setCount(0);
      return;
    }

    addLog('LAB', `Mounted ${labMode === 'broken' ? 'BROKEN' : 'FIXED'} Counter. Check outputs!`, 'info');

    let id;
    if (labMode === 'broken') {
      id = setInterval(() => {
        setCount(count + 1);
      }, 1000);
    } else {
      id = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
      addLog('LAB', `Cleaned up interval for ${labMode === 'broken' ? 'BROKEN' : 'FIXED'} counter.`, 'warning');
    };
  }, [labMode, addLog]);

  const handleStartLab = (mode) => {
    setCount(0);
    setLabMode(mode);
    if (mode === 'broken') {
      addToast('Stale counter mounted (stuck at 1)', 'warning');
    } else {
      addToast('Fixed counter mounted (counting up)', 'success');
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-100">Stale Closure Laboratory</h2>
          <p className="text-xs text-zinc-400">Concept verification of React state scopes</p>
        </div>
      </div>

      <div className="bg-black/35 p-4 rounded-xl border border-white/5 text-xs flex flex-col gap-3">
        <p className="text-zinc-300 leading-relaxed">
          Toggle counters below to see React state closure updates in action. The 
          <strong> Broken Counter</strong> captures a stale state reference and gets stuck at 
          <code className="text-rose-450 bg-rose-950/20 px-1 py-0.5 rounded mx-1 font-mono">1</code>. The 
          <strong> Fixed Counter</strong> uses functional updates to count up correctly.
        </p>

        <div className="flex gap-3 justify-center py-2.5 border-y border-white/5 my-1">
          <button
            onClick={() => handleStartLab(labMode === 'broken' ? null : 'broken')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              labMode === 'broken'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-950/30'
                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
            }`}
          >
            {labMode === 'broken' ? 'Stop Broken' : 'Start Broken'}
          </button>
          <button
            onClick={() => handleStartLab(labMode === 'fixed' ? null : 'fixed')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              labMode === 'fixed'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/30'
                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
            }`}
          >
            {labMode === 'fixed' ? 'Stop Fixed' : 'Start Fixed'}
          </button>
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 bg-black/45 rounded-lg border border-white/5">
          <span className="text-zinc-400 font-medium">Rendered Counter Value:</span>
          <span className={`font-mono text-base font-extrabold ${
            labMode === 'broken' ? 'text-rose-400' : labMode === 'fixed' ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'
          }`}>
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [drafts, setDrafts] = useLocalStorage('social_drafts_v2', []);
  const [activeEditId, setActiveEditId] = useState(null);
  
  const [apiMode, setApiMode] = useState('succeed');
  const [isLoading, setIsLoading] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  const [activePreviewTab, setActivePreviewTab] = useState('twitter');
  const [logs, setLogs] = useState([]);
  const [toasts, setToasts] = useState([]);

  const { values, errors, isValid, handleChange, setFormValues, reset } = useForm(
    { platform: 'twitter', content: '' },
    validatePost
  );

  const addLog = useCallback((source, message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setLogs((prev) => [
      ...prev,
      {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        time: timestamp,
        source,
        message,
        type
      }
    ]);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [
      ...prev,
      {
        id: 'toast_' + Math.random().toString(36).substring(2, 9),
        message,
        type
      }
    ]);
  }, []);

  const handleRemoveToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addLog('SYS', 'Post Composer Engine initialized.', 'info');
    addLog('DB', `Fetched ${drafts.length} saved drafts from offline storage.`, 'success');
  }, [addLog]);

  useEffect(() => {
    setActivePreviewTab(values.platform);
    addLog('APP', `Switched platform channel to "${validationStrategies[values.platform].name}"`, 'info');
  }, [values.platform, addLog]);

  const handleChangeApiMode = (mode) => {
    mockApiConfig.mode = mode;
    mockApiConfig.currentIntermittentFails = 0;
    setApiMode(mode);
    addLog('SIM', `API configured to mode: "${mode.toUpperCase()}"`, 'warning');
    addToast(`Simulator configured to ${mode}`, 'info');
  };

  const handleSaveDraft = async () => {
    if (!isValid || values.content.trim() === '') return;

    setIsLoading(true);
    setRetryAttempt(0);

    const draftId = activeEditId || 'drf_' + Math.random().toString(36).substring(2, 9);
    const draftPayload = {
      id: draftId,
      platform: values.platform,
      content: values.content,
      updatedAt: new Date().toISOString()
    };

    addLog('API', `POST /api/drafts/save (ID: ${draftPayload.id}) - Init transaction`, 'info');

    try {
      const callSaveMock = () => saveDraftMock(draftPayload);

      const response = await retry(
        callSaveMock,
        3,
        1000,
        (attempt, err) => {
          setRetryAttempt(attempt);
          addLog('API', `Save request failed. Retry attempt ${attempt}/3 due to: "${err.message}"`, 'warning');
          addToast(`Connection dropped. Retrying... (Attempt ${attempt}/3)`, 'warning');
        }
      );

      if (response.success) {
        addLog('API', `POST /api/drafts/save status: 200 OK (Transaction succeeded)`, 'success');
        addLog('DB', `Writing draft payload to local storage...`, 'info');

        setDrafts((prevDrafts) => {
          const index = prevDrafts.findIndex((d) => d.id === draftPayload.id);
          let nextDrafts;
          if (index !== -1) {
            nextDrafts = [...prevDrafts];
            nextDrafts[index] = draftPayload;
          } else {
            nextDrafts = [draftPayload, ...prevDrafts];
          }
          return nextDrafts;
        });

        addToast(activeEditId ? 'Draft updated successfully!' : 'Draft saved offline!', 'success');
        addLog('DB', `Draft sync completed successfully. (Stored records: ${drafts.length + (activeEditId ? 0 : 1)})`, 'success');
        
        reset();
        setActiveEditId(null);
      }
    } catch (err) {
      addLog('API', `POST /api/drafts/save status: 503 ERROR - Transaction aborted after retries (Reason: "${err.message}")`, 'error');
      addToast('Failed to save draft. Check network logs.', 'error');
    } finally {
      setIsLoading(false);
      setRetryAttempt(0);
    }
  };

  const handleEditDraft = (draft) => {
    setActiveEditId(draft.id);
    setFormValues({
      platform: draft.platform,
      content: draft.content
    });
    addLog('APP', `Draft "${draft.id}" loaded into editor. Platform set: ${draft.platform}`, 'info');
    addToast('Draft loaded into composer', 'info');
  };

  const handleDeleteDraft = (id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    addLog('DB', `Deleted draft ID: "${id}" from local storage`, 'warning');
    addToast('Draft deleted successfully', 'warning');
    
    if (activeEditId === id) {
      reset();
      setActiveEditId(null);
    }
  };

  const handleResetComposer = () => {
    reset();
    setActiveEditId(null);
    addLog('APP', 'Composer state reset.', 'info');
    addToast('Composer cleared', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col relative px-4 md:px-8 py-6 max-w-7xl mx-auto z-10">
      
      {/* Background Glowing Ambient Nodes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={handleRemoveToast} />

      {/* Header Panel */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-[1.5px] flex items-center justify-center shadow-2xl shadow-indigo-500/10">
            <div className="w-full h-full bg-[#0d0d12] rounded-[14.5px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-450 tracking-tight">
              AGY Social Composer Hub
            </h1>
            <p className="text-xs text-zinc-400 font-semibold tracking-wide mt-0.5">
              Unit 1 - Experiment 1: Platform Validator, Persistency & Fault Tolerance
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse bg-emerald-400"></span>
            Offline Sandbox Active
          </span>
        </div>
      </header>

      {/* Grid Content Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 flex-1 z-10 relative">
        
        {/* Left Side Column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <PostComposer
            values={values}
            errors={errors}
            isValid={isValid}
            onChange={handleChange}
            onSave={handleSaveDraft}
            onReset={handleResetComposer}
            isLoading={isLoading}
            retryAttempt={retryAttempt}
            isEditing={!!activeEditId}
          />

          <StaleClosureLab addLog={addLog} addToast={addToast} />

        </div>

        {/* Right Side Column */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Live Preview Console */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Live Channel Preview
              </h2>
              
              <div className="flex gap-1 bg-black/45 p-0.5 rounded-lg border border-white/5">
                {Object.keys(validationStrategies).map((platformId) => (
                  <button
                    key={platformId}
                    onClick={() => setActivePreviewTab(platformId)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all uppercase ${
                      activePreviewTab === platformId
                        ? 'bg-white/10 text-white shadow-sm border border-white/5'
                        : 'text-zinc-500 hover:text-zinc-350'
                    }`}
                  >
                    {platformId.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-container">
              <PlatformPreview 
                platform={activePreviewTab} 
                content={values.content} 
              />
            </div>
          </div>

          <DraftList
            drafts={drafts}
            onEdit={handleEditDraft}
            onDelete={handleDeleteDraft}
            activeEditId={activeEditId}
          />

        </div>
      </main>

      <footer className="w-full mt-auto z-10 relative">
        <NetworkConsole
          logs={logs}
          onClearLogs={() => setLogs([])}
          apiMode={apiMode}
          onChangeApiMode={handleChangeApiMode}
        />
      </footer>

    </div>
  );
}
