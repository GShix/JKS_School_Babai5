import { useEffect, useState } from 'react';
import TeamCard from "../../components/TeamCard"
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"
import { staffService } from '../../api';
import type { Staff } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

const OurTeam = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      // Only show active staff members
      const activeStaff = response.data?.filter((member: Staff) => member.status === 'active') || [];
      setStaff(activeStaff);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Define position hierarchy
  const positionHierarchy = [
    { position: 'Principal', title: 'Principal', single: true },
    { position: 'Vice Principal', title: 'Vice Principal', single: false },
    { position: 'Teacher', title: 'Teachers', single: false },
    { position: 'Librarian', title: 'Library Staff', single: false },
    { position: 'Lab Assistant', title: 'Laboratory Staff', single: false },
    { position: 'Accountant', title: 'Accounts Department', single: false },
    { position: 'Admin Staff', title: 'Administrative Staff', single: false },
    { position: 'Peon', title: 'Support Staff', single: false },
  ];

  // Group staff by position
  const groupedStaff = positionHierarchy.map(({ position, title, single }) => {
    const members = staff.filter(member => member.position === position);
    return members.length > 0 ? { position, title, single, members } : null;
  }).filter(Boolean);

  // Get any staff not in the defined hierarchy
  const definedPositions = positionHierarchy.map(h => h.position);
  const otherStaff = staff.filter(member => !definedPositions.includes(member.position));
  if (otherStaff.length > 0) {
    groupedStaff.push({ position: 'Other', title: 'Other Staff', single: false, members: otherStaff });
  }

  return (
    <div className="OurTeam-page min-h-screen bg-[#F7F7F7]">
      <Header/>
      <main className="min-h-screen">
        <div className="OurTeam-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
          <h1 className="text-5xl font-medium text-center my-8 text-white">Our Team</h1>
        </div>
        
        <div className="team-members w-full mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-16 max-w-7xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchStaff}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No team members to display</p>
            </div>
          ) : (
            <div className="space-y-10">
              {groupedStaff.map((group: any, index) => (
                <div key={group.position} className="space-y-5">
                  {/* Section Header */}
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {group.title}
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
                  </div>

                  {/* Staff Grid */}
                  <div className={`grid gap-6 ${
                    group.single 
                      ? 'grid-cols-1 max-w-sm mx-auto' 
                      : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  }`}>
                    {group.members.map((member: Staff) => (
                      <TeamCard
                        key={member.id}
                        fullName={member.fullName}
                        position={member.position}
                        department={member.department}
                        profileImage={member.profileImage}
                        email={member.email}
                        highlighted={group.position === 'Principal'}
                      />
                    ))}
                  </div>

                  {/* Divider (except for last section) */}
                  {index < groupedStaff.length - 1 && (
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
      <Footer/>
    </div>
  )
}

export default OurTeam
