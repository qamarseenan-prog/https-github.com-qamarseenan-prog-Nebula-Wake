import React, { useState, useEffect, useCallback } from 'react';
import { DigitalClock } from './components/DigitalClock';
import { AlarmList } from './components/AlarmList';
import { AlarmManager } from './components/AlarmManager';
import { RingingModal } from './components/RingingModal';
import { BriefingModal } from './components/BriefingModal';
import { Alarm } from './types';
import { startAlarmSound, stopAlarmSound } from './utils/audioUtils';

const App: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('nebula-alarms');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  // Persist alarms
  useEffect(() => {
    localStorage.setItem('nebula-alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentDay = now.getDay();

      alarms.forEach(alarm => {
        if (!alarm.isActive) return;

        // If repeat is on, check days. If repeat is off, trigger once.
        const isToday = alarm.repeat ? alarm.days.includes(currentDay) : true;

        if (
          isToday &&
          alarm.hour === currentHour &&
          alarm.minute === currentMinute &&
          currentSecond === 0 &&
          !ringingAlarm // Prevent double trigger
        ) {
          triggerAlarm(alarm);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);

  const triggerAlarm = (alarm: Alarm) => {
    setRingingAlarm(alarm);
    startAlarmSound();
  };

  const stopAlarm = () => {
    stopAlarmSound();
    
    // Disable non-repeating alarms
    if (ringingAlarm && !ringingAlarm.repeat) {
      setAlarms(prev => prev.map(a => a.id === ringingAlarm.id ? { ...a, isActive: false } : a));
    }
    
    setRingingAlarm(null);
    setShowBriefing(true); // Show the Gemini Briefing
  };

  const snoozeAlarm = () => {
    stopAlarmSound();
    setRingingAlarm(null);
    // Snooze logic: Create a new one-time alarm for 5 mins later
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 5 * 60000);
    
    const snoozedAlarm: Alarm = {
      id: `snooze-${Date.now()}`,
      hour: snoozeTime.getHours(),
      minute: snoozeTime.getMinutes(),
      label: `Snooze: ${ringingAlarm?.label}`,
      isActive: true,
      repeat: false,
      days: [],
    };
    
    setAlarms(prev => [...prev, snoozedAlarm]);
  };

  const addAlarm = (alarm: Alarm) => {
    setAlarms(prev => [...prev, alarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

      <main className="flex-1 max-w-md mx-auto w-full flex flex-col p-6 relative z-10">
        <header className="flex justify-between items-center py-4 mb-4">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Nebula Wake
          </h1>
          <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
             v1.0
          </div>
        </header>

        <DigitalClock />
        
        <div className="mt-8 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider">Your Alarms</h3>
            <span className="text-xs text-slate-600">{alarms.filter(a => a.isActive).length} Active</span>
          </div>
          <AlarmList 
            alarms={alarms} 
            onToggle={toggleAlarm} 
            onDelete={deleteAlarm} 
          />
        </div>

        <AlarmManager onAddAlarm={addAlarm} />
      </main>

      {ringingAlarm && (
        <RingingModal 
          alarm={ringingAlarm} 
          onStop={stopAlarm} 
          onSnooze={snoozeAlarm} 
        />
      )}

      {showBriefing && (
        <BriefingModal onClose={() => setShowBriefing(false)} />
      )}
    </div>
  );
};

export default App;
