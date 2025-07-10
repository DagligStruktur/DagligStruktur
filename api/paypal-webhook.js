export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body; // PayPal sender data her

    console.log('Webhook mottatt:', event);

    // Her kan du legge til validering av webhook-data
    // og kode for å sende e-post til kunden, lagre i database osv.

    res.status(200).json({ message: 'Webhook mottatt' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
