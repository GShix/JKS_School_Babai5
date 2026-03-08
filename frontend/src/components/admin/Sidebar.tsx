import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  // ClipboardCheck,
  FileText,
  DollarSign,
  // Calendar,
  // BookOpen,
  // CalendarX,
  Bell,
  Shield,
  Newspaper,
  Activity,
  Menu,
  X,
  // Crown,
  // LogOut,
  Settings,
  Building,
  Download,
  Image,
  Briefcase,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Mail,
} from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles?: string[];
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  onToggle: () => void;
  mobileMenuOpen: boolean;
  onMobileToggle: () => void;
  adminUser: {
    fullName: string;
    email: string;
    role: string;
    profileImage?: string;
  } | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  onToggle,
  mobileMenuOpen,
  onMobileToggle,
  adminUser,
  // onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(`/admin/${path}`);
    if (mobileMenuOpen) onMobileToggle();
  };

  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.replace('/admin/', '');
    return path || 'dashboard';
  };

  const activeTab = getCurrentTab();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admins', label: 'Admins', icon: Shield, roles: ['superAdmin'] },
    { id: 'students', label: 'Students', icon: GraduationCap },
    {
      id: 'staff-menu',
      label: 'Teacher | Staff',
      icon: Users,
      subItems: [
        { id: 'teachers', label: 'Teacher' },
        { id: 'staff', label: 'Staff' }
      ]
    },
    // { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'grades', label: 'Grades', icon: FileText },
    {
      id: 'fee-management',
      label: 'Fee Management',
      icon: DollarSign,
      subItems: [
        { id: 'fee-structures', label: 'Fee Structures' },
        { id: 'smart-allocation', label: 'Smart Allocation' },
        { id: 'fee-collection', label: 'Fee Collection' },
        { id: 'fee-transactions', label: 'Transactions' }
      ]
    },
    // { id: 'timetable', label: 'Timetable', icon: Calendar },
    // { id: 'assignments', label: 'Assignments', icon: BookOpen },
    // { id: 'leaves', label: 'Leaves', icon: CalendarX },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'blogs', label: 'Blogs', icon: Newspaper },
    { id: 'programs', label: 'Programs', icon: Activity },
    { id: 'school-profile', label: 'School Profile', icon: Building },
    { id: 'messages', label: 'Messages From', icon: MessageSquare },
    { id: 'contacts', label: 'Contact Forms', icon: Mail },
    { id: 'hero-slides', label: 'Hero Slides', icon: Image },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(adminUser?.role || '');
  });

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
          } bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        {/* Logo */}
        <div className="px-3 py-3 flex items-center justify-between border-b border-gray-400">
          {(sidebarOpen || mobileMenuOpen) ? (
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-blue-300">JKSS School</p>
              </div>
            </div>
          ) : (
            <Shield className="w-8 h-8 mx-auto" />
          )}

          <button
            onClick={onMobileToggle}
            className="lg:hidden p-2 hover:bg-blue-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Info */}
        {/* {(sidebarOpen || mobileMenuOpen) && adminUser && (
          <div className="px-4 py-3 bg-blue-800 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                {adminUser.role === 'superAdmin' ? (
                  <Crown className="w-5 h-5 text-blue-900" />
                ) : (
                  <Shield className="w-5 h-5 text-blue-900" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{adminUser.fullName}</p>
                <p className="text-xs text-blue-200">{adminUser.role}</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Menu Items */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || item.subItems?.some(sub => sub.id === activeTab);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.id);

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSubmenu(item.id);
                    } else {
                      handleNavigation(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg transition-all text-sm ${isActive
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'hover:bg-blue-800 text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    {(sidebarOpen || mobileMenuOpen) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {hasSubItems && (sidebarOpen || mobileMenuOpen) && (
                    isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Sub Items */}
                {hasSubItems && isExpanded && (sidebarOpen || mobileMenuOpen) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = activeTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.id)}
                          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isSubActive
                              ? 'bg-white text-blue-900 shadow'
                              : 'hover:bg-blue-800 text-blue-100'
                            }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span className="font-medium">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        {/* <div className="p-4 border-t border-indigo-700">
          <button
            onClick={() => {
              onLogout();
              if (mobileMenuOpen) onMobileToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all text-white"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(sidebarOpen || mobileMenuOpen) && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div> */}

        {/* Toggle Button - Desktop Only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20 bg-white text-indigo-900 w-6 h-6 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
