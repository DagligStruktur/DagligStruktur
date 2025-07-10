const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { email, produkt } = req.body;

  if (!email || !produkt) {
    return res.status(400).json({ message: "Email and product required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Nettbutikken din" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Ditt produkt: ${produkt}`,
    text: `Hei! Her er ditt kjøpte produkt: ${produkt}. Takk for kjøpet!`,
    attachments: [
      {
        filename: `${produkt}.pdf`,
        path: `${__dirname}/filer/${produkt}.pdf`,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-post sendt!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Noe gikk galt ved sending av e-post." });
  }
};
