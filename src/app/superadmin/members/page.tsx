'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Membername: '',
    MemberMail: '',
    MemberPassword: '',
  });
  const [members, setMembers] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchMembers = async () => {
    try {
      const res = await fetch('https://keshvacredit.com/api/v1/member/getMamber', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMembers(data);
    } catch {
      toast.error('Error fetching members');
    }
  };

useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    }
  };

  fetchMembers();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error('No token found in localStorage.');
      return;
    }

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/create/member', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Partner created successfully!');
        setIsModalOpen(false);
        setFormData({ Membername: '', MemberMail: '', MemberPassword: '' });
        fetchMembers();
      } else {
        toast.error(result.message || 'Failed to create user.');
      }
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const handleDelete = async (Membername: string, MemberMail: string) => {
    if (!confirm(`Delete member "${Membername}"?`)) return;

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/delete/member', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Membername, MemberMail }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Member deleted successfully!');
        fetchMembers();
      } else {
        toast.error(result.message || 'Failed to delete member');
      }
    } catch {
      toast.error('Error deleting member');
    }
  };

  // Function to generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Partner Management</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-sm font-semibold py-2 px-4 sm:px-6 rounded-lg mb-6 sm:mb-8 shadow-lg transition-all duration-300"
      >
        + Add Partner
      </button>

      <div className="space-y-4 sm:space-y-6">
        {members.map((member: any, index: number) => (
          <div key={member._id} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-lg sm:text-2xl font-bold text-gray-700 w-10 sm:w-12 mb-2 sm:mb-0 shrink-0">
              {index + 1}.
            </span>
            <div className="flex-1 bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg sm:text-xl font-semibold">
                    {getInitials(member.Membername)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 truncate">{member.MemberMail}</p>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{member.Membername}</h2>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(member.Membername, member.MemberMail)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs font-medium shadow-md transition-colors duration-200 self-end sm:self-center"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-md w-full">
            No members found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Add New Partner
            </h2>

            <input
              type="text"
              name="Membername"
              placeholder="Partner Name"
              value={formData.Membername}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
            <input
              type="email"
              name="MemberMail"
              placeholder="Partner Email"
              value={formData.MemberMail}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
            <input
              type="text"
              name="MemberPassword"
              placeholder="Partner Password"
              value={formData.MemberPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}