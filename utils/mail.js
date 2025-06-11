const nodemailer = require("nodemailer");

function sendEmail(email, data) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_SECRET_EMAIL,
        pass: process.env.MY_SECRET_EMAIL_PASS,
      },
    });
    const mailOption = {
      from: '"Space A" <dev.spacea@gmail.com>',
      sender: "Space A",
      to: email,
      subject: "Password Change Request Confirmation",
      html: `<html><head></head><body style=" margin: 0;
    background: #050401;
    padding: 90px 40px 40px;
    color: white;">

  <div style=" 
          max-width: 800px;
          margin: auto;">
    <div style="margin: auto;height: 80px;width: 80px;border-radius: 900px; background-color: #a3a3a3 ;overflow: hidden;border: 2px solid #a3a3a3">
      <div style="
            width: 100%;    margin: auto;
            margin-top: 20px;
            background-color: #050401;
            height: 65px;
            padding: 12px 6px;
            border-radius: 50% 50% 55% 45% / 20% 20% 80% 80%;">
        <span style="height: 12px;width: 12px;border-radius: 900px; background-color: #e5e5e5 ;display: block;"></span>
        <span style="height: 8px;width: 8px;border-radius: 900px; background-color: #e5e5e5 ;display: block;"></span>
      </div>
    </div>
    <p style="margin: 60px 0px;">

      Dear Ahmed,

      We have received a request to change the password for your portfolio account. To complete this process, please
      click
      the button
      below:

      <br>
      If you initiated this request, you can proceed with the link above to reset your password. Please ensure that you
      choose
      a strong and secure password to protect your account.
      <a style="display: block;
          background: #f97316;
          padding: 8px 40px;
          border-radius: 8px;
          margin: 20px auto;
          text-align: center;
          color: white;
          font-weight: 900;
          width: fit-content;" href="${data}">Change Password</a>
    </p>
    <p>If you did not request this password change, it is possible that someone else may be trying to access your
      account.
      We
      recommend taking the following steps immediately:</p>
    <ul>

      <li>
        Do not click the button above.
      </li>
      <li>
        Contact our support team to report unauthorized activity.
      </li>
      <li>
        Consider reviewing your account's security settings for additional protection.
      </li>
      <li>
        We value your security and are here to assist if you need any help.
      </li>
    </ul>
  </div> 
</body></html>`,
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
        return console.log("error");
      }
      // return console.log("sent");
      return resolve({ messege: "message sent succesfully" });
    });
  });
}

module.exports = { sendEmail };
