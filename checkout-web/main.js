import '@primer-io/checkout-web/dist/Checkout.css';
import { Primer } from '@primer-io/checkout-web';

async function init() {
  try {
    const res = await fetch('http://localhost:3000/api/client-session', { method: 'POST' });
    if (!res.ok) throw new Error('Token acquisition failed');

    const { clientToken } = await res.json();

    await Primer.showUniversalCheckout(clientToken, {
      container: '#checkout-container',
      locale: 'en',
      redirect: {
        returnUrl: window.location.origin + '/'
      },
      onCheckoutComplete({ payment }) {
        console.log('Payment complete:', payment);
        document.getElementById('success-message').hidden = false;
      },
      onCheckoutFail(error, data) {
        console.error('Checkout failed:', error, data);
      }
    });
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

init();
