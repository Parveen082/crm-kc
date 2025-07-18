"use client";
import React from 'react';

function Page() {
  return (
    <div className="  flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <h1 className="text-4xl font-bold text-white">Hello</h1>
          <p className="text-blue-100 mt-2">Welcome to this website user page </p>
        </div>
      </div>
    </div>
  );
}

export default Page;