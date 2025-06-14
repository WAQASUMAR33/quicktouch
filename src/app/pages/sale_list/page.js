'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function SaleListPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sales, setSales] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    vehicleNo: '',
    supplierId: '',
    productId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSale, setSelectedSale] = useState(null);
  const router = useRouter();

  // Fetch sales, suppliers, and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const [salesResp, suppliersResp, productsResp] = await Promise.all([
          fetch('/api/sale', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/supplier_management', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/products', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ ok: false })), // Fallback if /api/products doesn't exist
        ]);

        // Handle sales response
        let salesData = [];
        if (salesResp.ok) {
          salesData = await salesResp.json();
        } else {
          // Try parsing raw text as JSON (handles cases like the provided error)
          const text = await salesResp.text();
          try {
            salesData = JSON.parse(text);
          } catch {
            throw new Error(`Invalid sales data format: ${text}`);
          }
        }
        setSales(Array.isArray(salesData) ? salesData : []);

        // Handle suppliers response
        if (suppliersResp.ok) {
          const suppliersData = await suppliersResp.json();
          setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
        } else {
          setSuppliers([]);
          console.warn('Failed to fetch suppliers:', await suppliersResp.text());
        }

        // Handle products response
        let productsData = [];
        if (productsResp.ok) {
          productsData = await productsResp.json();
        } else {
          // Fallback: Derive products from sales
          productsData = Array.from(
            new Map(
              salesData.map((sale) => [
                sale.p_id,
                { p_id: sale.p_id, p_title: sale.product.p_title },
              ])
            ).values()
          ).sort((a, b) => a.p_title.localeCompare(b.p_title));
        }
        setProducts(Array.isArray(productsData) ? productsData : []);

      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const trnxDate = new Date(sale.created_at);
    const matchesDate = (() => {
      if (!filters.start_date && !filters.end_date) return true;
      const startDate = filters.start_date ? new Date(filters.start_date) : null;
      const endDate = filters.end_date ? new Date(filters.end_date) : null;
      if (endDate) endDate.setHours(23, 59, 59, 999);
      if (startDate && endDate) {
        return trnxDate >= startDate && trnxDate <= endDate;
      }
      if (startDate) return trnxDate >= startDate;
      if (endDate) return trnxDate <= endDate;
      return true;
    })();
    const matchesVehicleNo = filters.vehicleNo
      ? sale.vehicle_no.toLowerCase().includes(filters.vehicleNo.toLowerCase())
      : true;
    const matchesSupplier = filters.supplierId
      ? sale.sup_id === parseInt(filters.supplierId)
      : true;
    const matchesProduct = filters.productId
      ? sale.p_id === parseInt(filters.productId)
      : true;
    return matchesDate && matchesVehicleNo && matchesSupplier && matchesProduct;
  });

  // Calculate status
  const status = {
    totalRows: filteredSales.length,
    totalBags: filteredSales.reduce((sum, sale) => sum + (sale.no_of_bags || 0), 0),
    totalNetTotal: filteredSales.reduce((sum, sale) => sum + (sale.net_total || 0), 0),
  };

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Open sale details modal
  const openSaleDetails = (sale) => {
    setSelectedSale(sale);
  };

  // Close sale details modal
  const closeSaleDetails = () => {
    setSelectedSale(null);
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
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Sale List</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Status Card */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Total Sales</p>
              <p className="text-xl font-semibold text-blue-600">{status.totalRows}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Total Bags</p>
              <p className="text-xl font-semibold text-green-600">{status.totalBags}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Total Net Amount</p>
              <p className="text-xl font-semibold text-yellow-600">{status.totalNetTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
         
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Vehicle No</label>
              <input
                type="text"
                name="vehicleNo"
                value={filters.vehicleNo}
                onChange={handleFilterChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vehicle number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <select
                name="supplierId"
                value={filters.supplierId}
                onChange={handleFilterChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.sup_id} value={supplier.sup_id}>
                    {supplier.sup_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                name="productId"
                value={filters.productId}
                onChange={handleFilterChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product.p_id} value={product.p_id}>
                    {product.p_title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No sales found
                  </td>
                </tr>
              ) : (
                currentSales.map((sale) => (
                  <tr key={sale.sale_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.sale_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.product.p_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.supplier.sup_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.vehicle_no}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.no_of_bags}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.net_total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(sale.created_at), 'PP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openSaleDetails(sale)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSales.length)} of {filteredSales.length} sales
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

        {/* Sale Details Modal */}
        {selectedSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Sale Details - ID: {selectedSale.sale_id}</h2>
                <button
                  onClick={closeSaleDetails}
                  className="text-gray-600 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p><strong>Product:</strong> {selectedSale.product.p_title}</p>
                  <p><strong>Supplier:</strong> {selectedSale.supplier.sup_name}</p>
                  <p><strong>Vehicle No:</strong> {selectedSale.vehicle_no}</p>
                  <p><strong>Weight (Tons):</strong> {selectedSale.weight.toFixed(2)}</p>
                  <p><strong>No of Bags:</strong> {selectedSale.no_of_bags}</p>
                  <p><strong>Amount per Bag:</strong> {selectedSale.amount_per_bag.toFixed(2)}</p>
                  <p><strong>Freight per Bag:</strong> {selectedSale.freight_per_bag.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Total Amount:</strong> {selectedSale.total_amount.toFixed(2)}</p>
                  <p><strong>Total Freight Amount:</strong> {selectedSale.total_freight_amount.toFixed(2)}</p>
                  <p><strong>Net Total:</strong> {selectedSale.net_total.toFixed(2)}</p>
                  <p><strong>Previous Balance:</strong> {selectedSale.pre_balance.toFixed(2)}</p>
                  <p><strong>Payment:</strong> {selectedSale.payment.toFixed(2)}</p>
                  <p><strong>Balance:</strong> {selectedSale.balance.toFixed(2)}</p>
                  <p><strong>Created At:</strong> {format(new Date(selectedSale.created_at), 'PPp')}</p>
                  <p><strong>Updated At:</strong> {format(new Date(selectedSale.updated_at), 'PPp')}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dealer Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Bags</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freight Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedSale.saleDetails.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                          No dealer details found
                        </td>
                      </tr>
                    ) : (
                      selectedSale.saleDetails.map((detail) => (
                        <tr key={detail.sales_details_id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.dealer.dealer_name}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.v_no}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.no_of_bags}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.unit_rate.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.freight_rate.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.net_total_amount.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{detail.balance.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeSaleDetails}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}