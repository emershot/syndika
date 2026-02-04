import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('E-mail é obrigatório');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('E-mail inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSubmitting(true);

    try {
      // Fluxo profissional sem endpoint backend: mensagem neutra
      setSuccess(true);
      toast({
        title: 'Solicitação enviada',
        description: 'Se existir uma conta, você receberá instruções no seu e-mail.',
      });

      // Fallback opcional para suporte via e-mail
      const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'suporte@syndika.com.br';
      const subject = encodeURIComponent('Recuperar acesso');
      const body = encodeURIComponent(`Olá, preciso recuperar acesso.\n\nE-mail: ${email}`);
      window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-heading">Recuperar acesso</CardTitle>
          <CardDescription>
            Informe seu e-mail para receber as instruções de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Se existir uma conta com este e-mail, enviaremos as instruções.
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
                    if (emailError) validateEmail(e.target.value);
                  }}
                  className={`pl-10 ${emailError ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            Não recebeu o e-mail? Verifique a caixa de spam ou entre em contato com o suporte.
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
