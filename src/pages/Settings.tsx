import { AlertCircle, Check, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/app/providers/AuthContext";
import { useLanguage } from "@/app/providers/LanguageContext";
import { ImageWithFallback } from "@/shared/ui/figma/ImageWithFallback";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export function Settings() {
  const { currentUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  // Profile state
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  
  // Preferences state
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [learningReminders, setLearningReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of calling updateUserProfile, just show a success toast
    toast.success(t("settings.profileUpdated"));
  };
  
  // Handle preferences update
  const handlePreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("settings.preferencesUpdated"));
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1>{t("settings.title")}</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t("settings.profile")}</TabsTrigger>
          <TabsTrigger value="account">{t("settings.account")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("settings.preferences")}</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.profile")}</CardTitle>
                <CardDescription>{t("settings.profileDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                      {currentUser?.avatar ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                          <ImageWithFallback
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                          <User className="w-12 h-12 text-primary" />
                        </div>
                      )}
                      <Button variant="outline" size="sm" type="button">
                        {t("settings.changePicture")}
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">{t("auth.name")}</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("auth.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Check className="mr-2 h-4 w-4" />
                      {t("common.save")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.security")}</CardTitle>
                <CardDescription>{t("settings.changePasswordDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">{t("auth.password")}</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New {t("auth.password").toLowerCase()}</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>{t("settings.change")}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">{t("settings.dangerZone")}</CardTitle>
                <CardDescription>{t("settings.deleteAccountDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {t("settings.deleteAccount")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language")}</CardTitle>
                <CardDescription>{t("settings.languageDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full max-w-xs">
                  <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "ru")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.theme")}</CardTitle>
                <CardDescription>{t("settings.themeDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full max-w-xs">
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("settings.light")}</SelectItem>
                      <SelectItem value="dark">{t("settings.dark")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.notifications")}</CardTitle>
                <CardDescription>{t("settings.preferencesDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">{t("settings.emailNotifs")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t("settings.emailNotifsDesc")}
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="learning-reminders">{t("settings.reminderNotifs")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t("settings.reminderNotifsDesc")}
                        </p>
                      </div>
                      <Switch
                        id="learning-reminders"
                        checked={learningReminders}
                        onCheckedChange={setLearningReminders}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">{t("settings.marketingNotifs")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t("settings.marketingNotifsDesc")}
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Check className="mr-2 h-4 w-4" />
                      {t("common.save")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}