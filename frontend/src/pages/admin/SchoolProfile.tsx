import { useState, useEffect } from 'react';
import { Save, MapPin, Target, Eye } from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';

interface SchoolProfile {
  id: number;
  schoolName: string;
  schoolNameNepali?: string;
  established: string;
  mission: string;
  vision: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebookUrl?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  introduction?: string;
  establishedYear?: string;
  affiliationNumber?: string;
  schoolCode?: string;
}

const SchoolProfile = () => {
  const [profile, setProfile] = useState<SchoolProfile>({
    id: 0,
    schoolName: '',
    schoolNameNepali: '',
    established: '',
    mission: '',
    vision: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    facebookUrl: '',
    province: '',
    district: '',
    municipality: '',
    ward: '',
    introduction: '',
    establishedYear: '',
    affiliationNumber: '',
    schoolCode: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/school-profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setProfile({
          id: data.id || 1,
          schoolName: data.schoolName || '',
          schoolNameNepali: data.schoolNameNepali || '',
          established: data.establishedYear || '',
          mission: data.introduction || '',
          vision: data.introduction || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          facebookUrl: data.facebookUrl || '',
          province: data.province || '',
          district: data.district || '',
          municipality: data.municipality || '',
          ward: data.ward || '',
          introduction: data.introduction || '',
          establishedYear: data.establishedYear || '',
          affiliationNumber: data.affiliationNumber || '',
          schoolCode: data.schoolCode || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const payload = {
        schoolName: profile.schoolName,
        schoolNameNepali: profile.schoolNameNepali,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        addressNepali: profile.schoolNameNepali,
        province: profile.province,
        district: profile.district,
        municipality: profile.municipality,
        ward: profile.ward,
        introduction: profile.introduction,
        establishedYear: profile.establishedYear,
        principalName: '',
        website: profile.website,
        facebookUrl: profile.facebookUrl
      };
      
      const response = await axios.put(
        `${API_BASE_URL}/school-profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showSuccess('School profile has been updated successfully!');
      }
      setSaving(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaving(false);
      showError(error.response?.data?.message || error.message || 'Failed to save profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
            <div className="h-4 w-72 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-36 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-lg"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-4 px-1">
                <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shimmer effect */}
        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          .animate-pulse > * > * > div[class*="bg-gradient"] {
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">School Profile</h2>
          <p className="text-gray-600">Manage school information, contact details, and location</p>
        </div>
        <Button
          variant="primary"
          icon={<Save className="w-5 h-5" />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', label: 'Basic Information', icon: MapPin },
            { id: 'vision', label: 'Vision & Mission', icon: Target },
            { id: 'location', label: 'Location Details', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic School Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="School Name (English)"
                value={profile.schoolName}
                onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
              />
              
              <FormInput
                label="School Name (Nepali)"
                value={profile.schoolNameNepali || ''}
                onChange={(e) => setProfile({ ...profile, schoolNameNepali: e.target.value })}
                placeholder="जनकल्याण माध्यमिक विद्यालय"
              />
              
              <FormInput
                label="Established Year"
                value={profile.establishedYear || profile.established}
                onChange={(e) => setProfile({ ...profile, establishedYear: e.target.value })}
                placeholder="2020"
              />
              
              <FormInput
                label="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              
              <FormInput
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              
              <FormInput
                label="Website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://example.com"
              />
              
              <FormInput
                label="Facebook URL"
                value={profile.facebookUrl}
                onChange={(e) => setProfile({ ...profile, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/yourschool"
              />
              
              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Full address of the school"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Introduction
                </label>
                <textarea
                  value={profile.introduction}
                  onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief introduction about the school..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vision & Mission</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Vision
                </label>
                <textarea
                  value={profile.vision}
                  onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Our vision is to be..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Mission
                </label>
                <textarea
                  value={profile.mission}
                  onChange={(e) => setProfile({ ...profile, mission: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Our mission is to provide..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Province"
                value={profile.province}
                onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                placeholder="Lumbini Province"
              />
              
              <FormInput
                label="District"
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                placeholder="Dang"
              />
              
              <FormInput
                label="Municipality"
                value={profile.municipality}
                onChange={(e) => setProfile({ ...profile, municipality: e.target.value })}
                placeholder="Babai Municipality"
              />
              
              <FormInput
                label="Ward Number"
                value={profile.ward}
                onChange={(e) => setProfile({ ...profile, ward: e.target.value })}
                placeholder="1"
              />
              
              <FormInput
                label="Affiliation Number"
                value={profile.affiliationNumber}
                onChange={(e) => setProfile({ ...profile, affiliationNumber: e.target.value })}
                placeholder="Enter affiliation number"
              />
              
              <FormInput
                label="School Code"
                value={profile.schoolCode}
                onChange={(e) => setProfile({ ...profile, schoolCode: e.target.value })}
                placeholder="Enter school code"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolProfile;
