'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from './components/Header';
import HomeContent from './components/ui/HomeContent';
import ProjectsContent from './components/ui/ProjectsContent';
import CategoriesContent from './components/ui/CategoriesContent';
import FreeProjectsContent from './components/ui/FreeProjectsContent';

// Create a wrapper component that uses useSearchParams
function LayoutWrapperContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'categories' | 'freeprojects'>('home');

  // Get view from URL params
  useEffect(() => {
    const view = searchParams.get('view') as 'home' | 'projects' | 'categories' | 'freeprojects';
    if (view && ['home', 'projects', 'categories', 'freeprojects'].includes(view)) {
      setCurrentView(view);
    } else {
      setCurrentView('home');
    }
  }, [searchParams]);

  // Function to update view and URL
  const handleSetCurrentView = (view: 'home' | 'projects' | 'categories' | 'freeprojects') => {
    setCurrentView(view);
    
    // Update URL without page reload
    if (view === 'home') {
      router.push('/'); // Root path for home
    } else {
      router.push(`/?view=${view}`);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeContent currentView={currentView} setCurrentView={handleSetCurrentView} />;
      case 'projects':
        return <ProjectsContent/>;
      case 'categories':
        return <CategoriesContent/>;
      case 'freeprojects':
        return <FreeProjectsContent/>;
      default:
        return <HomeContent currentView={currentView} setCurrentView={handleSetCurrentView} />;
    }
  };

  return (
    <>
      <Header currentView={currentView} setCurrentView={handleSetCurrentView} />
      <main className="pt-20">
        {renderContent()}
      </main>
    </>
  );
}

// Main wrapper with Suspense
export default function LayoutWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LayoutWrapperContent />
    </Suspense>
  );
}