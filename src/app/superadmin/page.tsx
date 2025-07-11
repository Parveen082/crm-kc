'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPanelHome() {
  const router = useRouter();
  
  return (
    <div className="rounded-3xl flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className=" w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-10 space-y-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">
            🚀 Welcome <span className="text-purple-600">Dixit Asija sir</span>!
          </h1>
          <p className="text-lg text-gray-600">
            You’ve made it! You’re officially the king of this digital empire. Welcome to the <span className="font-semibold text-blue-600">Admin Panel</span>, where you get to make all the important decisions.!
          </p>
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full shadow-md animate-pulse">
            Admin Mode: Engaged 🔐
          </span>
          <div className="mt-10 bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-6 border border-dashed border-purple-300 shadow-inner text-left space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-purple-600">🛠 What You Can Do as the Big Boss:</h2>
            <ul className="list-disc list-inside text-lg space-y-2">
              <li>✅ Say goodbye to spreadsheets, now you get the numbers in real time!</li>
              <li>✅ Put on your superhero cape and manage all services.</li>
              <li>✅ Respond to user questions (because you’re the best at solving problems, obviously).</li>
              <li>✅ Keep track of the platform’s growth without needing a magnifying glass.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}