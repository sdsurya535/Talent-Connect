import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ActiveJobs = () => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Active Job Postings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Frontend Development Intern</h3>
              <div className="flex items-center gap-2">
                <Badge>Remote</Badge>
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">JavaScript</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                15 applications • Posted 2 days ago
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Data Science Intern</h3>
              <div className="flex items-center gap-2">
                <Badge>Hybrid</Badge>
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">ML</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                28 applications • Posted 3 days ago
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">UI/UX Design Intern</h3>
              <div className="flex items-center gap-2">
                <Badge>On-site</Badge>
                <Badge variant="outline">Figma</Badge>
                <Badge variant="outline">Adobe XD</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                22 applications • Posted 5 days ago
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveJobs;
