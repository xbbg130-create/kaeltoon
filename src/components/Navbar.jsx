"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Home, Menu, X, Sun, Moon, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, resolvedTheme, isDarkMode, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsMobileMenuOpen(false); // Close mobile menu after search
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getThemeIcon = () => {
    // Show appropriate icon based on the current effective theme
    return isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <Link href="/" className="text-2xl font-bold">
              Kaeltoon
            </Link>
          </div>

          {/* Desktop search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search manhwa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 py-6 w-full"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right side: Mobile menu button (mobile) and theme button (desktop) */}
          <div className="flex items-center space-x-2">
            {/* History button - only visible on desktop */}
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/history" aria-label="Reading History">
                  <History className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Theme button - only visible on desktop */}
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {getThemeIcon()}
              </Button>
            </div>

            {/* Mobile menu button - only visible on mobile */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu - hidden on desktop */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="relative">
              <div className="flex gap-2 pb-3">
                <Button variant="ghost" asChild className="flex-1 justify-start">
                  <Link href="/history" onClick={() => setIsMobileMenuOpen(false)}>
                    <History className="h-4 w-4 mr-2" />
                    Reading History
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {getThemeIcon()}
                </Button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search manhwa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 py-3 w-full"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}