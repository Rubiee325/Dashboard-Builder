import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BarChartWidget = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="x"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="y" fill={color}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartWidget;