import { useEffect, useState } from 'react';
import supabase from '../../../supabase';
import { User as MyUser } from '../../../types/userTypes'; // Import custom User type with alias
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<MyUser | null>(null); // Use the custom User type


  // redirect to login if not logged in
  useEffect(() => {
    (async () => {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
            navigate('/login')
            alert('you need to be logged in to view this page')
        }
    })();
}, [navigate])


  const logout = async () => {
    supabase.auth.signOut();
    navigate('/');
  };

  // fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      const currentUser = session?.data?.session?.user;

      if (currentUser) {
        setUser(currentUser as MyUser); // Cast currentUser to MyUser type
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className=''>
      welcome to your dashboard, {user?.email}!
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default Dashboard;
