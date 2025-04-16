import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          navigate('/', { replace: true });
          return;
        }

        if (session) {
          // Check if we have a pending calendar event
          const pendingEvent = localStorage.getItem('pendingCalendarEvent');
          if (pendingEvent) {
            localStorage.removeItem('pendingCalendarEvent');
            navigate('/calendar', { replace: true });
          } else {
            navigate('/dash', { replace: true });
          }
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Completing Sign In...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    </div>
  );
}; 