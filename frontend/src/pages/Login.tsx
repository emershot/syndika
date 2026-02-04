import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = (): boolean => {
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email) {
      setEmailError('E-mail é obrigatório');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso.",
        });
        // Redirecionar baseado no role
        if (result.user?.role === 'sindico' || result.user?.role === 'superadmin') {
          navigate('/dashboard');
        } else {
          navigate('/avisos');
        }
      } else {
        setError(result.error || "E-mail ou senha incorretos.");
        toast({
          title: "Erro no login",
          description: result.error || "E-mail ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg = "Ocorreu um erro ao fazer login. Tente novamente.";
      setError(errorMsg);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/recuperar-acesso');
  };

  const handleDemoLogin = async (emailDemo: string) => {
    setError('');
    setEmailError('');
    setPasswordError('');
    setIsLoading(true);

    try {
      const result = await login(emailDemo, 'demo');
      if (result.success) {
        toast({
          title: "Bem-vindo!",
          description: "Login de demonstração realizado.",
        });
        // Redirecionar baseado no role
        if (result.user?.role === 'sindico' || result.user?.role === 'superadmin') {
          navigate('/dashboard');
        } else {
          navigate('/avisos');
        }
      } else {
        setError(result.error || "Erro ao fazer login.");
      }
    } catch (error) {
      setError("Erro ao fazer login de demonstração.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Building2 className="h-7 w-7 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-sidebar-foreground">SYNDIKA</h1>
              <p className="text-sm text-sidebar-foreground/70">Gestão de Condomínios</p>
            </div>
          </div>
          
          <h2 className="font-heading text-4xl font-bold text-sidebar-foreground leading-tight mb-4">
            Simplifique a gestão<br />do seu condomínio
          </h2>
          
          <p className="text-lg text-sidebar-foreground/80 mb-8 max-w-md">
            Organize comunicação, chamados e reservas em um só lugar. 
            Menos WhatsApp, mais eficiência.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-primary text-lg">📢</span>
              </div>
              <div>
                <p className="font-medium text-sidebar-foreground">Mural de Avisos</p>
                <p className="text-sm text-sidebar-foreground/70">Comunicação oficial centralizada</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-primary text-lg">🔧</span>
              </div>
              <div>
                <p className="font-medium text-sidebar-foreground">Chamados e Manutenção</p>
                <p className="text-sm text-sidebar-foreground/70">Acompanhe ocorrências em tempo real</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-primary text-lg">📅</span>
              </div>
              <div>
                <p className="font-medium text-sidebar-foreground">Reserva de Áreas</p>
                <p className="text-sm text-sidebar-foreground/70">Agende espaços comuns facilmente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-sidebar-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-sidebar-primary/5 rounded-full blur-2xl" />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Building2 className="h-10 w-10 text-primary" />
            <div>
              <h1 className="font-heading text-xl font-bold">SYNDIKA</h1>
              <p className="text-xs text-muted-foreground">Gestão de Condomínios</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-heading">Entrar</CardTitle>
              <CardDescription>
                Entre com seu e-mail e senha para acessar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      className={`pl-10 ${emailError ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className={`pl-10 pr-10 ${passwordError ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Acesso rápido (demo)
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDemoLogin('carlos@email.com')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Entrar como Síndico
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDemoLogin('maria@email.com')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Entrar como Morador
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Esqueceu sua senha?{' '}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary hover:underline"
            >
              Recuperar acesso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
