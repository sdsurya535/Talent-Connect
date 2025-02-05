import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const RecentApplications = () => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/api/placeholder/40/40" alt="Applicant" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">
                Software Development Intern
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="bg-yellow-500">Pending Review</Badge>
              <span className="text-sm text-muted-foreground">2h ago</span>
            </div>
          </div>

          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/api/placeholder/40/40" alt="Applicant" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">Sarah Davis</p>
              <p className="text-sm text-muted-foreground">
                UI/UX Design Intern
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="bg-green-500">Shortlisted</Badge>
              <span className="text-sm text-muted-foreground">5h ago</span>
            </div>
          </div>

          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/api/placeholder/40/40" alt="Applicant" />
              <AvatarFallback>MW</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">Mike Wilson</p>
              <p className="text-sm text-muted-foreground">
                Data Science Intern
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="bg-red-500">Rejected</Badge>
              <span className="text-sm text-muted-foreground">1d ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplications;
