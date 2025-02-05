import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState([5]);
  const [allowContact, setAllowContact] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Share Your Feedback
          </CardTitle>
          <CardDescription>
            Help us improve our services with your valuable feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Type */}
            <div className="space-y-2">
              <Label>Feedback Type</Label>
              <RadioGroup
                defaultValue="general"
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">General</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug">Bug Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feature" id="feature" />
                  <Label htmlFor="feature">Feature Request</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Satisfaction Slider */}
            <div className="space-y-2">
              <Label>Satisfaction Level</Label>
              <Slider
                value={satisfaction}
                onValueChange={setSatisfaction}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Not Satisfied</span>
                <span>Very Satisfied</span>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Detailed Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Please share your detailed feedback, suggestions, or concerns..."
                className="h-32"
              />
            </div>

            {/* Contact Permission */}
            <div className="flex items-center space-x-2">
              <Switch
                id="contact"
                checked={allowContact}
                onCheckedChange={setAllowContact}
              />
              <Label htmlFor="contact">
                Allow us to contact you about your feedback
              </Label>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (optional)</Label>
              <Input
                id="attachments"
                type="file"
                className="cursor-pointer"
                multiple
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
