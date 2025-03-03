import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = {
  blue: {
    primary: "bg-blue-500 dark:bg-blue-600",
    secondary: "bg-blue-200 dark:bg-blue-800",
    accent: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    primary: "bg-purple-500 dark:bg-purple-600",
    secondary: "bg-purple-200 dark:bg-purple-800",
    accent: "text-purple-600 dark:text-purple-400",
  },
  green: {
    primary: "bg-emerald-500 dark:bg-emerald-600",
    secondary: "bg-emerald-200 dark:bg-emerald-800",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    primary: "bg-rose-500 dark:bg-rose-600",
    secondary: "bg-rose-200 dark:bg-rose-800",
    accent: "text-rose-600 dark:text-rose-400",
  },
};

const SchedulerApp = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("blue");
  const [showSettings, setShowSettings] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    priority: "medium",
    category: "meeting",
    location: "",
    attendees: "",
    reminder: "15",
  });

  // Theme management
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (currentView === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else if (currentView === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setSelectedDate(newDate);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const generateWeekDays = () => {
    const days = [];
    const day = new Date(selectedDate);
    day.setDate(day.getDate() - day.getDay());

    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    return days;
  };

  const handleAddEvent = () => {
    const eventWithDate = {
      ...newEvent,
      id: Date.now(),
      date: selectedDate.toISOString().split("T")[0],
    };
    setEvents([...events, eventWithDate]);
    setNewEvent({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      priority: "medium",
      category: "meeting",
      location: "",
      attendees: "",
      reminder: "15",
    });
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) => event.date === date.toISOString().split("T")[0]
    );
  };

  const getEventStyle = (priority) => {
    const theme = themes[currentTheme];
    const baseStyle =
      "rounded-lg p-2 mb-1 text-sm shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer";
    switch (priority) {
      case "high":
        return `${baseStyle} bg-red-500 dark:bg-red-600 text-white`;
      case "medium":
        return `${baseStyle} ${theme.primary} text-white`;
      default:
        return `${baseStyle} ${theme.secondary} ${theme.accent}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className={`h-8 w-8 ${themes[currentTheme].accent}`} />
            <h1 className="text-2xl font-bold">Scheduler Pro</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDark(!isDark)}
                    className={themes[currentTheme].accent}
                  >
                    {isDark ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Settings */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings
                    className={`h-5 w-5 ${themes[currentTheme].accent}`}
                  />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize Your Schedule</DialogTitle>
                  <DialogDescription>
                    Choose your preferred theme and display options
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Color Theme</Label>
                    <div className="flex space-x-2">
                      {Object.keys(themes).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setCurrentTheme(theme)}
                          className={`w-8 h-8 rounded-full ${
                            themes[theme].primary
                          } 
                            ${
                              currentTheme === theme
                                ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                                : ""
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* View Selector */}
            <Select value={currentView} onValueChange={setCurrentView}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Event Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className={themes[currentTheme].primary}>
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event in your schedule
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Event title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Event description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Event location"
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="attendees">Attendees</Label>
                    <Input
                      id="attendees"
                      placeholder="Add attendees (comma separated)"
                      value={newEvent.attendees}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, attendees: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newEvent.priority}
                      onValueChange={(value) =>
                        setNewEvent({ ...newEvent, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reminder">Reminder</Label>
                    <Select
                      value={newEvent.reminder}
                      onValueChange={(value) =>
                        setNewEvent({ ...newEvent, reminder: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Set reminder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleAddEvent}
                    className={themes[currentTheme].primary}
                  >
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="mb-6 border dark:border-gray-800">
          <CardContent className="p-0">
            <div className="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700">
              {/* Time column */}
              <div className="bg-white dark:bg-gray-800 p-2">
                <div className="h-12"></div>
                {generateTimeSlots().map((time, index) => (
                  <div
                    key={time}
                    className="h-12 border-t border-gray-200 dark:border-gray-700 p-1"
                  >
                    <span className="text-sm font-medium">{time}</span>
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {generateWeekDays().map((date, index) => (
                <div key={index} className="bg-white dark:bg-gray-800">
                  <div
                    className={`h-12 p-2 text-center border-b border-gray-200 dark:border-gray-700 
                    ${
                      date.toDateString() === new Date().toDateString()
                        ? themes[currentTheme].secondary
                        : ""
                    }`}
                  >
                    <div className="font-semibold">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-sm">
                      {date.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>

                  {generateTimeSlots().map((time, timeIndex) => (
                    <div
                      key={`${index}-${timeIndex}`}
                      className={`h-12 border-t border-gray-200 dark:border-gray-700 p-1
                        ${
                          date.toDateString() === new Date().toDateString()
                            ? "bg-gray-50 dark:bg-gray-800/50"
                            : ""
                        }`}
                    >
                      {getEventsForDate(date)
                        .filter((event) => event.startTime === time)
                        .map((event, eventIndex) => (
                          <TooltipProvider key={eventIndex}>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className={getEventStyle(event.priority)}>
                                  <div className="font-medium truncate">
                                    {event.title}
                                  </div>
                                  <div className="text-xs opacity-90 truncate">
                                    {event.location && `📍 ${event.location}`}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-sm">{event.description}</p>
                                  <p className="text-sm">
                                    {event.startTime} - {event.endTime}
                                  </p>
                                  {event.location && (
                                    <p className="text-sm">
                                      📍 {event.location}
                                    </p>
                                  )}
                                  {event.attendees && (
                                    <p className="text-sm">
                                      👥 {event.attendees}
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Your scheduled events for the selected period
                </CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.priority === "high"
                              ? "bg-red-500"
                              : event.priority === "medium"
                              ? themes[currentTheme].primary
                              : themes[currentTheme].secondary
                          }`}
                        />
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Event Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Event</DropdownMenuItem>
                          <DropdownMenuItem>Copy Event</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              const updatedEvents = events.filter(
                                (e) => e.id !== event.id
                              );
                              setEvents(updatedEvents);
                            }}
                          >
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      • {event.startTime} - {event.endTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">{event.description}</p>
                      {event.location && (
                        <p className="text-sm flex items-center space-x-1">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </p>
                      )}
                      {event.attendees && (
                        <p className="text-sm flex items-center space-x-1">
                          <span>👥</span>
                          <span>{event.attendees}</span>
                        </p>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Reminder: {event.reminder} minutes before
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {events.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No events scheduled</p>
                  <p className="text-sm">
                    Click the "Add Event" button to create your first event
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulerApp;
