import { useState } from 'react';
import { contactService } from '../api/services';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  isStudent: boolean;
  className: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    isStudent: false,
    className: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Validate email (optional but must be valid if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate class if student
    if (formData.isStudent && !formData.className.trim()) {
      newErrors.className = 'Class is required for students';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await contactService.submit({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        message: formData.message || undefined,
        isStudent: formData.isStudent,
        className: formData.isStudent ? formData.className : undefined,
      });
      
      if (response.data) {
        setSubmitMessage({
          type: 'success',
          text: 'Thank you for contacting us! We will get back to you shortly.',
        });

        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          isStudent: false,
          className: '',
        });
        setErrors({});
      }
    } catch (error: any) {
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Failed to submit the form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2 w-full flex justify-center">
          <h2 className="text-lg text-[#035CB0] bg-white px-4 py-2 rounded-full">
            Contact Us
          </h2>
        </div>
        <div className="mb-6 w-full flex justify-center">
          <h1 className="text-2xl sm:text-4xl text-[#035CB0] font-bold">Janakalyan Contact Form</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
              <p className="text-gray-600 mb-5">
                Get in touch with Shree Janakalyan Secondary School to start your journey towards
                success. Fill out the form below, and we'll be in contact shortly
              </p>
            {submitMessage && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  submitMessage.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Number"
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your E-mail (Optional)"
                  className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Are you a student? */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isStudent"
                  id="isStudent"
                  checked={formData.isStudent}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <label htmlFor="isStudent" className="ml-2 text-sm font-medium text-gray-700">
                  Are you a student?
                </label>
              </div>

              {/* Class (conditional) */}
              {formData.isStudent && (
                <div>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    placeholder="Enter your class (e.g., Class 10)"
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      errors.className ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.className && (
                    <p className="mt-1 text-sm text-red-600">{errors.className}</p>
                  )}
                </div>
              )}

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#035CB0] hover:bg-[#074e90] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? 'Sending...' : 'Contact Us'}
              </button>
            </form>
          </div>

          {/* Right side - Image/Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <img
                src="/img/running-shield-2.jpg"
                alt="Contact Us"
                className="rounded-lg shadow-2xl"
                onError={(e) => {
                  // Fallback to a gradient background if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-orange-500/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
