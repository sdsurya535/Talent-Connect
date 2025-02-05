import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  FileText,
  UserCheck,
  Mail,
  Settings,
  Filter,
} from "lucide-react";
import ApplicationTrends from "@/components/dashboardlayout/ApplicationTrends";
import RecentApplications from "@/components/dashboardlayout/RecentApps";
import ActiveJobs from "@/components/dashboardlayout/ActiveJobs";
import JobStats from "@/components/dashboardlayout/JobStats";
// import NotificationGraph from "@/components/NotificationGraph";
// import StudentPerformanceAnalytics from "@/components/StudentPerformanceAnalytics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StudentPerformanceAnalytics from "@/components/dashboardlayout/StudentPerformanceAnalytics";
import NotificationGraph from "@/components/dashboardlayout/NotificationGraph";

const TalentConnectDashboard = () => {
  // const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Talent Connect Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Job Statistics */}
      <JobStats />

      {/* Notification Analytics */}
      <NotificationGraph />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Application Trends Chart */}
        <ApplicationTrends />

        {/* Recent Applications */}
        <RecentApplications />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Active Jobs */}
        <ActiveJobs />

        {/* Additional Card for Quick Actions */}
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Review Applications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="mr-2 h-4 w-4" />
                Schedule Interviews
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Send Offer Letters
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Manage Job Posts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Analytics */}
      <StudentPerformanceAnalytics />

      {/* Shortlisted Candidates Section */}
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Shortlisted Candidates</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Candidate Row */}
              <div className="grid grid-cols-6 items-center gap-4 rounded-lg border p-4">
                <div className="col-span-2 flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/40/40" alt="Candidate" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Alex Chen</p>
                    <p className="text-sm text-muted-foreground">
                      Frontend Development
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm">Technical Assessment: 92%</p>
                  <p className="text-sm text-muted-foreground">
                    Interview Score: 8.5/10
                  </p>
                </div>
                <div className="col-span-1">
                  <Badge className="bg-green-500">Final Round</Badge>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>
              </div>

              {/* Another Candidate Row */}
              <div className="grid grid-cols-6 items-center gap-4 rounded-lg border p-4">
                <div className="col-span-2 flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/40/40" alt="Candidate" />
                    <AvatarFallback>RP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Rachel Park</p>
                    <p className="text-sm text-muted-foreground">
                      Data Science
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm">Technical Assessment: 88%</p>
                  <p className="text-sm text-muted-foreground">
                    Interview Score: 9/10
                  </p>
                </div>
                <div className="col-span-1">
                  <Badge className="bg-yellow-500">Second Round</Badge>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentConnectDashboard;
