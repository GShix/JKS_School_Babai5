import React, { useEffect, useState } from 'react';
import { Shield, Plus, Edit, Trash2, Crown } from 'lucide-react';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import Badge from '../../components/shared/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetAlert';

interface Admin {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'superAdmin';
  department?: string;
  employeeId?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
    department: '',
    employeeId: '',
    status: 'active'
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserRole(user.role);
      
      if (user.role !== 'superAdmin') {
        showError('Access Denied', 'Only Super Admins can access this page.');
        return;
      }
    }
    
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const adminData = response.data.data || [];
      const validAdmins = adminData.filter((admin: any) => admin && admin.id);
      setAdmins(validAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingAdmin && !formData.password) {
      showWarning('Password is required', 'Please enter a password for the new admin.');
      return;
    }

    const adminData: any = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      employeeId: formData.employeeId,
      status: formData.status
    };

    if (formData.password) {
      adminData.password = formData.password;
    }

    try {
      setLoading(true);
      if (editingAdmin) {
        await axios.put(
          `${API_BASE_URL}/admin/${editingAdmin.id}`,
          adminData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Admin has been updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/register`,
          adminData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New admin has been created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchAdmins();
    } catch (error: any) {
      console.error('Error saving admin:', error);
      showError(error.response?.data?.message || 'Failed to save admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      password: '',
      role: admin.role,
      department: admin.department || '',
      employeeId: admin.employeeId || '',
      status: admin.status
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this admin', 'This action cannot be undone');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Admin has been deleted successfully!');
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      showError('Failed to delete admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'admin',
      department: '',
      employeeId: '',
      status: 'active'
    });
    setEditingAdmin(null);
  };

  const columns = [
    { key: 'name', label: 'Admin Details', render: (_value: any, admin: Admin) => {
      if (!admin) return '-';
      return (
        <div className="flex items-center gap-2">
          {admin.role === 'superAdmin' && <Crown className="w-5 h-5 text-yellow-500" />}
          <div>
            <p className="font-medium flex items-center gap-2">
              {admin.fullName}
            </p>
            <p className="text-sm text-gray-600">{admin.email}</p>
          </div>
        </div>
      );
    }},
    { key: 'phone', label: 'Phone', render: (_value: any, admin: Admin) => admin?.phone || '-' },
    { 
      key: 'role', 
      label: 'Role', 
      render: (_value: any, admin: Admin) => {
        if (!admin || !admin.role) return '-';
        return (
          <Badge 
            variant={admin.role === 'superAdmin' ? 'success' : 'info'}
          >
            {admin.role === 'superAdmin' ? 'SUPER ADMIN' : 'ADMIN'}
          </Badge>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (_value: any, admin: Admin) => {
        if (!admin || !admin.status) return '-';
        return (
          <Badge 
            variant={admin.status === 'active' ? 'success' : 'danger'}
          >
            {admin.status.toUpperCase()}
          </Badge>
        );
      }
    },
    { key: 'lastLogin', label: 'Last Login', render: (_value: any, admin: Admin) => 
      admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'
    }
  ];

  const departmentOptions = [
    { value: 'Academic', label: 'Academic' },
    { value: 'Administration', label: 'Administration' },
    { value: 'IT', label: 'IT & Technical' },
    { value: 'Finance', label: 'Finance & Accounts' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Operations', label: 'Operations' }
  ];

  if (currentUserRole !== 'superAdmin') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only Super Administrators can access this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-7 h-7 text-red-600" />
              Admin Users Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage system administrators (Super Admin Only)</p>
          </div>
          <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
            Add Admin
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Security Notice:</strong> Super Admins have full system access. Only create admin accounts for trusted personnel.
            Regular admins have limited administrative privileges.
          </p>
        </div>

        <DataTable
          data={admins}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search admins..."
          loading={loading && admins.length === 0}
          actions={(admin) => {
            if (!admin) return null;
            return (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(admin)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  disabled={admin.role === 'superAdmin' && admins.filter(a => a && a.role === 'superAdmin').length === 1}
                  title={admin.role === 'superAdmin' && admins.filter(a => a && a.role === 'superAdmin').length === 1 ? 'Cannot delete the last super admin' : 'Delete admin'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          }}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingAdmin ? 'Edit Admin User' : 'Create New Admin User'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <FormInput
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <FormInput
              label={editingAdmin ? "Password (leave blank to keep current)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingAdmin}
            />
            <FormInput
              label="Employee ID"
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={departmentOptions}
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'superAdmin', label: 'Super Admin' }
              ]}
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              required
            />
          </div>

          {formData.role === 'superAdmin' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Super Admins have unrestricted access to all system features including user management, settings, and sensitive data.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingAdmin ? 'Update Admin' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admins;
