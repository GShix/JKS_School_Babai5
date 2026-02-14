import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showError } from "../../utils/sweetAlert";

type TabType = "dashboard" | "blogs" | "gallery" | "career" | "notices" | "downloads" | "results" | "users" | "students" | "staff";

interface DashboardStats {
  blogs: number;
  gallery: number;
  careers: number;
  notices: number;
  downloads: number;
  users: number;
  students: number;
  staff: number;
}

interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  uploadDate: string;
}

interface CareerItem {
  id: string;
  position: string;
  department: string;
  postedDate: string;
  applicants: number;
}

interface NoticeItem {
  id: string;
  title: string;
  category: string;
  postedDate: string;
}

interface DownloadItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  downloads: number;
}

interface ResultItem {
  id: string;
  examName: string;
  level: string;
  year: string;
}

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  joinDate: string;
}

interface StudentItem {
  id?: string;
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  class: string;
  section?: string;
  rollNumber?: string;
  admissionDate?: string;
  previousSchool?: string;
  bloodGroup?: string;
  status?: string;
  profileImage?: string;
  previousGrade?: string;
  previousPercentage?: number;
  medicalInfo?: string;
  notes?: string;
}

interface StaffItem {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  position: string;
  department: string;
  employeeId?: string;
  joiningDate?: string;
  qualification?: string;
  experience?: string;
  salary?: number;
  bloodGroup?: string;
  status?: string;
  profileImage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  subjects?: string;
  notes?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const[showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"student" | "staff" | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Helper function to get token from either storage
  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  // Sample data for each section
  const [blogs, setBlogs] = useState<BlogItem[]>([
    { id: "1", title: "Academic Excellence Initiative", excerpt: "New program launched...", date: "2025-12-07", author: "Admin" },
    { id: "2", title: "School Sports Day 2025", excerpt: "Annual sports event...", date: "2025-12-05", author: "Admin" },
  ]);

  const [gallery, setGallery] = useState<GalleryItem[]>([
    { id: "1", title: "Annual Day Celebration", category: "Events", uploadDate: "2025-12-01" },
    { id: "2", title: "Science Fair 2025", category: "Activities", uploadDate: "2025-11-28" },
  ]);

  const [careers, setCareers] = useState<CareerItem[]>([
    { id: "1", position: "Mathematics Teacher", department: "Academic", postedDate: "2025-12-01", applicants: 12 },
    { id: "2", position: "IT Lab Coordinator", department: "Technical", postedDate: "2025-11-25", applicants: 8 },
  ]);

  const [notices, setNotices] = useState<NoticeItem[]>([
    { id: "1", title: "Holiday Notice", category: "General", postedDate: "2025-12-07" },
    { id: "2", title: "Exam Schedule Released", category: "Academic", postedDate: "2025-12-05" },
  ]);

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    { id: "1", name: "Class 10 Syllabus", type: "PDF", uploadDate: "2025-11-20", downloads: 145 },
    { id: "2", name: "Fee Structure 2025", type: "Excel", uploadDate: "2025-11-18", downloads: 89 },
  ]);

  const [results, setResults] = useState<ResultItem[]>([
    { id: "1", examName: "Mid-term Exam", level: "Class 10", year: "2025" },
    { id: "2", examName: "Unit Test", level: "Class 12", year: "2025" },
  ]);

  const [users, setUsers] = useState<UserItem[]>([
    { id: "1", fullName: "Admin User", email: "admin.jkss@gmail.com", role: "admin", joinDate: "2025-12-07" },
    { id: "2", fullName: "Test Admin", email: "testadmin@school.com", role: "admin", joinDate: "2025-12-07" },
  ]);

  const [students, setStudents] = useState<StudentItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);

  const stats: DashboardStats = {
    blogs: blogs.length,
    gallery: gallery.length,
    careers: careers.length,
    notices: notices.length,
    downloads: downloads.length,
    users: users.length,
    students: students.length,
    staff: staff.length,
  };

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/students");
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff from backend
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/staff");
      setStaff(response.data.data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check admin access on mount
  useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin") || sessionStorage.getItem("isAdmin");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!adminFlag || !token) {
      navigate("/admin/login");
      return;
    }
    setIsAdmin(true);
    fetchStudents();
    fetchStaff();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleDelete = (section: TabType, id: string) => {
    switch (section) {
      case "blogs":
        setBlogs(blogs.filter(b => b.id !== id));
        break;
      case "gallery":
        setGallery(gallery.filter(g => g.id !== id));
        break;
      case "career":
        setCareers(careers.filter(c => c.id !== id));
        break;
      case "notices":
        setNotices(notices.filter(n => n.id !== id));
        break;
      case "downloads":
        setDownloads(downloads.filter(d => d.id !== id));
        break;
      case "results":
        setResults(results.filter(r => r.id !== id));
        break;
      case "users":
        setUsers(users.filter(u => u.id !== id));
        break;
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const token = getToken();
      await axios.delete(`/api/students/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      showError('Failed to delete student. Please try again.');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    try {
      const token = getToken();
      await axios.delete(`/api/staff/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      showError('Failed to delete staff member. Please try again.');
    }
  };

  const openStudentModal = (student?: StudentItem) => {
    setModalType("student");
    setEditingItem(student || null);
    setShowModal(true);
  };

  const openStaffModal = (staffMember?: StaffItem) => {
    setModalType("staff");
    setEditingItem(staffMember || null);
    setShowModal(true);
  };

  const handleSubmitStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = getToken();
    
    const studentData: any = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      address: formData.get("address"),
      guardianName: formData.get("guardianName"),
      guardianPhone: formData.get("guardianPhone"),
      guardianEmail: formData.get("guardianEmail"),
      class: formData.get("class"),
      section: formData.get("section"),
      rollNumber: formData.get("rollNumber"),
      admissionDate: formData.get("admissionDate"),
      previousSchool: formData.get("previousSchool"),
      bloodGroup: formData.get("bloodGroup"),
      status: formData.get("status") || "active",
      profileImage: formData.get("profileImage"),
      previousGrade: formData.get("previousGrade"),
      previousPercentage: formData.get("previousPercentage"),
      medicalInfo: formData.get("medicalInfo"),
      notes: formData.get("notes"),
    };

    try {
      if (editingItem?.id) {
        await axios.put(`/api/students/${editingItem.id}/update`, studentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("/api/students/create", studentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingItem(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      showError('Failed to save student. Please try again.');
    }
  };

  const handleSubmitStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = getToken();
    
    const staffData: any = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      address: formData.get("address"),
      position: formData.get("position"),
      department: formData.get("department"),
      employeeId: formData.get("employeeId"),
      joiningDate: formData.get("joiningDate"),
      qualification: formData.get("qualification"),
      experience: formData.get("experience"),
      salary: formData.get("salary"),
      bloodGroup: formData.get("bloodGroup"),
      status: formData.get("status") || "active",
      profileImage: formData.get("profileImage"),
      emergencyContactName: formData.get("emergencyContactName"),
      emergencyContactPhone: formData.get("emergencyContactPhone"),
      subjects: formData.get("subjects"),
      notes: formData.get("notes"),
    };

    try {
      if (editingItem?.id) {
        await axios.put(`/api/staff/${editingItem.id}/update`, staffData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("/api/staff/create", staffData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingItem(null);
      fetchStaff();
    } catch (error) {
      console.error("Error saving staff:", error);
      showError('Failed to save staff member. Please try again.');
    }
  };

  if (!isAdmin) {
    return <div className="text-center pt-20 text-red-600">Loading...</div>;
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
    { id: "students", label: "Students", icon: "ri-user-3-line" },
    { id: "staff", label: "Staff", icon: "ri-team-line" },
    { id: "blogs", label: "Blogs", icon: "ri-article-line" },
    { id: "gallery", label: "Gallery", icon: "ri-image-2-line" },
    { id: "career", label: "Career", icon: "ri-briefcase-line" },
    { id: "notices", label: "Announcements", icon: "ri-notification-3-line" },
    { id: "downloads", label: "Downloads", icon: "ri-download-cloud-line" },
    { id: "results", label: "Results", icon: "ri-bar-chart-line" },
    { id: "users", label: "Users", icon: "ri-admin-line" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile Menu Bar (visible only on small screens) */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-blue-500 rounded-lg transition"
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img src="/img/jkss_logo.png" alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
            <h1 className="font-bold text-sm truncate">JKSS Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500 rounded-lg transition flex-shrink-0"
            title="Logout"
          >
            <i className="ri-logout-circle-r-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* Sidebar Container */}
      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg z-40 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >
          {/* Logo Section */}
          <div className="p-4 lg:p-6 border-b border-blue-500 sticky top-0 bg-gradient-to-b from-blue-600 to-blue-700">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img src="/img/jkss_logo.png" alt="Logo" className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="font-bold text-sm truncate">JKSS Admin</h1>
                  <p className="text-xs text-blue-200 truncate">School Management</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-blue-500 rounded-lg flex-shrink-0"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-3 lg:p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  activeTab === item.id
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-blue-100 hover:bg-blue-500/50"
                }`}
              >
                <i className={`${item.icon} text-lg flex-shrink-0`}></i>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-3 lg:p-4 border-t border-blue-500 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all text-white font-medium text-sm"
            >
              <i className="ri-logout-circle-r-line text-lg flex-shrink-0"></i>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Top Bar (hidden on mobile) */}
          <header className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
            <div className="flex items-center justify-between px-6 py-4 gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(m => m.id === activeTab)?.label || "Dashboard"}
              </h1>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").fullName || "Admin" : "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  A
                </div>
              </div>
            </div>
          </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome to Admin Dashboard</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs lg:text-sm font-medium">Total Students</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.students}</p>
                    </div>
                    <i className="ri-user-3-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs lg:text-sm font-medium">Total Staff</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.staff}</p>
                    </div>
                    <i className="ri-team-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs lg:text-sm font-medium">Total Blogs</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.blogs}</p>
                    </div>
                    <i className="ri-article-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs lg:text-sm font-medium">Gallery Images</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.gallery}</p>
                    </div>
                    <i className="ri-image-2-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-xs lg:text-sm font-medium">Job Openings</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.careers}</p>
                    </div>
                    <i className="ri-briefcase-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-xs lg:text-sm font-medium">Announcements</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.notices}</p>
                    </div>
                    <i className="ri-notification-3-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-xs lg:text-sm font-medium">Downloads</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.downloads}</p>
                    </div>
                    <i className="ri-download-cloud-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-4 lg:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-xs lg:text-sm font-medium">Total Users</p>
                      <p className="text-3xl lg:text-4xl font-bold mt-1 lg:mt-2">{stats.users}</p>
                    </div>
                    <i className="ri-admin-line text-4xl lg:text-5xl opacity-20"></i>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between py-2 border-b text-sm lg:text-base">
                    <span className="text-gray-700">Last Login</span>
                    <span className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b text-sm lg:text-base">
                    <span className="text-gray-700">Admin Role</span>
                    <span className="text-gray-900 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-sm lg:text-base">
                    <span className="text-gray-700">Total Content Items</span>
                    <span className="text-gray-900 font-medium">{Object.values(stats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-3 lg:space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Manage Students</h2>
                <button 
                  onClick={() => openStudentModal()}
                  className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base"
                >
                  <i className="ri-add-line mr-2"></i>Add New Student
                </button>
              </div>
              {loading ? (
                <div className="text-center py-10">Loading students...</div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                  <table className="w-full text-sm lg:text-base">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Name</th>
                        <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Class</th>
                        <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Roll No</th>
                        <th className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Guardian</th>
                        <th className="hidden xl:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Status</th>
                        <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{student.fullName}</td>
                          <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{student.class} {student.section || ''}</td>
                          <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{student.rollNumber || 'N/A'}</td>
                          <td className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{student.guardianName || 'N/A'}</td>
                          <td className="hidden xl:table-cell px-3 lg:px-6 py-2 lg:py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {student.status || 'active'}
                            </span>
                          </td>
                          <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                            <button 
                              onClick={() => openStudentModal(student)}
                              className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id!)}
                              className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No students found. Add a new student to get started.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === "staff" && (
            <div className="space-y-3 lg:space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Manage Staff</h2>
                <button 
                  onClick={() => openStaffModal()}
                  className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base"
                >
                  <i className="ri-add-line mr-2"></i>Add New Staff
                </button>
              </div>
              {loading ? (
                <div className="text-center py-10">Loading staff...</div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                  <table className="w-full text-sm lg:text-base">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Name</th>
                        <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Position</th>
                        <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Department</th>
                        <th className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Email</th>
                        <th className="hidden xl:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Status</th>
                        <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {staff.map((staffMember) => (
                        <tr key={staffMember.id} className="hover:bg-gray-50">
                          <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{staffMember.fullName}</td>
                          <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{staffMember.position}</td>
                          <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{staffMember.department}</td>
                          <td className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{staffMember.email}</td>
                          <td className="hidden xl:table-cell px-3 lg:px-6 py-2 lg:py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              staffMember.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {staffMember.status || 'active'}
                            </span>
                          </td>
                          <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                            <button 
                              onClick={() => openStaffModal(staffMember)}
                              className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staffMember.id!)}
                              className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {staff.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No staff found. Add a new staff member to get started.</div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Blogs</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Add New Blog
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Title</th>
                    <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Author</th>
                    <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Date</th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-2 lg:py-4 text-gray-900 font-medium text-xs lg:text-sm">{blog.title}</td>
                      <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{blog.author}</td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{blog.date}</td>
                      <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                        <button className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete("blogs", blog.id)}
                          className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Gallery</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Upload Images
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-3 lg:p-4 hover:shadow-lg transition">
                  <div className="w-full h-32 lg:h-40 bg-gray-200 rounded-lg mb-2 lg:mb-3 flex items-center justify-center">
                    <i className="ri-image-2-line text-2xl lg:text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{item.title}</h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">{item.category}</p>
                  <p className="text-xs text-gray-500 mb-2 lg:mb-3">{item.uploadDate}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                      <i className="ri-edit-line mr-1"></i>Edit
                    </button>
                    <button
                      onClick={() => handleDelete("gallery", item.id)}
                      className="flex-1 px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                    >
                      <i className="ri-delete-bin-line mr-1"></i>Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Tab */}
        {activeTab === "career" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Career Vacancies</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Post Vacancy
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Position</th>
                    <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Department</th>
                    <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Posted</th>
                    <th className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Applicants</th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {careers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{item.position}</td>
                      <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{item.department}</td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{item.postedDate}</td>
                      <td className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-4">
                        <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                          {item.applicants}
                        </span>
                      </td>
                      <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                        <button className="px-2 lg:px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs lg:text-sm">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete("career", item.id)}
                          className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "notices" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Announcements</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Add Announcement
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Title</th>
                    <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Category</th>
                    <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Posted</th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{notice.title}</td>
                      <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {notice.category}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{notice.postedDate}</td>
                      <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                        <button className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete("notices", notice.id)}
                          className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === "downloads" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Downloads</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Upload File
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">File Name</th>
                    <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Type</th>
                    <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Uploaded</th>
                    <th className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Downloads</th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {downloads.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{item.name}</td>
                      <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{item.uploadDate}</td>
                      <td className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{item.downloads}</td>
                      <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                        <button className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete("downloads", item.id)}
                          className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Results</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Publish Results
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Exam Name</th>
                    <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Level</th>
                    <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Year</th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{item.examName}</td>
                      <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{item.level}</td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{item.year}</td>
                      <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                        <button className="px-2 lg:px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs lg:text-sm">
                          <i className="ri-eye-line mr-1"></i>View
                        </button>
                        <button className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                          <i className="ri-edit-line mr-1"></i>Edit
                        </button>
                        <button
                          onClick={() => handleDelete("results", item.id)}
                          className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold">Manage Users</h2>
              <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                <i className="ri-add-line mr-2"></i>Add User
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Name</th>
                    <th className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Email</th>
                    <th className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Role</th>
                    <th className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Joined</th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 text-xs lg:text-sm">{user.fullName}</td>
                      <td className="hidden sm:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{user.email}</td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-2 lg:py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 lg:px-6 py-2 lg:py-4 text-gray-600 text-xs lg:text-sm">{user.joinDate}</td>
                      <td className="px-3 lg:px-6 py-2 lg:py-4 space-x-1 lg:space-x-2">
                        <button className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs lg:text-sm">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="px-2 lg:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs lg:text-sm">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </main>
        </div>
      </div>

      {/* Modal for Student/Staff */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Add New'} {modalType === 'student' ? 'Student' : 'Staff Member'}</h2>
              <button onClick={() => { setShowModal(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            {modalType === 'student' ? (
              <form onSubmit={handleSubmitStudent} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" defaultValue={editingItem?.fullName || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" defaultValue={editingItem?.email || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" defaultValue={editingItem?.phone || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" defaultValue={editingItem?.dateOfBirth || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" defaultValue={editingItem?.gender || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <input type="text" name="class" defaultValue={editingItem?.class || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input type="text" name="section" defaultValue={editingItem?.section || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                    <input type="text" name="rollNumber" defaultValue={editingItem?.rollNumber || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                    <input type="text" name="guardianName" defaultValue={editingItem?.guardianName || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                    <input type="tel" name="guardianPhone" defaultValue={editingItem?.guardianPhone || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Email</label>
                    <input type="email" name="guardianEmail" defaultValue={editingItem?.guardianEmail || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                    <input type="date" name="admissionDate" defaultValue={editingItem?.admissionDate || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                    <input type="text" name="previousSchool" defaultValue={editingItem?.previousSchool || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <input type="text" name="bloodGroup" defaultValue={editingItem?.bloodGroup || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" defaultValue={editingItem?.status || 'active'} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                      <option value="transferred">Transferred</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                    <input type="text" name="profileImage" defaultValue={editingItem?.profileImage || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" defaultValue={editingItem?.address || ''} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Info</label>
                    <textarea name="medicalInfo" defaultValue={editingItem?.medicalInfo || ''} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea name="notes" defaultValue={editingItem?.notes || ''} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Student</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitStaff} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" defaultValue={editingItem?.fullName || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" defaultValue={editingItem?.email || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" name="phone" defaultValue={editingItem?.phone || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" defaultValue={editingItem?.dateOfBirth || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" defaultValue={editingItem?.gender || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <input type="text" name="position" defaultValue={editingItem?.position || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <input type="text" name="department" defaultValue={editingItem?.department || ''} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input type="text" name="employeeId" defaultValue={editingItem?.employeeId || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                    <input type="date" name="joiningDate" defaultValue={editingItem?.joiningDate || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <input type="text" name="qualification" defaultValue={editingItem?.qualification || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <input type="text" name="experience" defaultValue={editingItem?.experience || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <input type="number" name="salary" defaultValue={editingItem?.salary || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <input type="text" name="bloodGroup" defaultValue={editingItem?.bloodGroup || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" defaultValue={editingItem?.status || 'active'} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <input type="text" name="emergencyContactName" defaultValue={editingItem?.emergencyContactName || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                    <input type="tel" name="emergencyContactPhone" defaultValue={editingItem?.emergencyContactPhone || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                    <input type="text" name="profileImage" defaultValue={editingItem?.profileImage || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" defaultValue={editingItem?.address || ''} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
                    <input type="text" name="subjects" defaultValue={editingItem?.subjects || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea name="notes" defaultValue={editingItem?.notes || ''} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Staff Member</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
