"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Notification = {
  id: string;
  text: string;
  read: boolean;
};

export function SiteHeader() {
  const { userName, userId, userRole } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const displayName = userName ? toTitleCase(userName) : "";

  useEffect(() => {
    if (!userId || !userRole) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/notifications?userId=${userId}&role=${userRole}`
        );
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [userId, userRole]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <h1
          className={cn(
            "font-semibold tracking-tight mr-auto",
            "text-lg sm:text-xl md:text-2xl lg:text-3xl"
          )}
        >
          Welcome, {displayName}
        </h1>

     
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 bg-background text-white shadow-lg rounded-lg p-1">
            {notifications.length === 0 ? (
              <DropdownMenuItem className="text-sm text-muted-foreground cursor-default">
                No notifications
              </DropdownMenuItem>
            ) : (
              notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="text-sm flex justify-between items-center"
                >
                  <span>{notif.text}</span>
                  <button
                    onClick={() => handleDismiss(notif.id)}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
