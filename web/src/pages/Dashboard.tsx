import React from 'react';
import { Users, Briefcase, FileCheck, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);

  const stats = [
    { name: 'Total Candidates', value: '2,845', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Active Jobs', value: '45', icon: Briefcase, change: '+5%', changeType: 'increase' },
    { name: 'Applications this week', value: '142', icon: FileCheck, change: '-2%', changeType: 'decrease' },
    { name: 'Avg. Time to Hire', value: '14 days', icon: Clock, change: '-1.5 days', changeType: 'increase' },
  ];

  return (
    <div className="p-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">
            Welcome back, {user?.full_name || 'Admin'}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening in NexusOutsource today.
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white dark:bg-slate-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <dt>
              <div className="absolute bg-primary-500 rounded-md py-3 px-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Dashboard;
