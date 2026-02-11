import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  ChartPie,
} from "lucide-react";

const Dashboard = () => {
  const { isAdminLoggedIn } = useContext(AppContext);
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    if (isAdminLoggedIn) {
      setDashData({
        products: 12,
        orders: 6,
        customers: 97,
        revenue: 959.1,
        stores: 2,
      });
    }
  }, [isAdminLoggedIn]);

  if (!dashData) return null;

  return (
    <div className="m-5 space-y-8">
      {/* ========= TOP STATS ========= */}
      <div className="flex flex-wrap gap-4">
        <StatCard
          icon={assets.product_icon}
          value={dashData.products}
          label="Total Products"
        />
        <StatCard
          icon={assets.revenue_icon}
          value={`$${dashData.revenue}`}
          label="Total Revenue"
        />
        <StatCard
          icon={assets.order_icon}
          value={dashData.orders}
          label="Total Orders"
        />
        <StatCard
          icon={assets.store_icon}
          value={dashData.stores}
          label="Total Stores"
        />
      </div>

      {/* ========= CHARTS ROW ========= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Last7DaysSales />
        <OrderCancelRatio />
      </div>

      {/* ========= MONTHLY REVENUE ========= */}
      <MonthlyRevenue />
    </div>
  );
};

/*  STAT CARD  */
const StatCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border hover:scale-105 transition-all">
    <img className="w-14" src={icon} alt="" />
    <div>
      <p className="text-xl font-semibold text-gray-700">{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  </div>
);

/*  LAST 7 DAYS SALES  */
const Last7DaysSales = () => {
  const data = [
    { day: "Mon", sales: 120 },
    { day: "Tue", sales: 210 },
    { day: "Wed", sales: 150 },
    { day: "Thu", sales: 300 },
    { day: "Fri", sales: 250 },
    { day: "Sat", sales: 400 },
    { day: "Sun", sales: 350 },
  ];

  return (
    <div className="bg-white p-5 rounded border">
      <div className="font-medium mb-4 flex gap-2">
        <ChartNoAxesCombined />
        <span>Last 7 Days Sales</span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/*  ORDER VS CANCEL  */
const OrderCancelRatio = () => {
  const data = [
    { name: "Completed", value: 80 },
    { name: "Cancelled", value: 20 },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="bg-white p-5 rounded border flex flex-col items-center">
      <div className="font-medium mb-4 flex gap-2">
        <ChartPie /> <span>Order vs Cancel Ratio</span>
      </div>
      <PieChart width={260} height={260}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

/*  MONTHLY REVENUE  */
const MonthlyRevenue = () => {
  const data = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 2100 },
    { month: "Mar", revenue: 1800 },
    { month: "Apr", revenue: 2500 },
    { month: "May", revenue: 3200 },
  ];

  return (
    <div className="bg-white p-5 rounded border">
      <div className="font-medium mb-4 gap-2 flex">
        <ChartNoAxesColumnIncreasing /> <span>Monthly Revenue</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
