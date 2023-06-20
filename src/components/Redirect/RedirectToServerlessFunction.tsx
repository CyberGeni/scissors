import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToServerlessFunction: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      const identifier = window.location.pathname.substr(1); // Remove leading slash
      const response = await fetch(`/api/handler?identifier=${identifier}`);
      if (response.ok) {
        const data = await response.json();
        const { original_url } = data;
        window.location.replace(original_url);
      } else {
        navigate('/not-found'); // Handle URL not found case in your React application
      }
    };

    fetchOriginalUrl();
  }, [navigate]);

  return null;
};

export default RedirectToServerlessFunction;
