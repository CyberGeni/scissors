import { useEffect, useState } from 'react';
import supabase from '../../../supabase';
import { User } from '../../../types/userTypes';
import { useNavigate } from 'react-router-dom';

// interface DashboardProps {
//   user: User | null;
// }

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
 
  const logout = async () => {
    supabase.auth.signOut()
    navigate('/')
  }
  // fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      const currentUser = session?.data?.session?.user;

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className=''>welcome to your dashboard, {user?.email}!
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Dashboard

function setUser(currentUser: User) {
  throw new Error('Function not implemented.');
}
