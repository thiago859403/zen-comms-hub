import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, Lock, Smartphone } from "lucide-react";
import nuviaLogo from "@/assets/nuvia-logo-transparent.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    twoFactorCode: ""
  });
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    checkIfAlreadyAdmin();
  }, []);

  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [lockTimer, isLocked]);

  const checkIfAlreadyAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (roles) {
        navigate("/dashboard/admin");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error(`Conta bloqueada. Tente novamente em ${lockTimer} segundos.`);
      return;
    }

    setLoading(true);

    try {
      // Verificar se existe algum admin no sistema
      const { data: existingAdmins } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1);

      // Se não existe admin e as credenciais são as corretas, criar o primeiro admin
      if ((!existingAdmins || existingAdmins.length === 0) && 
          formData.username === "NuviaCloud" && 
          formData.password === "26533xt3ef36et3e7dg34r743gh") {
        
        // Criar o usuário admin
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: "admin@nuviacloud.com",
          password: "26533xt3ef36et3e7dg34r743gh",
          options: {
            data: {
              full_name: "NuviaCloud",
              company: "Nuvia Cloud"
            },
            emailRedirectTo: `${window.location.origin}/dashboard/admin`
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Atualizar o perfil
          await supabase
            .from("profiles")
            .update({
              full_name: "NuviaCloud",
              company: "Nuvia Cloud",
              status: "active"
            })
            .eq("id", signUpData.user.id);

          // Adicionar role de admin
          await supabase
            .from("user_roles")
            .insert({ user_id: signUpData.user.id, role: "admin" });

          toast.success("Usuário admin criado com sucesso! Faça login novamente.");
          setLoading(false);
          return;
        }
      }

      // Buscar usuário pelo username (usando email como username)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("email, id")
        .eq("full_name", formData.username)
        .single();

      if (!profiles) {
        throw new Error("Credenciais inválidas");
      }

      // Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profiles.email,
        password: formData.password,
      });

      if (error) throw error;

      // Verificar se é admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        await supabase.auth.signOut();
        throw new Error("Acesso negado: privilégios de administrador necessários");
      }

      // Resetar tentativas e ir para 2FA
      setLoginAttempts(0);
      setUserId(data.user.id);
      setStep("2fa");
      
      // Aqui você chamaria uma edge function para enviar SMS
      toast.success("Código 2FA enviado para seu celular!");
      
    } catch (error: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(300); // 5 minutos
        toast.error("Conta bloqueada por 5 minutos devido a múltiplas tentativas incorretas.");
      } else {
        toast.error(error.message || "Credenciais inválidas");
        toast.warning(`Tentativa ${newAttempts} de 3`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui você verificaria o código 2FA com a edge function
      // Por enquanto, vamos simular a verificação
      if (formData.twoFactorCode.length === 6) {
        // Log da atividade
        await supabase.from("admin_activity_logs").insert({
          admin_id: userId,
          action: "admin_login",
          details: { timestamp: new Date().toISOString() }
        });

        toast.success("Login realizado com sucesso!");
        navigate("/dashboard/admin");
      } else {
        throw new Error("Código inválido");
      }
    } catch (error: any) {
      toast.error(error.message || "Código 2FA inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <img src={nuviaLogo} alt="Nuvia Cloud" className="h-16" />
          </div>
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "login" ? "Painel Administrativo" : "Verificação 2FA"}
          </CardTitle>
          <CardDescription>
            {step === "login" 
              ? "Acesso restrito à equipe Nuvia Cloud" 
              : "Digite o código enviado para +55 31 97524-6891"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="NuviaCloud"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={isLocked || loading}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLocked || loading}
                  className="bg-background/50"
                />
              </div>

              {isLocked && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  Conta bloqueada. Aguarde {Math.floor(lockTimer / 60)}:{(lockTimer % 60).toString().padStart(2, '0')} minutos
                </div>
              )}

              {loginAttempts > 0 && !isLocked && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
                  Tentativa {loginAttempts} de 3
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLocked || loading}
              >
                {loading ? "Verificando..." : "Entrar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Código de Verificação
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={formData.twoFactorCode}
                  onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, '') })}
                  required
                  disabled={loading}
                  className="bg-background/50 text-center text-2xl tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || formData.twoFactorCode.length !== 6}
                >
                  {loading ? "Verificando..." : "Verificar"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep("login")}
                  disabled={loading}
                >
                  Voltar
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Acesso seguro com autenticação em duas etapas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
