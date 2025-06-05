import { LogOut } from "lucide-react";

import { useLanguage } from "@/entities/i18n/providers/language-provider";
import { User } from "@/entities/session/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";

interface UserSectionProps {
  user: User;
  onLogout: () => void;
}

/**
 * User section for the sidebar showing user info and logout button
 */
export function UserSection({ user, onLogout }: UserSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium">{user.name}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onLogout} 
          className="flex-shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <LogOut size={18} />
        </Button>
      </div>
    </div>
  );
}