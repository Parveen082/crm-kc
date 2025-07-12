'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPanelHome() {
  const router = useRouter();

  return (
    <div className=" bg-gradient-to-br from-indigo-50 to-blue-50 ">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 md:p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome Back, <span className="text-yellow-300">Admin!</span>
          </h1>
          <p className="text-purple-100 text-lg">
            Your control center for managing the entire platform
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Welcome Message */}
          <div className="text-center">
            <div className="inline-block p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 ">
              You have full administrative privileges
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage users, content, and platform settings with powerful tools designed for efficiency.
            </p>
          </div>

          {/* Admin Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold rounded-full shadow-md transform hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Admin Mode Activated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}