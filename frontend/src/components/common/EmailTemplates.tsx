import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EmailTemplate {
  type: string;
  to: string;
  subject: string;
  templateData: Record<string, unknown>;
  sentAt: Date;
  deliveryStatus: 'pending' | 'sent' | 'failed';
}

interface EmailTemplatePreviewProps {
  email: EmailTemplate;
}

/**
 * Componente para exibir prévia de emails enviados
 * Usado para debugging e verificação de conteúdo
 */
export const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ email }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviado';
      case 'failed':
        return 'Falhou';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const renderTemplateContent = () => {
    switch (email.type) {
      case 'ticket_created':
        return (
          <div className="space-y-3">
            <p>
              <strong>Novo Chamado Criado:</strong> {String(email.templateData.title)}
            </p>
            <p>
              <strong>Categoria:</strong> {String(email.templateData.category)}
            </p>
            <p>
              <strong>Prioridade:</strong> {String(email.templateData.priority)}
            </p>
            <p className="text-sm text-muted-foreground">
              {String(email.templateData.description)}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Local:</strong> {String(email.templateData.location)}
            </p>
          </div>
        );

      case 'ticket_updated':
        return (
          <div className="space-y-3">
            <p>
              <strong>Chamado Atualizado:</strong> {String(email.templateData.title)}
            </p>
            <p>
              <strong>Novo Status:</strong> {String(email.templateData.newStatus)}
            </p>
            <p className="text-xs text-muted-foreground">
              Atualizado em: {format(new Date(String(email.templateData.updatedAt)), 'Pp', { locale: ptBR })}
            </p>
          </div>
        );

      case 'announcement_published':
        return (
          <div className="space-y-3">
            <p>
              <strong>Novo Aviso Publicado:</strong> {String(email.templateData.title)}
            </p>
            <p>
              <strong>Tipo:</strong> {String(email.templateData.type)}
            </p>
            <p className="text-sm text-muted-foreground">
              {String(email.templateData.content)}
            </p>
            <p className="text-xs text-muted-foreground">
              Publicado em: {format(new Date(String(email.templateData.publishedAt)), 'Pp', { locale: ptBR })}
            </p>
          </div>
        );

      case 'reservation_approved':
        return (
          <div className="space-y-3">
            <p>
              <strong>Reserva Aprovada:</strong> {String(email.templateData.area)}
            </p>
            <p>
              <strong>Data:</strong> {String(email.templateData.date)}
            </p>
            <p>
              <strong>Horário:</strong> {String(email.templateData.timeSlot)}
            </p>
          </div>
        );

      case 'reservation_rejected':
        return (
          <div className="space-y-3">
            <p>
              <strong>Reserva Recusada:</strong> {String(email.templateData.area)}
            </p>
            <p>
              <strong>Data:</strong> {String(email.templateData.date)}
            </p>
            <p className="text-sm text-yellow-700">
              <strong>Motivo:</strong> {String(email.templateData.reason)}
            </p>
          </div>
        );

      default:
        return (
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(email.templateData, null, 2)}
          </pre>
        );
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm">{email.subject}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Para: {email.to}
            </p>
          </div>
          <Badge className={getStatusColor(email.deliveryStatus)}>
            {getStatusLabel(email.deliveryStatus)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="border-l-2 border-primary pl-3">
          {renderTemplateContent()}
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {format(email.sentAt, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
        </p>
      </CardContent>
    </Card>
  );
};

/**
 * Componente para exibir histórico de emails
 */
interface EmailHistoryProps {
  emails: EmailTemplate[];
  maxItems?: number;
}

export const EmailHistory: React.FC<EmailHistoryProps> = ({ emails, maxItems = 10 }) => {
  const displayedEmails = emails.slice(0, maxItems).reverse();

  if (emails.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum email enviado ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Histórico de Emails Recentes</h3>
        <Badge variant="outline">{emails.length} emails</Badge>
      </div>
      <div className="space-y-2">
        {displayedEmails.map((email, idx) => (
          <EmailTemplatePreview key={idx} email={email} />
        ))}
      </div>
    </div>
  );
};
