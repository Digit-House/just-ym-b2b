import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '@/components/Header';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header/>
      <main className="flex-1 ml-64 transition-all duration-300 ease-in-out p-8 mt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
