'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function DealerTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dealers, setDealers] = useState([]);
  const [selectedDealerId, setSelectedDealerId] = useState('');
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    details: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    d_id: '',
    amount_in: '',
    amount_out: '',
    details: '',
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch all transactions and derive dealers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const transactionsResp = await fetch('/api/dealer_transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!transactionsResp.ok) {
          throw new Error(`Failed to fetch transactions: ${await transactionsResp.text()}`);
        }

        const transactionsData = await transactionsResp.json();
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);

        // Extract unique dealers from transactions
        const uniqueDealers = Array.from(
          new Map(
            transactionsData.map((trnx) => [
              trnx.d_id,
              {
                dealer_id: trnx.dealer.dealer_id,
                dealer_name: trnx.dealer.dealer_name,
                dealer_address: trnx.dealer.dealer_address,
                dealer_balance: trnx.dealer.dealer_balance,
                dealer_city: trnx.dealer.dealer_city,
                dealer_route: trnx.dealer.dealer_route,
                updated_at: trnx.updated_at,
              },
            ])
          ).values()
        ).sort((a, b) => a.dealer_name.localeCompare(b.dealer_name));
        setDealers(uniqueDealers);
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Update selected dealer details when dealer ID changes
  useEffect(() => {
    if (!selectedDealerId) {
      setSelectedDealer(null);
    } else {
      const dealer = dealers.find((d) => d.dealer_id === parseInt(selectedDealerId));
      setSelectedDealer(dealer || null);
    }
  }, [selectedDealerId, dealers]);

  // Handle dealer selection
  const handleDealerChange = (e) => {
    setSelectedDealerId(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
    setFormData({
      d_id: '',
      amount_in: '',
      amount_out: '',
      details: '',
    });
    setFormError('');
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Validate form
      if (!formData.d_id) {
        setFormError('Please select a dealer');
        return;
      }
      const amountIn = parseFloat(formData.amount_in) || 0;
      const amountOut = parseFloat(formData.amount_out) || 0;
      if (amountIn < 0 || amountOut < 0) {
        setFormError('Amount In and Amount Out must be non-negative');
        return;
      }

      const response = await fetch('/api/dealer_transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          d_id: parseInt(formData.d_id),
          amount_in: amountIn,
          amount_out: amountOut,
          details: formData.details,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      // Refresh transactions
      const transactionsResp = await fetch('/api/dealer_transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (transactionsResp.ok) {
        const transactionsData = await transactionsResp.json();
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        // Update dealers
        const uniqueDealers = Array.from(
          new Map(
            transactionsData.map((trnx) => [
              trnx.d_id,
              {
                dealer_id: trnx.dealer.dealer_id,
                dealer_name: trnx.dealer.dealer_name,
                dealer_address: trnx.dealer.dealer_address,
                dealer_balance: trnx.dealer.dealer_balance,
                dealer_city: trnx.dealer.dealer_city,
                dealer_route: trnx.dealer.dealer_route,
                updated_at: trnx.updated_at,
              },
            ])
          ).values()
        ).sort((a, b) => a.dealer_name.localeCompare(b.dealer_name));
        setDealers(uniqueDealers);
      }

      setSuccessMessage('Transaction created successfully');
      closeModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message);
      console.error('Submit Error:', err);
    }
  };

  // Filter transactions client-side
  const filteredTransactions = transactions.filter((trnx) => {
    const matchesDealer = selectedDealerId
      ? trnx.d_id === parseInt(selectedDealerId)
      : true;
    const trnxDate = new Date(trnx.created_at);
    const matchesDate = (() => {
      if (!filters.start_date && !filters.end_date) return true;
      const startDate = filters.start_date ? new Date(filters.start_date) : null;
      const endDate = filters.end_date ? new Date(filters.end_date) : null;
      // Set endDate to end of day for inclusivity
      if (endDate) endDate.setHours(23, 59, 59, 999);
      if (startDate && endDate) {
        return trnxDate >= startDate && trnxDate <= endDate;
      }
      if (startDate) return trnxDate >= startDate;
      if (endDate) return trnxDate <= endDate;
      return true;
    })();
    const matchesDetails = filters.details
      ? trnx.details.toLowerCase().includes(filters.details.toLowerCase())
      : true;
    return matchesDealer && matchesDate && matchesDetails;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Dealer Transactions</h1>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            New Transaction
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

    

        {/* Dealer Details */}
        {selectedDealer && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dealer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Name:</strong> {selectedDealer.dealer_name}</p>
              <p><strong>Address:</strong> {selectedDealer.dealer_address}</p>
              <p><strong>City:</strong> {selectedDealer.dealer_city}</p>
              <p><strong>Route:</strong> {selectedDealer.dealer_route}</p>
              <p><strong>Balance:</strong> {selectedDealer.dealer_balance.toFixed(2)}</p>
              <p><strong>Updated At:</strong> {format(new Date(selectedDealer.updated_at), 'PPp')}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
         
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
           
           <div>

            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <select
                value={selectedDealerId}
                onChange={handleDealerChange}
                className="w-full  py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Dealers</option>
                {dealers.map((dealer) => (
                <option key={dealer.dealer_id} value={dealer.dealer_id}>
                    {dealer.dealer_name}
                </option>
                ))}
            </select>

           </div>
           
           
           
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Details</label>
              <input
                type="text"
                name="details"
                value={filters.details}
                onChange={handleFilterChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search details (e.g., Sale ID)"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pre Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransactions.map((trnx) => (
                  <tr key={trnx.trnx_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trnx.trnx_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trnx.dealer.dealer_name}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trnx.pre_balance.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trnx.amount_in.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trnx.amount_out.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trnx.balance.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{trnx.details}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(trnx.created_at), 'PP')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Modal for New Transaction */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">New Dealer Transaction</h2>
              {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Dealer</label>
                  <select
                    name="d_id"
                    value={formData.d_id}
                    onChange={handleFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Dealer</option>
                    {dealers.map((dealer) => (
                      <option key={dealer.dealer_id} value={dealer.dealer_id}>
                        {dealer.dealer_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Amount In</label>
                  <input
                    type="number"
                    name="amount_in"
                    value={formData.amount_in}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount in"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Amount Out</label>
                  <input
                    type="number"
                    name="amount_out"
                    value={formData.amount_out}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount out"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter transaction details"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}