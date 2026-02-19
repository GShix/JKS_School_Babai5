import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Settings } from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showWarning } from '../../utils/sweetAlert';

const AccountSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'notifications'>('profile');
  const [adminData, setAdminData] = useState({
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    employeeId: ''
  });

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    employeeId: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studentUpdates: true,
    staffUpdates: true,
    attendanceAlerts: true,
    feeReminders: true
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setAdminData(user);
        setProfileForm({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          department: user.department || '',
          employeeId: user.employeeId || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE_URL}/admin/profile`,
        profileForm,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      // Update local storage
      const updatedUser = { ...adminData, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      
      setAdminData(updatedUser);
      showSuccess('Profile has been updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showWarning('Passwords do not match', 'Please ensure both new password fields are identical.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showWarning('Password too short', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${API_BASE_URL}/admin/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      showSuccess('Password has been changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      showError(error.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE_URL}/admin/notifications`,
        notificationSettings,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      showSuccess('Notification preferences have been updated!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      showError('Failed to update notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !adminData.id) {
    return <LoadingSpinner text="Loading account settings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-blue-600" />
            Account Settings
          </h2>
          <p className="text-sm text-gray-600 mt-1">Manage your account profile and preferences</p>
        </div>

        {/* Admin Info Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
              {adminData.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{adminData.fullName}</h3>
              <p className="text-blue-100">{adminData.email}</p>
              <p className="text-sm text-blue-200 mt-1">
                {adminData.role === 'superAdmin' ? '👑 Super Administrator' : '🛡️ Administrator'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex max-sm:text-sm gap-4 border-b mb-6">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
              activeSection === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveSection('password')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
              activeSection === 'password'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            Password
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
              activeSection === 'notifications'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
              />
              <FormInput
                label="Phone"
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                required
              />
              <FormInput
                label="Employee ID"
                type="text"
                value={profileForm.employeeId}
                onChange={(e) => setProfileForm({ ...profileForm, employeeId: e.target.value })}
              />
              <FormInput
                label="Department"
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              />
              <div className="flex items-end">
                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p className="font-semibold text-gray-900 capitalize">{adminData.role}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Update Profile
              </Button>
            </div>
          </form>
        )}

        {/* Password Section */}
        {activeSection === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="max-w-md space-y-4">
              <FormInput
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
              <FormInput
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
              <FormInput
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Password Requirements:</strong>
                  <ul className="list-disc list-inside mt-2">
                    <li>Minimum 6 characters</li>
                    <li>Use a strong, unique password</li>
                    <li>Avoid using personal information</li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Change Password
              </Button>
            </div>
          </form>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Real-time alerts in the browser</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Student Updates</p>
                  <p className="text-sm text-gray-600">New student registrations and updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.studentUpdates}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, studentUpdates: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Staff Updates</p>
                  <p className="text-sm text-gray-600">Staff changes and announcements</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.staffUpdates}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, staffUpdates: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Attendance Alerts</p>
                  <p className="text-sm text-gray-600">Low attendance warnings</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.attendanceAlerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, attendanceAlerts: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Fee Reminders</p>
                  <p className="text-sm text-gray-600">Pending fee payment notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.feeReminders}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, feeReminders: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleNotificationUpdate} loading={loading}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
