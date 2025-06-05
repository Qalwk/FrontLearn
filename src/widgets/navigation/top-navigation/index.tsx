import { 
  Menu, 
  Bell, 
  Sun, 
  Moon,
  Search,
  Globe
} from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/entities/i18n/providers/language-provider";
import { useAuth } from "@/entities/session/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

interface TopNavigationProps {
  toggleSidebar: () => void;
}

/**
 * Top navigation bar component
 */
export function TopNavigation({ toggleSidebar }: TopNavigationProps) {
  const { currentUser, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    // In a real app, we would toggle the theme class on the document
    // and save the preference to localStorage
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };
  
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ru" : "en");
  };
  
  return (
    <header className="border-b border-border h-14 flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>
        
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-9 pl-8 pr-3 rounded-md bg-input-background focus:outline-none focus:ring-1 focus:ring-ring w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleLanguage}
          title={language === "en" ? "Switch to Russian" : "Switch to English"}
        >
          <Globe size={20} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                {t("common.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}