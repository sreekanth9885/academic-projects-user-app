'use client';

import { useState } from 'react';
import Header from './components/Header';
import HomeContent from './components/ui/HomeContent';
import ProjectsContent from './components/ui/ProjectsContent';
import CategoriesContent from './components/ui/CategoriesContent';
import FreeProjectsContent from './components/ui/FreeProjectsContent';

export default function LayoutWrapper() {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'categories' | 'freeprojects'>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeContent />;
      case 'projects':
        return <ProjectsContent />;
      case 'categories':
        return <CategoriesContent />;
      case 'freeprojects':
        return <FreeProjectsContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <>
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="pt-20">
        {renderContent()}
      </main>
    </>
  );
}