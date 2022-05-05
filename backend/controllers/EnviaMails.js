var nodemailer = require('nodemailer');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');

// var someVal = properties.get('main.app.port');

// console.log("Pruebaa:",someVal);
// fully qualified name
class EnviaMails {
  // by object path
  constructor(subject, cuerpo, reciveTO = "") {



    var user = properties.get('mail.mail.user');
    var password = properties.get('mail.mail.password');
    if (reciveTO == "")
      reciveTO = properties.get('mail.mail.recive');
    var host = properties.get('mail.mail.host');
    var port = properties.get('mail.mail.port');

    console.log("dentro dell constructor" + subject + cuerpo + user);

    var mailOptions = {
      from: user, // sender address
      to: reciveTO, // my mail
      subject: subject, // Subject line
      text: cuerpo, // plain text body
      // html: params.html, // html body
      // attachments: params.attachments
    };

    var transport = nodemailer.createTransport({
      host: host,
      port: port,
      auth: {
        user: user,
        pass: password
      }
    });

    transport.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    this.enviarMail(transport, mailOptions);
  }

  enviarMail(transport, mailOptions) {
    //agrego cuerpo del mensaje
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error while sending mail: ');
      } else {
        console.log('Message sent: %s', info.messageId);
      }
      transport.close(); // shut down the connection pool, no more messages.
    });

  }
}
module.exports = EnviaMails;