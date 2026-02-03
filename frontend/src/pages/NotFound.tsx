import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center px-6">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <AlertCircle className="h-32 w-32 text-destructive/20" />
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-destructive">
              404
            </span>
          </div>
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Página não encontrada
        </h1>
        
        <p className="text-muted-foreground mb-6 text-lg">
          Desculpe, a página que você procura não existe ou foi removida.
        </p>

        <p className="text-sm text-muted-foreground mb-8 break-all">
          Rota solicitada: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Ir ao Painel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
