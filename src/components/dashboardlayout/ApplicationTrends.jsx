import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", applications: 65, shortlisted: 28 },
  { month: "Feb", applications: 85, shortlisted: 32 },
  { month: "Mar", applications: 125, shortlisted: 45 },
  { month: "Apr", applications: 175, shortlisted: 58 },
  { month: "May", applications: 150, shortlisted: 48 },
  { month: "Jun", applications: 200, shortlisted: 62 },
];

const ApplicationTrends = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Application Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#8884d8"
                strokeWidth={2}
                name="Total Applications"
              />
              <Line
                type="monotone"
                dataKey="shortlisted"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Shortlisted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTrends;
