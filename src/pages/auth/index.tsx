import { useState } from "react";

import { useLanguage } from "@/entities/i18n/providers/language-provider";
import { AuthForm } from "@/features/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

/**
 * Authentication page with login and registration tabs
 */
export function AuthPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">{t("app.title")}</CardTitle>
            <CardDescription>
              {activeTab === "login" 
                ? "Sign in to your account" 
                : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthForm mode="login" />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm mode="register" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}