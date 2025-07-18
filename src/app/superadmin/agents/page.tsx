'use client';

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  // State for controlling the 'Add Agent' modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for controlling the 'Delete Agent' confirmation modal visibility
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // State to hold the agent's name and email for the delete confirmation
  const [agentToDelete, setAgentToDelete] = useState<{ Agentname: string; AgentMail: string } | null>(null);
  // State for form data when adding a new agent
  const [formData, setFormData] = useState({
    Agentname: '',
    AgentMail: '',
    AgentPassword: '',
  });
  // State to store the list of agents fetched from the API
  const [agents, setAgents] = useState([]);
  // State to store the authentication token, initialized to null
  const [token, setToken] = useState<string | null>(null);
  // State to manage loading status when fetching agents
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to retrieve the authentication token from localStorage
  // This runs only on the client-side after the component mounts, preventing hydration errors.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to fetch agents from the API
  const fetchAgents = async () => {
    // If token is not yet available, set loading to false and return
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true); // Set loading to true before fetching
    try {
      const res = await fetch('https://keshvacredit.com/api/v1/agent/getAgents', {
        headers: { Authorization: `Bearer ${token}` }, // Include the authentication token
      });
      const data = await res.json();
      if (res.ok) {
        setAgents(data); // Update agents state with fetched data
      } else {
        toast.error(data.message || 'Error fetching agents'); // Display error message
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Error fetching agents'); // Display generic error message
    } finally {
      setIsLoading(false); // Set loading to false after fetch attempt
    }
  };

  // useEffect hook to call fetchAgents whenever the token changes (i.e., when it's loaded from localStorage)
  useEffect(() => {
    fetchAgents();
  }, [token]); // Dependency on 'token' ensures fetching happens after token is set

  // Handler for input changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler for submitting the 'Add Agent' form
  const handleSubmit = async () => {
    if (!token) {
      toast.error('Authentication token is missing.');
      return;
    }

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/create/agent', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Agent created successfully!'); // Success notification
        setIsModalOpen(false); // Close the modal
        setFormData({ Agentname: '', AgentMail: '', AgentPassword: '' }); // Reset form
        fetchAgents(); // Refresh the agents list
      } else {
        toast.error(result.message || 'Failed to create agent.'); // Error notification
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Something went wrong.'); // Generic error for network issues
    }
  };

  // Handler for the delete button click, opens the confirmation modal
  const handleDeleteClick = (Agentname: string, AgentMail: string) => {
    setAgentToDelete({ Agentname, AgentMail }); // Store agent info for deletion
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  // Handler for confirming the deletion in the modal
  const confirmDelete = async () => {
    if (!agentToDelete || !token) {
      toast.error('Invalid delete request or token missing.');
      setIsConfirmModalOpen(false);
      return;
    }

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/delete/agent', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentToDelete), // Send agent details for deletion
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Agent deleted successfully!'); // Success notification
        fetchAgents(); // Refresh the agents list
      } else {
        toast.error(result.message || 'Failed to delete agent'); // Error notification
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Error deleting agent'); // Generic error for network issues
    } finally {
      setIsConfirmModalOpen(false); // Close the confirmation modal
      setAgentToDelete(null); // Clear agent to delete
    }
  };

  // Handler for canceling the deletion in the modal
  const cancelDelete = () => {
    setIsConfirmModalOpen(false); // Close the confirmation modal
    setAgentToDelete(null); // Clear agent to delete
  };

  // Function to generate avatar initials from an agent's name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2); // Take up to the first two initials
  };

  return (
    // Main container div with responsive padding and Inter font
    <div className="p-4 sm:p-6 max-w-7xl mx-auto font-inter">
    

      {/* Page title */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Agent Management</h1>

      {/* Button to open the 'Add Agent' modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-sm font-semibold py-2 px-4 sm:px-6 rounded-lg mb-6 sm:mb-8 shadow-lg transition-all duration-300"
      >
        + Add Agent
      </button>

      {/* Conditional rendering based on loading state */}
      {isLoading ? (
        <div className="text-center text-gray-600 py-6">Loading agents...</div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Conditional rendering based on whether agents are found */}
          {agents.length > 0 ? (
            agents.map((agent: any, index: number) => (
              <div key={agent._id} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                {/* Agent numbering */}
                <span className="text-lg sm:text-2xl font-bold text-gray-700 w-10 sm:w-12 mb-2 sm:mb-0 shrink-0">
                  {index + 1}.
                </span>
                {/* Agent card */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {/* Agent avatar with initials */}
                      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg sm:text-xl font-semibold">
                        {getInitials(agent.Agentname)}
                      </div>
                      {/* Agent details (email and name) */}
                      <div className="text-center sm:text-left">
                        <p className="text-sm text-gray-500 truncate">{agent.AgentMail}</p>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{agent.Agentname}</h2>
                      </div>
                    </div>
                    {/* Delete agent button */}
                    <button
                      onClick={() => handleDeleteClick(agent.Agentname, agent.AgentMail)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs font-medium shadow-md transition-colors duration-200 self-end sm:self-center"
                    >
                      {/* Delete icon (SVG) */}
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
            ))
          ) : (
            // Message displayed when no agents are found
            <div className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-md w-full">
              No agents found.
            </div>
          )}
        </div>
      )}

      {/* Add Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Add New Agent
            </h2>

            {/* Input fields for agent details */}
            <input
              type="text"
              name="Agentname"
              placeholder="Agent Name"
              value={formData.Agentname}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
            <input
              type="email"
              name="AgentMail"
              placeholder="Agent Email"
              value={formData.AgentMail}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
            <input
              type="password" 
              name="AgentPassword"
              placeholder="Agent Password"
              value={formData.AgentPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />

            {/* Action buttons for the modal */}
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

      {/* Confirmation Modal for deleting an agent */}
      {isConfirmModalOpen && agentToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete agent <span className="font-semibold">"{agentToDelete.Agentname}"</span>?
              This action cannot be undone.
            </p>
            {/* Action buttons for the confirmation modal */}
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
