import supabase from '../../../supabase';
import { User } from '../../../types/userTypes';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate()
  const logout = async () => {
    supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className=''>welcome to your dashboard, {user?.email}!
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Dashboard