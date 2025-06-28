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
    weight: 0.0,
    noOfBags: 0,
    unitRate: 0.0,
    freightPerBag: 0.0,
    totalAmount: 0.0,
    totalFreightAmount: 0.0,
    netTotal: 0.0,
    totalSaleAmount: 0.0,
    vehicleNo: '',
    preBalance: 0.0,
    payment: 0.0,
    balance: 0.0,
    date: new Date().toISOString().split('T')[0],
  });
  const [saleDetails, setSaleDetails] = useState([
    {
      id: Date.now().toString(),
      dealerId: '',
      vNo: '',
      noOfBags: 0,
      unitRate: 0.0,
      freightRate: 0.0,
      totalAmountBags: 0.0,
      totalAmountFreight: 0.0,
      netTotalAmount: 0.0,
      preBalance: 0.0,
      payment: 0.0,
      balance: 0.0,
    },
  ]);
  const [isAddingDealer, setIsAddingDealer] = useState(false);
  const [isRemovingDealer, setIsRemovingDealer] = useState(false);
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
        if (!suppliersResp.ok || !dealersResp.ok || !productsResp.ok) {
          throw new Error(
            `Failed to fetch data: ${
              (await suppliersResp.text()) || (await dealersResp.text()) || (await productsResp.text())
            }`
          );
        }
        const suppliersData = await suppliersResp.json();
        const dealersData = await dealersResp.json();
        const productsData = await productsResp.json();
        console.log('Fetched suppliers:', JSON.stringify(suppliersData, null, 2));
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
        setDealers(Array.isArray(dealersData) ? dealersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Update dealer balance
  useEffect(() => {
    setSaleDetails((prev) =>
      prev.map((detail) => {
        const dealer = dealers.find((d) => d.dealer_id === parseInt(detail.dealerId));
        return {
          ...detail,
          preBalance: dealer ? dealer.dealer_balance || 0.0 : 0.0,
          balance: (dealer ? dealer.dealer_balance || 0.0 : 0.0) + detail.netTotalAmount - detail.payment,
        };
      })
    );
  }, [dealers, saleDetails.map((d) => d.dealerId).join(','), saleDetails.map((d) => d.netTotalAmount).join(','), saleDetails.map((d) => d.payment).join(',')]);

  // Calculate totalSaleAmount and supplier balance
  useEffect(() => {
    const totalSaleAmount = saleDetails.reduce((sum, item) => sum + (item.netTotalAmount || 0), 0);
    setSaleForm((prev) => ({
      ...prev,
      totalSaleAmount,
      balance: prev.preBalance + prev.netTotal - prev.payment,
    }));
  }, [saleDetails, saleForm.preBalance, saleForm.netTotal, saleForm.payment]);

  // Handle sale form changes
  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => {
      const updated = { ...prev };
      if (['weight', 'unitRate', 'freightPerBag', 'payment'].includes(name)) {
        updated[name] = parseFloat(value) || 0.0;
      } else {
        updated[name] = value;
      }

      // Handle weight change
      if (name === 'weight') {
        updated.noOfBags = Math.round(updated.weight * 20);
      }

      // Calculate totals
      updated.totalAmount = updated.unitRate * updated.noOfBags;
      updated.totalFreightAmount = updated.freightPerBag * updated.noOfBags;
      updated.netTotal = updated.totalAmount - updated.totalFreightAmount;

      // Handle supplier change
      if (name === 'supId') {
        console.log('Selected supId:', value);
        if (!value || isNaN(parseInt(value))) {
          updated.preBalance = 0.0;
          updated.balance = updated.netTotal - updated.payment;
        } else {
          const supplier = Array.isArray(suppliers)
            ? suppliers.find((sup) => sup.sup_id === parseInt(value))
            : null;
          console.log('Found supplier:', JSON.stringify(supplier, null, 2));
          updated.preBalance = supplier ? supplier.sup_balance || 0.0 : 0.0;
          updated.balance = updated.preBalance + updated.netTotal - updated.payment;
        }
      }

      // Update balance for fields affecting netTotal
      if (['unitRate', 'freightPerBag', 'weight', 'payment'].includes(name)) {
        updated.balance = updated.preBalance + updated.netTotal - updated.payment;
      }

      console.log('Updated saleForm:', JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  // Handle sale details changes
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    setSaleDetails((prev) => {
      const updated = [...prev];
      if (!updated[index] || typeof updated[index] !== 'object') {
        console.warn(`Invalid saleDetails entry at index ${index}:`, updated[index]);
        return updated;
      }
      updated[index] = { ...updated[index] };
      if (['noOfBags', 'unitRate', 'freightRate', 'payment'].includes(name)) {
        updated[index][name] = parseFloat(value) || 0.0;
      } else {
        updated[index][name] = value;
      }

      // Handle dealer change
      if (name === 'dealerId') {
        const dealer = dealers.find((d) => d.dealer_id === parseInt(value));
        updated[index].preBalance = dealer ? dealer.dealer_balance || 0.0 : 0.0;
      }

      // Calculate totals
      updated[index].totalAmountBags = updated[index].unitRate * updated[index].noOfBags;
      updated[index].totalAmountFreight = updated[index].freightRate * updated[index].noOfBags;
      updated[index].netTotalAmount = updated[index].totalAmountBags - updated[index].totalAmountFreight;
      updated[index].balance = updated[index].preBalance + updated[index].netTotalAmount - updated[index].payment;

      return updated;
    });
  };

  // Add new dealer row
  const addDealerRow = () => {
    if (isAddingDealer) return;
    setIsAddingDealer(true);
    setSaleDetails((prev) => {
      const totalDealerBags = prev.reduce((sum, detail) => sum + (detail?.noOfBags || 0), 0);
      if (totalDealerBags >= saleForm.noOfBags && saleForm.noOfBags > 0) {
        setError('Total dealer bags cannot exceed sale bags');
        setIsAddingDealer(false);
        return prev;
      }
      const updated = [
        ...prev,
        {
          id: Date.now().toString(),
          dealerId: '',
          vNo: '',
          noOfBags: 0,
          unitRate: 0.0,
          freightRate: 0.0,
          totalAmountBags: 0.0,
          totalAmountFreight: 0.0,
          netTotalAmount: 0.0,
          preBalance: 0.0,
          payment: 0.0,
          balance: 0.0,
        },
      ];
      setTimeout(() => setIsAddingDealer(false), 300);
      return updated;
    });
  };

  // Remove dealer row
  const removeDealerRow = (index) => {
    if (isRemovingDealer) return;
    setIsRemovingDealer(true);
    setSaleDetails((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const result = updated.length === 0
        ? [
            {
              id: Date.now().toString(),
              dealerId: '',
              vNo: '',
              noOfBags: 0,
              unitRate: 0.0,
              freightRate: 0.0,
              totalAmountBags: 0.0,
              totalAmountFreight: 0.0,
              netTotalAmount: 0.0,
              preBalance: 0.0,
              payment: 0.0,
              balance: 0.0,
            },
          ]
        : updated;
      setTimeout(() => setIsRemovingDealer(false), 300);
      return result;
    });
    setError('');
  };

  // Clean string inputs
  const cleanString = (str) => (str ? str.trim().replace(/[^a-zA-Z0-9-]/g, '') : '');

  // Validate form before submission
  const validateForm = () => {
    if (!saleForm.pId || isNaN(parseInt(saleForm.pId)) || parseInt(saleForm.pId) <= 0) {
      return 'Please select a valid Product';
    }
    if (!saleForm.supId || isNaN(parseInt(saleForm.supId)) || parseInt(saleForm.supId) <= 0) {
      return 'Please select a valid Supplier';
    }
    if (!cleanString(saleForm.vehicleNo)) {
      return 'Vehicle No is required and must be alphanumeric';
    }
    if (!saleForm.date) {
      return 'Date is required';
    }
    if (saleForm.weight <= 0 || saleForm.noOfBags <= 0) {
      return 'Weight and Number of Bags must be greater than 0';
    }
    if (saleForm.unitRate <= 0) {
      return 'Unit Rate must be greater than 0';
    }
    if (saleForm.freightPerBag < 0) {
      return 'Freight per Bag must be non-negative';
    }
    if (saleForm.preBalance === undefined || saleForm.payment === undefined) {
      return 'Previous Balance and Payment are required';
    }
    if (isNaN(saleForm.totalAmount) || isNaN(saleForm.totalFreightAmount) || isNaN(saleForm.netTotal) || isNaN(saleForm.totalSaleAmount)) {
      return 'Sale calculations are invalid';
    }

    if (saleDetails.length === 0 || saleDetails.some((detail) => !detail || typeof detail !== 'object' || !detail.id)) {
      return 'At least one valid dealer detail is required';
    }
    for (const [index, detail] of saleDetails.entries()) {
      if (!detail || typeof detail !== 'object' || !detail.id) {
        return `Dealer row ${index + 1} is invalid`;
      }
      if (!detail.dealerId || isNaN(parseInt(detail.dealerId)) || parseInt(detail.dealerId) <= 0) {
        return `Please select a valid dealer for row ${index + 1}`;
      }
      if (!cleanString(detail.vNo) && !cleanString(saleForm.vehicleNo)) {
        return `Vehicle No is required for dealer row ${index + 1} or sale`;
      }
      if (detail.noOfBags <= 0) {
        return `Number of Bags in dealer row ${index + 1} must be greater than 0`;
      }
      if (detail.unitRate <= 0) {
        return `Unit Rate in dealer row ${index + 1} must be greater than 0`;
      }
      if (detail.freightRate < 0) {
        return `Freight Rate in dealer row ${index + 1} must be non-negative`;
      }
      if (detail.preBalance === undefined || detail.payment === undefined) {
        return `Previous Balance and Payment in dealer row ${index + 1} are required`;
      }
      if (
        isNaN(detail.totalAmountBags) ||
        isNaN(detail.totalAmountFreight) ||
        isNaN(detail.netTotalAmount) ||
        isNaN(detail.balance)
      ) {
        return `Calculated fields in dealer row ${index + 1} are invalid`;
      }
    }

    const totalDealerBags = saleDetails.reduce((sum, detail) => sum + (detail?.noOfBags || 0), 0);
    if (totalDealerBags !== saleForm.noOfBags) {
      return `Total dealer bags (${totalDealerBags}) must equal sale bags (${saleForm.noOfBags})`;
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const payload = {
        p_id: parseInt(saleForm.pId),
        sup_id: parseInt(saleForm.supId),
        weight: saleForm.weight,
        no_of_bags: saleForm.noOfBags,
        amount_per_bag: saleForm.unitRate,
        freight_per_bag: saleForm.freightPerBag,
        total_amount: saleForm.totalAmount,
        total_freight_amount: saleForm.totalFreightAmount,
        net_total: saleForm.netTotal,
        total_sale_amount: saleForm.totalSaleAmount,
        vehicle_no: cleanString(saleForm.vehicleNo),
        pre_balance: saleForm.preBalance,
        payment: saleForm.payment,
        balance: saleForm.balance,
        date: saleForm.date,
        saleDetails: saleDetails.map((detail) => ({
          v_no: cleanString(detail.vNo) || cleanString(saleForm.vehicleNo),
          p_id: parseInt(saleForm.pId),
          d_id: parseInt(detail.dealerId),
          no_of_bags: detail.noOfBags,
          unit_rate: detail.unitRate,
          freight_rate: detail.freightRate,
          total_amount_bags: detail.totalAmountBags,
          total_amount_freight: detail.totalAmountFreight,
          net_total_amount: detail.netTotalAmount,
          pre_balance: detail.preBalance,
          payment: detail.payment,
          balance: detail.balance,
        })),
      };

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('/api/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create sale');
      }

      router.push('/pages/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
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
          <h1 className="text-3xl font-semibold text-gray-800">New Sale</h1>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {/* Sale Form - Upper Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sale Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      {prod.title || prod.p_title}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (Tons)</label>
                <input
                  type="number"
                  name="weight"
                  value={saleForm.weight}
                  onChange={handleSaleChange}
                  step="0.01"
                  min="0.01"
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
                  readOnly
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Rate per Bag</label>
                <input
                  type="number"
                  name="unitRate"
                  value={saleForm.unitRate}
                  onChange={handleSaleChange}
                  step="0.01"
                  min="0.01"
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
                  min="0"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Freight Amount</label>
                <input
                  type="number"
                  name="totalFreightAmount"
                  value={saleForm.totalFreightAmount}
                  readOnly
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Sale Amount</label>
                <input
                  type="number"
                  name="totalSaleAmount"
                  value={saleForm.totalSaleAmount}
                  readOnly
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier Previous Balance</label>
                <input
                  type="number"
                  name="preBalance"
                  value={saleForm.preBalance}
                  readOnly
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier Payment</label>
                <input
                  type="number"
                  name="payment"
                  value={saleForm.payment}
                  onChange={handleSaleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier Balance</label>
                <input
                  type="number"
                  name="balance"
                  value={saleForm.balance}
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
              <div key={detail.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
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
                  <label className="block text-sm font-medium text-gray-700">Vehicle No</label>
                  <input
                    type="text"
                    name="vNo"
                    value={detail.vNo}
                    onChange={(e) => handleDetailChange(index, e)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">No of Bags</label>
                  <input
                    type="number"
                    name="noOfBags"
                    value={detail.noOfBags}
                    onChange={(e) => handleDetailChange(index, e)}
                    min="1"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Rate per Bag</label>
                  <input
                    type="number"
                    name="unitRate"
                    value={detail.unitRate}
                    onChange={(e) => handleDetailChange(index, e)}
                    step="0.01"
                    min="0.01"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Freight Rate per Bag</label>
                  <input
                    type="number"
                    name="freightRate"
                    value={detail.freightRate}
                    onChange={(e) => handleDetailChange(index, e)}
                    step="0.01"
                    min="0"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Bags Amount</label>
                  <input
                    type="number"
                    name="totalAmountBags"
                    value={detail.totalAmountBags}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Freight Amount</label>
                  <input
                    type="number"
                    name="totalAmountFreight"
                    value={detail.totalAmountFreight}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Net Total Amount</label>
                  <input
                    type="number"
                    name="netTotalAmount"
                    value={detail.netTotalAmount}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Balance</label>
                  <input
                    type="number"
                    name="preBalance"
                    value={detail.preBalance}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div className=' hidden'> 
                  <label className="block text-sm font-medium text-gray-700">Payment</label>
                  <input
                    type="number"
                    name="payment"
                    value={detail.payment}
                    onChange={(e) => handleDetailChange(index, e)}
                    step="0.01"
                    min="0"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className=' hidden'> 
                  <label className="block text-sm font-medium text-gray-700">Balance</label>
                  <input
                    type="number"
                    name="balance"
                    value={detail.balance}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeDealerRow(index)}
                    className="mt-6 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                    disabled={isRemovingDealer}
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
              disabled={loading || isAddingDealer}
            >
              Add Dealer
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading || !suppliers.length || !dealers.length || !products.length}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
                loading || !suppliers.length || !dealers.length || !products.length
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              Submit Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}