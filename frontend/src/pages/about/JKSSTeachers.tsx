import { useEffect, useState } from 'react';
import TeamCard from "../../components/TeamCard"
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"
import { teacherService } from '../../api';
import type { Teacher } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

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
      // Only show active teachers
      const activeTeachers = response.data?.filter((teacher: Teacher) => teacher.status === 'active') || [];
      setTeachers(activeTeachers);
      setError(null);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Group teachers by department
  const teachersByDepartment: Record<string, Teacher[]> = {};
  teachers.forEach(teacher => {
    const dept = teacher.department || 'Other';
    if (!teachersByDepartment[dept]) {
      teachersByDepartment[dept] = [];
    }
    teachersByDepartment[dept].push(teacher);
  });

  return (
    <div className="JKSSTeachers-page min-h-screen bg-[#F7F7F7]">
      <Header />
      <main className="min-h-screen">
        <div className="teachers-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start px-12" style={{ backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity: 0.9 }}>
          <h1 className="text-5xl font-medium text-center my-8 text-white">JKSS Teachers</h1>
        </div>

        <div className="teachers-content w-full mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-16 max-w-7xl">
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
            <div className="space-y-10">
              {Object.entries(teachersByDepartment).map(([department, deptTeachers], index) => (
                <div key={department} className="space-y-5">
                  {/* Department Header */}
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {department} Department
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    <p className="mt-2 text-gray-600">{deptTeachers.length} Teacher{deptTeachers.length !== 1 ? 's' : ''}</p>
                  </div>

                  {/* Teachers Grid */}
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {deptTeachers.map((teacher: Teacher) => (
                      <TeamCard
                        key={teacher.id}
                        fullName={`${teacher.firstName} ${teacher.middleName || ''} ${teacher.lastName}`.trim()}
                        position="Teacher"
                        department={teacher.department}
                        profileImage={teacher.profileImage}
                        email={teacher.email}
                        highlighted={false}
                      />
                    ))}
                  </div>

                  {/* Divider (except for last section) */}
                  {index < Object.keys(teachersByDepartment).length - 1 && (
                    <div className="pt-6">
                      <div className="border-t border-gray-200"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default JKSSTeachers
