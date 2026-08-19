import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase, Users, Calendar, Eye, FileText } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import { showError, showDeleteConfirm, showSuccess } from '../../utils/sweetAlert';
import { careerService } from '../../api/services';
import type { CareerPosition, JobApplication } from '../../api/types';
import { SERVER_URL } from '../../api/config';

const Career = () => {
  const [jobs, setJobs] = useState<CareerPosition[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<CareerPosition | null>(null);
  const [editingJob, setEditingJob] = useState<CareerPosition | null>(null);
  const [noticeFile, setNoticeFile] = useState<File | null>(null);

  const getStatCardClasses = (color: string) => {
    const classes = {
      blue: 'bg-blue-50 border border-blue-200',
      green: 'bg-green-50 border border-green-200',
      yellow: 'bg-yellow-50 border border-yellow-200',
      gray: 'bg-gray-50 border border-gray-200'
    };
    return classes[color as keyof typeof classes] || classes.gray;
  };

  const getStatTextClasses = (color: string) => {
    const classes = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      gray: 'text-gray-600'
    };
    return classes[color as keyof typeof classes] || classes.gray;
  };

  const getStatIconClasses = (color: string) => {
    const classes = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      gray: 'text-gray-500'
    };
    return classes[color as keyof typeof classes] || classes.gray;
  };

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    type: 'Full-time',
    location: 'Bhangabari, Dang',
    description: '',
    requirements: '',
    responsibilities: '',
    salaryRange: '',
    vacancies: 1,
    applicationDeadline: '',
    status: 'active'
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await careerService.getAllPositions();
      if (response.data) {
        setJobs(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      showError(error.response?.data?.message || 'Failed to fetch job positions');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await careerService.getAllApplications();
      if (response.data) {
        setApplications(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.department || !formData.description) {
        showError('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      if (formData.requirements) formDataToSend.append('requirements', formData.requirements);
      if (formData.responsibilities) formDataToSend.append('responsibilities', formData.responsibilities);
      if (formData.salaryRange) formDataToSend.append('salaryRange', formData.salaryRange);
      formDataToSend.append('vacancies', formData.vacancies.toString());
      if (formData.applicationDeadline) formDataToSend.append('applicationDeadline', formData.applicationDeadline);
      formDataToSend.append('status', formData.status);

      if (noticeFile) {
        formDataToSend.append('noticeFile', noticeFile);
      }

      if (editingJob) {
        await careerService.updatePosition(editingJob.id, formDataToSend);
        showSuccess('Job position updated successfully');
      } else {
        await careerService.createPosition(formDataToSend);
        showSuccess('Job position created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      console.error('Error saving job:', error);
      showError(error.response?.data?.message || 'Failed to save job. Please try again.');
    }
  };

  const handleEdit = (job: CareerPosition) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      description: job.description,
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || '',
      salaryRange: job.salaryRange || '',
      vacancies: job.vacancies,
      applicationDeadline: job.applicationDeadline || '',
      status: job.status
    });
    setNoticeFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this job posting');
    if (!result.isConfirmed) return;

    try {
      await careerService.deletePosition(id);
      showSuccess('Job position deleted successfully');
      fetchJobs();
    } catch (error: any) {
      console.error('Error deleting job:', error);
      showError(error.response?.data?.message || 'Failed to delete job. Please try again.');
    }
  };

  const updateStatus = async (id: number, status: 'active' | 'closed' | 'draft') => {
    try {
      const job = jobs.find(j => j.id === id);
      if (!job) return;

      const formDataToSend = new FormData();
      formDataToSend.append('status', status);

      await careerService.updatePosition(id, formDataToSend);
      showSuccess(`Job position ${status === 'active' ? 'reopened' : 'closed'} successfully`);
      fetchJobs();
    } catch (error: any) {
      console.error('Error updating status:', error);
      showError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const viewApplications = async (position: CareerPosition) => {
    setSelectedPosition(position);
    setShowApplicationsModal(true);
  };

  const updateApplicationStatus = async (applicationId: number, status: string, notes?: string) => {
    try {
      await careerService.updateApplicationStatus(applicationId, { status, notes });
      showSuccess('Application status updated successfully');
      fetchApplications();
    } catch (error: any) {
      console.error('Error updating application:', error);
      showError(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const deleteApplication = async (id: number) => {
    const result = await showDeleteConfirm('this application');
    if (!result.isConfirmed) return;

    try {
      await careerService.deleteApplication(id);
      showSuccess('Application deleted successfully');
      fetchApplications();
    } catch (error: any) {
      console.error('Error deleting application:', error);
      showError(error.response?.data?.message || 'Failed to delete application');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      type: 'Full-time',
      location: 'Bhangabari, Dang',
      description: '',
      requirements: '',
      responsibilities: '',
      salaryRange: '',
      vacancies: 1,
      applicationDeadline: '',
      status: 'active'
    });
    setNoticeFile(null);
    setEditingJob(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'closed': return 'danger';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const getJobTypeBadgeVariant = (type: string): 'default' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (type) {
      case 'Full-time': return 'success';
      case 'Part-time': return 'warning';
      case 'Contract': return 'info';
      case 'Temporary': return 'warning';
      default: return 'default';
    }
  };

  const getApplicationStatusVariant = (status: string): 'default' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'shortlisted': return 'success';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'reviewing': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getPositionApplications = (positionId: number) => {
    return applications.filter(app => app.positionId === positionId);
  };

  const columns = [
    { key: 'title', label: 'Job Title' },
    { key: 'department', label: 'Department' },
    {
      key: 'type',
      label: 'Type',
      render: (value: string, _row: any) => (
        <Badge variant={getJobTypeBadgeVariant(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    { key: 'vacancies', label: 'Vacancies' },
    {
      key: 'applicationDeadline',
      label: 'Deadline',
      render: (value: string, _row: any) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'id',
      label: 'Applications',
      render: (_: any, row: CareerPosition) => (
        <button
          onClick={() => viewApplications(row)}
          className="text-blue-600 hover:underline font-medium"
        >
          {getPositionApplications(row.id).length}
        </button>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string, _row: any) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Management</h2>
          <p className="text-gray-600">Manage job postings and vacancies</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => {
            setEditingJob(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Add Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Positions',
            value: jobs.filter(j => j.status === 'active').length,
            icon: Briefcase,
            color: 'green'
          },
          {
            label: 'Total Vacancies',
            value: jobs.reduce((sum, j) => sum + (j.status === 'active' ? j.vacancies : 0), 0),
            icon: Users,
            color: 'blue'
          },
          {
            label: 'Applications',
            value: applications.length,
            icon: Eye,
            color: 'yellow'
          },
          {
            label: 'Closed',
            value: jobs.filter(j => j.status === 'closed').length,
            icon: Calendar,
            color: 'gray'
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${getStatCardClasses(stat.color)} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${getStatTextClasses(stat.color)} text-sm font-medium`}>{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${getStatIconClasses(stat.color)}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <DataTable
        data={jobs}
        columns={columns}
        searchPlaceholder="Search jobs by title, department..."
        loading={loading && jobs.length === 0}
        actions={(job: CareerPosition) => (
          <div className="flex gap-2">
            <button
              onClick={() => viewApplications(job)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="View applications"
            >
              <Eye className="w-4 h-4" />
            </button>
            {job.status === 'active' && (
              <button
                onClick={() => updateStatus(job.id, 'closed')}
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                title="Close job posting"
              >
                <Calendar className="w-4 h-4" />
              </button>
            )}
            {job.status === 'closed' && (
              <button
                onClick={() => updateStatus(job.id, 'active')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Reopen job posting"
              >
                <Briefcase className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleEdit(job)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit position"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(job.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete position"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingJob(null);
          resetForm();
        }}
        title={editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingJob(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {editingJob ? 'Update' : 'Create'} Job
            </Button>
          </div>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="md:col-span-2">
            <FormInput
              label="Job Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Mathematics Teacher"
            />
          </div>

          <Select
            label="Department"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: 'Academics', label: 'Academics' },
              { value: 'Administration', label: 'Administration' },
              { value: 'Science', label: 'Science' },
              { value: 'IT', label: 'IT' },
              { value: 'Sports', label: 'Sports' },
              { value: 'Library', label: 'Library' },
              { value: 'Other', label: 'Other' }
            ]}
          />

          <Select
            label="Job Type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'Full-time', label: 'Full Time' },
              { value: 'Part-time', label: 'Part Time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Temporary', label: 'Temporary' }
            ]}
          />

          <FormInput
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Bhangabari, Dang"
          />

          <FormInput
            label="Salary Range"
            value={formData.salaryRange}
            onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            placeholder="e.g., NPR 35,000 - 50,000"
          />

          <FormInput
            label="Number of Vacancies"
            type="number"
            required
            value={formData.vacancies.toString()}
            onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) || 1 })}
          />

          <FormInput
            label="Application Deadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
          />

          <Select
            label="Status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'closed', label: 'Closed' },
              { value: 'draft', label: 'Draft' }
            ]}
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice/Attachment (PDF/Image)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                onChange={(e) => setNoticeFile(e.target.files?.[0] || null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {editingJob?.noticeFileUrl && !noticeFile && (
                <a
                  href={`${SERVER_URL}${editingJob.noticeFileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Current
                </a>
              )}
            </div>
            {noticeFile && (
              <p className="text-sm text-gray-600 mt-1">Selected: {noticeFile.name}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the job..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements (comma-separated)
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bachelor degree, Teaching experience, Good communication..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities (comma-separated)
            </label>
            <textarea
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Teaching, Lesson planning, Student assessment..."
            />
          </div>
        </form>
      </Modal>

      {/* Applications Modal */}
      <Modal
        isOpen={showApplicationsModal}
        onClose={() => {
          setShowApplicationsModal(false);
          setSelectedPosition(null);
        }}
        title={`Applications for ${selectedPosition?.title || ''}`}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {selectedPosition && getPositionApplications(selectedPosition.id).length === 0 ? (
            <p className="text-center text-gray-500 py-8">No applications received yet for this position.</p>
          ) : (
            getPositionApplications(selectedPosition?.id || 0).map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{app.applicantName}</h4>
                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                      <p>✉️ {app.email}</p>
                      <p>📞 {app.phone}</p>
                      <p className="text-xs text-gray-500">Applied: {new Date(app.createdAt || '').toLocaleDateString()}</p>
                    </div>
                    {app.coverLetter && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                      </div>
                    )}
                    {app.notes && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600">{app.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <Badge variant={getApplicationStatusVariant(app.status)}>
                      {app.status.toUpperCase()}
                    </Badge>
                    <a
                      href={`${SERVER_URL}${app.resumeFileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Resume
                    </a>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'reviewing')}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                      >
                        Shortlist
                      </button>
                    </>
                  )}
                  {(app.status === 'reviewing' || app.status === 'shortlisted') && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'accepted')}
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="ml-auto px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Career;
