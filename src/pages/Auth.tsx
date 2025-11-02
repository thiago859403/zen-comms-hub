import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, signupSchema } from "@/lib/validations";
import { z } from "zod";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      ...(isLogin ? {} : {
        name: formData.get("name") as string,
        company: formData.get("company") as string,
      }),
    };

    try {
      const schema = isLogin ? loginSchema : signupSchema;
      schema.parse(data);
      
      // TODO: Implement authentication logic with backend
      toast({
        title: "Validation successful",
        description: "Form data is valid. Backend integration required.",
        variant: "default",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">WhatsAutomate</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? "Entre para acessar sua conta" 
              : "Comece a automatizar seu WhatsApp gratuitamente"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name"
                name="name"
                type="text" 
                placeholder="João Silva" 
                required 
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
          )}
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="company">Nome da empresa</Label>
              <Input 
                id="company"
                name="company"
                type="text" 
                placeholder="Minha Empresa Ltda" 
                required 
              />
              {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="seu@email.com" 
              required 
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password"
              name="password"
              type="password" 
              placeholder="••••••••" 
              required 
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </a>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            {isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
          </span>{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? "Criar conta" : "Fazer login"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Auth;