const nodeMailer = require('nodemailer');


class MailService {

  constructor(){
    this.tranporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
      }
  });
  }

  async sendActivationLink(to, link) {
    await this.tranporter.sendMail({
      from:process.env.SMTP_USER,
      to,
      subject: "Account activation on site " + process.env.API_URL,
      text: '',
      html: 
      `
        <div>
          <h1>Для активации пройдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    })
  } 
}

module.exports = new MailService();