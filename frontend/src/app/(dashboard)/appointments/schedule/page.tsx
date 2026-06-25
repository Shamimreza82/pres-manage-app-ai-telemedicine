'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const fmtTime = (t: string) => {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hh = Number(h);
  return `${hh % 12 || 12}:${m} ${hh < 12 ? 'AM' : 'PM'}`;
};

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors/profile').then((r) => {
      const p = r.data.data;
      let s = p.chamberSchedule;
      if (!s || typeof s === 'string') {
        try { s = JSON.parse(s || '[]'); } catch { s = []; }
      }
      setSchedule(s);
      setDoctor(p);
    }).catch((e) => console.error(e))
    .finally(() => setLoading(false));
  }, []);

  const getSlot = (day: string) => schedule.find((s: any) => s.day === day);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2.5 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {doctor ? `Dr. ${doctor.fullName}` : 'Loading...'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-widest">Day</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-widest">Start Time</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-widest">End Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {DAYS.map((day) => {
                  const slot = getSlot(day);
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                  return (
                    <tr key={day} className={`${today ? 'bg-teal-50/50 dark:bg-teal-950/20' : ''} hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors`}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Calendar className={`h-5 w-5 ${today ? 'text-teal-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${today ? 'text-teal-800 dark:text-teal-300' : 'text-gray-900 dark:text-white'}`}>
                            {day}
                            {today && <span className="ml-2 text-xs font-normal text-teal-600">Today</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {slot ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {slot ? (
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {fmtTime(slot.startTime)}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {slot ? (
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {fmtTime(slot.endTime)}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
