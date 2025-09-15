'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Users, Calendar, Trophy, MapPin } from 'lucide-react';

export default function AcademyManagementPage() {
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contactEmail: '',
    contactPhone: ''
  });

  // Load academies on component mount
  useEffect(() => {
    loadAcademies();
  }, []);

  const loadAcademies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/academy_management');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load academies');
      }
      
      setAcademies(data.academies || []);
    } catch (err) {
      console.error('Error loading academies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingAcademy 
        ? `/api/academy_management/${editingAcademy.id}`
        : '/api/academy_management';
      
      const method = editingAcademy ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save academy');
      }

      // Refresh academies list
      await loadAcademies();
      
      // Reset form and close modal
      setFormData({
        name: '',
        location: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
      });
      setEditingAcademy(null);
      setShowModal(false);
      
    } catch (err) {
      console.error('Error saving academy:', err);
      setError(err.message);
    }
  };

  const handleEdit = (academy) => {
    setEditingAcademy(academy);
    setFormData({
      name: academy.name || '',
      location: academy.location || '',
      description: academy.description || '',
      contactEmail: academy.contactEmail || '',
      contactPhone: academy.contactPhone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (academyId) => {
    if (!confirm('Are you sure you want to delete this academy? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/academy_management/${academyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete academy');
      }

      // Refresh academies list
      await loadAcademies();
      
    } catch (err) {
      console.error('Error deleting academy:', err);
      setError(err.message);
    }
  };

  const openCreateModal = () => {
    setEditingAcademy(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      contactEmail: '',
      contactPhone: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAcademy(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      contactEmail: '',
      contactPhone: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academy Management</h1>
          <p className="text-gray-600 mt-1">Manage academies and their information</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Academy</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Academies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academies.map((academy) => (
          <div key={academy.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Academy Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{academy.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {academy.location}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(academy)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit Academy"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(academy.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Academy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Academy Description */}
              {academy.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{academy.description}</p>
              )}

              {/* Academy Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">Users</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.users?.length || 0}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500">Events</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.events?.length || 0}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-1">
                    <Trophy className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500">Matches</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.matches?.length || 0}</p>
                </div>
              </div>

              {/* Contact Information */}
              {(academy.contactEmail || academy.contactPhone) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    {academy.contactEmail && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Email:</span> {academy.contactEmail}
                      </p>
                    )}
                    {academy.contactPhone && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Phone:</span> {academy.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {academies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No academies found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first academy.</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Academy</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingAcademy ? 'Edit Academy' : 'Create New Academy'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Academy Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingAcademy ? 'Update Academy' : 'Create Academy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
