'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSalePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleForm, setSaleForm] = useState({
    pId: '',
    supId: '',
    amountPerBag: 0.0,
    noOfBags: 0,
    freightPerBag: 0.0,
    totalAmount: 0.0,
    tax1: 0.0,
    tax2: 0.0,
    tax3: 0.0,
    netTotal: 0.0,
    vehicleNo: '',
    date: new Date().toISOString().split('T')[0], // Default to today: June 08, 2025
  });
  const [saleDetails, setSaleDetails] = useState([{ dealerId: '', noOfBags: 0, unitRate: 0.0, freight: 0.0, totalAmount: 0.0 }]);
  const router = useRouter();

  // Fetch suppliers, dealers, and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const [suppliersResp, dealersResp, productsResp] = await Promise.all([
          fetch('/api/supplier_management', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/dealer_management', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/product_management', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!suppliersResp.ok || !dealersResp.ok || !productsResp.ok) throw new Error('Failed to fetch data');
        setSuppliers(await suppliersResp.json());
        setDealers(await dealersResp.json());
        setProducts(await productsResp.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Handle sale form changes
  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0.0;
    setSaleForm((prev) => {
      const updated = { ...prev, [name]: numValue };
      if (name === 'amountPerBag' || name === 'noOfBags' || name === 'freightPerBag') {
        updated.totalAmount = (updated.amountPerBag * updated.noOfBags) + (updated.freightPerBag * updated.noOfBags);
        updated.netTotal = updated.totalAmount + (updated.totalAmount * (updated.tax1 + updated.tax2 + updated.tax3) / 100);
      } else if (name === 'tax1' || name === 'tax2' || name === 'tax3') {
        updated.netTotal = updated.totalAmount + (updated.totalAmount * (numValue + prev.tax2 + prev.tax3) / 100);
      } else if (name === 'pId' || name === 'supId') {
        updated[name] = value; // Handle string values for IDs
      }
      return updated;
    });
  };

  // Handle sale details changes
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0.0;
    setSaleDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: numValue };
      if (name === 'noOfBags' || name === 'unitRate' || name === 'freight') {
        updated[index].totalAmount = (updated[index].noOfBags * updated[index].unitRate) + updated[index].freight;
      }
      return updated;
    });
  };

  // Add new dealer row
  const addDealerRow = () => {
    setSaleDetails((prev) => [...prev, { dealerId: '', noOfBags: 0, unitRate: 0.0, freight: 0.0, totalAmount: 0.0 }]);
  };

  // Remove dealer row
  const removeDealerRow = (index) => {
    setSaleDetails((prev) => prev.filter((_, i) => i !== index));
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
      const saleResponse = await fetch('/api/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          p_id: parseInt(saleForm.pId),
          sup_id: parseInt(saleForm.supId),
          amount_per_bag: saleForm.amountPerBag,
          no_of_bags: saleForm.noOfBags,
          freight_per_bag: saleForm.freightPerBag,
          total_amount: saleForm.totalAmount,
          tax_1: saleForm.tax1,
          tax_2: saleForm.tax2,
          tax_3: saleForm.tax3,
          net_total: saleForm.netTotal,
          vehicle_no: saleForm.vehicleNo,
          created_at: saleForm.date,
        }),
      });
      if (!saleResponse.ok) throw new Error('Failed to create sale');
      const saleData = await saleResponse.json();
      const saleId = saleData.sale_id;

      await Promise.all(
        saleDetails.map(async (detail) => {
          await fetch('/api/sale-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sales_id: saleId,
              v_no: saleForm.vehicleNo,
              p_id: parseInt(saleForm.pId), // Use selected product ID
              d_id: parseInt(detail.dealerId),
              no_of_bags: detail.noOfBags,
              unit_rate: detail.unitRate,
              freight: detail.freight,
              total_amount: detail.totalAmount,
              tax_1: saleForm.tax1,
              tax_2: saleForm.tax2,
              tax_3: saleForm.tax3,
              total_amount_without_tax: detail.totalAmount,
              total_amount_with_tax: detail.totalAmount + (detail.totalAmount * (saleForm.tax1 + saleForm.tax2 + saleForm.tax3) / 100),
            }),
          });
        })
      );
      router.push('/sales-list'); // Redirect to sales list or dashboard
    } catch (err) {
      setError(err.message);
    }
  };

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
        <h1 className="text-3xl font-semibold text-gray-800">New Sale</h1>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Sale Form - Upper Section with 4 Columns */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sale Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                name="pId"
                value={saleForm.pId}
                onChange={handleSaleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Product</option>
                {products.map((prod) => (
                  <option key={prod.p_id} value={prod.p_id}>
                    {prod.p_title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <select
                name="supId"
                value={saleForm.supId}
                onChange={handleSaleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup.sup_id} value={sup.sup_id}>
                    {sup.sup_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle No</label>
              <input
                type="text"
                name="vehicleNo"
                value={saleForm.vehicleNo}
                onChange={handleSaleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={saleForm.date}
                onChange={handleSaleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount per Bag</label>
              <input
                type="number"
                name="amountPerBag"
                value={saleForm.amountPerBag}
                onChange={handleSaleChange}
                step="0.01"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">No of Bags</label>
              <input
                type="number"
                name="noOfBags"
                value={saleForm.noOfBags}
                onChange={handleSaleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Freight per Bag</label>
              <input
                type="number"
                name="freightPerBag"
                value={saleForm.freightPerBag}
                onChange={handleSaleChange}
                step="0.01"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={saleForm.totalAmount}
                readOnly
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax 1 (%)</label>
              <input
                type="number"
                name="tax1"
                value={saleForm.tax1}
                onChange={handleSaleChange}
                step="0.01"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax 2 (%)</label>
              <input
                type="number"
                name="tax2"
                value={saleForm.tax2}
                onChange={handleSaleChange}
                step="0.01"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax 3 (%)</label>
              <input
                type="number"
                name="tax3"
                value={saleForm.tax3}
                onChange={handleSaleChange}
                step="0.01"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Net Total</label>
              <input
                type="number"
                name="netTotal"
                value={saleForm.netTotal}
                readOnly
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Sale Details for Dealers */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dealer Details</h2>
          {saleDetails.map((detail, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dealer</label>
                <select
                  name="dealerId"
                  value={detail.dealerId}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Dealer</option>
                  {dealers.map((dealer) => (
                    <option key={dealer.dealer_id} value={dealer.dealer_id}>
                      {dealer.dealer_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">No of Bags</label>
                <input
                  type="number"
                  name="noOfBags"
                  value={detail.noOfBags}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Rate</label>
                <input
                  type="number"
                  name="unitRate"
                  value={detail.unitRate}
                  onChange={(e) => handleDetailChange(index, e)}
                  step="0.01"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Freight</label>
                <input
                  type="number"
                  name="freight"
                  value={detail.freight}
                  onChange={(e) => handleDetailChange(index, e)}
                  step="0.01"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={detail.totalAmount}
                  readOnly
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDealerRow(index)}
                  className="mt-6 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDealerRow}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Add Dealer
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit Sale
          </button>
        </div>
      </form>
    </div>
  );
}