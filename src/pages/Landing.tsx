import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users, BarChart3, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import nuviaLogo from "@/assets/nuvia-logo-transparent.png";
import nuviaIcon from "@/assets/nuvia-icon-transparent.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Dark Style */}
      <header className="bg-[hsl(250_50%_10%)] text-white sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img src={nuviaLogo} alt="Nuvia Customer Cloud" className="h-10" />
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">
                Customer Cloud
              </a>
              <a href="#features" className="text-sm hover:text-primary transition-colors">
                Soluções
              </a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">
                Preços
              </a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">
                Clientes
              </a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">
                Blog
              </a>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                Central de Ajuda
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Dramatic Style like Zenvia */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(250_60%_15%)] via-[hsl(260_55%_20%)] to-[hsl(280_50%_25%)]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse"></div>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-accent/20 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              <span>Promoção Especial - 20% OFF</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Venda mais e Atenda melhor com{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nuvia Customer Cloud
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Aproveite <span className="text-accent font-bold">20% OFF</span> no plano de software e faça de 2025 o melhor ano da sua história
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6 h-auto font-semibold shadow-lg shadow-accent/50 hover:shadow-xl hover:shadow-accent/60 transition-all hover:scale-105"
                >
                  Aproveite agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto backdrop-blur-sm"
                >
                  Começar Grátis
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Configuração em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Suporte em português</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-4 border-accent bg-gradient-to-br from-accent/40 to-primary/40 backdrop-blur-sm flex items-center justify-center text-white hidden lg:flex animate-pulse">
          <div className="text-center">
            <div className="text-3xl font-bold">20%</div>
            <div className="text-xs">OFF</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Poderosos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para escalar suas comunicações no WhatsApp
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mensagens em Massa</h3>
              <p className="text-muted-foreground">
                Envie milhares de mensagens personalizadas com textos, imagens e documentos.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automação Inteligente</h3>
              <p className="text-muted-foreground">
                Crie fluxos de chatbot com respostas automáticas e botões interativos.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gestão de Contatos</h3>
              <p className="text-muted-foreground">
                Importe e organize milhares de contatos com facilidade.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Relatórios Detalhados</h3>
              <p className="text-muted-foreground">
                Acompanhe entregas, leituras e engajamento em tempo real.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Crie sua conta gratuitamente e comece a automatizar hoje mesmo.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-primary">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <img src={nuviaLogo} alt="Nuvia Customer Cloud" className="h-8" />
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma completa de automação para WhatsApp Business.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Nuvia Customer Cloud. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;