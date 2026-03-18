const Dashboard = require('../models/Dashboard');
const auth = require('../middleware/auth');

const saveDashboardConfig = async (req, res) => {
  try {

    const userId = req.user.id;

    let config = await Dashboard.findOne({ userId });

    if (!config) {
      config = new Dashboard({
        userId,
        widgets: req.body.widgets
      });
    } else {
      config.widgets = req.body.widgets;
    }

    await config.save();

    res.json({ success: true, data: config });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getDashboardConfig = async (req, res) => {
  try {

    const userId = req.user.id;

    const config = await Dashboard.findOne({ userId });

    res.json({ success: true, data: config || { widgets: [] } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET
// const getDashboardConfig = async (req, res) => {
//   try {
//     let dashboard = await Dashboard.findOne();

//     if (!dashboard) {
//       dashboard = new Dashboard({
//         name: "Main Dashboard",
//         userId: "default-user",
//         widgets: []
//       });
//       await dashboard.save();
//     }

//     res.json({ success: true, data: dashboard });

//   } catch (err) {
//     console.error("GET DASHBOARD ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch dashboard" });
//   }
// };

// POST (SAVE)

// const saveDashboardConfig = async (req, res) => {
//   try {
//     console.log("REQ BODY:", req.body);
//     const { widgets } = req.body;

//     console.log("SAVE PAYLOAD:", widgets); // DEBUG

//     let dashboard = await Dashboard.findOne();

//     if (!dashboard) {
//       dashboard = new Dashboard({
//         name: "Main Dashboard",
//         userId: "default-user",
//         widgets
//       });
//     } else {
//       dashboard.widgets = widgets;
//     }

//     await dashboard.save();

//     res.json({ success: true, data: dashboard });

//   } catch (err) {
//     console.error("SAVE DASHBOARD ERROR:", err);
//     res.status(500).json({ message: "Save failed" });
//   }
// };

module.exports = {
  getDashboardConfig,
  saveDashboardConfig
};