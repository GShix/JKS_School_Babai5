
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/shared/ScrollToTop'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import About from './pages/about/About'
import GameZone from './pages/game/GameZone'
import Announcements from './pages/announcements/Announcements'
import AnnouncementDetail from './pages/announcements/AnnouncementDetail'
import Downloads from './pages/download/Downloads'
import Career from './pages/career/Career'
import Gallery from './pages/Gallery/Gallery'
import JKSSTeachers from './pages/about/JKSSTeachers'
import JKSSStaffs from './pages/about/JKSSStaffs'
import AcademicPrograms from './pages/academicPrograms/AcademicPrograms'
import Education from './pages/academicPrograms/Education'
import Agriculture from './pages/academicPrograms/Agriculture'
import Management from './pages/academicPrograms/Management'
import Results from './pages/results/Results'
import Admission from './pages/admission/Admission'
import SecondaryLevelProgram from './pages/academicPrograms/SecondaryLevelProgram'
import BasicLevelProgram from './pages/academicPrograms/BasicLevelProgram'
import StudentLogin from './pages/auth/StudentLogin'

// Admin Layout and Pages
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminTeachers from './pages/admin/Teachers'
import AdminStaff from './pages/admin/Staff'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminBlogs from './pages/admin/Blogs'
import AdminGallery from './pages/admin/Gallery'
import AdminCareer from './pages/admin/Career'
import AdminDownloads from './pages/admin/Downloads'
import AdminPrograms from './pages/admin/Programs'
import Admins from './pages/admin/Admins'
import SchoolProfile from './pages/admin/SchoolProfile'
import Messages from './pages/admin/Messages'
import Contacts from './pages/admin/Contacts'
import HeroSlides from './pages/admin/HeroSlides'
import Settings from './pages/admin/AccountSettings'
import { FeeTransactions, Grades } from './pages/admin'
import FeeCollection from './pages/admin/FeeCollection'
import FeeStructureManager from './pages/admin/FeeStructureManager'
import SmartAllocation from './pages/admin/SmartAllocation'
import Blogs from './pages/blogs/Blogs'
import BlogDetail from './pages/blogs/BlogDetail'

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/results' element={<Results />} />
          <Route path='/admission' element={<Admission />} />
          <Route path='/about/jkss' element={<About />} />
          <Route path='/about/teachers' element={<JKSSTeachers />} />
          <Route path='/about/staffs' element={<JKSSStaffs />} />

          {/* Group the academic program routes together */}

          <Route path='/academic-programs/' element={<AcademicPrograms />} />
          <Route path='/academic-programs/education' element={<Education />} />
          <Route path='/academic-programs/agriculture' element={<Agriculture />} />
          <Route path='/academic-programs/management' element={<Management />} />
          <Route path='/academic-programs/secondary-level' element={<SecondaryLevelProgram />} />
          <Route path='/academic-programs/basic-level' element={<BasicLevelProgram />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/announcements' element={<Announcements />} />
          <Route path='/announcements/:id' element={<AnnouncementDetail />} />
          <Route path='/downloads' element={<Downloads />} />
          <Route path='/career' element={<Career />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/blogs/:id' element={<BlogDetail />} />

          {/* Admin Routes */}
          <Route path='/admin/login' element={<Login />} />
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='students' element={<AdminStudents />} />
            <Route path='teachers' element={<AdminTeachers />} />
            <Route path='grades' element={<Grades />} />
            <Route path='staff' element={<AdminStaff />} />
            <Route path='announcements' element={<AdminAnnouncements />} />
            <Route path='blogs' element={<AdminBlogs />} />
            <Route path='gallery' element={<AdminGallery />} />
            <Route path='career' element={<AdminCareer />} />
            <Route path='downloads' element={<AdminDownloads />} />
            <Route path='programs' element={<AdminPrograms />} />
            <Route path='admins' element={<Admins />} />
            <Route path='school-profile' element={<SchoolProfile />} />
            <Route path='messages' element={<Messages />} />
            <Route path='contacts' element={<Contacts />} />
            <Route path='hero-slides' element={<HeroSlides />} />
            <Route path='settings' element={<Settings />} />
            {/* Enhanced Fee Management Routes */}
            <Route path='fee-structures' element={<FeeStructureManager />} />
            <Route path='smart-allocation' element={<SmartAllocation />} />
            <Route path='fee-collection' element={<FeeCollection />} />
            <Route path='fee-transactions' element={<FeeTransactions />} />
          </Route>

          {/* Student Routes */}
          <Route path='/student/login' element={<StudentLogin />} />
          {/* <Route path='/student/dashboard' element={<St/>}/> */}

          <Route path='/user/register' element={<Register />} />
          <Route path='/game-zone' element={<GameZone />} />
          {/* 
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/productdetails/:id' element={<ProductDetail/>}/> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
