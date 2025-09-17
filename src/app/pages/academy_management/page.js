'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Users, Calendar, Trophy, MapPin, User, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';

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
    contactPhone: '',
    contactPerson: '',
    contactPersonPhone: '',
    status: 'approved'
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
        contactPhone: '',
        contactPerson: '',
        contactPersonPhone: '',
        status: 'approved'
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
      contactPhone: academy.contactPhone || '',
      contactPerson: academy.contactPerson || '',
      contactPersonPhone: academy.contactPersonPhone || '',
      status: academy.status || 'approved'
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
      contactPhone: '',
      contactPerson: '',
      contactPersonPhone: '',
      status: 'approved'
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
      contactPhone: '',
      contactPerson: '',
      contactPersonPhone: '',
      status: 'approved'
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
                <div className="flex flex-col items-end space-y-2">
                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    academy.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : academy.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {academy.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {academy.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {academy.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {academy.status || 'approved'}
                  </div>
                  
                  {/* Action Buttons */}
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
              </div>

              {/* Academy Description */}
              {academy.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{academy.description}</p>
              )}

              {/* Academy Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">Users</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.User?.length || 0}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500">Players</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.Player?.length || 0}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500">Events</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.Event?.length || 0}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-1">
                    <Trophy className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500">Matches</p>
                  <p className="text-sm font-semibold text-gray-900">{academy.Match?.length || 0}</p>
                </div>
              </div>

              {/* Contact Information */}
              {(academy.contactEmail || academy.contactPhone || academy.contactPerson || academy.contactPersonPhone) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    {academy.contactEmail && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <span className="font-medium mr-1">Email:</span> {academy.contactEmail}
                      </p>
                    )}
                    {academy.contactPhone && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        <span className="font-medium mr-1">Phone:</span> {academy.contactPhone}
                      </p>
                    )}
                    {academy.contactPerson && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span className="font-medium mr-1">Contact Person:</span> {academy.contactPerson}
                      </p>
                    )}
                    {academy.contactPersonPhone && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        <span className="font-medium mr-1">Person Phone:</span> {academy.contactPersonPhone}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                {editingAcademy ? 'Edit Academy' : 'Create New Academy'}
              </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Academy Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter academy name"
                    required
                  />
                </div>

                <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter academy location"
                    required
                  />
                </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter academy description"
                  />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter contact email"
                  />
                </div>

                <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter contact phone"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter contact person name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPersonPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Phone
                      </label>
                      <input
                        type="tel"
                        id="contactPersonPhone"
                        name="contactPersonPhone"
                        value={formData.contactPersonPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter contact person phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    {formData.status === 'approved' && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                    {formData.status === 'pending' && <Clock className="w-5 h-5 mr-2 text-yellow-600" />}
                    {formData.status === 'rejected' && <XCircle className="w-5 h-5 mr-2 text-red-600" />}
                    Academy Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                        formData.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : formData.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {formData.status === 'approved' && <CheckCircle className="w-4 h-4 mr-2" />}
                        {formData.status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                        {formData.status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
                        Current Status: {formData.status || 'approved'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center"
                  >
                    {editingAcademy ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Academy
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Academy
                      </>
                    )}
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
