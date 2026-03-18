import React from "react";
const KPIWidget = ({ widget, orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data
      </div>
    );
  }
  const config = widget.config || {};
  const fieldMap = {
    "Total Amount": "totalAmount",
    "Quantity": "quantity",
    "Unit Price": "unitPrice"
  };
  const metricKey = fieldMap[config.metric] || "totalAmount";
  let value = 0;
  if (config.aggregation === "Sum") {
    value = orders.reduce(
      (sum, o) => sum + (Number(o[metricKey]) || 0),
      0
    );
  }
  if (config.aggregation === "Count") {
    value = orders.length;
  }
  if (config.aggregation === "Average") {
    value =
      orders.length === 0
        ? 0
        : orders.reduce(
            (sum, o) => sum + (Number(o[metricKey]) || 0),
            0
          ) / orders.length;
  }
  return (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-4xl font-black text-[#0F172A]">
        {Math.round(value)}
      </h2>
      <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">
        Sum of {config.metric || "Total Amount"}
      </p>
    </div>
  );
};
export default KPIWidget;