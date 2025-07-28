import nodemailer from 'nodemailer';

// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro provedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Credenciais de e-mail não configuradas');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${options.to}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}

// Templates de e-mail
export const emailTemplates = {
  newRequest: (userName: string, requestType: string) => ({
    subject: 'Nova Solicitação - Sistema de Ponto',
    html: `
      <h2>Nova Solicitação Recebida</h2>
      <p>O funcionário <strong>${userName}</strong> fez uma nova solicitação de <strong>${requestType}</strong>.</p>
      <p>Acesse o sistema para revisar e aprovar a solicitação.</p>
      <br>
      <p>Sistema de Ponto Eletrônico</p>
    `,
  }),

  requestApproved: (requestType: string) => ({
    subject: 'Solicitação Aprovada - Sistema de Ponto',
    html: `
      <h2>Solicitação Aprovada</h2>
      <p>Sua solicitação de <strong>${requestType}</strong> foi aprovada.</p>
      <br>
      <p>Sistema de Ponto Eletrônico</p>
    `,
  }),

  requestRejected: (requestType: string, reason?: string) => ({
    subject: 'Solicitação Rejeitada - Sistema de Ponto',
    html: `
      <h2>Solicitação Rejeitada</h2>
      <p>Sua solicitação de <strong>${requestType}</strong> foi rejeitada.</p>
      ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
      <br>
      <p>Sistema de Ponto Eletrônico</p>
    `,
  }),

  forgottenTimeRecord: (userName: string, date: string) => ({
    subject: 'Ponto Não Registrado - Sistema de Ponto',
    html: `
      <h2>Lembrete de Ponto</h2>
      <p>Olá <strong>${userName}</strong>,</p>
      <p>Você não registrou seu ponto no dia <strong>${date}</strong>.</p>
      <p>Por favor, faça uma solicitação de correção de ponto se necessário.</p>
      <br>
      <p>Sistema de Ponto Eletrônico</p>
    `,
  }),

  weeklyReport: (userName: string, hoursWorked: number, expectedHours: number) => ({
    subject: 'Relatório Semanal - Sistema de Ponto',
    html: `
      <h2>Relatório Semanal</h2>
      <p>Olá <strong>${userName}</strong>,</p>
      <p>Resumo da sua semana:</p>
      <ul>
        <li>Horas trabalhadas: <strong>${hoursWorked}h</strong></li>
        <li>Horas esperadas: <strong>${expectedHours}h</strong></li>
        <li>Saldo: <strong>${(hoursWorked - expectedHours).toFixed(1)}h</strong></li>
      </ul>
      <br>
      <p>Sistema de Ponto Eletrônico</p>
    `,
  }),
};
