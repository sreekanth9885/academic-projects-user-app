'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import HomeContent from './components/ui/HomeContent';
import ProjectsContent from './components/ui/ProjectsContent';
import CategoriesContent from './components/ui/CategoriesContent';
import FreeProjectsContent from './components/ui/FreeProjectsContent';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LayoutWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'categories' | 'freeprojects'>('home');
  useEffect(() => {
    const view = searchParams.get('view') as 'home' | 'projects' | 'categories' | 'freeprojects';
    if (view && ['home', 'projects', 'categories', 'freeprojects'].includes(view)) {
      setCurrentView(view);
    } else {
      setCurrentView('home');
    }
  }, [searchParams]);
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
        return <ProjectsContent />;
      case 'categories':
        return <CategoriesContent />;
      case 'freeprojects':
        return <FreeProjectsContent />;
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