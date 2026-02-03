import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Check, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-lg">SYNDIKA</span>
          </div>
          <Button onClick={() => navigate('/login')}>
            Entrar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6 text-foreground">
            Gestão de Condomínios<br />
            <span className="text-primary">Simplificada</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Centralize avisos, chamados e reservas em um único lugar. 
            Menos WhatsApp, mais eficiência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="gap-2"
            >
              Comece agora
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Acessar demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Rápido e Intuitivo</h3>
            <p className="text-muted-foreground">
              Interface amigável que não requer treinamento. Comece a usar em minutos.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Seguro e Confiável</h3>
            <p className="text-muted-foreground">
              Seus dados estão sempre protegidos com criptografia de nível empresarial.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Suporte Completo</h3>
            <p className="text-muted-foreground">
              Equipe dedicada pronta para ajudar você a aproveitar ao máximo.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-20 p-12 rounded-2xl bg-card border border-border">
          <h2 className="font-heading text-3xl font-bold mb-12 text-center">
            Recursos Inclusos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'Mural de avisos com anexos',
              'Sistema de chamados organizado',
              'Reserva de áreas comuns',
              'Gestão de moradores',
              'Relatórios e estatísticas',
              'Notificações automáticas',
              'Integração com e-mail',
              'Acesso mobile-friendly',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-success" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Crie sua conta e acesse todos os recursos por 30 dias gratuitamente.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            Entrar ou Criar Conta
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>© 2024 SYNDIKA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
