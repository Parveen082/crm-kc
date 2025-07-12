"use client";
import React from "react";
import { HardHat } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="p-6  bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <div className="max-w-3xl mx-auto bg-white border border-yellow-200 rounded-xl shadow-lg p-8 mt-12 text-center space-y-4">
        <div className="flex items-center justify-center text-yellow-600 mb-4">
          <HardHat className="w-10 h-10 mr-2" />
          <h1 className="text-3xl font-bold">Users Page</h1>
        </div>

        <p className="text-lg text-yellow-700 font-medium">
          🚧 This section is currently under construction.
        </p>
        <p className="text-sm text-yellow-600">
          We're working hard to bring this feature to you. Please check back soon!
        </p>

        <div className="pt-6">
          <span className="inline-block text-xs text-yellow-400">
            © {new Date().getFullYear()} KeshvaCredit. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
