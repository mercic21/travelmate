import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const isAdminRedirect = location.state?.from?.pathname === '/admin';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || '/';
      console.log('Redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        console.log('Starting authentication...');
        const response = await (isLogin ? login(data) : register(data));
        console.log('Authentication response:', response);
        return response;
      } catch (error) {
        console.error('Authentication error:', error);
        throw error;
      }
    },
    onMutate: () => {
      console.log('Mutation starting...');
    },
    onSuccess: (data) => {
      console.log('Mutation succeeded:', data);
      toast.success(`Successfully ${isLogin ? 'logged in' : 'registered'}!`);
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      toast.error(error.message || 'Authentication failed');
    },
    onSettled: () => {
      console.log('Mutation settled');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mutation.isPending) return;
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {isAdminRedirect && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          Please log in with admin credentials to access the admin panel.
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
        />
        
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-indigo-600 hover:text-indigo-800"
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default AuthPage;
