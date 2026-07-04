const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/client-session', async (req, res) => {
  try {
    const payload = {
      orderId: `order-${Date.now()}`,
      amount: 2500,
      currencyCode: 'SGD',
      order: {
        lineItems: [{ itemId: 'challenge-item', description: 'Primer Exercise 2', amount: 2500, quantity: 1 }]
      }
    };

    const response = await fetch('https://api.sandbox.primer.io/client-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': '2.4',
        'X-Api-Key': process.env.PRIMER_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json({ clientToken: data.clientToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Token backend listening on port ${PORT}`));
