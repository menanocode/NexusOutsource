import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Users, UserCheck, XCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const PartnerDashboard = () => {
  const user = useAuthStore(state => state.user);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['partner-dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/partners/dashboard');
      return data.data.stats;
    }
  });

  const rawStats = statsData || { pending: 0, interview: 0, hired: 0, rejected: 0 };

  const stats = [
    { name: 'Pending Review', value: rawStats.pending, icon: Clock, color: 'text-amber-500' },
    { name: 'In Interivew', value: rawStats.interview, icon: Users, color: 'text-blue-500' },
    { name: 'Hired', value: rawStats.hired, icon: UserCheck, color: 'text-green-500' },
    { name: 'Rejected', value: rawStats.rejected, icon: XCircle, color: 'text-red-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">
          Partner Portal - {user?.full_name}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review your candidate pipeline.
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white dark:bg-slate-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <dt>
              <div className="absolute rounded-md py-3 px-3">
                <item.icon className={`h-8 w-8 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              {isLoading ? (
                <p className="text-2xl font-semibold text-slate-400">...</p>
              ) : (
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default PartnerDashboard;
