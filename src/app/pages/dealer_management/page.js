'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DealersManagementPage() {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [formData, setFormData] = useState({
    dealerName: '',
    dealerAddress: '',
    dealerBalance: 0.0,
    dealerCity: '',
    dealerRoute: '',
  });
  const [filterData, setFilterData] = useState({
    dealerName: '',
    dealerCity: '',
    dealerRoute: '',
  });
  const [selectedDealerIds, setSelectedDealerIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const router = useRouter();

  // Fetch dealers list
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const response = await fetch('/api/dealer_management', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch dealers');
        const data = await response.json();
        setDealers(data);
        setFilteredDealers(data); // Initialize filtered dealers
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, [router]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  useEffect(() => {
    const filtered = dealers.filter((dealer) => {
      const nameMatch = dealer.dealer_name
        .toLowerCase()
        .includes(filterData.dealerName.toLowerCase());
      const cityMatch = dealer.dealer_city
        .toLowerCase()
        .includes(filterData.dealerCity.toLowerCase());
      const routeMatch = dealer.dealer_route
        .toLowerCase()
        .includes(filterData.dealerRoute.toLowerCase());
      return nameMatch && cityMatch && routeMatch;
    });
    setFilteredDealers(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [filterData, dealers]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dealerBalance' ? parseFloat(value) || 0.0 : value,
    }));
  };

  // Open popup for add or edit
  const openPopup = (dealer = null) => {
    setSelectedDealer(dealer);
    setFormData({
      dealerName: dealer?.dealer_name || '',
      dealerAddress: dealer?.dealer_address || '',
      dealerBalance: dealer?.dealer_balance || 0.0,
      dealerCity: dealer?.dealer_city || '',
      dealerRoute: dealer?.dealer_route || '',
    });
    setIsPopupOpen(true);
  };

  // Save dealer (add or update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const method = selectedDealer ? 'PUT' : 'POST';
      const url = selectedDealer
        ? `/api/dealer_management/${selectedDealer.dealer_id}`
        : '/api/dealer_management';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dealer_name: formData.dealerName,
          dealer_address: formData.dealerAddress,
          dealer_balance: formData.dealerBalance,
          dealer_city: formData.dealerCity,
          dealer_route: formData.dealerRoute,
        }),
      });
      if (!response.ok) throw new Error(`Failed to ${selectedDealer ? 'update' : 'add'} dealer`);
      const data = await response.json();
      setDealers((prev) =>
        selectedDealer
          ? prev.map((d) => (d.dealer_id === selectedDealer.dealer_id ? data : d))
          : [...prev, data]
      );
      setIsPopupOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete dealer
  const handleDelete = async (dealerId) => {
    if (confirm('Are you sure you want to delete this dealer?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const response = await fetch(`/api/dealer_management/${dealerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete dealer');
        setDealers((prev) => prev.filter((d) => d.dealer_id !== dealerId));
        setSelectedDealerIds((prev) => prev.filter((id) => id !== dealerId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle checkbox selection
  const handleSelectDealer = (dealerId) => {
    setSelectedDealerIds((prev) =>
      prev.includes(dealerId)
        ? prev.filter((id) => id !== dealerId)
        : [...prev, dealerId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDealerIds.length === currentDealers.length) {
      setSelectedDealerIds([]);
    } else {
      setSelectedDealerIds(currentDealers.map((dealer) => dealer.dealer_id));
    }
  };

  // Print selected dealers
  const handlePrint = () => {
    if (selectedDealerIds.length === 0) {
      alert('Please select at least one dealer to print.');
      return;
    }
    const selected = filteredDealers.filter((dealer) =>
      selectedDealerIds.includes(dealer.dealer_id)
    );
    const printDateTime = new Date().toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'full',
      timeStyle: 'short',
    });
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Dealer's Balance Sheet</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .print-title { font-size: 20px; margin: 10px 0; }
            .print-datetime { font-size: 14px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Khawaja Traders</div>
            <div class="print-title">Dealer's Balance Sheet</div>
            <div class="print-datetime">Generated on: ${printDateTime}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Balance</th>
                <th>City</th>
                <th>Route</th>
              </tr>
            </thead>
            <tbody>
              ${selected
                .map(
                  (dealer) => `
                    <tr>
                      <td>${dealer.dealer_id}</td>
                      <td>${dealer.dealer_name}</td>
                      <td>${dealer.dealer_address}</td>
                      <td>${dealer.dealer_balance.toFixed(2)}</td>
                      <td>${dealer.dealer_city}</td>
                      <td>${dealer.dealer_route}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
          <button class="no-print" onclick="window.print()">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDealers = filteredDealers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDealers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dealers Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => openPopup()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Add New Dealer
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
          >
            Print Selected
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Dealers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="dealerName"
              value={filterData.dealerName}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filter by name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="dealerCity"
              value={filterData.dealerCity}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filter by city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Route</label>
            <input
              type="text"
              name="dealerRoute"
              value={filterData.dealerRoute}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filter by route"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedDealerIds.length === currentDealers.length && currentDealers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentDealers.map((dealer) => (
              <tr key={dealer.dealer_id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedDealerIds.includes(dealer.dealer_id)}
                    onChange={() => handleSelectDealer(dealer.dealer_id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dealer.dealer_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dealer.dealer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dealer.dealer_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dealer.dealer_balance.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dealer.dealer_city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dealer.dealer_route}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => openPopup(dealer)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dealer.dealer_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition duration-200`}
            >
              {number}
            </button>
          ))}
        </nav>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedDealer ? 'Edit Dealer' : 'Add New Dealer'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="dealerName"
                  value={formData.dealerName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="dealerAddress"
                  value={formData.dealerAddress}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <input
                  type="number"
                  name="dealerBalance"
                  value={formData.dealerBalance}
                  onChange={handleChange}
                  step="0.01"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="dealerCity"
                  value={formData.dealerCity}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Route</label>
                <input
                  type="text"
                  name="dealerRoute"
                  value={formData.dealerRoute}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}