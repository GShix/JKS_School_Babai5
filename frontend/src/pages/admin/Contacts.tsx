import React, { useEffect, useState } from 'react';
import { Phone, Mail, User, GraduationCap, MessageSquare, Eye, Trash2, Check, Clock, Filter, RefreshCw } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import { contactService } from '../../api';
import type { Contact } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

type StatusFilter = 'all' | 'pending' | 'contacted' | 'resolved';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, statusFilter, searchQuery]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAll();
      setContacts(response.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', getErrorMessage(error));
      showError(`Failed to fetch contacts: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.message?.toLowerCase().includes(query)
      );
    }

    setFilteredContacts(filtered);
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setNotes(contact.notes || '');
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (contactId: number, newStatus: Contact['status']) => {
    try {
      setUpdatingStatus(true);
      await contactService.update(contactId, { status: newStatus, notes });
      await fetchContacts();
      showSuccess(`Contact status updated to ${newStatus}!`);
      
      // Update the selected contact if it's still open
      if (selectedContact?.id === contactId) {
        const updatedContact = contacts.find(c => c.id === contactId);
        if (updatedContact) {
          setSelectedContact({ ...updatedContact, status: newStatus, notes });
        }
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      showError(`Failed to update contact: ${getErrorMessage(error)}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedContact) return;

    try {
      setUpdatingStatus(true);
      await contactService.update(selectedContact.id, { notes });
      await fetchContacts();
      showSuccess('Notes saved successfully!');
      
      // Update the selected contact
      setSelectedContact({ ...selectedContact, notes });
    } catch (error) {
      console.error('Error saving notes:', error);
      showError(`Failed to save notes: ${getErrorMessage(error)}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this contact');
    if (!result.isConfirmed) return;

    try {
      await contactService.delete(id);
      await fetchContacts();
      setShowDetailModal(false);
      showSuccess('Contact has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showError(`Failed to delete contact: ${getErrorMessage(error)}`);
    }
  };

  const getStatusBadge = (status: Contact['status']) => {
    const statusConfig = {
      pending: { variant: 'warning' as const, label: 'Pending', icon: Clock },
      contacted: { variant: 'info' as const, label: 'Contacted', icon: Phone },
      resolved: { variant: 'success' as const, label: 'Resolved', icon: Check }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1 inline" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string, row: Contact) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {value?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            {row.isStudent && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <GraduationCap className="w-3 h-3" />
                {row.className}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string, _row: any) => (
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          {value}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string, _row: any) => (
        value ? (
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            {value}
          </div>
        ) : (
          <span className="text-gray-400 italic">Not provided</span>
        )
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: Contact['status'], _row: any) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      render: (value: string, _row: any) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      )
    }
  ];

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => c.status === 'pending').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    resolved: contacts.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Form Submissions</h1>
          <p className="text-gray-600 mt-1">Manage and respond to contact inquiries</p>
        </div>
        <Button
          onClick={fetchContacts}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.contacted}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'contacted', 'resolved'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {stats[status as keyof typeof stats]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredContacts}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search by name, phone, email, or message..."
        onSearch={setSearchQuery}
        actions={(contact) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleViewDetails(contact)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(contact.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Detail Modal */}
      {selectedContact && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Contact Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Header with Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {selectedContact.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">Submitted {formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>
              {getStatusBadge(selectedContact.status)}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedContact.email || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
              </div>

              {selectedContact.isStudent && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Student Type</p>
                      <p className="text-sm font-medium text-blue-600">Student</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm font-medium text-gray-900">{selectedContact.className}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Message */}
            {selectedContact.message && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add internal notes about this contact..."
              />
              <div className="mt-2">
                <Button
                  onClick={handleSaveNotes}
                  disabled={updatingStatus || notes === selectedContact.notes}
                  size="sm"
                >
                  Save Notes
                </Button>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleUpdateStatus(selectedContact.id, 'pending')}
                  disabled={updatingStatus || selectedContact.status === 'pending'}
                  variant={selectedContact.status === 'pending' ? 'primary' : 'outline'}
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Pending
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedContact.id, 'contacted')}
                  disabled={updatingStatus || selectedContact.status === 'contacted'}
                  variant={selectedContact.status === 'contacted' ? 'primary' : 'outline'}
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contacted
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedContact.id, 'resolved')}
                  disabled={updatingStatus || selectedContact.status === 'resolved'}
                  variant={selectedContact.status === 'resolved' ? 'primary' : 'outline'}
                  size="sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Resolved
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleDelete(selectedContact.id)}
                variant="outline"
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Contact
              </Button>
              <Button
                onClick={() => setShowDetailModal(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Contacts;
