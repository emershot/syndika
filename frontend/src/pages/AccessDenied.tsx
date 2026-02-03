import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Lock, ArrowLeft, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    // Se é síndico, vai para dashboard
    if (user?.role === 'sindico' || user?.role === 'superadmin') {
      navigate('/dashboard');
    } else {
      // Se é morador, vai para avisos (página acessível)
      navigate('/avisos');
    }
  };

  const handleGoIndex = () => {
    // Home button: sempre vai para a página pública de avisos
    // (ou index se não autenticado, mas isso é improvável aqui)
    navigate('/avisos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
            <p className="text-sm text-muted-foreground">
              Esta página é apenas para administradores.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 Você pode navegar pelas páginas disponíveis usando o menu lateral. Se acredita que deveria ter acesso, contacte o administrador.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleGoIndex}
              className="gap-2"
            >
              <Megaphone className="h-4 w-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
