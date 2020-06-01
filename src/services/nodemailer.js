const nodemailer = require('nodemailer');

let defaultMailOption = {
  // from: `Immigrative Visa services <${ process.env.MAIL}>`,
  from: process.env.MAIL,
};

config = () => {
  const conf1 = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    // tls: {
    //   rejectUnathorized: false
    // }
  };

  return nodemailer.createTransport(conf1);
}

function sendMail(_options) {
  return new Promise(async(resolve, reject) => {
    try {
      const transporter = await config();

      let mailOptions = {
        ...defaultMailOption,
        ..._options
      }

      const info = await transporter.sendMail(mailOptions)

      return resolve(info);

    } catch (error) {
      return reject(error);
      // console.log('manejo de error para el envio de mail', error)
      // return error;
    }

  });
}


function getNewUserTemplate(username, password) {
  let _html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <style media="screen">
      .wrapper {
        box-sizing: border-box;
        padding: 1em;
        height: 100%;
        font-family: 'Crimson Text', serif;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
      }

      .el-wrapper {
        width: 100%;
        box-sizing: border-box;
        padding: 1em;
      }

      .title {
        text-align: center;
      }

      .content {
        text-align: justify;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center
      }

      .input {
        box-sizing: border-box;
        padding: 1em;
        text-align: center;
        border: solid 1px lightgray;
        background-color: rgba(200, 200, 200, 0.4);
        border-radius: 5px;
      }

      .footer {
        width: 100%;
        text-align: center;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: stretch;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <section class="el-wrapper title">
        <h1>Create a new acount</h1>
      </section>
      <section class="el-wrapper content">
        <p class="texto">
          Texto de bienbenida para el nuevo usuario
        </p>
        <p class="input">
          user name: ${username}
        </p>
        <p class="input">
          password: ${password}
        </p>
      </section>
      <section class="el-wrapper footer">
        <p>
          copiRigth
        </p>
        <p>
          other comment
        </p>
        <p>
          more information contact
        </p>
      </section>
    </div>
  </body>
  </html>`

  return _html;
}


module.exports = {
  sendMail,
  getNewUserTemplate
}