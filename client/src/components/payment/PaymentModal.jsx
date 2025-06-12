import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsAPI, bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Add logging to debug stripe initialization
console.log('Stripe public key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Log any stripe promise errors
stripePromise.catch(error => {
  console.error('Stripe initialization error:', error);
});

const PaymentForm = ({ clientSecret, bookingId, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/bookings',
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await bookingsAPI.confirm(bookingId, paymentIntent.id);
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message);
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ isOpen, onClose, amount, itemType, itemId, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && amount) {
      const initializePayment = async () => {
        try {
          console.log('Initializing payment:', { amount, itemType, itemId });
          
          if (!amount || !itemType || !itemId) {
            throw new Error('Missing payment details');
          }

          const response = await paymentsAPI.createIntent({
            amount,
            itemType,
            itemId
          });

          console.log('Payment intent created:', { 
            hasSecret: !!response.clientSecret,
            bookingId: response.bookingId 
          });

          setClientSecret(response.clientSecret);
          setBookingId(response.bookingId);
          setError(null);
        } catch (error) {
          console.error('Payment initialization error:', error);
          setError(error.message);
          toast.error(error.message);
          onClose();
        }
      };

      initializePayment();
    }
  }, [isOpen, amount, itemType, itemId]);

  if (!isOpen || !clientSecret) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            bookingId={bookingId}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
