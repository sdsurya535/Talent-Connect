
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, UserCheck, FileText } from "lucide-react";

const JobStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <Card className="border-l-4 border-l-blue-500 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <div className="transition-transform duration-200 group-hover:rotate-12">
            <Briefcase className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-slide-up">127</div>
          <p className="text-xs text-muted-foreground">+5 posted this week</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Job Posts</CardTitle>
          <div className="transition-transform duration-200 group-hover:rotate-12">
            <FileText className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-slide-up">2,350</div>
          <p className="text-xs text-muted-foreground">+180 new job posts</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
          <div className="transition-transform duration-200 group-hover:rotate-12">
            <UserCheck className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-slide-up">342</div>
          <p className="text-xs text-muted-foreground">+24 this week</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rejected</CardTitle>
          <div className="transition-transform duration-200 group-hover:rotate-12">
            <Users className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-slide-up">573</div>
          <p className="text-xs text-muted-foreground">+48 from last month</p>
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JobStats;
