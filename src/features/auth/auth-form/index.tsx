import { useState } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/entities/i18n/providers/language-provider";
import { useAuth } from "@/entities/session/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";


interface AuthFormProps {
  mode: "login" | "register";
}

/**
 * Authentication form for login and registration
 */
export function AuthForm({ mode }: AuthFormProps) {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        toast.success("Successfully logged in!");
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">{t("auth.name")}</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></span>
            {mode === "login" ? "Logging in..." : "Creating account..."}
          </span>
        ) : (
          t(mode === "login" ? "auth.login" : "auth.register")
        )}
      </Button>
    </form>
  );
}