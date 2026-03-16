import { useCallback, useEffect, useMemo, useState } from 'react';
import TeamCard from "../../components/TeamCard"
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"
import { teacherService } from '../../api';
import type { Teacher } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
// Preferred ordering to mirror the visual from the screenshot
const POSITION_ORDER = [
  'Principal',
  'Vice-Principal',
  'Co-ordinator (Primary Level)',
  'Co-ordinator (Basic Level)',
  'Co-ordinator (Secondary Level)',
  'Examinations',
  'Teacher',
  'A - levels',
  'CCA | ECA',
  'Primary School (Grades 1-5)',
  'Middle School (Grades 6-10)',
  'Plus 2',
  'Executive Team',
  'Senior School Academic Director',
  'Academic Director',
  'Administrative Team',
];

const DEFAULT_POSITION = 'All';

const getPositionRank = (position?: string) => {
  const normalized = position?.trim() || 'Teacher';
  const idx = POSITION_ORDER.indexOf(normalized);
  return idx === -1 ? POSITION_ORDER.length : idx;
};

const JKSSTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>(DEFAULT_POSITION);

  const fetchTeachers = useCallback(async () => {
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
  }, []);

  // Initial load + refresh whenever page regains visibility for a fresh feel
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchTeachers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchTeachers]);

  // Build tab list: ordered known positions first, then any extras alphabetically
  const positionTabs = useMemo(() => {
    const uniquePositions = Array.from(
      new Set(
        teachers
          .map(t => (t.position && t.position.trim()) ? t.position.trim() : 'Teacher')
          .filter(Boolean),
      ),
    );

    const ordered = POSITION_ORDER.filter(pos => uniquePositions.includes(pos));
    const extras = uniquePositions
      .filter(pos => !POSITION_ORDER.includes(pos))
      .sort((a, b) => a.localeCompare(b));

    return [DEFAULT_POSITION, ...ordered, ...extras];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    const bySelection = selectedPosition === DEFAULT_POSITION
      ? teachers
      : teachers.filter(
        t => (t.position && t.position.trim()) ? t.position.trim() === selectedPosition : selectedPosition === 'Teacher',
      );

    return [...bySelection].sort((a, b) => {
      const rankA = getPositionRank(a.position);
      const rankB = getPositionRank(b.position);
      if (rankA !== rankB) return rankA - rankB;

      const nameA = `${a.firstName} ${a.middleName || ''} ${a.lastName}`.trim();
      const nameB = `${b.firstName} ${b.middleName || ''} ${b.lastName}`.trim();
      return nameA.localeCompare(nameB);
    });
  }, [teachers, selectedPosition]);

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

        <div className="teachers-content w-full mx-auto px-4 py-4 sm:px-6 md:px-10 lg:px-12 max-w-7xl">
          {/* Position filter bar */}
          <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
            <div className="overflow-x-auto pb-2">
              <div className="flex flex-nowrap gap-2 min-w-full">
                {positionTabs.map((pos) => {
                  const isActive = pos === selectedPosition;
                  return (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-md border transition-colors duration-150 ${isActive
                        ? 'bg-[#035CB0] border-[#035CB0] text-white shadow-sm'
                        : 'bg-[#4a4a4a] border-[#4a4a4a] text-white hover:bg-[#5a5a5a]'
                        }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="h-1 bg-[#035CB0] rounded-full"></div>
          </div>

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
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium">No teachers found for "{selectedPosition}".</p>
              <p className="text-gray-500 text-sm mt-1">Try selecting a different position.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredTeachers.map((t: Teacher) => (
                  <TeamCard
                    key={t.id}
                    fullName={`${t.firstName} ${t.middleName || ''} ${t.lastName}`.trim()}
                    position={t.position || 'Teacher'}
                    department={t.department}
                    profileImage={t.profileImage}
                    email={t.email}
                    highlighted={selectedPosition !== DEFAULT_POSITION}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JKSSTeachers

