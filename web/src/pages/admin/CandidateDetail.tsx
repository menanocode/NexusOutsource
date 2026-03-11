import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const CandidateDetail = () => {
  const { candidateId } = useParams<{ candidateId: string }>();

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: async () => {
      // In reality we need to fetch a specific application or candidate.
      // E.g., application details which holds candidate object
      // For MVP, if we have candidateId, we fetch /candidates/:id although our backend currently
      // only exposes /applications/:id with candidate.
      // So let's mock the UI for the sake of completeness.
      return {
        id: candidateId,
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '081234567890',
        address: 'Jl. Merdeka No 1',
        cv_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF for viewer testing
      };
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/candidates" className="text-sm border-b border-primary-500 text-primary-600 mb-2 inline-block">&larr; Back to Candidates</Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{candidate?.full_name}</h1>
          <p className="text-sm text-slate-500">{candidate?.email} • {candidate?.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-4">Profile</h3>
            <div className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500">Address</dt>
                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{candidate?.address}</dd>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 border border-slate-200 dark:border-slate-700">
             <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-4">Scoring History</h3>
             <p className="text-sm text-slate-500">No scores yet.</p>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 border border-slate-200 dark:border-slate-700 h-[800px] overflow-auto flex flex-col">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-4">Curriculum Vitae</h3>
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex justify-center items-start overflow-auto">
              {candidate?.cv_url ? (
                <Document
                  file={candidate.cv_url}
                  loading={<div className="p-4">Loading PDF...</div>}
                  error={<div className="p-4 text-red-500">Failed to load PDF. Check CORS or URL.</div>}
                >
                  <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} width={600} />
                </Document>
              ) : (
                <div className="p-8 text-slate-500">No CV uploaded</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
