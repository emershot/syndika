import { AppLayout } from '@/components/layout/AppLayout';
import { mockCondominium, mockCommonAreas } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Building2, MapPin, Clock, Bell, Shield, CreditCard, Phone, Mail, Home, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Settings() {
  const condo = mockCondominium;

  const handleSave = () => {
    toast({
      title: 'Configurações salvas!',
      description: 'As alterações foram aplicadas com sucesso.',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações do condomínio
          </p>
        </div>

        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="dados">Dados Prediais</TabsTrigger>
            <TabsTrigger value="areas">Áreas</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="plano">Plano</TabsTrigger>
          </TabsList>

          {/* General Settings - EXPANDIDO COM 13 CAMPOS */}
          <TabsContent value="geral" className="space-y-6">
            {/* Identificação Básica */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Identificação Básica
                </CardTitle>
                <CardDescription>
                  Informações essenciais do condomínio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Condomínio</Label>
                    <Input id="name" defaultValue={condo.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Número de Unidades</Label>
                    <Input id="units" type="number" defaultValue={condo.totalUnits} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Condomínio</Label>
                  <select className="w-full px-3 py-2 border rounded-md" defaultValue={condo.tipoCondominio}>
                    <option value="vertical">Vertical (Prédios)</option>
                    <option value="horizontal">Horizontal (Casarões)</option>
                    <option value="misto">Misto</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" defaultValue={condo.address} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" defaultValue={condo.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" defaultValue={condo.state} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">CEP</Label>
                    <Input id="zip" defaultValue={condo.zipCode} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contato do Condomínio */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contato do Condomínio
                </CardTitle>
                <CardDescription>
                  Dados usados para comunicação com moradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">📞 Telefone Principal</Label>
                    <Input id="phone" defaultValue={condo.telefone} placeholder="(11) 3333-3333" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">💬 WhatsApp</Label>
                    <Input id="whatsapp" defaultValue={condo.whatsapp} placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">📧 E-mail Principal</Label>
                    <Input id="email" type="email" defaultValue={condo.email} placeholder="contato@condominio.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">🌐 Website</Label>
                    <Input id="website" defaultValue={condo.website} placeholder="www.condominio.com.br" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identificação Legal */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Identificação Legal
                </CardTitle>
                <CardDescription>
                  Dados obrigatórios para documentação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue={condo.cnpj} placeholder="12.345.678/0001-90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual (opcional)</Label>
                  <Input id="ie" defaultValue={condo.inscricaoEstadual || ''} placeholder="123.456.789.012" />
                </div>
              </CardContent>
            </Card>

            {/* Síndico Responsável */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Síndico Responsável
                </CardTitle>
                <CardDescription>
                  Contato direto para moradores e gestores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sindico-name">Nome do Síndico</Label>
                  <Input id="sindico-name" defaultValue={condo.nomeSindico} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sindico-phone">Telefone do Síndico</Label>
                    <Input id="sindico-phone" defaultValue={condo.telefoneSindico} placeholder="(11) 99999-1234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sindico-email">E-mail do Síndico</Label>
                    <Input id="sindico-email" type="email" defaultValue={condo.emailSindico} placeholder="sindico@email.com" />
                  </div>
                </div>
                {condo.dataSindicoInicio && (
                  <div className="text-sm text-muted-foreground">
                    Síndico desde: {format(condo.dataSindicoInicio, 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">Salvar Alterações</Button>
          </TabsContent>

          {/* NOVA ABA - Dados Prediais */}
          <TabsContent value="dados" className="space-y-6">
            {/* Estrutura do Prédio */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Estrutura do Prédio
                </CardTitle>
                <CardDescription>
                  Informações sobre a construção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blocos">Número de Blocos</Label>
                    <Input id="blocos" type="number" defaultValue={condo.numeroBlocos} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="andares">Andares por Bloco</Label>
                    <Input id="andares" type="number" defaultValue={condo.andaresPorBloco} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="garagens">Vagas de Garagem</Label>
                  <Input id="garagens" type="number" defaultValue={condo.vagasGaragem} />
                </div>
              </CardContent>
            </Card>

            {/* Segurança e Acesso */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança e Acesso
                </CardTitle>
                <CardDescription>
                  Configurações de segurança do condomínio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Portaria 24h</p>
                      <p className="text-sm text-muted-foreground">Acesso controlado permanente</p>
                    </div>
                    <Switch defaultChecked={condo.temPortaria24h} />
                  </div>

                  {condo.temPortaria24h && (
                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <Label htmlFor="horarios">Horários de Portaria</Label>
                      <Input id="horarios" defaultValue={condo.horariosPortaria || ''} placeholder="Ex: Seg-Sex 6-22h" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Câmeras de Segurança</p>
                      <p className="text-sm text-muted-foreground">Monitoramento 24h</p>
                    </div>
                    <Switch defaultChecked={condo.temCameras} />
                  </div>

                  {condo.temCameras && (
                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <Label htmlFor="cameras">Áreas com Câmeras (separadas por vírgula)</Label>
                      <Input id="cameras" defaultValue={condo.areasCameras?.join(', ') || ''} />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="vigilancia">Empresa de Vigilância</Label>
                    <Input id="vigilancia" defaultValue={condo.empresaVigilancia || ''} placeholder="Nome da empresa" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados Financeiros */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Dados Financeiros
                </CardTitle>
                <CardDescription>
                  Informações de cobrança e formas de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxa">Taxa Condominial Mensal (R$)</Label>
                    <Input id="taxa" type="number" step="0.01" defaultValue={condo.taxaCondominial} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vencimento">Dia de Vencimento</Label>
                    <Input id="vencimento" type="number" min="1" max="31" defaultValue={condo.diaVencimento} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Formas de Pagamento Aceitas</Label>
                  <div className="space-y-2">
                    {['Boleto', 'PIX', 'Débito automático', 'Dinheiro'].map((forma) => (
                      <div key={forma} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={forma}
                          defaultChecked={condo.formasPagamento?.includes(forma)}
                          className="rounded"
                        />
                        <Label htmlFor={forma} className="font-normal">{forma}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Dados Bancários</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco</Label>
                      <Input id="banco" defaultValue={condo.banco || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência</Label>
                      <Input id="agencia" defaultValue={condo.agencia || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta Corrente</Label>
                      <Input id="conta" defaultValue={condo.contaBancaria || ''} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Características do Prédio */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Características do Prédio
                </CardTitle>
                <CardDescription>
                  Informações sobre a infraestrutura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano de Construção</Label>
                    <Input id="ano" type="number" defaultValue={condo.anoConstituicao || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reforma">Última Reforma Geral</Label>
                    <Input 
                      id="reforma" 
                      type="date" 
                      defaultValue={condo.anoUltimaReforma ? format(new Date(condo.anoUltimaReforma), 'yyyy-MM-dd') : ''} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situacao">Situação do Prédio</Label>
                  <select className="w-full px-3 py-2 border rounded-md" defaultValue={condo.situacaoPredial || 'bom'}>
                    <option value="excelente">Excelente</option>
                    <option value="bom">Bom</option>
                    <option value="regular">Regular</option>
                    <option value="precario">Precário</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Amenidades Disponíveis</Label>
                  <div className="space-y-2">
                    {['Piscina aquecida', 'Academia completa', 'Salão de festas', 'Churrasqueira', 'Playground'].map((amenidade) => (
                      <div key={amenidade} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={amenidade}
                          defaultChecked={condo.amenidades?.includes(amenidade)}
                          className="rounded"
                        />
                        <Label htmlFor={amenidade} className="font-normal">{amenidade}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">Salvar Dados Prediais</Button>
          </TabsContent>

          {/* Common Areas Settings */}
          <TabsContent value="areas" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Áreas Comuns
                </CardTitle>
                <CardDescription>
                  Configure as áreas disponíveis para reserva
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCommonAreas.map((area) => (
                  <div key={area.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{area.name}</h4>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Horário de Funcionamento</Label>
                        <div className="flex items-center gap-2">
                          <Input type="time" defaultValue={area.openTime} className="w-24" />
                          <span>às</span>
                          <Input type="time" defaultValue={area.closeTime} className="w-24" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Múltiplas Reservas</Label>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={area.allowMultipleReservations} />
                          <span className="text-sm text-muted-foreground">
                            {area.allowMultipleReservations ? 'Permitido' : 'Não permitido'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Regras</Label>
                      <Textarea defaultValue={area.rules} rows={2} />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  + Adicionar Nova Área
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como os moradores recebem avisos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Novos avisos</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar moradores sobre novos comunicados
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Atualizações de chamados</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre mudanças de status
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Reservas</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre aprovação/recusa de reservas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">E-mail diário</p>
                    <p className="text-sm text-muted-foreground">
                      Resumo diário de atividades para o síndico
                    </p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={handleSave}>Salvar Preferências</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Settings */}
          <TabsContent value="plano" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Seu Plano
                </CardTitle>
                <CardDescription>
                  Informações sobre sua assinatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary-light rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plano atual</p>
                      <p className="text-2xl font-bold font-heading">Plano Plus</p>
                    </div>
                    <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      Ativo
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Unidades</p>
                      <p className="font-medium">Até 80 unidades</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor mensal</p>
                      <p className="font-medium">R$ 149,00/mês</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Início</p>
                      <p className="font-medium">
                        {format(condo.planStartDate, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Próxima cobrança</p>
                      <p className="font-medium">15/01/2025</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Recursos inclusos:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Mural de avisos ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Gestão de chamados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Reserva de áreas comuns
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Relatórios básicos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Suporte por e-mail
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">Alterar Plano</Button>
                  <Button variant="outline" className="text-muted-foreground">
                    Histórico de Pagamentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
