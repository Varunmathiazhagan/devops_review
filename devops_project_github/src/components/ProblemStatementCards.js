import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './animations.css';

// Domain background images
const domainImages = {
  ai: '/image/aip.avif',
  cybersecurity: '/image/cyp.avif',
  iot: '/image/iotp.png',
  app: '/image/appp.avif',
};

// Domain coordinators
const domainCoordinators = {
  ai: [
    { name: 'Mithra S', phone: '+91 7010437916' },
    { name: 'Mohammed Yunus A ', phone: '+91 7010499316' },
  ],
  cybersecurity: [
    { name: 'Kavya S', phone: '+91 8438416749' },
    { name: 'Dharun vidhyakar S', phone: '+918610708272' },
  ],
  app: [
    { name: 'Immanuvel R', phone: '+91 8825503860' },
    { name: 'jayaSwathi P', phone: '+91 9344876996 '},
  ],
  iot: [
    { name: 'Nisar A', phone: '+919876543217' },
    { name: 'Rohith C R', phone: '+91 9842868885' },
  ],
};

const ProblemStatementCards = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [viewMode, setViewMode] = useState('domains');

  // Domains data with problems
  const domains = [
    {
      id: 'ai',
      title: 'Artificial Intelligence',
      description: 'Exploring the frontier of machine learning and cognitive computing',
      icon: '🤖',
      problems: [
        {
          id: 'AI01',
          title: 'AI for Code Vulnerability Detection',
          description: 'Create an AI-powered tool that scans and predicts security vulnerabilities in codebases, suggesting real-time fixes for developers',
        },
        {
          id: 'AI02',
          title: 'Self-Healing AI Systems',
          description: 'Develop an AI system that can autonomously detect its own failures or performance drops and recover without human intervention, ensuring robustness in critical applications.',
        }
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Cyber security',
      description: 'Protecting digital assets in an increasingly connected world',
      icon: '🛡️',
      problems: [
        {
          id: 'CBS01',
          title: 'AI-Driven Adaptive Cyber Defense System',
          description: 'Build an AI-based system that autonomously detects, analyzes, and mitigates cyber threats in real-time by adapting to new attack patterns',
        },
        {
          id: 'CBS02',
          title: 'Biometric Authentication with Deepfake Resistance',
          description: 'Develop an advanced biometric security system (facial recognition, voice authentication, retina scan) that can detect and prevent deepfake-based identity fraud',
        }
      ]
    },
    {
      id: 'iot',
      title: 'Internet of Things',
      description: 'Connecting devices to create smarter environments',
      icon: '🌐',
      problems: [
        {
          id: 'IOT01',
          title: 'IoT-Enabled Air Pollution Meter',
          description: 'Air pollution is a growing concern in urban and industrial areas, leading to severe health and environmental issues. Traditional air quality monitoring systems are expensive and lack real-time accessibility. There is a need for an affordable, IoT-enabled air pollution meter that can continuously monitor key air quality parameters such as CO2 levels, PM2.5, PM10, humidity, and temperature, and provide real-time data to users.',
          objectives: [
            'Continuously measures air quality parameters.',
            'Sends real-time data to a web or mobile dashboard',
            'Generates alerts when pollution levels exceed safe thresholds',
            'Helps users make informed decisions to improve air quality'
          ]
        },
        {
          id: 'IOT02',
          title: 'IoT Energy Meter with Current, Voltage, and Cost Monitoring System',
          description: 'With the increasing cost of electricity and the need for energy conservation, there is a demand for smart solutions to monitor energy usage in real time. Traditional energy meters only show total consumption, lacking real-time tracking of voltage, current, and cost',
          objectives: [
            'Monitors voltage, current, and power consumption',
            'Provides real-time data on energy usage and cost',
            'Sends alerts when consumption reaches a specified threshold',
            'Helps users optimize energy usage and reduce electricity bills'
          ]
        }
      ]
    },
    {
      id: 'app',
      title: 'App Development',
      description: 'Creating solutions for the mobile-first world',
      icon: '📱',
      problems: [
        {
          id: 'APP01',
          title: 'Student-Alumni Connect App',
          description: 'Students often struggle to find the right guidance on careers, industry trends, and skill development. Meanwhile, alumni have valuable experience but lack an easy way to share it. There is a need for a mobile platform where students can connect with alumni, ask questions, discuss topics, and get career advice in an interactive way.',
          objectives: [
            'Ask & Answer Questions (like Stack Overflow)',
            'Create Discussions & Polls (like Reddit)',
            'Find Mentors for career guidance',
            'Post Jobs & Internships to help students',
            'Host Events & Webinars for learning and networking'
          ],
          execution: [
            'User Login & Verification – Students and alumni sign up with verification.',
            'Q&A & Discussions – Users can ask questions, post discussions, and upvote answers.',
            'Mentorship Feature – Alumni can offer guidance; students can request mentors.',
            'Job & Internship Board – Alumni can post job opportunities for students.',
            'Event Hub – Webinars, AMA (Ask Me Anything) sessions, and career talks.',
            'Notifications & Gamification – Badges, leaderboards, and engagement rewards.',
            'Simple & Secure – Easy-to-use interface with moderation to ensure quality content.'
          ]
        },
        {
          id: 'APP02',
          title: 'BNYS Campus Healthcare App',
          description: 'Managing outpatient appointments, doctor consultations, and bed bookings in a BNYS (Bachelor of Naturopathy and Yogic Sciences) campus clinic is often inefficient and time-consuming. Patients face difficulties in scheduling treatments, finding the right doctor, and accessing essential healthcare services. A digital solution is needed to simplify and streamline the entire process for both patients and healthcare providers.',
          objectives: [
            'Book Appointments with doctors based on availability',
            'Reserve Beds for inpatient treatments',
            'View Doctor Profiles and select specialists',
            'Access Treatment Plans & Reports in one place',
            'Receive Notifications & Reminders for upcoming appointments'
          ],
          execution: [
            'User Registration & Login – Patients sign up and manage their profiles.',
            'Doctor & Treatment Search – View available doctors and book treatments.',
            'Appointment & Bed Booking System – Schedule outpatient visits and inpatient admissions.',
            'Medical History & Reports – Patients can access past consultations and prescriptions.',
            'Notifications & Alerts – Get reminders for appointments and treatment follow-ups.',
            'Simple & User-Friendly UI – Easy navigation for both patients and doctors.'
          ]
        }
      ]
    }
  ];

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setViewMode('problems');
  };

  const handleBack = () => {
    setViewMode('domains');
    setSelectedDomain(null);
  };

  const renderDomainCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {domains.map((domain) => (
        <motion.div
          key={domain.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -5 }}
          className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
          onClick={() => handleDomainSelect(domain)}
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img 
              src={domainImages[domain.id]} 
              alt={domain.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-end">
            <div className="mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl">{domain.icon}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 text-left">
              {domain.title}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 text-left">{domain.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Updated to show registration closed badge for all domains */}
              <span className="text-xs sm:text-sm font-medium text-white bg-red-600/50 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg shadow-red-500/30 border border-red-400/20">
                Registration Closed
              </span>
              
              <button 
                className="flex items-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/30 text-sm sm:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDomainSelect(domain);
                }}
              >
                <span className="mr-1 sm:mr-2 font-medium">
                  View Problems
                </span>
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Glow effect - now red for all domains to indicate registration closed */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-red-500/10 rounded-xl"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  const renderProblemsView = () => {
    if (!selectedDomain) return null;
    
    // Get the coordinators for the selected domain
    const coordinators = domainCoordinators[selectedDomain.id] || [];
    
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 flex items-center">
          <button 
            onClick={handleBack}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 mr-3 sm:mr-4 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-left">
            {selectedDomain.title} Problems
          </h2>
          
          {/* Add registration closed badge next to title */}
          <span className="ml-3 text-xs sm:text-sm font-medium text-white bg-red-600/50 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg shadow-red-500/30 border border-red-400/20">
            Registration Closed
          </span>
        </div>
        
        {/* Event information card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 mb-6 sm:mb-8"
        >
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center text-left">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Hackathon Information</span>
            </h3>
            <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-indigo-500 to-transparent mb-3 sm:mb-4"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-blue-600/30 mr-2 mt-0.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-left"><span className="text-blue-300 font-medium">Team Size:</span> 3-4 members (only from same department)</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-blue-600/30 mr-2 mt-0.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-left"><span className="text-blue-300 font-medium">Selection:</span> Selected teams will advance to main hackathon</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-blue-600/30 mr-2 mt-0.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-left"><span className="text-blue-300 font-medium">Preliminaries:</span> Prototype presentation is optional in prelims</p>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-blue-600/30 mr-2 mt-0.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-left"><span className="text-blue-300 font-medium">Presentation:</span> PPT presentation is required</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-blue-600/30 mr-2 mt-0.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-left"><span className="text-blue-300 font-medium">Refreshments:</span> Food and refreshments will be provided</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-blue-600/30 mr-2 mt-0.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-left"><span className="text-blue-300 font-medium">Judging:</span> Innovation, functionality & presentation quality</p>
                </div>
              </div>
            </div>
            
            {/* Coordinator contact information */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-indigo-500/20">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-pink-600/30 mr-2 sm:mr-3">
                  <div className="relative">
                    <span className="text-sm sm:text-lg">👁️</span>
                    <span className="absolute top-0 left-0 text-sm sm:text-lg animate-[blink_2s_ease-in-out_infinite]">😉</span>
                  </div>
                </div>
                <div>
                  <p className="text-pink-300 font-bold text-sm sm:text-lg mb-1 text-left">For more details, contact our coordinators</p>
                  
                  {/* Domain coordinators */}
                  <div className="flex flex-col gap-2">
                    {coordinators.map((coordinator, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4">
                        <div className="flex items-center">
                          <span className="text-white font-medium mr-1 sm:mr-2 text-xs sm:text-sm">Coordinator:</span> 
                          <span className="text-gray-200 text-xs sm:text-sm">{coordinator.name}</span>
                        </div>
                        <a 
                          href={`tel:${coordinator.phone}`}
                          className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-xs sm:text-sm"
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {coordinator.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration closed notice */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-red-500/20 bg-red-900/20 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-red-600/30 mr-2 sm:mr-3">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-300 font-bold text-sm sm:text-base">Registration for this hackathon has ended as of April 20, 2025</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-bl from-blue-500/20 to-transparent -z-10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-purple-500/10 to-transparent -z-10 rounded-tr-full"></div>
        </motion.div>
        
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {selectedDomain.problems.map((problem) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="p-4 sm:p-6">
                <div>
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 bg-blue-600/30 text-blue-200">
                    {problem.id}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3 text-left">{problem.title}</h4>
                  <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-blue-500 to-transparent mb-3 sm:mb-4"></div>
                  
                  <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
                    <div>
                      <h5 className="text-base sm:text-lg font-medium text-blue-300 mb-2 sm:mb-3 text-left">Problem Description</h5>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify md:text-justify">{problem.description}</p>
                    </div>
                    
                    {/* Enhanced Objectives Section */}
                    {problem.objectives && (
                      <div className="mt-4 sm:mt-6">
                        <h5 className="text-base sm:text-lg font-medium text-green-300 mb-3 sm:mb-4 flex items-center text-left">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Key Objectives</span>
                        </h5>
                        <div className="bg-gradient-to-r from-green-900/30 to-green-900/10 rounded-xl p-4 sm:p-5 border-l-4 border-green-500 shadow-lg shadow-green-900/20">
                          <ul className="space-y-2.5 sm:space-y-3.5">
                            {problem.objectives.map((objective, index) => (
                              <li key={index} className="flex items-start group">
                                <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full bg-green-600/30 mr-3 mt-0.5 group-hover:bg-green-600/50 transition-colors">
                                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-300 group-hover:text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-gray-200 text-sm sm:text-base font-medium group-hover:text-white transition-colors text-left">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Execution Steps Section */}
                    {problem.execution && (
                      <div className="mt-5 sm:mt-7">
                        <h5 className="text-base sm:text-lg font-medium text-orange-300 mb-3 sm:mb-4 flex items-center text-left">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Implementation Steps</span>
                        </h5>
                        <div className="bg-gradient-to-r from-orange-900/30 to-orange-900/10 rounded-xl p-4 sm:p-5 border-l-4 border-orange-500 shadow-lg shadow-orange-900/20">
                          <ol className="space-y-2.5 sm:space-y-3.5">
                            {problem.execution.map((step, index) => (
                              <li key={index} className="flex items-start group">
                                <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full bg-orange-600/30 mr-3 mt-0.5 group-hover:bg-orange-600/50 transition-colors">
                                  <span className="text-orange-300 font-semibold text-xs sm:text-sm group-hover:text-orange-200">{index+1}</span>
                                </div>
                                <span className="text-gray-200 text-sm sm:text-base font-medium group-hover:text-white transition-colors text-left">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 sm:mt-8 flex flex-wrap justify-center sm:justify-start">
                    {/* Registration Ended button */}
                    <button
                      disabled
                      className="w-full sm:w-auto relative overflow-hidden group px-6 py-3 sm:px-8 sm:py-4 bg-gray-600/50 text-gray-300 font-bold rounded-full transition duration-300 mb-3 sm:mb-0 text-sm sm:text-base flex items-center justify-center cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Registration Ended
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Problem card corner decorations */}
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-bl from-blue-500/20 to-transparent -z-10 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-purple-500/10 to-transparent -z-10 rounded-tr-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/5 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          DOMAINS
        </h1>
        <div className="h-px w-48 sm:w-64 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-4 sm:mt-6 mb-3 sm:mb-4"></div>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Choose a domain that interests you and explore the problem statements
        </p>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === 'domains' && renderDomainCards()}
          {viewMode === 'problems' && renderProblemsView()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProblemStatementCards;
