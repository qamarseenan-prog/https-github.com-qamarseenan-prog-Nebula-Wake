import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { Alarm } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface AlarmListProps {
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlarmList: React.FC<AlarmListProps> = ({ alarms, onToggle, onDelete }) => {
  if (alarms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500">
        <Clock size={48} className="mb-4 opacity-50" />
        <p>No alarms set.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {alarms.map((alarm) => {
        const formattedHour = alarm.hour % 12 || 12;
        const period = alarm.hour >= 12 ? 'PM' : 'AM';
        const formattedMinute = alarm.minute.toString().padStart(2, '0');

        return (
          <div
            key={alarm.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
              alarm.isActive
                ? 'bg-slate-800 border-slate-700 shadow-lg shadow-blue-900/10'
                : 'bg-slate-900/50 border-slate-800 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-bold ${alarm.isActive ? 'text-white' : 'text-slate-400'}`}>
                  {formattedHour}:{formattedMinute}
                </span>
                <span className="text-sm text-slate-500 font-medium">{period}</span>
              </div>
              <div className="flex space-x-2 mt-1">
                <span className="text-sm text-slate-400 font-medium">{alarm.label}</span>
                {alarm.repeat && (
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full flex items-center">
                    Repeats
                  </span>
                )}
              </div>
              <div className="flex space-x-1 mt-2">
                 {DAYS_OF_WEEK.map((day, index) => (
                   <span 
                    key={day} 
                    className={`text-[10px] uppercase font-bold ${
                      alarm.days.includes(index) ? 'text-blue-400' : 'text-slate-700'
                    }`}
                   >
                     {day.charAt(0)}
                   </span>
                 ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onToggle(alarm.id)}
                className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  alarm.isActive ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    alarm.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              
              <button
                onClick={() => onDelete(alarm.id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
