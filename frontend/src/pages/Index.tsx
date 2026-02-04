import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Check, Shield, Zap, Star, Users, TrendingUp } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  // GA4 tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: '/',
        page_title: 'Syndika - Gestão Condomínio Sem WhatsApp',
      });
    }
  }, []);

  const handleDemoClick = (role: string) => {
    if (window.gtag) window.gtag('event', 'demo_access', { role });
    localStorage.setItem('demoRole', role);
    navigate('/login?demo=true');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Meta tags para SEO */}
      <head>
        <title>Syndika - Gestão de Condomínio Sem WhatsApp | 30 Dias Grátis</title>
        <meta name="description" content="Plataforma completa para gestão de condomínios. Avisos, chamados, reservas e moradores organizados. Teste grátis por 30 dias. Zero risco." />
        <meta name="keywords" content="gestão condomínio, síndico, avisos, chamados, reservas, software condomínio" />
        <meta property="og:title" content="Syndika - Gestão Condomínio Sem WhatsApp" />
        <meta property="og:description" content="Organizar condomínio nunca foi tão fácil. Teste grátis por 30 dias." />
      </head>

      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-lg">SYNDIKA</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Preços
            </Button>
            <Button onClick={() => navigate('/login')}>
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - URGÊNCIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge urgência */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">⏰ 100+ síndicos já organizados | 70% menos caos</span>
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl font-bold mb-6 text-foreground leading-tight">
            Cansado de <span className="text-primary">WhatsApp caótico?</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4">
            Centralize avisos, chamados e reservas. Menos WhatsApp, mais eficiência.
          </p>
          
          <p className="text-lg text-muted-foreground mb-10 font-medium">
            ✅ Teste grátis 30 dias → Zero risco
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="gap-2 text-lg py-6"
            >
              🚀 TESTE GRÁTIS 30 DIAS
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => handleDemoClick('sindico')}
              className="gap-2 text-lg py-6"
            >
              👨‍💼 Ver Dashboard Síndico
            </Button>
          </div>

          {/* Social proof no hero */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Síndicos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Unidades Gerenciadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">70%</div>
              <div className="text-sm text-muted-foreground">Menos Chamados</div>
            </div>
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

        {/* SOCIAL PROOF - DEPOIMENTOS */}
        <div className="mt-24 py-16 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <h2 className="font-heading text-3xl font-bold mb-12 text-center">
            Síndicos que já economizam tempo e dinheiro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            <div className="bg-background rounded-xl p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-foreground font-semibold mb-2">"Reduziu chamados em 70%"</p>
              <p className="text-muted-foreground text-sm mb-4">
                Síndico Esperança conseguiu controlar o volume de chamados repetitivos com avisos automáticos.
              </p>
              <p className="text-sm font-semibold text-primary">— João Silva, Síndico</p>
            </div>

            <div className="bg-background rounded-xl p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-foreground font-semibold mb-2">"Zero conflito em reservas"</p>
              <p className="text-muted-foreground text-sm mb-4">
                Condomínio Horizonte eliminou sobreposições e desentendimentos em reservas.
              </p>
              <p className="text-sm font-semibold text-primary">— Maria Santos, Conselho</p>
            </div>

            <div className="bg-background rounded-xl p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-foreground font-semibold mb-2">"Economia de tempo real"</p>
              <p className="text-muted-foreground text-sm mb-4">
                Ganhou 15h/semana em comunicação desorganizada. Agora tudo é centralizado.
              </p>
              <p className="text-sm font-semibold text-primary">— Roberto Costa, Síndico</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-24 p-12 rounded-2xl bg-card border border-border">
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

        {/* PRICING SECTION - CLARO E DIRETO */}
        <div id="pricing" className="mt-24 scroll-mt-20">
          <h2 className="font-heading text-4xl font-bold text-center mb-16">
            Preços Simples e Transparentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Starter */}
            <div className="rounded-2xl border-2 border-border p-10 hover:border-primary transition-colors">
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold mb-2">Starter</h3>
                <p className="text-muted-foreground mb-4">Para pequenos condomínios</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R$49</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">até 80 unidades</p>
              </div>
              <Button 
                size="lg"
                className="w-full mb-6"
                onClick={() => handleDemoClick('starter')}
              >
                TESTAR STARTER
              </Button>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Até 80 unidades</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Avisos, chamados, reservas</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Notificações por e-mail</span>
                </li>
              </ul>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-primary p-10 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                  MAIS POPULAR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-4">Para condomínios maiores</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R$99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">201+ unidades</p>
              </div>
              <Button 
                size="lg"
                className="w-full mb-6"
                onClick={() => handleDemoClick('pro')}
              >
                TESTAR PRO
              </Button>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Unidades ilimitadas</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Todos recursos Starter +</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8">
            ✅ 30 dias grátis em todos os planos. Sem cartão de crédito. Sem compromisso.
          </p>
        </div>

        {/* DEMO INTEGRADA - ACESSO RÁPIDO */}
        <div className="mt-24 py-16 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Teste Agora - Sem Cadastro Prévio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-6">
            <button
              onClick={() => handleDemoClick('sindico')}
              className="group p-8 rounded-xl bg-background border-2 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">👨‍💼</div>
              <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition">
                Ver Dashboard Síndico
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Visualize como um síndico gerencia avisos, chamados e moradores
              </p>
              <p className="text-xs font-semibold text-primary">
                Admin / demo123 →
              </p>
            </button>

            <button
              onClick={() => handleDemoClick('morador')}
              className="group p-8 rounded-xl bg-background border-2 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition">
                Testar Como Morador
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Explore a experiência de um morador visualizando avisos e criando chamados
              </p>
              <p className="text-xs font-semibold text-primary">
                Morador / morador123 →
              </p>
            </button>
          </div>
        </div>

        {/* FORM OTIMIZADO - 3 CAMPOS */}
        <div className="mt-24 py-16 max-w-md mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            Receber Proposta Personalizada
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            ⏱️ Proposta em 5 minutos | Sem compromisso
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (window.gtag) window.gtag('event', 'form_submit', { form_type: 'contact' });
              const formData = new FormData(e.currentTarget);
              // Implementar envio real via API
              alert('Obrigado! Entraremos em contato em breve.');
            }}
            className="space-y-4 bg-card border border-border rounded-xl p-8"
          >
            <div>
              <label className="text-sm font-semibold mb-2 block">Nome completo</label>
              <input 
                type="text" 
                name="name" 
                placeholder="João Silva"
                required 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">WhatsApp</label>
              <input 
                type="tel" 
                name="whatsapp" 
                placeholder="(11) 99999-9999"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Unidades no condomínio</label>
              <select 
                name="units" 
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition"
              >
                <option value="">Selecionar...</option>
                <option value="1-20">1 - 20 unidades</option>
                <option value="21-80">21 - 80 unidades</option>
                <option value="81-200">81 - 200 unidades</option>
                <option value="200+">200+ unidades</option>
              </select>
            </div>
            <Button size="lg" className="w-full">
              Receber Proposta Grátis
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border py-12 text-center text-muted-foreground text-sm">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="mb-4">© 2024 SYNDIKA. Gestão de Condomínio Simplificada.</p>
          <div className="flex justify-center gap-6 text-xs">
            <a href="#" className="hover:text-primary transition">Privacidade</a>
            <a href="#" className="hover:text-primary transition">Termos</a>
            <a href="mailto:support@syndika.app" className="hover:text-primary transition">Contato</a>
          </div>
        </div>
      </footer>

      {/* GA4 Script */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');`}
      </script>
    </div>
  );
};

export default Index;
