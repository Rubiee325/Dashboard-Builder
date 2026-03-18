import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, deleteOrder } from '../../services/api';
import { Edit2, Trash2, Plus, Search, ShoppingCart, LayoutGrid } from 'lucide-react';
import OrderForm from './OrderForm';
import Toast from '../ui/Toast';
import ConfirmationModal from '../ui/ConfirmationModal';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const order = orders.find(o => o._id === deleteId);
      const shortId = order?._id.slice(-6).toUpperCase();
      await deleteOrder(deleteId);
      showToast(`Order ORD-${shortId} has been removed successfully.`);
      fetchOrders();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const filteredOrders = orders.filter(o => 
    `${o.firstName} ${o.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC]">
        <div className="w-12 h-12 border-4 border-[#54bd95]/20 border-t-[#54bd95] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-8 md:p-12 font-sans animate-in fade-in duration-700">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter mb-2">Customer Orders</h1>
                <p className="text-[#64748B] font-medium text-lg">View and manage customer orders and details</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-xl flex items-center gap-3 px-6 shadow-sm min-w-[300px]">
                    <Search size={18} className="text-[#94A3B8]" />
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        className="bg-transparent border-none outline-none w-full text-sm font-bold text-[#0F172A] placeholder:text-[#CBD5E1] placeholder:font-normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => { setEditingOrder(null); setIsFormOpen(true); }}
                    className="bg-[#54bd95] hover:bg-[#3e9e7b] text-white px-8 py-4 rounded-xl font-black text-xs transition-all shadow-xl shadow-[#54bd95]/20 active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                >
                    <Plus size={20} /> Create Order
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-12 border-b border-[#E2E8F0]">
            <button onClick={() => navigate('/')} className="px-2 py-5 text-[#94A3B8] font-black text-xs uppercase tracking-[0.2em] hover:text-[#0F172A] transition-all">Dashboard</button>
            <button className="px-2 py-5 border-b-4 border-[#54bd95] text-[#0F172A] font-black text-xs uppercase tracking-[0.2em] transition-all">Table</button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl p-32 shadow-sm border border-[#E2E8F0] flex flex-col items-center text-center mt-4">
              <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-[#F1F5F9] text-[#E2E8F0]">
                  <ShoppingCart size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-3">No Orders Yet</h2>
              <p className="text-[#64748B] font-medium mb-10 max-w-sm leading-relaxed">Click Create Order to enter new order information.</p>
              <button 
                  onClick={() => { setEditingOrder(null); setIsFormOpen(true); }}
                  className="bg-[#54bd95] hover:bg-[#3e9e7b] text-white px-10 py-4 rounded-xl font-black text-sm transition-all shadow-xl shadow-[#54bd95]/20 active:scale-95 flex items-center gap-3 uppercase tracking-widest"
              >
                  <Plus size={20} /> Create Order
              </button>
          </div>
        ) : (
          /* Table Area */
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                  <tr>
                    {[
                      'S.No', 'Customer ID', 'Customer Name', 'Email ID', 'Phone Number', 
                      'Address', 'Order ID', 'Order Date', 'Product', 'Quantity', 
                      'Unit Price', 'Total Amount', 'Status', 'Created By', 'Actions'
                    ].map((col) => (
                      <th key={col} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] border-b border-[#E2E8F0] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredOrders.map((order, idx) => (
                    <tr key={order._id} className="group hover:bg-[#F8FAFC]/50 transition-all">
                      <td className="px-6 py-5 text-sm font-bold text-[#94A3B8]">{idx + 1}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#64748B] uppercase tracking-tighter">CUST-{order._id.slice(-4).toUpperCase()}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#0F172A] whitespace-nowrap">{order.firstName} {order.lastName}</td>
                      <td className="px-6 py-5 text-sm font-medium text-[#64748B]">{order.email}</td>
                      <td className="px-6 py-5 text-sm font-medium text-[#64748B] whitespace-nowrap">{order.phone}</td>
                      <td className="px-6 py-5 text-sm font-medium text-[#64748B] whitespace-nowrap max-w-[200px] truncate" title={order.streetAddress}>{order.streetAddress}, {order.city}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#54bd95] uppercase tracking-tighter">ORD-{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-5 text-sm font-bold text-[#475569]">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-5 text-sm font-bold text-[#475569] whitespace-nowrap">{order.product}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#0F172A]">{order.quantity}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#475569]">${order.unitPrice?.toLocaleString()}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#0F172A]">${order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Completed' ? 'bg-[#ECFDF5] text-[#10B981]' :
                          order.status === 'In progress' ? 'bg-[#EEF2FF] text-[#6366F1]' :
                          'bg-[#FFFBEB] text-[#F59E0B]'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#64748B] whitespace-nowrap">{order.createdBy}</td>
                      <td className="px-6 py-5 text-right sticky right-0 bg-inherit shadow-[-10px_0_15px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setEditingOrder(order); setIsFormOpen(true); }}
                            className="p-2.5 hover:bg-[#54bd95]/10 rounded-xl text-[#54bd95] transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(order._id)}
                            className="p-2.5 hover:bg-rose-50 rounded-xl text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
        }
      </div>

      <Toast toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      <ConfirmationModal 
        isOpen={!!deleteId}
        title="Delete"
        message={`Are you sure you want to delete order ORD-${orders.find(o => o._id === deleteId)?._id.slice(-6).toUpperCase()}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {isFormOpen && (
        <OrderForm
          order={editingOrder}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(msg) => { 
            setIsFormOpen(false); 
            fetchOrders(); 
            showToast(msg || `Order ${editingOrder ? 'updated' : 'created'} successfully`);
          }}
        />
      )}
    </div>
  );
};

export default OrderList;
