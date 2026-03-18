const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'Please fill the field'] },
  lastName: { type: String, required: [true, 'Please fill the field'] },
  email: { type: String, required: [true, 'Please fill the field'] },
  phone: { type: String, required: [true, 'Please fill the field'] },
  streetAddress: { type: String, required: [true, 'Please fill the field'] },
  city: { type: String, required: [true, 'Please fill the field'] },
  state: { type: String, required: [true, 'Please fill the field'] },
  postalCode: { type: String, required: [true, 'Please fill the field'] },
  country: { 
    type: String, 
    required: [true, 'Please fill the field'],
    enum: { values: ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'], message: 'Please fill the field' }
  },
  product: { 
    type: String, 
    required: [true, 'Please fill the field'],
    enum: { 
      values: ['Fiber Internet 300 Mbps', '5G Unlimited Mobile Plan', 'Fiber Internet 1 Gbps', 'Business Internet 500 Mbps', 'VoIP Corporate Package'],
      message: 'Please fill the field'
    }
  },
  quantity: { type: Number, required: [true, 'Please fill the field'], min: [1, 'quantity must be >= 1'] },
  unitPrice: { type: Number, required: [true, 'Please fill the field'] },
  totalAmount: { type: Number },
  status: { 
    type: String, 
    required: [true, 'Please fill the field'], 
    enum: { values: ['Pending', 'In Progress', 'Completed'], message: 'Please fill the field' },
    default: 'Pending'
  },
  createdBy: { 
    type: String, 
    required: [true, 'Please fill the field'],
    enum: { values: ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin'], message: 'Please fill the field' }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Refactored to Promise-based hook to avoid 'next' callback issues
orderSchema.pre('save', function() {
  this.totalAmount = (this.quantity || 0) * (this.unitPrice || 0);
});

module.exports = mongoose.model('Order', orderSchema);
