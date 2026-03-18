import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getDashboardConfig, getOrders } from '../../services/api';
import { Settings, Download, Moon, Sun } from 'lucide-react';

import KPIWidget from './widgets/KPIWidget';
import ChartWidget from './widgets/ChartWidget';
import TableWidget from './widgets/TableWidget';
import DateFilter from './DateFilter';

import { useTheme } from '../../context/ThemeContext';
import { exportToPDF } from '../../utils/exportUtils';

const DashboardView = () => {

  const navigate = useNavigate();
  const { isDarkMode = false, toggleTheme = () => {} } = useTheme() || {};

  const [config, setConfig] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('All time');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const socket = React.useMemo(() => io('http://localhost:5000'), []);

  const fetchData = useCallback(async () => {

    setLoading(true);

    try {

      const [configRes, ordersRes] = await Promise.all([
        getDashboardConfig(),
        getOrders()
      ]);

      const dashboardConfig =
        configRes.data?.data || configRes.data || {};

      let orderData =
        ordersRes?.data?.data || ordersRes?.data || [];

      const now = new Date();

      if (dateRange !== "All time") {
        orderData = orderData.filter(order => {
          const created = new Date(order.createdAt);

          if (dateRange === "Today") {
            return created.toDateString() === now.toDateString();
          }

          if (dateRange === "Last 7 Days") {
            return (now - created) <= 7 * 86400000;
          }

          if (dateRange === "Last 30 Days") {
            return (now - created) <= 30 * 86400000;
          }

          if (dateRange === "Last 90 Days") {
            return (now - created) <= 90 * 86400000;
          }

          return true;
        });
      }

      setConfig(dashboardConfig);
      setOrders(orderData);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }

  }, [dateRange]);

  useEffect(() => {

    fetchData();

    socket.on('order_added', fetchData);
    socket.on('order_updated', fetchData);
    socket.on('order_deleted', fetchData);

    return () => {
      socket.off('order_added');
      socket.off('order_updated');
      socket.off('order_deleted');
    };

  }, [fetchData]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-[#54bd95] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <h2 className="text-red-500 text-center mt-20">{error}</h2>;
  }

  if (!config?.widgets?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button
          onClick={() => navigate('/configure')}
          className="bg-[#54bd95] text-white px-6 py-3 rounded-xl font-bold"
        >
          Configure Dashboard
        </button>
      </div>
    );
  }
  /* ================= UI ================= */
  return (
    <div id="dashboard-content" className={`min-h-screen p-10 ${isDarkMode ? "bg-[#0B1733]" : "bg-[#F7F9FC]"}`}>
      {/* HEADER */}
      <div className="flex justify-between mb-8">

        <h1 className="text-xl md:text-3xl font-bold">Analytics Dashboard</h1>

        <div className="flex gap-4">

          <button onClick={toggleTheme} className="p-2 rounded-lg bg-white/10">
              {isDarkMode ? <Sun color="white" size={18}/> : <Moon color="black" size={18}/>}
          </button>

          <button onClick={() => exportToPDF()} className="p-2 rounded-lg bg-white/10">
                {isDarkMode ? <Download color="white" size={18}/> : <Download color="black" size={18}/>}
          </button>

          <button
            onClick={() => navigate('/configure')}
            className="p-2 rounded-lg bg-[#54bd95] text-white flex items-center gap-2">
            <Settings size={16} color="white"/> Configure
          </button>

        </div>

      </div>

      {/* DATE FILTER */}
      <div className="mb-6 flex justify-end">
        <DateFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* ✅ FINAL GRID FIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        

        {config.widgets.map(widget => (

          <div key={widget.id || widget._id} className="bg-white rounded-xl p-5 shadow min-h-[300px] flex flex-col">

            <h3 className="text-sm font-bold mb-3">{widget.title}</h3>

            <div className="h-full flex flex-col">

              {widget.type === "KPI" && (
                <KPIWidget widget={widget} orders={orders} />
              )}

              {widget.type === "Table" && (
               <TableWidget widget={widget} orders={orders} />
              )}

              {(
             widget.type?.toLowerCase().includes("chart") ||
             widget.type?.toLowerCase().includes("bar") ||
             widget.type?.toLowerCase().includes("line") ||
             widget.type?.toLowerCase().includes("area") ||
             widget.type?.toLowerCase().includes("pie") ||
             widget.type?.toLowerCase().includes("scatter")
             ) && (
               <ChartWidget widget={widget} orders={orders} />
            )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default DashboardView;