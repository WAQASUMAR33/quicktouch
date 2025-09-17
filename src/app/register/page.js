'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'academy'
  
  // User signup form data
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'player',
    academyId: ''
  });

  // Academy registration form data
  const [academyFormData, setAcademyFormData] = useState({
    academyName: '',
    location: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    contactPerson: '',
    contactPersonPhone: '',
    password: '',
    confirmPassword: ''
  });

  const [academies, setAcademies] = useState([]);
  const [academiesLoading, setAcademiesLoading] = useState(true);
  const [academiesError, setAcademiesError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAcademyPassword, setShowAcademyPassword] = useState(false);
  const [showAcademyConfirmPassword, setShowAcademyConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Load academies on component mount
  useEffect(() => {
    const loadAcademies = async () => {
      try {
        setAcademiesLoading(true);
        setAcademiesError('');
        
        const response = await fetch('/api/academy_management');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load academies');
        }
        
        setAcademies(data.academies || []);
      } catch (err) {
        console.error('Error loading academies:', err);
        // Fallback to test academies if API fails
        setAcademies([
          {
            id: 'academy-main-campus',
            name: 'Quick Touch Academy - Main Campus',
            location: 'Lahore, Pakistan'
          },
          {
            id: 'academy-karachi-branch', 
            name: 'Quick Touch Academy - Karachi Branch',
            location: 'Karachi, Pakistan'
          },
          {
            id: 'academy-islamabad-branch',
            name: 'Quick Touch Academy - Islamabad Branch', 
            location: 'Islamabad, Pakistan'
          }
        ]);
        setAcademiesError('');
      } finally {
        setAcademiesLoading(false);
      }
    };

    loadAcademies();
  }, []);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAcademyInputChange = (e) => {
    const { name, value } = e.target;
    setAcademyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUserForm = () => {
    const newErrors = {};

    if (!userFormData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!userFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!userFormData.password) {
      newErrors.password = 'Password is required';
    } else if (userFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!userFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (userFormData.password !== userFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!userFormData.academyId) {
      newErrors.academyId = 'Please select an academy';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcademyForm = () => {
    const newErrors = {};

    if (!academyFormData.academyName.trim()) {
      newErrors.academyName = 'Academy name is required';
    }

    if (!academyFormData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!academyFormData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(academyFormData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!academyFormData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    }

    if (!academyFormData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    if (!academyFormData.contactPersonPhone.trim()) {
      newErrors.contactPersonPhone = 'Contact person phone is required';
    }

    if (!academyFormData.password) {
      newErrors.password = 'Password is required';
    } else if (academyFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!academyFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (academyFormData.password !== academyFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateUserForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userFormData.fullName,
          email: userFormData.email,
          password: userFormData.password,
          phone: userFormData.phone,
          role: userFormData.role,
          academyId: userFormData.academyId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      setError('');
      alert('Registration successful! Please check your email to verify your account.');
      router.push('/login');
    } catch (err) {
      console.error('Registration error:', err.message);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleAcademySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateAcademyForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/academy-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(academyFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Academy registration failed');
      }

      // Registration successful
      setError('');
      setSuccess(true);
    } catch (err) {
      console.error('Academy registration error:', err.message);
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Registration Submitted!
            </h2>
            
            <p className="text-white/70 mb-6">
              Your academy registration has been submitted successfully. Our admin team will review your application and get back to you soon.
            </p>
            
            <div className="bg-blue-50/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-white/80">
                <strong>What happens next:</strong><br />
                1. Our admin team will review your application<br />
                2. You'll receive an email with approval status<br />
                3. Once approved, you can log in and access your academy dashboard
              </p>
            </div>
            
            <p className="text-sm text-white/50">
              Thank you for your interest in joining Quick Touch Academy!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative w-full max-w-4xl">
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
              <Image
                src="/quicktouch.png"
                alt="Quick Touch Academy"
                width={80}
                height={80}
                className="rounded-2xl"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join Quick Touch Academy</h1>
            <p className="text-white/70">Create your account or register your academy</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-8 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'user'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="w-5 h-5" />
                <span>User Signup</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('academy')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'academy'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Academy Registration</span>
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* User Signup Form */}
          {activeTab === 'user' && (
            <form onSubmit={handleUserSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-white/90">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={userFormData.fullName}
                    onChange={handleUserInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-white/90">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={userFormData.phone}
                    onChange={handleUserInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-white/90">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="player" className="bg-slate-800 text-white">Player</option>
                    <option value="coach" className="bg-slate-800 text-white">Coach</option>
                    <option value="scout" className="bg-slate-800 text-white">Scout</option>
                  </select>
                </div>
              </div>

              {/* Academy Selection */}
              <div className="space-y-2">
                <label htmlFor="academyId" className="block text-sm font-medium text-white/90">
                  Academy *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-white/50" />
                  </div>
                  {academiesLoading ? (
                    <div className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/50 flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading academies...
                    </div>
                  ) : (
                    <select
                      id="academyId"
                      name="academyId"
                      value={userFormData.academyId}
                      onChange={handleUserInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                      required
                    >
                      <option value="" className="bg-slate-800 text-white">Select an academy</option>
                      {academies.map((academy) => (
                        <option key={academy.id} value={academy.id} className="bg-slate-800 text-white">
                          {academy.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={userFormData.password}
                    onChange={handleUserInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={userFormData.confirmPassword}
                    onChange={handleUserInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${
                  isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Academy Registration Form */}
          {activeTab === 'academy' && (
            <form onSubmit={handleAcademySubmit} className="space-y-5">
              {/* Academy Name Field */}
              <div className="space-y-2">
                <label htmlFor="academyName" className="block text-sm font-medium text-white/90">
                  Academy Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="academyName"
                    name="academyName"
                    type="text"
                    value={academyFormData.academyName}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter academy name"
                    required
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-white/90">
                  Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={academyFormData.location}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter academy location"
                    required
                  />
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-white/90">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-white/50" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={academyFormData.description}
                    onChange={handleAcademyInputChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="Enter academy description"
                  />
                </div>
              </div>

              {/* Contact Email Field */}
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-white/90">
                  Contact Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={academyFormData.contactEmail}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter contact email"
                    required
                  />
                </div>
              </div>

              {/* Contact Phone Field */}
              <div className="space-y-2">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-white/90">
                  Contact Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={academyFormData.contactPhone}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="+92-300-1234567"
                    required
                  />
                </div>
              </div>

              {/* Contact Person Field */}
              <div className="space-y-2">
                <label htmlFor="contactPerson" className="block text-sm font-medium text-white/90">
                  Contact Person Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    value={academyFormData.contactPerson}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
              </div>

              {/* Contact Person Phone Field */}
              <div className="space-y-2">
                <label htmlFor="contactPersonPhone" className="block text-sm font-medium text-white/90">
                  Contact Person Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="contactPersonPhone"
                    name="contactPersonPhone"
                    type="tel"
                    value={academyFormData.contactPersonPhone}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="+92-300-1234567"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="academyPassword" className="block text-sm font-medium text-white/90">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="academyPassword"
                    name="password"
                    type={showAcademyPassword ? "text" : "password"}
                    value={academyFormData.password}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAcademyPassword(!showAcademyPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showAcademyPassword ? (
                      <EyeOff className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="academyConfirmPassword" className="block text-sm font-medium text-white/90">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    id="academyConfirmPassword"
                    name="confirmPassword"
                    type={showAcademyConfirmPassword ? "text" : "password"}
                    value={academyFormData.confirmPassword}
                    onChange={handleAcademyInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAcademyConfirmPassword(!showAcademyConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showAcademyConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${
                  isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting registration...
                  </div>
                ) : (
                  'Submit Academy Registration'
                )}
              </button>
            </form>
          )}

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-300 hover:text-purple-200 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}