import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Check, Shield, Zap, Star, MessageSquare, CheckCircle, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // GA4 tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: '/',
        page_title: 'Syndika - Gestão Condomínio Sem WhatsApp',
      });
    }
  }, []);

  // Mostrar CTA flutuante após scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoClick = (role: string) => {
    if (window.gtag) window.gtag('event', 'demo_access', { role });
    localStorage.setItem('demoRole', role);
    navigate('/login?demo=true');
  };

  const handleCTAClick = () => {
    if (window.gtag) window.gtag('event', 'cta_click', { source: 'floating' });
    navigate('/login');
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
          <div className="hidden sm:flex gap-3">
            <Button
              variant="ghost"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Como funciona
            </Button>
            <Button
              variant="ghost"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Preços
            </Button>
            <Button onClick={() => navigate('/login')}>
              Entrar
            </Button>
          </div>
          <div className="sm:hidden">
            <Button onClick={() => navigate('/login')} size="sm">
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Floating CTA Button (Mobile) */}
      {showFloatingCTA && (
        <div className="fixed bottom-4 left-0 right-0 sm:hidden z-40 px-4">
          <Button
            onClick={handleCTAClick}
            className="w-full gap-2"
          >
            Teste grátis 30 dias
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          {/* Badge prova social */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">100+ síndicos já organizados | 70% menos chamados repetidos</span>
          </div>

          {/* Headline com dor principal */}
          <h1 className="font-heading text-4xl sm:text-6xl font-bold mb-6 text-foreground leading-tight">
            Cansado de <span className="text-primary">WhatsApp caótico</span> no condomínio?
          </h1>

          {/* Subheadline com benefício concreto */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            Centralize avisos, chamados e reservas em um painel único e reduza chamados repetidos em até 70%.
          </p>

          {/* Garantia */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Check className="h-5 w-5 text-primary" />
            <p className="text-base font-medium text-foreground">30 dias grátis, sem cartão de crédito</p>
          </div>

          {/* CTAs principais */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              onClick={handleCTAClick}
              className="gap-2 text-base sm:text-lg py-6 sm:py-7"
            >
              Teste grátis 30 dias
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleDemoClick('sindico')}
              className="gap-2 text-base sm:text-lg py-6 sm:py-7"
            >
              Ver Dashboard Síndico
            </Button>
          </div>

          {/* Métricas no hero */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-12 sm:mt-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">100+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Síndicos ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">200+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Unidades gerenciadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">70%</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Menos chamados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-center">
          Veja como outros síndicos reduziram retrabalho com a SYNDIKA
        </h2>
        <p className="text-center text-muted-foreground mb-12">4,9/5 de satisfação entre síndicos que testaram</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="font-semibold text-foreground mb-3">
              "Reduziu chamados repetitivos em 70%"
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              João, síndico de condomínio residencial, 80 unidades, Curitiba/PR conseguiu controlar o volume de chamados com avisos automáticos e confirmação de leitura.
            </p>
            <p className="text-xs font-medium text-primary">Teste aprovado</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="font-semibold text-foreground mb-3">
              "Acaba com conflitos de horário"
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Marina, conselheira de condomínio residencial, 120 unidades, São Paulo/SP eliminou sobreposições e desentendimentos em reservas com regras automáticas.
            </p>
            <p className="text-xs font-medium text-primary">Teste aprovado</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="font-semibold text-foreground mb-3">
              "Recupera 15h/semana de trabalho"
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Roberto, síndico de condomínio residencial, 150 unidades, Rio de Janeiro/RJ ganhou tempo significativo em comunicação centralizada com histórico completo.
            </p>
            <p className="text-xs font-medium text-primary">Teste aprovado</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30 rounded-2xl">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-16 text-center">
          Recursos para cada desafio do síndico
        </h2>

        {/* Features Grid com grupos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Comunicação organizada */}
          <div className="rounded-xl border border-border bg-background p-8">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-4">Comunicação organizada</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Mural de avisos com anexos, histórico e confirmação de leitura</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Notificações automáticas por e-mail para todos os moradores</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Integração com e-mail corporativo do condomínio</span>
              </li>
            </ul>
          </div>

          {/* Operação sem conflito */}
          <div className="rounded-xl border border-border bg-background p-8">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-4">Operação sem conflito</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Reservas com regras claras, confirmação automática e avisos</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Sistema de chamados organizado com priorização automática</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Gestão centralizada de moradores e suas informações</span>
              </li>
            </ul>
          </div>

          {/* Transparência para o conselho */}
          <div className="rounded-xl border border-border bg-background p-8">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-4">Transparência para o conselho</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Relatórios e estatísticas em tempo real sobre operações</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Histórico completo e auditável de todas as ações</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Acesso mobile-friendly para consultas rápidas</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-4">
          Planos simples e transparentes
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Sem fidelidade. Cancele quando quiser.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Starter */}
          <div className="rounded-2xl border-2 border-border p-8 sm:p-10 hover:border-primary transition-colors">
            <div className="mb-6">
              <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">Starter</h3>
              <p className="text-sm text-muted-foreground mb-4">Ideal para pequenos condomínios</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">R$ 49</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Até 80 unidades</p>
            </div>
            <Button
              size="lg"
              className="w-full mb-6"
              onClick={() => handleDemoClick('starter')}
            >
              Testar Starter
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
                <span>Notificações automáticas</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0" />
                <span>Gestão de moradores</span>
              </li>
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-primary p-8 sm:p-10 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                MAIS POPULAR
              </span>
            </div>
            <div className="mb-6">
              <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">Para condomínios maiores e complexos</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">R$ 99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">A partir de 81 unidades</p>
            </div>
            <Button
              size="lg"
              className="w-full mb-6"
              onClick={() => handleDemoClick('pro')}
            >
              Testar Pro
            </Button>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0" />
                <span>Unidades ilimitadas</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0" />
                <span>Todos recursos do Starter</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0" />
                <span>Relatórios avançados e exportação</span>
              </li>
              <li className="flex gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0" />
                <span>Suporte prioritário por WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs sm:text-sm mt-8">
          ✅ 30 dias grátis em todos os planos • Sem cartão de crédito • Sem compromisso
        </p>
        <p className="text-center text-muted-foreground text-xs mt-2">
          Para condomínios com mais de 200 unidades, consulte-nos para plano personalizado.
        </p>
      </section>

      {/* DEMO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12">
          Teste a SYNDIKA agora, sem cadastro
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
          <button
            onClick={() => handleDemoClick('sindico')}
            className="group p-8 sm:p-10 rounded-xl bg-card border-2 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="text-5xl mb-4">👨‍💼</div>
            <h3 className="font-heading font-bold text-lg sm:text-xl mb-3 group-hover:text-primary transition">
              Ver Dashboard Síndico
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Visualize como você vai gerenciar avisos, chamados, reservas e moradores em um painel único.
            </p>
            <p className="text-xs font-semibold text-primary">
              Credenciais: admin / demo123 →
            </p>
          </button>

          <button
            onClick={() => handleDemoClick('morador')}
            className="group p-8 sm:p-10 rounded-xl bg-card border-2 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="text-5xl mb-4">👤</div>
            <h3 className="font-heading font-bold text-lg sm:text-xl mb-3 group-hover:text-primary transition">
              Testar como Morador
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore a experiência do morador: veja avisos, crie chamados e reserve áreas comuns.
            </p>
            <p className="text-xs font-semibold text-primary">
              Credenciais: morador / morador123 →
            </p>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Ambiente de demonstração com dados fictícios para você testar sem risco.
        </p>
      </section>

      {/* PROPOSAL FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30 rounded-2xl">
        <div className="max-w-md mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-3">
            Receber proposta personalizada
          </h2>
          <p className="text-center text-muted-foreground mb-2">
            Proposta em até 5 minutos, personalizada para seu condomínio
          </p>
          <p className="text-center text-xs text-muted-foreground mb-8">
            Usamos seu contato apenas para enviar sua proposta. Nada de grupos ou spam.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (window.gtag) window.gtag('event', 'form_submit', { form_type: 'proposal' });
              alert('Obrigado! Entraremos em contato em breve.');
            }}
            className="space-y-4 bg-background border border-border rounded-xl p-6 sm:p-8"
          >
            <div>
              <label className="text-sm font-semibold mb-2 block">Nome completo</label>
              <input
                type="text"
                name="name"
                placeholder="João Silva"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                placeholder="(11) 99999-9999"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Unidades no condomínio</label>
              <select
                name="units"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition text-sm"
              >
                <option value="">Selecione...</option>
                <option value="1-20">1 - 20 unidades</option>
                <option value="21-80">21 - 80 unidades</option>
                <option value="81-200">81 - 200 unidades</option>
                <option value="200+">200+ unidades</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Preferência de contato</label>
              <select
                name="contact_preference"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none transition text-sm"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">E-mail</option>
                <option value="phone">Ligação</option>
              </select>
            </div>

            <Button size="lg" className="w-full">
              Receber Proposta Grátis
            </Button>
          </form>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12">
          Dúvidas frequentes
        </h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-6 hover:border-primary transition-colors">
            <h3 className="font-heading font-bold text-lg mb-3">Preciso instalar algo no computador?</h3>
            <p className="text-sm text-muted-foreground">
              Não. SYNDIKA é 100% online. Acesse pelo navegador do seu computador ou celular. Apenas compartilhe o link com moradores e síndicos.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6 hover:border-primary transition-colors">
            <h3 className="font-heading font-bold text-lg mb-3">Posso cancelar a qualquer momento?</h3>
            <p className="text-sm text-muted-foreground">
              Sim. Sem fidelidade, sem penalidades. Cancele quando quiser pelo painel de conta. Você continuará com acesso até o final do período pago.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6 hover:border-primary transition-colors">
            <h3 className="font-heading font-bold text-lg mb-3">Moradores pagam alguma mensalidade?</h3>
            <p className="text-sm text-muted-foreground">
              Não. Apenas o síndico ou administradora paga. Moradores recebem acesso gratuito para visualizar avisos, fazer chamados e reservar áreas.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6 hover:border-primary transition-colors">
            <h3 className="font-heading font-bold text-lg mb-3">Como funciona o suporte?</h3>
            <p className="text-sm text-muted-foreground">
              Suporte por e-mail incluído em ambos planos. Plano Pro inclui suporte prioritário por WhatsApp em até 2 horas, de seg a sex, das 8h às 18h.
            </p>
          </div>
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
