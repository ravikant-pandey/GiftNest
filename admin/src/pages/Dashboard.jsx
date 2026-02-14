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
import dayjs from "dayjs";

/* ---------- HELPERS ---------- */

// Last 7 days sales
const generateLast7DaysData = (orders) => {
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, "day");
    const dayName = date.format("ddd");

    const daySales = orders
      .filter(
        (order) =>
          dayjs(order.createdAt).isSame(date, "day") && order.isPaid === true,
      )
      .reduce((sum, order) => sum + order.amount, 0);

    last7Days.push({
      day: dayName,
      sales: daySales,
    });
  }

  return last7Days;
};

// Monthly revenue from real orders
const generateMonthlyRevenue = (orders) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => {
    const monthRevenue = orders
      .filter((o) => dayjs(o.createdAt).month() === index && o.isPaid === true)
      .reduce((sum, o) => sum + o.amount, 0);

    return { month, revenue: monthRevenue };
  });
};

/* ---------- MAIN DASHBOARD ---------- */

const Dashboard = () => {
  const { isAdminLoggedIn, products, orders, sellers } = useContext(AppContext);
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    if (isAdminLoggedIn) {
      const revenue = orders
        .filter((o) => o.isPaid === true)
        .reduce((sum, o) => sum + o.amount, 0);

      setDashData({
        products: products.length,
        orders: orders.length,
        revenue,
        stores: sellers.length,
      });
    }
  }, [isAdminLoggedIn, products, orders, sellers]);

  if (!dashData) return null;

  return (
    <div className="m-5 space-y-8">
      {/* TOP STATS */}
      <div className="flex flex-wrap gap-4">
        <StatCard
          icon={assets.product_icon}
          value={dashData.products}
          label="Total Products"
        />
        <StatCard
          icon={assets.revenue_icon}
          value={`₹ ${dashData.revenue}`}
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Last7DaysSales orders={orders} />
        <OrderCancelRatio orders={orders} />
      </div>

      <MonthlyRevenue orders={orders} />
    </div>
  );
};

/* ---------- STAT CARD ---------- */

const StatCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border hover:scale-105 transition-all">
    <img className="w-14" src={icon} alt="" />
    <div>
      <p className="text-xl font-semibold text-gray-700">{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  </div>
);

/* ---------- LAST 7 DAYS SALES ---------- */

const Last7DaysSales = ({ orders }) => {
  const data = generateLast7DaysData(orders);

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

/* ---------- ORDER VS CANCEL PIE ---------- */

const OrderCancelRatio = ({ orders }) => {
  const completed = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  const data = [
    { name: "Completed", value: completed },
    { name: "Cancelled", value: cancelled },
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
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

/* ---------- MONTHLY REVENUE ---------- */

const MonthlyRevenue = ({ orders }) => {
  const data = generateMonthlyRevenue(orders);

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
