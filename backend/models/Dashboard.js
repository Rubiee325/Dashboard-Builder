const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['KPI Card', 'Bar Chart', 'Line Chart', 'Pie Chart', 'Area Chart', 'Scatter Plot', 'Table']
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  config: { type: Object, default: {} }
});

const dashboardSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'default-user' },
  widgets: [widgetSchema]
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
