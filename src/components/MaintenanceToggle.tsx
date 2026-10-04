'use client';

import { useState, useEffect } from 'react';

export default function MaintenanceToggle() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial state
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setIsMaintenance(data.maintenance_mode || false);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const toggleMaintenance = async () => {
    const newValue = !isMaintenance;
    setIsMaintenance(newValue); // Optimistic UI update

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'maintenance_mode', value: newValue ? 'true' : 'false' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error(error);
      setIsMaintenance(!newValue); // Revert on failure
    }
  };

  if (isLoading) {
    return <div className="w-14 h-7 bg-white/5 rounded-full animate-pulse"></div>;
  }

  return (
    <button 
      onClick={toggleMaintenance}
      className={`w-14 h-7 rounded-full relative transition-colors focus:outline-none ${isMaintenance ? 'bg-vortex shadow-[0_0_10px_rgba(112,71,235,0.4)]' : 'bg-white/10'}`}
    >
      <div 
        className={`w-5 h-5 rounded-full absolute top-1 transition-transform ${isMaintenance ? 'bg-white translate-x-8' : 'bg-gray-400 translate-x-1'}`}
      ></div>
    </button>
  );
}
