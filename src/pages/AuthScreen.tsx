import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/app/providers/AuthContext";
import { useLanguage } from "@/app/providers/LanguageContext";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  number: z.string().regex(/^\+\d{10,15}$/, { message: ("Invalid phone number format") }),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  agreeToTerms: z.boolean(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(data => data.agreeToTerms === true, {
  message: "Вы должны принять условия использования",
  path: ["agreeToTerms"],
})

export function AuthScreen() {
  const { t } = useLanguage();
  const { login, register, loginAsAdmin, loginAsUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "Ah",
      email: "ASZADC@gmail.com",
      number: "+2354234432545",
      password: "zxczxc",
      confirmPassword: "zxczxc",
      agreeToTerms: false,
    },
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    setError(null);
    try {
      await register(data.name, data.email, data.password, data.number);
      setSuccess("Registration successful!");
      setActiveTab("login");
    } catch (err) {
      setError("Email already in use");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-primary p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
            </div>
            <h1 className="text-primary">{t("app.name")}</h1>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">{activeTab === "login" ? t("auth.login") : t("auth.register")}</CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" 
                ? "Enter your credentials to access your account" 
                : "Create a new account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    
                    <Button type="submit" className="w-full">
                      {t("auth.login")}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.name")}</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.number")}</FormLabel>
                          <FormControl>
                            <Input placeholder="+79123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex gap-2">
                            <FormControl>
                              <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="bg-white w-[30px] h-[25px] rounded-[4px] border"
                              >
                                <Checkbox.Indicator>
                                  <CheckIcon />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Я согласен с условиями использования
                              </FormLabel>
                              <FormDescription>
                                Принимая условия, вы подтверждаете, что ознакомились с ними.
                              </FormDescription>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    {success && <p className="text-green-600 text-sm">{success}</p>}
                    
                    <Button type="submit" className="w-full">
                      {t("auth.register")}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={loginAsUser}>
                {t("auth.loginAsUser")}
              </Button>
              <Button variant="outline" className="flex-1" onClick={loginAsAdmin}>
                {t("auth.loginAsAdmin")}
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-4">
              For demo purposes only. Quick access buttons added for convenience.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}