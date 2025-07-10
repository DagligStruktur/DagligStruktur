// /api/send-email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Kun POST er tillatt" });
  }

  const { email, produkt } = req.body;

  if (!email || !produkt) {
    return res.status(400).json({ message: "Mangler e-post eller produkt" });
  }

  // 📩 Konfigurer transport med Gmail og app-passord
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "juliewold2006@gmail.com", // <-- bytt ut med din Gmail-adresse
      pass: "embihpkgactmelt"     // <-- bytt ut med det 16-sifrede app-passordet
    }
  });

  try {
    // Her sender vi e-posten
    await transporter.sendMail({
      from: '"Min Nettbutikk" <DIN_EPOST@gmail.com>', // Fra deg
      to: email, // Kundens e-post
      subject: `Takk for kjøpet av ${produkt}`,
      text: `Hei! Takk for kjøpet av ${produkt}. Her er produktet ditt som vedlegg.`,
      attachments: [
        {
          filename: `${produkt}.pdf`,
          path: `./produkter/${produkt}.pdf`, // Forutsetter at filen ligger der
        }
      ]
    });

    return res.status(200).json({ message: "E-post sendt!" });

  } catch (error) {
    console.error("Feil ved sending av e-post:", error);
    return res.status(500).json({ message: "Feil ved sending av e-post" });
  }
}
