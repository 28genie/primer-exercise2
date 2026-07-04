import { loadPrimer } from '@primer-io/primer-js';

async function init() {
  await loadPrimer();
  const checkoutEl = document.getElementById('primer-checkout-element');

  try {
    const res = await fetch('http://localhost:3000/api/client-session', { method: 'POST' });
    if (!res.ok) throw new Error('Token acquisition failed');

    const { clientToken } = await res.json();
    checkoutEl.setAttribute('client-token', clientToken);

    checkoutEl.options = {
      locale: 'en',
      card: { cardholderName: { required: true } },
      redirect: { returnUrl: window.location.origin + '/' }
    };

    checkoutEl.addEventListener('primer:payment-success', (e) => console.log('Success:', e.detail));
    checkoutEl.addEventListener('primer:payment-failure', (e) => console.error('Failure:', e.detail));
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

init();
