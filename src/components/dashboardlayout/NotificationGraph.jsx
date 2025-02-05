import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, subWeeks, subMonths, startOfToday } from "date-fns";

const NotificationGraph = () => {
  const today = startOfToday();
  const [timeRange, setTimeRange] = useState("7days");
  const [notificationType, setNotificationType] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 7),
    to: today,
  });

  // Pre-defined date ranges for quick selection
  const dateRanges = {
    "7days": {
      from: subDays(today, 7),
      to: today,
      label: "Last 7 Days",
    },
    "30days": {
      from: subDays(today, 30),
      to: today,
      label: "Last 30 Days",
    },
    "3months": {
      from: subMonths(today, 3),
      to: today,
      label: "Last 3 Months",
    },
  };

  // Sample data generator based on date range
  const generateDataForRange = (range) => {
    const data = [];
    let currentDate = range.from;
    while (currentDate <= range.to) {
      data.push({
        date: format(currentDate, "MMM dd"),
        sent: Math.floor(Math.random() * 100) + 400,
        viewed: Math.floor(Math.random() * 80) + 300,
        applied: Math.floor(Math.random() * 50) + 100,
      });
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return data;
  };

  const [data, setData] = useState(generateDataForRange(dateRanges["7days"]));

  // Update data when time range changes
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    const newDateRange = dateRanges[newRange];
    setDateRange(newDateRange);
    setData(generateDataForRange(newDateRange));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Notification Trends</CardTitle>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Date Range Quick Select */}
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>

            {/* Notification Type Filter */}
            <Select
              value={notificationType}
              onValueChange={setNotificationType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
              </SelectContent>
            </Select>

            {/* Current Date Range Display */}
            <div className="flex items-center bg-secondary px-3 py-2 rounded-md text-sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                {format(dateRange.to, "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="date"
                className="text-sm text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {(notificationType === "all" || notificationType === "sent") && (
                <Line
                  type="monotone"
                  dataKey="sent"
                  name="Notifications Sent"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              )}
              {(notificationType === "all" ||
                notificationType === "viewed") && (
                <Line
                  type="monotone"
                  dataKey="viewed"
                  name="Notifications Viewed"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              )}
              {(notificationType === "all" ||
                notificationType === "applied") && (
                <Line
                  type="monotone"
                  dataKey="applied"
                  name="Applications Submitted"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationGraph;
