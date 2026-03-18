import React from "react";
const TableWidget = ({ widget, orders = [], drillDownFilter }) => {
  const { config } = widget;
  const {
    columns = [],
    sortBy = "Order Date",
    pagination = "10",
    fontSize = 14,
    headerBg = "#54bd95"
  } = config;
  const fieldMap = {
    "Customer Name": ["firstName", "lastName"],
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
      return (a.totalAmount || 0) - (b.totalAmount || 0);
    }
    if (sortBy === "Descending") {
      return (b.totalAmount || 0) - (a.totalAmount || 0);
    }
    return 0;
  });
  const displayData = data.slice(0, Number(pagination));
  return (
    <div style={{ fontSize }} className="w-full overflow-auto">
      <table className="w-full border-collapse">
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