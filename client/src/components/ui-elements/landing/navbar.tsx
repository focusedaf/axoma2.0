"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Menu, Users, Package, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: React.ReactNode };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const publicNavLinks: NavItem[] = [
    { href: "#hero", label: "Home", icon: <Home className="h-4 w-4" /> },
    {
      href: "#features",
      label: "Features",
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: "#benefits",
      label: "Benefits",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "#how-it-works",
      label: "How It Works",
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: "#why-axoma",
      label: "Why Axoma",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  const authenticatedNavLinks: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    { href: "/exams", label: "Exams", icon: <Package className="h-4 w-4" /> },
  ];

  const navLinks = isLoggedIn ? authenticatedNavLinks : publicNavLinks;

  return (
    <motion.header
      className="border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-5 flex items-center justify-between relative">
        <div className="flex items-center gap-4 flex-none">
          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <motion.h1
            className="text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Axoma
          </motion.h1>
        </div>

        <nav className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 text-md font-semibold text-gray-600">
          {navLinks.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="hover:text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 flex-none">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" /> Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <motion.aside
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          exit={{ x: -200 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 h-screen w-full bg-background shadow-md z-50 md:hidden flex flex-col"
        >
          <div className="flex items-center justify-between h-16 border-b px-4">
            <motion.h1 className="text-lg font-bold">Axoma</motion.h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <nav className="flex flex-col p-2 space-y-2">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  {link.icon}
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t space-y-2">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/profile");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 justify-start rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Profile</span>
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 justify-start rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-md border hover:bg-accent"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              </>
            )}
          </div>
        </motion.aside>
      )}
    </motion.header>
  );
}
