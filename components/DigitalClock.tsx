import React, { useEffect, useState } from 'react';

export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const timeString = formatTime(time);
  // Split "10:45 PM" into "10:45" and "PM"
  const [digits, period] = timeString.split(' ');

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative">
        <div className="text-7xl md:text-9xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg font-mono">
          {digits}
          <span className="text-3xl md:text-5xl ml-2 text-slate-400 font-sans font-normal tracking-normal">
            {period}
          </span>
        </div>
      </div>
      <div className="mt-2 text-slate-400 text-lg md:text-xl font-medium tracking-wide">
        {formatDate(time)}
      </div>
    </div>
  );
};
