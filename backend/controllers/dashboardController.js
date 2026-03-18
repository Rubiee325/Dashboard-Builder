const Dashboard = require('../models/Dashboard');

exports.getDashboard = async (req, res, next) => {
  try {
    const dashboard = await Dashboard.findOne({ userId: 'default-user' });
    if (!dashboard) return res.status(200).json({ userId: 'default-user', widgets: [] });
    res.status(200).json(dashboard);
  } catch (err) {
    next(err);
  }
};

exports.saveDashboard = async (req, res, next) => {
  try {
    const { widgets } = req.body;
    let dashboard = await Dashboard.findOne({ userId: 'default-user' });
    
    if (dashboard) {
      dashboard.widgets = widgets;
      await dashboard.save();
    } else {
      dashboard = new Dashboard({ userId: 'default-user', widgets });
      await dashboard.save();
    }
    res.status(201).json(dashboard);
  } catch (err) {
    next(err);
  }
};

exports.removeWidget = async (req, res, next) => {
  try {
    const dashboard = await Dashboard.findOne({ userId: 'default-user' });
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    
    dashboard.widgets = dashboard.widgets.filter(w => w.id !== req.params.id);
    await dashboard.save();
    res.status(200).json({ message: 'Widget removed successfully', dashboard });
  } catch (err) {
    next(err);
  }
};
