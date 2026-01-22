'use client';

import HomeContent from './home-content';
interface HeaderProps {
  currentView: 'home' | 'projects' | 'categories' | 'freeprojects';
  setCurrentView: (view: 'home' | 'projects' | 'categories' | 'freeprojects') => void;
}
export default function ParentComponent({currentView, setCurrentView}: HeaderProps) {
  return (
    <div>
      <HomeContent 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
    </div>
  );
}


