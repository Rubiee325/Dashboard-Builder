import React, { useState, useEffect } from 'react';
import { createOrder, updateOrder } from '../../services/api';
import { X, ChevronRight, DollarSign } from 'lucide-react';

const OrderForm = ({ order, onClose, onSuccess }) => {
  const initialData = {
    firstName: '', lastName: '', email: '', phone: '', streetAddress: '',
    city: '', state: '', postalCode: '', country: 'United States',
    product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: 0,
    totalAmount: 0, status: 'Pending', createdBy: 'Mr. Michael Harris'
  };

  const [formData, setFormData] = useState(order || initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(prev => ({ ...prev, totalAmount: prev.quantity * prev.unitPrice }));
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "streetAddress",
  "city",
  "state",
  "postalCode",
  "country",
  "product",
  "quantity",
  "unitPrice",
  "status",
  "createdBy"
];

for (let field of requiredFields) {
  if (
    formData[field] === "" ||
    formData[field] === null ||
    formData[field] === undefined
  ) {
    alert("Please fill the field");
    return;
  }
}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };





  
  const handleSubmit = async (e) => {
    for (let key in formData) {
  // if (!formData[key]) {
  //   alert("Please fill the field");
  //   return;
  // }
}
    e.preventDefault();
    if (!validate()) return;
    try {
      let response;
      if (order?._id) {
        response = await updateOrder(order._id, formData);
        const shortId = order._id.slice(-6).toUpperCase();
        onSuccess(`Order ORD-${shortId} has been updated successfully`);
      } else {
        response = await createOrder(formData);
        const shortId = response.data.data._id.slice(-6).toUpperCase();
        onSuccess(`New order ORD-${shortId} has been created successfully`);
      }
    } catch (error) { 
      console.error('Order save error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-[150] p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[600px] rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#F1F5F9] shrink-0">
          <h3 className="text-xl font-black text-[#0F172A]">{order ? 'Edit Order' : 'Create Order'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#64748B] transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <div className="space-y-10">
            {/* Section 1: Customer Information */}
            <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#54bd95]"></span>
                    Section 1 — Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-5">
                    <FormInput label="First Name" name="firstName" value={formData.firstName} error={errors.firstName} onChange={handleChange} />
                    <FormInput label="Last Name" name="lastName" value={formData.lastName} error={errors.lastName} onChange={handleChange} />
                    <FormInput label="Email ID" name="email" value={formData.email} error={errors.email} onChange={handleChange} />
                    <FormInput label="Phone Number" name="phone" value={formData.phone} error={errors.phone} onChange={handleChange} />
                    <div className="col-span-2">
                        <FormInput label="Street Address" name="streetAddress" value={formData.streetAddress} error={errors.streetAddress} onChange={handleChange} />
                    </div>
                    <FormInput label="City" name="city" value={formData.city} error={errors.city} onChange={handleChange} />
                    <FormInput label="State / Province" name="state" value={formData.state} error={errors.state} onChange={handleChange} />
                    <FormInput label="Postal Code" name="postalCode" value={formData.postalCode} error={errors.postalCode} onChange={handleChange} />
                    <FormSelect 
                        label="Country" 
                        name="country" 
                        value={formData.country} 
                        options={['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong']} 
                        onChange={handleChange} 
                    />
                </div>
            </section>
 
            {/* Section 2: Order Information */}
            <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Section 2 — Order Information
                </h4>
                <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <FormSelect 
                            label="Choose Product" 
                            name="product" 
                            value={formData.product} 
                            options={['Fiber Internet 300 Mbps', '5GUnlimited Mobile Plan', 'Fiber Internet 1 Gbps', 'Business Internet 500 Mbps', 'VoIP Corporate Package']} 
                            onChange={handleChange} 
                        />
                    </div>
                    <FormInput label="Quantity" name="quantity" type="number" min="1" value={formData.quantity} error={errors.quantity} onChange={handleChange} />
                    <div className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-2 ml-1">Unit Price</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold">$</span>
                            <input
                                type="number"
                                name="unitPrice"
                                value={formData.unitPrice || ''}
                                onChange={handleChange}
                                className={`w-full bg-[#F8FAFC] border ${errors.unitPrice ? 'border-rose-300' : 'border-[#E2E8F0]'} rounded-xl pl-8 pr-4 py-3.5 text-sm font-bold text-[#0F172A] outline-none focus:ring-2 focus:ring-[#54bd95]/10 focus:border-[#54bd95] transition-all`}
                                placeholder="0.00"
                                
                            />  
                        </div>
                    </div>
                    <div className="mt-2">
  <label className="text-sm font-bold">Total Amount</label>
  <input
    type="text"
    value={formData.quantity * formData.unitPrice}
    readOnly
    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
  />
</div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-2 ml-1">Total Amount</label>
                        <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-sm text-[#54bd95] font-black">
                            ${formData.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <FormSelect 
                        label="Status" 
                        name="status" 
                        value={formData.status} 
                        options={['Pending', 'In progress', 'Completed']} 
                        onChange={handleChange} 
                    />
                    <div className="col-span-2">
                        <FormSelect 
                            label="Created By" 
                            name="createdBy" 
                            value={formData.createdBy} 
                            options={['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin']} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </section>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3.5 rounded-xl text-sm font-bold text-[#64748B] hover:bg-white transition-all shadow-sm active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-[#54bd95] hover:bg-[#3e9e7b] text-white px-8 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-[#54bd95]/20 active:scale-95 flex items-center gap-2"
          >
            {order ? 'Save Changes' : 'Submit'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
 
const FormInput = ({ label, name, value, error, onChange, type = "text", ...props }) => (
    <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-2 ml-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
            className={`w-full bg-[#F8FAFC] border ${error ? 'border-rose-300' : 'border-[#E2E8F0]'} rounded-xl px-4 py-3.5 text-sm font-bold text-[#0F172A] outline-none focus:ring-2 focus:ring-[#54bd95]/10 focus:border-[#54bd95] transition-all placeholder:text-[#CBD5E1] placeholder:font-normal`}
            placeholder={`Enter ${label.toLowerCase()}...`}
        />
        {error && <p className="text-rose-500 text-[9px] font-black uppercase mt-1.5 ml-1">{error}</p>}
    </div>
);
 
const FormSelect = ({ label, name, value, options, onChange }) => (
    <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-2 ml-1">{label}</label>
        <div className="relative">
            <select 
                name={name} 
                value={value} 
                onChange={onChange} 
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-sm font-bold text-[#0F172A] outline-none focus:ring-2 focus:ring-[#54bd95]/10 focus:border-[#54bd95] transition-all appearance-none cursor-pointer"
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
                <ChevronRight size={16} className="rotate-90" />
            </div>
        </div>
    </div>
);

export default OrderForm;
