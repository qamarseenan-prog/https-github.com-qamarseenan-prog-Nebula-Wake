import React, { useEffect, useState } from 'react';
import { Sparkles, Sun, Quote, X } from 'lucide-react';
import { generateMorningBriefing } from '../services/geminiService';
import { BriefingResponse } from '../types';

interface BriefingModalProps {
  onClose: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({ onClose }) => {
  const [data, setData] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    generateMorningBriefing().then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white z-20"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Sparkles className="w-12 h-12 text-blue-400 animate-spin-slow" />
            <p className="text-slate-300 animate-pulse">Generating your morning insight...</p>
          </div>
        ) : (
          <div className="p-8">
             <div className="flex items-center space-x-2 mb-6">
                <Sun className="text-yellow-400 w-8 h-8" />
                <h2 className="text-2xl font-bold text-white">{data?.greeting}</h2>
             </div>
             
             <div className="space-y-6">
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <Quote className="text-blue-400 w-6 h-6 mb-2 opacity-50" />
                  <p className="text-lg text-slate-200 italic font-medium leading-relaxed">
                    "{data?.quote}"
                  </p>
               </div>

               <div className="flex items-start space-x-3 text-slate-400 bg-slate-800/30 p-4 rounded-xl">
                 <div className="mt-1 min-w-[20px]">🌤</div>
                 <p className="text-sm">{data?.weatherTip}</p>
               </div>
             </div>

             <button
               onClick={onClose}
               className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700"
             >
               I'm Awake
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
