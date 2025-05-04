import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Home = () => {
  const mountRef = useRef(null);
  const [prizeCount, setPrizeCount] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [showBrochure, setShowBrochure] = useState(false);
  const [brochureLoaded, setBrochureLoaded] = useState(false);
  const [buttonTextIndex, setButtonTextIndex] = useState(0); 
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState({
    prizes: false,
    problems: false
  });
  
  // Detect touch device
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        window.matchMedia("(hover: none)").matches
      );
    };
    
    detectTouch();
    window.addEventListener('resize', detectTouch);
    
    return () => window.removeEventListener('resize', detectTouch);
  }, []);
  
  // Button text alternating effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setButtonTextIndex(prev => prev === 0 ? 1 : 0);
    }, 4000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.25
    };
    
    const prizeObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isVisible.prizes) {
        setIsVisible(prev => ({ ...prev, prizes: true }));
      }
    }, observerOptions);
    
    const problemObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isVisible.problems) {
        setIsVisible(prev => ({ ...prev, problems: true }));
      }
    }, observerOptions);
    
    const prizeSection = document.getElementById('prizes');
    const problemSection = document.getElementById('problems');
    
    if (prizeSection) prizeObserver.observe(prizeSection);
    if (problemSection) problemObserver.observe(problemSection);
    
    return () => {
      if (prizeSection) prizeObserver.unobserve(prizeSection);
      if (problemSection) problemObserver.unobserve(problemSection);
    };
  }, [isVisible.prizes, isVisible.problems]); // Added missing dependencies
  
  // Counting animation effect
  useEffect(() => {
    if (!isVisible.prizes && !isVisible.problems) return;
    
    const prizeDuration = 2000;
    const prizeIncrement = 400;
    const problemDuration = 1500;
    
    let prizeTimer, problemTimer;
    
    if (isVisible.prizes) {
      prizeTimer = setInterval(() => {
        setPrizeCount(prev => {
          if (prev < 20000) {
            return Math.min(prev + prizeIncrement, 20000);
          }
          clearInterval(prizeTimer);
          return 20000;
        });
      }, (prizeDuration / (20000/prizeIncrement)));
    }
    
    if (isVisible.problems) {
      problemTimer = setInterval(() => {
        setProblemCount(prev => {
          if (prev < 8) {
            return prev + 1;
          }
          clearInterval(problemTimer);
          return 8;
        });
      }, problemDuration / 8);
    }
    
    return () => {
      if (prizeTimer) clearInterval(prizeTimer);
      if (problemTimer) clearInterval(problemTimer);
    };
  }, [isVisible.prizes, isVisible.problems]); // Added missing dependencies

  // Three.js Particle Effect - with mobile optimization
  useEffect(() => {
    // Simplify particle system for mobile
    const isMobile = window.innerWidth < 768 || isTouchDevice;
    const particleCount = isMobile ? 1000 : 2000; // Fewer particles on mobile
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer;
    
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
        antialias: !isMobile // Disable antialiasing on mobile for performance
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1) : window.devicePixelRatio);
      
      const mountRefCurrent = mountRef.current;
      if (mountRefCurrent) {
        mountRefCurrent.appendChild(renderer.domElement);
      }

      // Particle System
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * (isMobile ? 1500 : 2500);
        positions[i + 1] = (Math.random() - 0.5) * (isMobile ? 1500 : 2500);
        positions[i + 2] = (Math.random() - 0.5) * (isMobile ? 1500 : 2500);
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = 1.0;
      }

      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 3 : 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      camera.position.z = isMobile ? 800 : 1200;

      // Animation - slower rotation on mobile to avoid motion sickness
      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (particleSystem) {
          particleSystem.rotation.y += isMobile ? 0.0007 : 0.0015;
          particleSystem.rotation.x += isMobile ? 0.0003 : 0.0005;
        }
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const isMobileView = window.innerWidth < 768;
        camera.position.z = isMobileView ? 800 : 1200;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(isMobileView ? Math.min(window.devicePixelRatio, 1) : window.devicePixelRatio);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        
        if (mountRefCurrent && renderer.domElement && mountRefCurrent.contains(renderer.domElement)) {
          mountRefCurrent.removeChild(renderer.domElement);
        }
        
        if (particleSystem) {
          if (particleSystem.geometry) particleSystem.geometry.dispose();
          if (particleSystem.material) particleSystem.material.dispose();
        }
        scene.clear();
        if (renderer) renderer.dispose();
      };
    } catch (error) {
      console.error("Three.js error:", error);
      // Fallback for devices that don't support WebGL well
      const mountRefCurrent = mountRef.current;
      if (mountRefCurrent) {
        mountRefCurrent.innerHTML = '<div class="fixed inset-0 -z-1 bg-gradient-to-br from-black via-gray-900 to-black"></div>';
      }
      return () => {
        if (mountRefCurrent) {
          mountRefCurrent.innerHTML = '';
        }
      };
    }
  }, [isTouchDevice]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex flex-col justify-start px-4 pt-4 sm:pt-6 md:pt-16">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center space-y-8 sm:space-y-5"> {/* Increased base spacing */}
            {/* College Logo and Name - Increased size */}
            <div className="mb-16 sm:mb-4 md:mb-6"> {/* Increased bottom margin on mobile */}
              <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-3 md:space-x-4">
                <img 
                  src="/image/logo.png" 
                  alt="Kongu Engineering College Logo" 
                  className="h-16 sm:h-14 md:h-20 lg:h-22 object-contain" // Increased mobile size
                />
                <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 tracking-wide">
                  Kongu Engineering College
                </h2>
              </div>
            </div>
            
            {/* DevForge heading and presents by - Added more spacing */}
            <div className="mt-16 sm:mt-4"> {/* Increased top margin on mobile */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight animate-gradient">
                DevForge
              </h1>
              
              {/* "presents by" text */}
              <div className="text-center mb-6 sm:mb-4">
                <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light">
                  <span className="italic">presented by</span>
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-blue-400 px-4">
                  Department of Information Technology
                </p>
              </div>
            </div>
            
            {/* 30 hrs Hackathon badge - Increased spacing */}
            <div className="mt-12 sm:mt-4"> {/* Increased gap before hackathon badge */}
              <div className="inline-block bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2 sm:py-3 border border-blue-800/40 shadow-lg shadow-blue-900/20">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold animate-pulse">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">30 hrs</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 ml-2">Hackathon</span>
                </h2>
              </div>
            </div>
            
            {/* Organization byline - Increased spacing */}
            <div className="relative mx-auto max-w-3xl mt-12 sm:mt-6"> {/* Increased gap before organization */}
              <p className="text-base sm:text-lg text-gray-300 font-light mb-1 sm:mb-2 animate-typing">
                Organized by
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-blue-300 font-medium px-2 sm:px-4 leading-relaxed">
               IT Association & IT Coding Club
              </p>
            </div>
            
            {/* Motto - Adjusted spacing */}
            <div className="py-6 sm:py-4 md:py-6 mt-8 sm:mt-4">
              <p className="text-xl sm:text-2xl md:text-3xl text-blue-400 font-light tracking-wider leading-relaxed animate-gradient px-2">
                <span className="font-medium">Forge</span> Your Vision · <span className="font-medium">Code</span> The Future · <span className="font-medium">Build</span> With Passion
              </p>
            </div>
            
            {/* CTA Buttons - Increased gap between buttons on mobile */}
            <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-4 py-8 sm:py-6 md:py-8 mt-8 sm:mt-4">
              <button 
                onClick={() => setShowBrochure(true)}
                className={`group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 ${isTouchDevice ? 'mobile-glow animate-mobile-pulse' : 'hover:shadow-xl hover:shadow-blue-500/20'}`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  See Brochure 
                </span>
                <span className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-400 ${isTouchDevice ? 'opacity-10' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'}`}></span>
                
                {/* Add mobile feedback particles */}
                {isTouchDevice && (
                  <div className="absolute inset-0 opacity-0 active:opacity-30 overflow-hidden rounded-full pointer-events-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white mobile-particle"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          '--delay': `${Math.random() * 1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </button>
              
              <a 
                href="https://kongu.edu/itpark360/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group relative px-5 py-3 sm:px-8 md:px-10 bg-transparent border-2 border-blue-500 text-blue-100 font-semibold rounded-full overflow-hidden transition-all duration-500 transform hover:scale-105 hover:text-white active:scale-95 ${isTouchDevice ? 'animate-mobile-glow' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setButtonTextIndex(prev => prev === 0 ? 1 : 0);
                  window.open("https://kongu.edu/itpark360/", "_blank");
                }}
              >
                {/* Content wrapper - simplified for better reliability */}
                <div className="relative z-10 w-full flex items-center justify-center">
                  {/* Desktop version with VR blinking */}
                  <div className="hidden md:flex items-center justify-center space-x-2">
                    {buttonTextIndex === 0 ? (
                      <>
                        <svg className="w-5 h-5 text-cyan-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="whitespace-nowrap font-bold text-shadow">Visit Our Department</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-purple-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="whitespace-nowrap font-bold text-shadow">Experience Our <span className="text-purple-300 animate-pulse">VR</span></span>
                      </>
                    )}
                  </div>
                  
                  {/* Mobile version with VR blinking */}
                  <div className="flex md:hidden items-center justify-center space-x-2">
                    {buttonTextIndex === 0 ? (
                      <>
                        <svg className="w-5 h-5 text-cyan-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="whitespace-nowrap text-base font-bold text-shadow">Visit our Department</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-purple-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="whitespace-nowrap text-base font-bold text-shadow">Experience our <span className="text-purple-300 animate-pulse">VR</span></span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Enhanced gradient background with better contrast */}
                <span className={`absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-800/90 to-purple-900/90 ${isTouchDevice ? 'opacity-20' : 'opacity-0 group-hover:opacity-95 transition-opacity duration-300'}`}></span>
                
                {/* Improved glow effect */}
                <span className={`absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-md transition-all duration-500 ${isTouchDevice ? 'opacity-30 animate-mobile-pulse' : 'opacity-0 group-hover:opacity-60 group-hover:animate-pulse'}`}></span>
                
                {/* Moving particles effect */}
                <div className={`absolute inset-0 overflow-hidden rounded-full ${isTouchDevice ? 'opacity-15' : 'opacity-0 group-hover:opacity-30'}`}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full bg-white ${isTouchDevice ? 'mobile-particle' : 'animate-particle-float'}`}
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${Math.random() * 3 + 2}s`
                      }}
                    ></div>
                  ))}
                </div>
              </a>
              
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - Fixed Responsiveness */}
      <section id="timeline" className="relative z-10 py-20 md:py-28 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto text-center mb-12 md:mb-20">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-gradient">
            Event Timeline
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Mark your calendar for our upcoming hackathon journey — from registration to the grand finale.
          </p>
        </div>
        
        <div className="relative">
          {/* Center line - now visible on all devices */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded opacity-70"></div>
          
          <div className="space-y-12 md:space-y-24">
            {/* Registration Deadline - Updated to show completed */}
            <div className="relative flex flex-col sm:flex-row items-start md:items-center">
              <div className="absolute left-4 top-6 md:left-1/2 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-700 rounded-full border-4 border-black shadow-lg shadow-green-500/50 z-10 flex items-center justify-center">
                {/* Added check mark to show completed */}
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div className="pl-12 md:pl-0 w-full md:w-1/2 md:pr-8 md:text-right">
                <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-green-500/10 hover:border-green-900/30 transition-all duration-300">
                  <span className="inline-block px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm mb-3">COMPLETED</span>
                  <h4 className="text-2xl font-semibold text-green-400 mb-2">April 20, 2025</h4>
                  <p className="text-gray-300">Registration deadline has passed - All entries are now closed.</p>
                </div>
              </div>
              
              <div className="hidden md:block md:w-1/2"></div>
            </div>

            {/* Prelims */}
            <div className="relative flex flex-col sm:flex-row items-start md:items-center">
              <div className="absolute left-4 top-6 md:left-1/2 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-full border-4 border-black shadow-lg shadow-cyan-500/50 z-10"></div>
              
              <div className="hidden md:block md:w-1/2"></div>
              
              <div className="pl-12 w-full md:w-1/2 md:pl-8 text-left">
                <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-900/30 transition-all duration-300">
                  <span className="inline-block px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded-full text-sm mb-3">PRELIMS</span>
                  <h4 className="text-2xl font-semibold text-cyan-400 mb-2">April 23, 2025</h4>
                  <p className="text-gray-300">Preliminary rounds to qualify for the main hackathon event</p>
                </div>
              </div>
            </div>

            {/* Day 1 */}
            <div className="relative flex flex-col sm:flex-row items-start md:items-center">
              <div className="absolute left-4 top-6 md:left-1/2 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full border-4 border-black shadow-lg shadow-blue-500/50 z-10"></div>
              
              <div className="pl-12 md:pl-0 w-full md:w-1/2 md:pr-8 md:text-right">
                <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 shadow-lg">
                  <span className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm mb-3">DAY 1</span>
                  <h4 className="text-2xl font-semibold text-blue-400 mb-2">May 2, 2025 - 9:00 AM</h4>
                  <p className="text-gray-300">Kickoff & Team Formation - Let the 30-hour coding marathon begin!</p>
                </div>
              </div>
              
              <div className="hidden md:block md:w-1/2"></div>
            </div>

            {/* Day 2 */}
            <div className="relative flex flex-col sm:flex-row items-start md:items-center">
              <div className="absolute left-4 top-6 md:left-1/2 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full border-4 border-black shadow-lg shadow-purple-500/50 z-10"></div>
              
              <div className="hidden md:block md:w-1/2"></div>
              
              <div className="pl-12 w-full md:w-1/2 md:pl-8 text-left">
                <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 shadow-lg">
                  <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm mb-3">DAY 2</span>
                  <h4 className="text-2xl font-semibold text-purple-400 mb-2">May 3, 2025 - 3:00 PM</h4>
                  <p className="text-gray-300">Submission Deadline & Project Demonstrations</p>
                </div>
              </div>
            </div>

            {/* Finale */}
            <div className="relative flex flex-col sm:flex-row items-start md:items-center">
              <div className="absolute left-4 top-6 md:left-1/2 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-pink-500 to-pink-700 rounded-full border-4 border-black shadow-lg shadow-pink-500/50 z-10"></div>
              
              <div className="pl-12 md:pl-0 w-full md:w-1/2 md:pr-8 md:text-right">
                <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 shadow-lg">
                  <span className="inline-block px-3 py-1 bg-pink-900/50 text-pink-300 rounded-full text-sm mb-3">FINALE</span>
                  <h4 className="text-2xl font-semibold text-pink-400 mb-2">May 3, 2025 - 4:00 PM</h4>
                  <p className="text-gray-300">Awards Ceremony - ₹20,000 Prize Pool Distribution</p>
                </div>
              </div>
              
              <div className="hidden md:block md:w-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* Venue Section - Corrected spelling and improved formatting */}
        <div className="max-w-5xl mx-auto mt-20 md:mt-28 text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-900/40 to-blue-900/40 backdrop-blur-sm rounded-xl px-6 py-6 border border-indigo-800/40 shadow-lg shadow-indigo-900/20">
            <h4 className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
              Venue
            </h4>
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl md:text-2xl text-blue-300 font-medium">
                Srinivasan Ramanujam Seminar Hall
              </p>
              <p className="text-lg md:text-xl text-gray-300 mt-1">
                IT Park, Kongu Engineering College
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Section with enhanced glowing hover */}
      <section id="prizes" className="relative z-10 py-16 md:py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 animate-gradient">
              Prize Pool
            </h3>
            
            <div className="group inline-block bg-gradient-to-r from-yellow-600/30 via-pink-600/30 to-purple-600/30 p-1 rounded-xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 touch-glow hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:-translate-y-1">
              <div className="bg-black border border-yellow-500/20 rounded-lg px-10 py-6 shadow-xl shadow-yellow-500/5 group-hover:border-pink-500/50 transition-all duration-300">
                <h4 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse">
                  ₹{prizeCount.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Background particles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {Array.from({ length: isTouchDevice ? 8 : 15 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full bg-yellow-500/20 ${isTouchDevice ? 'mobile-particle' : 'animate-float'}`}
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                '--delay': `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </section>
      
      {/* Problem Statement Section with mobile glow */}
      <section id="problems" className="relative z-10 py-16 md:py-20 px-4 bg-gradient-to-b from-black to-gray-900/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 animate-gradient">
              Problem Statements
            </h3>
            
            <div className="inline-block bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-indigo-600/30 p-1 rounded-xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 touch-glow">
              <div className="bg-black border border-blue-500/20 rounded-lg px-14 py-8 shadow-xl shadow-blue-500/5">
                <h4 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
                  {problemCount}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-500/20 animate-float"
              style={{
                width: `${Math.random() * 25 + 8}px`,
                height: `${Math.random() * 25 + 8}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 12}s`
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* Brochure Modal - Improved for mobile and visibility */}
      {showBrochure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full h-[85vh] md:h-[90vh] max-w-3xl md:max-w-4xl bg-gray-900/80 rounded-lg shadow-2xl border border-blue-900/30 overflow-hidden">
            {/* Close button - Enhanced for mobile */}
            <button 
              onClick={() => setShowBrochure(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-red-600 hover:bg-red-700 text-white w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
              aria-label="Close brochure"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Loading indicator */}
            {!brochureLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            )}
            
            {/* Scrollable container with pinch zoom for mobile */}
            <div className="w-full h-full overflow-auto p-2 md:p-4 overscroll-contain">
              <div className="min-h-full flex items-center justify-center">
                <img 
                  src="/image/dai.png" 
                  alt="Hackathon Brochure" 
                  className={`w-full h-auto object-contain transition-opacity duration-300 ${brochureLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ maxHeight: 'none' }} /* Allows image to display at full height */
                  onLoad={() => setBrochureLoaded(true)}
                />
              </div>
            </div>

            {/* Image viewing instructions */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-black/70 text-gray-300 text-xs md:text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                <span className="hidden sm:inline">Scroll to view full brochure</span>
                <span className="inline sm:hidden">Pinch to zoom, swipe to scroll</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

<style jsx>{`
  .text-shadow {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  }
  
  /* Touch-specific glow effect for mobile */
  @media (hover: none) {
    .touch-glow:active {
      transform: scale(1.05);
      box-shadow: 0 0 30px rgba(236, 72, 153, 0.7);
      transition: box-shadow 0.3s, transform 0.3s;
    }
  }
  
  /* Animated glow for prize hover */
  @keyframes prize-glow {
    0% {
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
    }
    50% {
      box-shadow: 0 0 35px rgba(236, 72, 153, 0.8);
    }
    100% {
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
    }
  }
  
  .group:hover .prize-glow-effect {
    animation: prize-glow 2s infinite;
  }
`}</style>
