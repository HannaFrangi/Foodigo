import React, { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';

// Lazy load components
const SearchRecipe = lazy(() =>
  import('../components/SearchRecipe/SearchRecipe')
);
const LatestRecipe = lazy(() =>
  import('../components/LatestRecipe/LatestRecipe')
);

// Lazy load GSAP only when needed
const loadGSAP = () => import('gsap');

const Homepage = () => {
  const latestRef = useRef(null);
  const searchRef = useRef(null);
  const CarouselleRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // Lazy load GSAP and run animations
    loadGSAP().then((gsapModule) => {
      const gsap = gsapModule.default;

      // Make sure all refs are available before creating the animation
      if (!latestRef.current || !searchRef.current) return;

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' },
      });

      // Create the animation sequence
      tl.from(latestRef.current, {
        opacity: 0,
        y: 100,
        immediateRender: true,
      }).from(
        searchRef.current,
        {
          opacity: 0,
          y: 100,
          immediateRender: true,
        },
        '-=0.8'
      );

      // Only animate CarouselleRef if it exists
      if (CarouselleRef.current) {
        tl.from(
          CarouselleRef.current,
          {
            opacity: 0,
            y: 100,
            immediateRender: true,
          },
          '-=0.8'
        );
      }

      // Only animate footerRef if it exists
      if (footerRef.current) {
        tl.from(
          footerRef.current,
          {
            opacity: 0,
            y: 50,
            immediateRender: true,
          },
          '-=0.8'
        );
      }

      // Clean up function
      return () => {
        tl.kill();
      };
    });

    document.title = 'Foodigo | Home';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-grow'>
        <div ref={latestRef}>
          <Suspense fallback={<LatestRecipeSkeleton />}>
            <LatestRecipe />
          </Suspense>
        </div>

        <div ref={searchRef}>
          <Suspense fallback={<SearchRecipeSkeleton />}>
            <SearchRecipe />
          </Suspense>
        </div>

        <div ref={footerRef}>
          <Suspense fallback={<FooterSkeleton />}>
            <Footer />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

// Lightweight skeleton components
const LatestRecipeSkeleton = () => (
  <div className='animate-pulse p-8'>
    <div className='h-8 bg-gray-200 rounded w-1/3 mb-6'></div>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='bg-gray-200 h-64 rounded-lg'></div>
      ))}
    </div>
  </div>
);

const SearchRecipeSkeleton = () => (
  <div className='animate-pulse p-8'>
    <div className='h-12 bg-gray-200 rounded w-full mb-4'></div>
    <div className='h-64 bg-gray-200 rounded'></div>
  </div>
);

const FooterSkeleton = () => (
  <div className='animate-pulse bg-gray-800 p-12'>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='space-y-4'>
          <div className='h-6 bg-gray-600 rounded w-1/2'></div>
          <div className='space-y-2'>
            <div className='h-4 bg-gray-600 rounded w-3/4'></div>
            <div className='h-4 bg-gray-600 rounded w-1/2'></div>
            <div className='h-4 bg-gray-600 rounded w-2/3'></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Lazy load Footer component
const Footer = lazy(() =>
  Promise.resolve({
    default: () => (
      <footer className='bg-olive text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {/* About Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-bold tracking-wide uppercase'>
                About Us
              </h3>
              <p className='text-white-400 leading-relaxed'>
                Discover delicious recipes and cooking inspiration for every
                meal, crafted with love for food enthusiasts worldwide. They Not
                Like us.
              </p>
            </div>

            {/* Quick Links */}
            <div className='space-y-4'>
              <h3 className='text-lg font-bold tracking-wide uppercase'>
                Quick Links
              </h3>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-white transition-colors duration-200'>
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-white transition-colors duration-200'>
                    Popular Recipes
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-white transition-colors duration-200'>
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-white transition-colors duration-200'>
                    Submit Recipe
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-bold tracking-wide uppercase'>
                Connect With Us
              </h3>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-slate-400 transition-colors duration-200 flex items-center gap-2'>
                    <span className='w-5 h-5 inline-block'>
                      <svg
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        className='w-5 h-5'>
                        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                      </svg>
                    </span>
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-slate-400 transition-colors duration-200 flex items-center gap-2'>
                    <span className='w-5 h-5 inline-block'>
                      <svg
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        className='w-5 h-5'>
                        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                      </svg>
                    </span>
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-white-400 hover:text-slate-400 transition-colors duration-200 flex items-center gap-2'>
                    <span className='w-5 h-5 inline-block'>
                      <svg
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        className='w-5 h-5'>
                        <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                      </svg>
                    </span>
                    X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    ),
  })
);

export default Homepage;
