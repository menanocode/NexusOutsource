import React, { useState } from 'react';
import { Plus, Search, MoreVertical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

// Mock types for MVP UI
type Job = {
  id: string;
  title: string;
  job_type: string;
  status: string;
  quota: number;
  filled_count: number;
  created_at: string;
  partner?: { company_name: string };
};

export const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['jobs', searchTerm],
    queryFn: async () => {
      // API call to backend jobs endpoint
      const { data } = await api.get('/jobs', { params: { search: searchTerm } });
      return data.data.jobs as Job[];
    }
  });

  const jobs = jobsResponse || [];

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Jobs Management</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
            A list of all job postings from partners.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Job
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative rounded-md shadow-sm max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md py-2 px-3 border"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Filled / Quota</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell><div className="text-center py-4">Loading...</div></TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell><div className="text-center py-4 text-slate-500">No jobs found</div></TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
                <TableCell>{null}</TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-white">{job.title}</div>
                    <div className="text-slate-500 text-xs mt-1">ID: {job.id.substring(0,8)}</div>
                  </TableCell>
                  <TableCell>{job.partner?.company_name || 'N/A'}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {job.job_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      job.status === 'CLOSED' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {job.filled_count} / {job.quota}
                  </TableCell>
                  <TableCell>
                    <button className="text-slate-400 hover:text-slate-500">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Jobs;
