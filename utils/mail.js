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
      from: '"Alabwaa" <alabwaa.yl@gmail.com>',
      sender: "Alabwaa",
      to: email,
      subject: "Password Change Request Confirmation",
      html: `
      <!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إعادة تعيين كلمة المرور</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      direction: rtl;
    }
    h2 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 20px;
      background-color: #007bff;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>إعادة تعيين كلمة المرور</h2>
    <p>مرحبًا </p>
    <p>
      لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك.
      إذا كنت أنت من أرسل هذا الطلب، يُرجى الضغط على الزر أدناه لإعادة تعيين كلمة المرور:
    </p>
    <a href="${data}" class="button">إعادة تعيين كلمة المرور</a>
    <p>
      إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني، ولن يتم إجراء أي تغييرات على حسابك.
    </p>
    <p class="footer">هذا الرابط صالح لفترة محدودة فقط.</p>
    <p class="footer">مع تحياتنا،<br>شركة الابواء</p>
  </div>
</body>
</html>`,
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
