import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost', 
      port: 1025, 
      secure: false, 
    });
  }

   async sendPasswprdResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:4200/reset-password?token=${token}`

    const mailOptions = {
      from: 'no-reply@localhost', // Dirección del remitente
      to: to, // Destinatario
      subject: 'Recuperanción de clave', // Asunto del correo
      html: `<p> Solicitaste la recuperación de tu clave. Tu código de recuperacion es:</p>
      <p>${token}</p>
    
      <p> Entra al siguiente enlace para recuperar tu contraseña: <a href="${resetLink}"> Has clic acá </a></p>`,
    };

     await this.transporter.sendMail(mailOptions);
  }
}
