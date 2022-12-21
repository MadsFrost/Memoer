import React from 'react'
import Navigation from '../Navigation';

export interface LayoutProps {
    children: React.ReactNode | React.ReactNode[];
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`
          min-w-screen min-h-screen flex flex-col
        `}>
      <div className="h-full min-w-min">
          <Navigation />
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}

export default Layout