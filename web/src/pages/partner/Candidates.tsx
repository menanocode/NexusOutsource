import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Document, Page, pdfjs } from 'react-pdf';
import { Modal } from '../../components/ui/Modal';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PartnerCandidates = () => {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '', decision: 'PENDING' });

  const { data: applicationsResponse, isLoading } = useQuery({
    queryKey: ['partner-candidates'],
    queryFn: async () => {
      const { data } = await api.get('/partners/candidates');
      return data.data.applications;
    }
  });

  const applications = applicationsResponse || [];

  const feedbackMutation = useMutation({
    mutationFn: async (payload: any) => {
      // Create feedback first
      const { data } = await api.post('/partners/feedbacks', {
        application_id: selectedApp.id,
        rating: parseInt(payload.rating),
        comment: payload.comment
      });
      // If decision is definitive, update it
      if (payload.decision !== 'PENDING') {
        await api.patch(`/partners/feedbacks/${data.data.feedback.id}/decision`, {
          decision: payload.decision
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-candidates'] });
      setIsReviewOpen(false);
      setSelectedApp(null);
    }
  });

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    feedbackMutation.mutate(feedbackData);
  };

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Candidates for Review</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
            Candidates that have been shortlisted or submitted to your company.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job Applied</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell>Loading...</TableCell></TableRow>
            ) : applications.length === 0 ? (
               <TableRow><TableCell>No candidates pending your review.</TableCell></TableRow>
            ) : (
              applications.map((app: any) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-white">{app.candidate.full_name}</div>
                    <div className="text-slate-500 text-xs mt-1">{app.candidate.email}</div>
                  </TableCell>
                  <TableCell>{app.job.title}</TableCell>
                  <TableCell>{app.candidate.years_of_experience} yrs</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {app.current_stage}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => { setSelectedApp(app); setIsReviewOpen(true); }}
                      className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 font-medium text-sm"
                    >
                      Review & Decide
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Modal */}
      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title={`Review: ${selectedApp?.candidate?.full_name}`}>
        {selectedApp && (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700 h-[300px] overflow-auto flex justify-center">
              {selectedApp.candidate.cv_url ? (
                <Document file={selectedApp.candidate.cv_url}>
                  <Page pageNumber={1} width={400} />
                </Document>
              ) : (
                <p className="text-slate-500 mt-10">No CV Attachment</p>
              )}
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rating (1-5)</label>
                <input
                  type="number" min="1" max="5" required
                  value={feedbackData.rating}
                  onChange={e => setFeedbackData({ ...feedbackData, rating: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Feedback Notes</label>
                <textarea
                  rows={3} required
                  value={feedbackData.comment}
                  onChange={e => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                  placeholder="What did you think of the candidate?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Final Decision</label>
                <select
                  value={feedbackData.decision}
                  onChange={e => setFeedbackData({ ...feedbackData, decision: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                >
                  <option value="PENDING">Keep Pending</option>
                  <option value="INTERVIEW">Request Interview</option>
                  <option value="HIRED">Hire</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="bg-white dark:bg-slate-800 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackMutation.isPending}
                  className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50"
                >
                  {feedbackMutation.isPending ? 'Saving...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PartnerCandidates;
