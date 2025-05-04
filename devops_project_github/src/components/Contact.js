import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Updated axios request with proper headers
      await axios.post('http://localhost:5000/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
      });
      
      // Clear form
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error details:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: error.response?.data?.message || 'Oops! Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(59, 130, 246, 0.15)",
      borderColor: "rgba(59, 130, 246, 0.6)",
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    idle: { 
      scale: 1,
      backgroundColor: "rgb(37, 99, 235)",
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "rgb(29, 78, 216)",
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.95,
      backgroundColor: "rgb(30, 64, 175)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div id="contact" className="py-16 bg-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/5 rounded-full filter blur-2xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-600/5 rounded-full filter blur-2xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Get In Touch
          </h2>
          <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-blue-500 to-transparent mx-auto mt-4 mb-4"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions about the hackathon? Drop us a message and we'll get back to you soon!
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl"
          >
            {!formStatus.submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1 text-left">
                    Your Name
                  </label>
                  <motion.div whileTap="focus" whileFocus="focus" variants={inputVariants}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 text-left">{errors.name}</p>
                    )}
                  </motion.div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1 text-left">
                    Email Address
                  </label>
                  <motion.div whileTap="focus" whileFocus="focus" variants={inputVariants}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 text-left">{errors.email}</p>
                    )}
                  </motion.div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1 text-left">
                    Your Message
                  </label>
                  <motion.div whileTap="focus" whileFocus="focus" variants={inputVariants}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${
                        errors.message ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none`}
                      placeholder="What would you like to ask?"
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500 text-left">{errors.message}</p>
                    )}
                  </motion.div>
                </div>
                
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        Send Message
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-8 text-center"
              >
                <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full ${formStatus.success ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
                  {formStatus.success ? (
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${formStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                  {formStatus.success ? 'Thank You!' : 'Oops!'}
                </h3>
                <p className="text-gray-300 mb-6">{formStatus.message}</p>
                <button
                  onClick={() => setFormStatus({ submitted: false, success: false, message: '' })}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
