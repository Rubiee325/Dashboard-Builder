import React, { useState, useEffect } from "react";
import { getOrders } from "../../../services/api";

const TableWidget = ({ widget, drillDownFilter }) => {

  const { config } = widget;

  const {
    columns = [],
    sortBy = "Order Date",
    pagination = "10",
    fontSize = 14,
    headerBg = "#54bd95"
  } = config;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Orders load failed", err);
      }
    };
    loadOrders();
  }, []);

  const fieldMap = {
    "Customer Name": ["firstName","lastName"],
    "Email ID": "email",
    "Phone Number": "phone",
    "Product": "product",
    "Quantity": "quantity",
    "Unit Price": "unitPrice",
    "Total Amount": "totalAmount",
    "Status": "status",
    "Created By": "createdBy",
    "Order Date": "createdAt"
  };

  let data = [...orders];

  if (drillDownFilter) {
    data = data.filter(
      (o) =>
        o.product === drillDownFilter ||
        o.status === drillDownFilter ||
        o.createdBy === drillDownFilter
    );
  }

  data.sort((a, b) => {
    if (sortBy === "Order Date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "Ascending") {
      return a.totalAmount - b.totalAmount;
    }
    if (sortBy === "Descending") {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const displayData = data.slice(0, Number(pagination));

  return (

    <div
      style={{ fontSize }}
      // className="w-full max-h-[250px] overflow-auto border rounded-xl"
      className="w-full overflow-auto"
    >

      <table className="w-full border-collapse">

        {/* HEADER */}
        <thead className="sticky top-0 z-10">
          <tr style={{ background: headerBg }}>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-white text-xs uppercase text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>

          {displayData.map((row, i) => (

            <tr key={i} className="border-b hover:bg-gray-50">

              {columns.map((col) => {

                let value;

                if (col === "Customer Name") {
                  value = `${row.firstName || ""} ${row.lastName || ""}`;
                }

                else if (col === "Order Date") {
                  value = row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString()
                    : "-";
                }

                else if (col === "Total Amount") {
                  value = `$${row.totalAmount ?? 0}`;
                }

                else {
                  const field = fieldMap[col];
                  value = row[field];
                }

                return (
                  <td key={col} className="px-4 py-3 whitespace-nowrap">
                    {value ?? "-"}
                  </td>
                );

              })}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default TableWidget;