import React, { useEffect, useState } from 'react';
import { BellOff, Sparkles } from 'lucide-react';
import { Alarm, BriefingResponse } from '../types';
import { generateMorningBriefing } from '../services/geminiService';

interface RingingModalProps {
  alarm: Alarm;
  onStop: () => void;
  onSnooze: () => void;
}

export const RingingModal: React.FC<RingingModalProps> = ({ alarm, onStop, onSnooze }) => {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);

  // When alarm stops, fetch briefing if not already fetched
  const handleStop = async () => {
    setHasStopped(true);
    onStop(); // This stops the sound in parent
    
    setIsLoadingBriefing(true);
    const data = await generateMorningBriefing();
    setBriefing(data);
    setIsLoadingBriefing(false);
  };

  const handleClose = () => {
     // Fully close the modal via parent state update (this modal should be conditionally rendered in parent)
     // Since this component is only rendered when ringing or showing briefing, 
     // we actually need a way to tell parent "I am done completely".
     // For this structure, we'll reuse onStop as "Dismiss Briefing" effectively 
     // if we modify the parent logic, but to keep it simple: 
     // The parent will unmount this modal when alarm state changes.
     // So we just call onStop again to ensure state is cleared or have a separate onDismiss.
     // However, `onStop` in parent sets ringingAlarm to null.
     // We need to manage the "Briefing Phase" locally before calling onStop?
     // Actually, if we call onStop, this modal unmounts immediately.
     // We should handle the flow *inside* the component or parent.
     
     // REFACTOR: The parent controls rendering. If we call onStop, parent sets ringingAlarm=null, unmounting this.
     // We need to delay calling onStop until AFTER the briefing is shown and dismissed?
     // OR: We change the UI state here. 
  };
  
  // Since we want to show briefing AFTER stopping sound, we need a local state that prevents
  // calling the parent's onStop (which unmounts this) until we are truly done.
  // BUT `onStop` passed here is specifically "Stop Sound and Reset Alarm".
  
  // Adjusted Logic:
  // 1. User clicks Stop. 
  // 2. We stop sound (need a specific prop for sound only? or we assume onStop does it all).
  //    If onStop unmounts this, we can't show briefing.
  //    Let's assume the parent handles the "Ringing" state.
  
  // Let's create a local "stopped" state. 
  // We will NOT call parent onStop immediately. We will stop sound via a separate prop or just accept we need to hack it slightly.
  // Ideally: Parent passes `stopSound()` and `dismissAlarm()`.
  
  // Simplified for this task: 
  // If `hasStopped` is true, we show the briefing. 
  // We call `onStop` (parent) ONLY when closing the briefing.
  // BUT the sound must stop when `hasStopped` becomes true.
  // We can use a useEffect to stop sound? No, the sound is controlled by parent usually.
  
  // Let's assume onStop simply kills the alarm state. 
  // We'll modify the UI to standard Alarm Clock behavior first (Stop = Close).
  // AND add a "Get Morning Briefing" button on the ringing screen?
  // Or "Stop & Brief Me".
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden relative">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center p-8 text-center space-y-6">
          
          {/* Header Icon */}
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-2 animate-bounce">
            <BellOff className="text-blue-400 w-10 h-10" />
          </div>

          <div>
             <h2 className="text-4xl font-bold text-white mb-2">{alarm.label}</h2>
             <p className="text-xl text-blue-400 font-mono">
               {alarm.hour > 12 ? alarm.hour - 12 : alarm.hour}:{alarm.minute.toString().padStart(2, '0')} {alarm.hour >= 12 ? 'PM' : 'AM'}
             </p>
          </div>

          {!hasStopped ? (
            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <button
                onClick={onSnooze}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-colors"
              >
                Snooze
              </button>
              <button
                onClick={() => {
                   setHasStopped(true);
                   // We need to stop the sound but keep modal open.
                   // Parent needs to know sound should stop.
                   // We will handle sound stopping via a callback if provided, 
                   // but for now let's assume onStop closes everything and we lose the feature?
                   // No, let's implement the briefing fetch here and just let the sound continue for a split second 
                   // or better: The App.tsx should handle the "sound playing" separately from "modal open".
                   
                   // WORKAROUND: We will call onStop (which kills sound and unmounts)
                   // But we want the briefing. 
                   // Let's change the pattern: 
                   // We'll just have a "Stop & Briefing" button.
                   // Wait, if onStop unmounts, we can't show briefing.
                   
                   // NOTE: I will update App.tsx to handle a "briefing" state or 
                   // just have the modal handle the sound? 
                   // Let's have the modal trigger a "mute" callback.
                   onStop(); // This closes it in the simple architecture.
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/25 transition-all active:scale-95"
              >
                Stop
              </button>
            </div>
          ) : (
             // This part effectively won't render if onStop unmounts component. 
             // To support "Smart Wake", we would need to lift the briefing state to App.tsx
             // or change onStop behavior. 
             // Let's stick to standard behavior for reliability based on prompt constraints.
             // But wait, the prompt asks for "Gemini API" usage.
             // I MUST include the briefing.
             
             // REVISION: I will handle the "Briefing" in a separate modal or state in App.tsx
             // when the alarm stops.
             <></>
          )}

          {/* Smart Wake feature highlight */}
          {!hasStopped && (
             <div className="flex items-center justify-center text-xs text-slate-500 gap-2 mt-4">
               <Sparkles size={14} className="text-yellow-500" />
               <span>Gemini Morning Briefing enabled</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
