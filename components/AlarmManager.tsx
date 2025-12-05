import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Alarm } from '../types';
import { DEFAULT_ALARM_LABEL, DAYS_OF_WEEK } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface AlarmManagerProps {
  onAddAlarm: (alarm: Alarm) => void;
}

export const AlarmManager: React.FC<AlarmManagerProps> = ({ onAddAlarm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [label, setLabel] = useState(DEFAULT_ALARM_LABEL);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default

  const handleSave = () => {
    const newAlarm: Alarm = {
      id: uuidv4(),
      hour,
      minute,
      label,
      isActive: true,
      repeat: selectedDays.length > 0,
      days: selectedDays.length > 0 ? selectedDays : [], // If no days selected, it's a one-time alarm (logic handled in App)
    };
    onAddAlarm(newAlarm);
    setIsOpen(false);
  };

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index].sort());
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl shadow-blue-600/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Plus size={28} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add Alarm</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Time Picker */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex flex-col items-center">
             <label className="text-xs text-slate-400 mb-1 uppercase font-bold">Hour</label>
             <input
               type="number"
               min="0"
               max="23"
               value={hour}
               onChange={(e) => setHour(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
               className="w-20 text-center bg-slate-900 border border-slate-700 rounded-lg p-3 text-3xl font-mono text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
          </div>
          <div className="flex items-center pt-6 text-2xl font-bold text-slate-500">:</div>
          <div className="flex flex-col items-center">
             <label className="text-xs text-slate-400 mb-1 uppercase font-bold">Minute</label>
             <input
               type="number"
               min="0"
               max="59"
               value={minute}
               onChange={(e) => setMinute(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
               className="w-20 text-center bg-slate-900 border border-slate-700 rounded-lg p-3 text-3xl font-mono text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
          </div>
        </div>

        {/* Label */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-600"
            placeholder="Alarm name"
          />
        </div>

        {/* Repeats */}
        <div className="mb-8">
          <label className="block text-sm text-slate-400 mb-3">Repeat</label>
          <div className="flex justify-between gap-1">
            {DAYS_OF_WEEK.map((day, index) => (
              <button
                key={day}
                onClick={() => toggleDay(index)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  selectedDays.includes(index)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {day.charAt(0)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
        >
          Save Alarm
        </button>
      </div>
    </div>
  );
};
