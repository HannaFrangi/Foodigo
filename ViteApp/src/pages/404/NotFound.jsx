import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { gsap } from 'gsap';

const Error = () => {
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const numbersRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      errorRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    ).fromTo(
      numbersRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.3'
    );
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-white-900 p-4'>
      <div
        ref={errorRef}
        className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all hover:scale-[1.02]'>
        <div
          ref={numbersRef}
          className='text-9xl font-bold text-[#5d6544] mb-4'>
          404
        </div>
        <h2 className='text-3xl text-gray-800 mb-4'>Page Not Found</h2>
        <p className='text-gray-600 mb-6'>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className='bg-[#5d6544] text-white py-3 px-6 rounded-full flex items-center justify-center space-x-2 mx-auto transition-all duration-300 hover:bg-[#4a5336] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5d6544]'>
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default Error;
