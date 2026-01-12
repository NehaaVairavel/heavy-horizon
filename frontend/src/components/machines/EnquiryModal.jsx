import { useState } from 'react';
import { submitEnquiry } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function EnquiryModal({ isOpen, onClose, machine, enquiryType }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    mobile: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your requirement';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const enquiryData = {
        type: enquiryType,
        machine: machine?.title,
        condition: machine?.condition,
        message: formData.message.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
      };

      const response = await submitEnquiry(enquiryData);

      toast({
        title: 'Enquiry Submitted!',
        description: 'Redirecting you to WhatsApp...',
      });

      window.open(response.whatsapp, '_blank');

      setFormData({ message: '', mobile: '', email: '' });
      setErrors({});
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit enquiry',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Send Enquiry</h2>
            {machine && (
              <p className="modal-subtitle">{machine.title} - {machine.category}</p>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Requirement / Query <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.message ? 'error' : ''}`}
                placeholder="Describe your requirement..."
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                className={`form-input ${errors.mobile ? 'error' : ''}`}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                maxLength={10}
              />
              {errors.mobile && <p className="form-error">{errors.mobile}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email ID (Optional)</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
                  Submitting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
