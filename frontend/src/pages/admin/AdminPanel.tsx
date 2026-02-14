import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import DashboardStats from '../../components/admin/DashboardStats';
import StudentsManagement from '../../components/admin/StudentsManagement';
import TeacherManagement from '../../components/admin/TeacherManagement';
import StaffManagement from '../../components/admin/StaffManagement';
import AttendanceManagement from '../../components/admin/AttendanceManagement';
import GradesManagement from '../../components/admin/GradesManagement';
import FeesManagement from '../../components/admin/FeesManagement';
import TimetableManagement from '../../components/admin/TimetableManagement';
import AssignmentsManagement from '../../components/admin/AssignmentsManagement';
import LeavesManagement from '../../components/admin/LeavesManagement';
import AnnouncementsManagement from '../../components/admin/AnnouncementsManagement';
import BlogsManagement from '../../components/admin/BlogsManagement';
import ProgramsManagement from '../../components/admin/ProgramsManagement';
import AdminsManagement from '../../components/admin/AdminsManagement';
import AccountSettings from '../../components/admin/AccountSettings';
import SchoolProfileManagement from '../../components/admin/SchoolProfileManagement';
import MessageManagement from '../../components/admin/MessageManagement';
import DownloadsManagement from '../../components/admin/DownloadsManagement';
import GalleryManagement from '../../components/admin/GalleryManagement';
import CareerManagement from '../../components/admin/CareerManagement';
import HeroSlideManagement from '../../components/admin/HeroSlideManagement';
import ContactsManagement from '../../components/admin/ContactsManagement';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const adminFlag = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!adminFlag || !token) {
      navigate('/admin/login');
      return;
    }

    // Get admin user data
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      try {
        setAdminUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data and redirect to login
        localStorage.clear();
        sessionStorage.clear();
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    setShowLogoutModal(true);
    setProfileDropdownOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats onStatClick={(stat) => setActiveTab(stat)} />;
      case 'students':
        return <StudentsManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'grades':
        return <GradesManagement />;
      case 'fees':
        return <FeesManagement />;
      case 'timetable':
        return <TimetableManagement />;
      case 'assignments':
        return <AssignmentsManagement />;
      case 'leaves':
        return <LeavesManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      case 'blogs':
        return <BlogsManagement />;
      case 'programs':
        return <ProgramsManagement />;
      case 'admins':
        return <AdminsManagement />;
      case 'school-profile':
        return <SchoolProfileManagement />;
      case 'messages':
        return <MessageManagement />;
      case 'downloads':
        return <DownloadsManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'career':
        return <CareerManagement />;
      case 'hero-slides':
        return <HeroSlideManagement />;
      case 'contacts':
        return <ContactsManagement />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <DashboardStats onStatClick={(stat) => setActiveTab(stat)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileMenuOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-20'} flex flex-col min-h-screen w-full overflow-hidden`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8 py-2 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </div>

              {/* Admin Profile (Desktop) */}
              {adminUser && (
                <div className="hidden md:block relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {adminUser.fullName?.charAt(0) || 'A'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {adminUser.fullName}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {adminUser.role}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Profile Settings</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs lg:text-sm text-gray-500">
            <p>© 2026 JKSS School Management System. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition">Support</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout? You'll need to sign in again to access the admin panel.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
