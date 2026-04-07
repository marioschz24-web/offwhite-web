const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity || 1,
          currency_id: 'CLP'
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/pending`
        },
        auto_return: 'approved'
      }
    });

    res.status(200).json({ id: result.id, init_point: result.init_point });

  } catch (error) {
    console.error('MP Error:', error);
    res.status(500).json({ error: 'Error creando preferencia de pago' });
  }
};
