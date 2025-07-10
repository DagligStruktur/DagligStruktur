// pages/api/paypal-webhook.js (eller api/paypal-webhook.js)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // For testing, log payload and return OK
  console.log('Received webhook:', req.body);

  res.status(200).json({ message: 'Webhook received!' });
}
