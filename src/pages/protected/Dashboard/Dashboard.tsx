import { useEffect, useState } from 'react';
import supabase from '../../../supabase'
import { User } from '../../../types/userTypes';
function Dashboard() {

    const [user, setUser] = useState<User | null> (null)

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

        </div>
    )
}

export default Dashboard