"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Menu, Users, Package, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

type NavItem = { label: string; href: string; icon: React.ReactNode };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const publicNavLinks: NavItem[] = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    {
      href: "/features",
      label: "Features",
      icon: <Package className="h-4 w-4" />,
    },
    { href: "/docs", label: "Docs", icon: <Users className="h-4 w-4" /> },
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
    <header>
      <div className="flex items-center justify-between border-b h-16 px-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
        <Link href="/" className="text-xl font-bold">
          Axoma
        </Link>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="fixed top-0 left-0 h-screen w-16 bg-background shadow-lg z-50 md:hidden">
          <div className="flex h-16 items-center justify-end border-b px-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <nav className="flex flex-col p-2 space-y-1">
            
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="group relative flex items-center justify-center w-12 h-12 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  {link.icon}
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {link.label}
                  </span>
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/profile")}
                    className="group relative flex w-full items-center justify-center h-12 rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Profile
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="group relative flex w-full items-center justify-center h-12 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Logout
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="group relative flex items-center justify-center w-12 h-12 rounded-md border hover:bg-accent"
                  >
                    <Users className="h-4 w-4" />
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Sign In
                    </span>
                  </Link>
                  <Link
                    href="/register"
                    className="group relative flex items-center justify-center w-12 h-12 rounded-md bg-primary text-white hover:bg-primary/90"
                  >
                    <User className="h-4 w-4" />
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Get Started
                    </span>
                  </Link>
                </>
              )}
            </nav>
          </ScrollArea>
        </aside>
      )}

      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between h-16 px-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
          >
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          <span className="hidden sm:inline">Axoma</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink
                  asChild
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
