'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Membername: '',
    MemberMail: '',
    MemberPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No token found in localStorage.');
      return;
    }

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/create/member', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('User created successfully!');
        setIsModalOpen(false);
        setFormData({ Membername: '', MemberMail: '', MemberPassword: '' });
      } else {
        toast.error(result.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Member Management</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Member
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-black">Add New Member</h2>

            <input
              type="text"
              name="Membername"
              placeholder="Member name"
              value={formData.Membername}
              onChange={handleChange}
              className="w-full border text-black p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="MemberMail"
              placeholder="Member Email"
              value={formData.MemberMail}
              onChange={handleChange}
              className="w-full border text-black p-2 mb-3 rounded"
            />
            <input
              type="MemberPassword"
              name="MemberPassword"
              placeholder="Member Password"
              value={formData.MemberPassword}
              onChange={handleChange}
              className="w-full border text-black p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
