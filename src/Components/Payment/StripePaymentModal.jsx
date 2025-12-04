import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Loader2, Lock } from 'lucide-react';

// PUT YOUR PUBLISHABLE KEY HERE
const stripePromise = loadStripe("pk_test_51SaVMAFNR3lVWIEVBwB09PsLL10JX5qdy0S1eyBpW47MyQlRozWRdQXBcgLD6DWkDVCz7Rr14uQQHr0v1K5501wc00Pu8OXYNu");

const CheckoutForm = ({ onSuccess, onClose, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // No redirect needed for simple card payments usually, but required parameter
        return_url: window.location.origin, 
      },
      redirect: 'if_required' // Important: Stops redirect if not 3DSecure
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // PAYMENT SUCCESS! Now save the order in DB
      onSuccess();
    } else {
      setErrorMessage("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      
      <button 
        disabled={!stripe || loading} 
        className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 disabled:bg-gray-300 transition"
      >
        {loading ? <Loader2 className="animate-spin" /> : `Pay LKR ${amount.toLocaleString()}`}
      </button>
    </form>
  );
};

const StripePaymentModal = ({ clientSecret, onClose, onSuccess, amount }) => {
  const options = {
    clientSecret,
    appearance: { theme: 'stripe' },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X size={24} />
        </button>
        
        <div className="mb-6 flex items-center gap-2 text-teal-700">
            <Lock size={20} />
            <h2 className="text-xl font-bold">Secure Payment</h2>
        </div>

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm onSuccess={onSuccess} onClose={onClose} amount={amount} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default StripePaymentModal;