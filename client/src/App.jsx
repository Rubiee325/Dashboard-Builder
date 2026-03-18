import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";

import Login from "./components/Login";
import Signup from "./components/Signup";
import DashboardView from "./components/dashboard/DashboardView";
import ConfigCanvas from "./components/dashboard/ConfigCanvas";
import OrderList from "./components/orders/OrderList";

// function App() {
//   return (
//     <ThemeProvider>   {/* ✅ MUST WRAP HERE */}
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<DashboardView />} />
//         <Route path="/configure" element={<ConfigCanvas />} />
//         <Route path="/orders" element={<OrderList />} />
//       </Routes>
//     </ThemeProvider>
//   );
// }

// export default App;


function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Layout Wrapper */}
      <Route path="/" element={<Layout />}>

        {/* Default page */}
        <Route index element={<DashboardView />} />

        {/* Pages inside layout */}
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="configure" element={<ConfigCanvas />} />

      </Route>

    </Routes>
  );
}

export default App;