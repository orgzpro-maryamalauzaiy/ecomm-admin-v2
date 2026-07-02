import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

// Types
interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image?: string;
}

interface Order {
  id?: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_price: number;
  subtotal: number;
  admin_fee: number;
  shipping_cost: number;
  discount: number;
  order_status: 'pending'  | 'successed' | 'failed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_code: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  estimated_delivery?: string;
}
// 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

interface OrderDetailPageProps {
  mode: 'view' | 'edit' | 'create';
}

// Status options with colors
const orderStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
];

const paymentMethodOptions = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'cod', label: 'Cash on Delivery' },
];

const OrderDetail: React.FC<OrderDetailPageProps> = ({ mode = 'view' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(mode === 'edit');
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'payment'>('details');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [subtotal, setSubtotal] = useState(0)

  const [order, setOrder] = useState<Order>({
    invoice_number: "",
    customer_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    total_price: 0,
    subtotal: 0,
    admin_fee: 0,
    shipping_cost: 0,
    discount: 0,
    order_status: 'pending',
    payment_status: 'pending',
    payment_code: "",
    shipping_address: "",
    shipping_city: "",
    shipping_province: "",
    shipping_postal_code: "",
    notes: "",
    items: [],
    created_at: "",
    updated_at: "",
    tracking_number: "",
    estimated_delivery: "",
  });

  // Fetch order data if in view/edit mode and id exists
  useEffect(() => {
    if ((mode === 'view' || mode === 'edit') && id) {
      fetchOrder();
    }

    if(subtotal == 0){
      let subtotal = 0
      order.items.map(item => {
        subtotal += (item.price * item.quantity)

        console.log('subtotal', subtotal)
      })

      setSubtotal(subtotal)
      // order.subtotal = subtotal
    }

    console.log(subtotal)
    // order.items.map(item => item.price )
  }, [id, mode, subtotal]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/orders/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    setIsUpdating(true);
    try {
      const response = await axios.patch(`${BASE_URL}/orders/${id}/status`,
        { order_status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setOrder(prev => ({ ...prev, order_status: newStatus as any }));
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    if (!id) return;

    setIsUpdating(true);
    try {
      const response = await axios.patch(`${BASE_URL}/orders/${id}/payment-status`,
        { payment_status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setOrder(prev => ({ ...prev, payment_status: newStatus as any }));
        toast.success(`Payment status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    setIsUpdating(true);
    try {
      const response = await axios.patch(`${BASE_URL}/orders/${id}`, order, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Order updated successfully!');
        setIsEditing(false);
        fetchOrder();
      }
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string, type: 'order' | 'payment') => {
    const options = type === 'order' ? orderStatusOptions : paymentStatusOptions;
    return options.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  // View Mode Render
  if (mode === 'view' || (mode === 'edit' && !isEditing)) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Pesanan</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Pesanan #{order.invoice_number}
            </p>
          </div>
          <div className="flex gap-3">
            {/* <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Order
            </button> */}
            <button
              onClick={() => navigate('/orders')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700"
            >
              Kembali
            </button>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Status Pesanan</p>
            <div className="flex items-center justify-between mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status, 'order')}`}>
                {order.order_status?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Status Pembayaran</p>
            <div className="flex items-center justify-between mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.payment_status, 'payment')}`}>
                {order.payment_status?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pesanan</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{formatCurrency(order.total_price)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pesanan</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex gap-6">
            {[
              { key: 'details', label: 'Order Details' },
              { key: 'items', label: 'Order Items' },
              { key: 'payment', label: 'Payment Info' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                  <p className="text-gray-800 dark:text-white font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-800 dark:text-white">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-gray-800 dark:text-white">{order.customer_phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shipping Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-800 dark:text-white">{order.shipping_address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                    <p className="text-gray-800 dark:text-white">{order.shipping_city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Province</p>
                    <p className="text-gray-800 dark:text-white">{order.shipping_province}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Postal Code</p>
                  <p className="text-gray-800 dark:text-white">{order.shipping_postal_code}</p>
                </div>
                {order.tracking_number && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                    <p className="text-gray-800 dark:text-white font-mono">{order.tracking_number}</p>
                  </div>
                )}
                {order.estimated_delivery && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                    <p className="text-gray-800 dark:text-white">{formatDate(order.estimated_delivery)}</p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Order Notes */}
            {/* {order.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Notes</h3>
                <p className="text-gray-600 dark:text-gray-300">{order.notes}</p>
              </div>
            )} */}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <tr key={item.product_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img src={item.image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">{item.product_name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">ID: {item.product_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-white">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4 text-gray-800 dark:text-white">{item.quantity}</td>
                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No items found in this order
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Subtotal:</td>
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">{formatCurrency(order.total_price - order.admin_fee)}</td>
                  </tr>
                  <tr>
                    {/* <td colSpan={3} className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Shipping Cost:</td>
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">{formatCurrency(order.shipping_cost)}</td> */}
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Admin Fee:</td>
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">{formatCurrency(order.admin_fee)}</td>
                  </tr>
                  {order.discount > 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-right font-medium text-green-600">Discount:</td>
                      <td className="px-6 py-3 font-medium text-green-600">-{order.discount + '%'}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                    <td colSpan={3} className="px-6 py-3 text-right font-bold text-gray-800 dark:text-white">Total:</td>
                    <td className="px-6 py-3 font-bold text-blue-600 text-lg">{formatCurrency(order.total_price)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="text-gray-800 dark:text-white font-medium capitalize">{order.payment_code?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.payment_status, 'payment')}`}>
                    {order.payment_status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status, 'order')}`}>
                    {order.order_status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-800 dark:text-white">{formatDate(order.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Payment Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 mt-1.5 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Order Created</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                {order.order_status !== 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 mt-1.5 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Order {order.order_status}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Edit Mode Render
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Order #{order.invoice_number}
        </h1>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
        >
          Cancel
        </button>
      </div>

      <ComponentCard title="Order Information">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          {/* Order Status */}
          <div>
            <Label htmlFor="order_status">Order Status</Label>
            <select
              id="order_status"
              name="order_status"
              value={order.order_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              disabled={isUpdating}
            >
              {orderStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <Label htmlFor="payment_status">Payment Status</Label>
            <select
              id="payment_status"
              name="payment_status"
              value={order.payment_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              disabled={isUpdating}
            >
              {paymentStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="payment_method">Payment Method</Label>
            <select
              id="payment_method"
              name="payment_method"
              value={order.payment_method}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              disabled={isUpdating}
            >
              <option value="">Select Payment Method</option>
              {paymentMethodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Tracking Number */}
          <div>
            <Label htmlFor="tracking_number">Tracking Number</Label>
            <Input
              type="text"
              id="tracking_number"
              name="tracking_number"
              value={order.tracking_number || ''}
              onChange={handleInputChange}
              placeholder="Enter tracking number"
              disabled={isUpdating}
            />
          </div>

          {/* Estimated Delivery */}
          <div>
            <Label htmlFor="estimated_delivery">Estimated Delivery Date</Label>
            <Input
              type="date"
              id="estimated_delivery"
              name="estimated_delivery"
              value={order.estimated_delivery?.split('T')[0] || ''}
              onChange={handleInputChange}
              disabled={isUpdating}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Order Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={order.notes || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="Add internal notes about this order"
              disabled={isUpdating}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </ComponentCard>

      {/* Quick Status Update Buttons */}
      <div className="mt-6">
        <ComponentCard title="Quick Status Updates">
          <div className="flex flex-wrap gap-3">
            {orderStatusOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                disabled={isUpdating || order.order_status === opt.value}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  order.order_status === opt.value
                    ? opt.color + ' cursor-default'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Set as {opt.label}
              </button>
            ))}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default OrderDetail;