import { useEffect, useState } from 'react';
import supabase from '../../../supabase';
import { User as MyUser } from '../../../types/userTypes'; // Import custom User type with alias
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Dashboard/Sidebar/Sidebar';
import userIcon from '../../../assets/icons/user.png';
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<MyUser | null>(null); // Use the custom User type

  // redirect to login if not logged in
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate('/login')
      }
    })();
  }, [navigate])

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
    <div className='flex font-circular'>
      <Sidebar />
      <section className='sm:ml-[25%] lg:ml-[20%] w-full'>
        {/* topbar */}
        <div className='border-b border-gray-200 py-4 px-6 flex items-center justify-between w-full'>
          <h1 className='text-gray-800 font-semibold tracking-tight text-lg'>Dashboard</h1>
          <div className='flex items-center space-x-4 mr-6'>
            <button className='h-fit w-fit whitespace-nowrap sm:w-full rounded-lg px-4 py-3 bg-blue-700 text-white shadow-gray-300/20 shadow-inner' type="submit">Shorten new link</button>
            <div className='flex items-center w-full space-x-1'>
              <img className='w-8 h-8' src={userIcon} alt="" />
              <div className='flex flex-col w-fit -space-y-1'>
                <span className='text-gray-700'>cybergenie</span>
                <span className='text-sm text-gray-500'>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
        <main className='p-6'>
          <Outlet />
        </main>
        {/* main content */}
        
      </section>
   </div>
  );
};

export default Dashboard;
