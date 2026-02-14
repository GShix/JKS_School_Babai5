import React from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';

type Result = {
  id: string;
  year: string;
  className: string;
  examType: string;
  iemisNo: string;
  studentName: string;
  grade: string;
  pdfUrl?: string;
}

const sampleResults: Result[] = [
  { id: '1', year: '2025', className: 'Class XI - Agriculture', examType: 'Final', iemisNo: '2025-001', studentName: 'Aarav Sharma', grade: 'A+', pdfUrl: '/files/results/2025-001.pdf' },
  { id: '2', year: '2025', className: 'Class XI - Education', examType: 'Final', iemisNo: '2025-002', studentName: 'Sita Rai', grade: 'A', pdfUrl: '/files/results/2025-002.pdf' },
  { id: '3', year: '2024', className: 'Class XII - Management', examType: 'Final', iemisNo: '2024-101', studentName: 'Kumar Thapa', grade: 'B+', pdfUrl: '/files/results/2024-101.pdf' },
  { id: '4', year: '2023', className: 'Grade 8', examType: 'Midterm', iemisNo: '2023-055', studentName: 'Maya KC', grade: 'A', pdfUrl: '/files/results/2023-055.pdf' },
  { id: '5', year: '2025', className: 'Grade 5', examType: 'Final', iemisNo: '2025-210', studentName: 'Prakash Singh', grade: 'A-', pdfUrl: '/files/results/2025-210.pdf' },
  { id: '6', year: '2025', className: 'Grade 9 - General', examType: 'Final', iemisNo: '2025-900', studentName: 'Rita Rai', grade: 'B+', pdfUrl: '/files/results/2025-900.pdf' },
  { id: '7', year: '2025', className: 'Grade 9 - Agriculture', examType: 'Final', iemisNo: '2025-901', studentName: 'Ganesh BK', grade: 'A', pdfUrl: '/files/results/2025-901.pdf' },
  { id: '8', year: '2025', className: 'Nursery', examType: 'Assessment', iemisNo: 'N-01', studentName: 'Little Sam', grade: 'Pass' },
  { id: '9', year: '2025', className: 'LKG', examType: 'Assessment', iemisNo: 'L-02', studentName: 'Anu Lama', grade: 'Pass' },
  { id: '10', year: '2025', className: 'UKG', examType: 'Assessment', iemisNo: 'U-03', studentName: 'Bimal Thapa', grade: 'Pass' },
];

export default function Results() {
  const [year, setYear] = React.useState('2025');
  const [className, setClassName] = React.useState('Grade 1');
  const [examType, setExamType] = React.useState('First-term');
  const [iemisNo, setIemisNo] = React.useState('');
  const [results, setResults] = React.useState<Result[]>([]);

  const years = ['2025', '2024', '2023', '2022'];
  const classes = [
    'Nursery','LKG','UKG',
    'Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8',
    'Grade 9 - General','Grade 9 - Agriculture','Grade 10 - General','Grade 10 - Agriculture',
    'Class XI - Agriculture','Class XI - Education','Class XI - Management',
    'Class XII - Agriculture','Class XII - Education','Class XII - Management'
  ];
  const baseExamTypes = ['First-term', 'Half-annual', 'Final', 'Practical', 'Assessment'];

  // For Grade 10 and Class XII (NEB), Final exam results are not published here — hide 'Final'
  const availableExamTypes = React.useMemo(() => {
    if (className.includes('Grade 10') || className.includes('Class XII')) {
      return baseExamTypes.filter(t => t !== 'Final')
    }
    return baseExamTypes
  }, [className])

  // Keep examType state consistent with available options
  React.useEffect(() => {
    if (!availableExamTypes.includes(examType)) {
      setExamType(availableExamTypes[0])
    }
  }, [availableExamTypes])

  const search = React.useCallback(() => {
    // Simple client-side filter over sampleResults
    const res = sampleResults.filter(r => {
      if (r.year !== year) return false;
      if (r.className !== className) return false;
      if (r.examType !== examType) return false;
      if (iemisNo.trim()) {
        return r.iemisNo.toLowerCase().includes(iemisNo.trim().toLowerCase());
      }
      return true;
    });
    setResults(res);
  }, [year, className, examType, iemisNo]);

  React.useEffect(() => {
    // initial search
    search();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    <div className="about-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
        <h1 className="text-4xl sm:text-5xl font-medium text-center my-8 text-white">Published Results</h1>
    </div>
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#035CB0] mb-4 sm:px-4">Fill your details</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div>
              <label className="sr-only">Select Year</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="w-full border rounded px-4 py-3 cursor-pointer">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="sr-only">Class</label>
              <select value={className} onChange={e => setClassName(e.target.value)} className="w-full border rounded px-4 py-3 cursor-pointer">
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="sr-only">Exam Type</label>
              <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full border rounded px-4 py-3 cursor-pointer">
                {availableExamTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="sr-only">IEMIS No.</label>
              <input value={iemisNo} onChange={e => setIemisNo(e.target.value)} placeholder="IEMIS No." className="w-full border rounded px-4 py-3" />
            </div>

            <div className="flex">
              <button onClick={search} className="ml-auto bg-[#0b78f6] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full">Search Result</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Search Results ({results.length})</h2>
          {results.length === 0 ? (
            <div className="text-gray-600">No results found. Try changing the filters above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="px-4 py-2">Reg. No.</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Class</th>
                    <th className="px-4 py-2">Exam</th>
                    <th className="px-4 py-2">Grade</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id} className="border-t">
                      <td className="px-4 py-3">{r.iemisNo}</td>
                      <td className="px-4 py-3">{r.studentName}</td>
                      <td className="px-4 py-3">{r.className}</td>
                      <td className="px-4 py-3">{r.examType} ({r.year})</td>
                      <td className="px-4 py-3">{r.grade}</td>
                      <td className="px-4 py-3">
                        {r.pdfUrl ? (
                          <a href={r.pdfUrl} download className="px-3 py-2 bg-[#035CB0] text-white rounded">Download</a>
                        ) : (
                          <span className="text-gray-500">No file</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
