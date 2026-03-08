import { useEffect, useState } from 'react';
import TeamCard from "../../components/TeamCard"
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"
import { teacherService } from '../../api';
import type { Teacher } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

// Hierarchy definition — order matters for display
const POSITION_HIERARCHY = [
  { key: 'Principal', label: 'Principal', highlighted: true },
  { key: 'Vice-Principal', label: 'Vice-Principal', highlighted: true },
  { key: 'Co-ordinator (Primary Level)', label: 'Co-ordinator — Primary Level', highlighted: false },
  { key: 'Co-ordinator (Basic Level)', label: 'Co-ordinator — Basic Level', highlighted: false },
  { key: 'Co-ordinator (Secondary Level)', label: 'Co-ordinator — Secondary Level', highlighted: false },
  { key: 'Teacher', label: 'Teachers', highlighted: false },
];

const JKSSTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getAll();
      const activeTeachers = response.data?.filter((t: Teacher) => t.status === 'active') || [];
      setTeachers(activeTeachers);
      setError(null);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Group teachers by position, bucket unknown positions into 'Teacher'
  const grouped: Record<string, Teacher[]> = {};
  teachers.forEach(t => {
    const pos = POSITION_HIERARCHY.some(p => p.key === t.position) ? (t.position || 'Teacher') : 'Teacher';
    if (!grouped[pos]) grouped[pos] = [];
    grouped[pos].push(t);
  });

  // Build ordered sections (skip empty groups)
  const sections = POSITION_HIERARCHY.filter(p => grouped[p.key]?.length);

  return (
    <div className="JKSSTeachers-page min-h-screen bg-[#F7F7F7]">
      <Header />
      <main className="min-h-screen">
        <div
          className="teachers-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start px-12"
          style={{ backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity: 0.9 }}
        >
          <h1 className="text-5xl font-medium text-center my-8 text-white">JKSS Teachers</h1>
        </div>

        <div className="teachers-content w-full mx-auto px-4 py-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading teachers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchTeachers}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No teachers to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map(({ key, label, highlighted }, idx) => {
                const group = grouped[key];
                const isSingleTeacher = group.length === 1;
                return (
                  <div key={key} className="space-y-4">
                    {/* Section Header */}
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{label}</h2>
                      <div className={`h-1 mx-auto rounded-full ${highlighted ? 'w-24 bg-yellow-400' : 'w-16 bg-blue-600'}`}></div>
                    </div>

                    {/* Cards */}
                    <div className={`grid gap-3 justify-center ${isSingleTeacher
                      ? 'grid-cols-1 max-w-xs mx-auto'
                      : highlighted
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-2xl mx-auto'
                        : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                      }`}>
                      {group.map((t: Teacher) => (
                        <TeamCard
                          key={t.id}
                          fullName={`${t.firstName} ${t.middleName || ''} ${t.lastName}`.trim()}
                          position={t.position || 'Teacher'}
                          department={t.department}
                          profileImage={t.profileImage}
                          email={t.email}
                          highlighted={highlighted}
                        />
                      ))}
                    </div>

                    {/* Divider (except last) */}
                    {idx < sections.length - 1 && (
                      <div className="pt-3">
                        <div className="border-t border-gray-200"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JKSSTeachers

