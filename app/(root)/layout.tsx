"use client";
import Sidebar from '@/components/shared/Sidebar'

import React from 'react'
import { usePathname } from 'next/navigation'; 
import MobileNav from '@/components/shared/MobileNav';
 const Layout = ({ children }: {children: React.ReactNode}) => {
  const pathname = usePathname();
  // Hide the sidebar on the home page ("/")
  const showSidebar = pathname !== '/';
  console.log("pathname ",pathname);
  // useEffect(() => {
  //   console.log("Client-side render (hydration)");
  // }, []); 
  return (
    <main className='root'>
      {showSidebar && (
      <div>
        <Sidebar/>
        <MobileNav/>
      </div>
      
      )}
      {/* <Sidebar/>
      <MobileNav/> */}
            <div className='root-container'>
                <div className='wrapper'>
                {children}
                </div>
            </div>
           
        </main>
  )
}
export default Layout