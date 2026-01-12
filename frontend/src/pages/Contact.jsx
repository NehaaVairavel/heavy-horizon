import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { submitEnquiry } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
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
        type: 'Contact',
        message: formData.message.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
      };

      const response = await submitEnquiry(enquiryData);

      toast({
        title: 'Message Sent!',
        description: 'Redirecting you to WhatsApp...',
      });

      // Construct WhatsApp URL client-side
      const ADMIN_PHONE = '916379432565';
      const text = encodeURIComponent(`New Enquiry from Website:\n\nMessage: ${formData.message}\nMobile: ${formData.mobile}\nEmail: ${formData.email || 'N/A'}`);
      window.open(`https://wa.me/${ADMIN_PHONE}?text=${text}`, '_blank');

      setFormData({ message: '', mobile: '', email: '' });
      setErrors({});
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit message',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <span className="section-label">Get In Touch</span>
          <h1 className="section-title">Contact <span>Us</span></h1>
          <p>
            Have questions about our equipment? Need a quote?
            We're here to help. Reach out to us today!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-card">
              <h2 className="section-title" style={{ marginBottom: 32, textAlign: 'left', fontSize: '1.75rem' }}>
                Send a <span>Message</span>
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Requirement Details <span className="required">*</span>
                  </label>
                  <textarea
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder="Describe your requirement or query..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    rows={5}
                  />
                  {errors.message && <p className="form-error">{errors.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Contact Number <span className="required">*</span>
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="section-title" style={{ marginBottom: 24, textAlign: 'left', fontSize: '1.75rem' }}>
                Contact <span>Information</span>
              </h2>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: 32, lineHeight: 1.7 }}>
                We're available to assist you with all your equipment rental
                and sales needs in Chennai. Reach out through any of the channels below.
              </p>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h4>Phone</h4>
                  <p>+91 63794 32565</p>
                  <small>Mon - Sat: 9:00 AM - 6:00 PM</small>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h4>Email</h4>
                  <p>info@heavyhorizon.com</p>
                  <small>We'll respond within 24 hours</small>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h4>Location</h4>
                  <p>Chennai</p>
                  <small>Tamil Nadu, India</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
