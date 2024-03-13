import { useEffect, useState } from 'react';
import supabase from '../../../supabase';
import { User as MyUser } from '../../../types/userTypes'; // Import custom User type with alias
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Dashboard/Sidebar/Sidebar';
import userIcon from '../../../assets/icons/user.png';
import ShortenLink from '../../../components/Modals/ShortenLinkModal';
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import '../../../App.css'
import LogoutModal from '../../../components/Modals/LogoutModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<MyUser | null>(null); // Use the custom User type
  const username = user?.email?.split('@')[0];
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

  // display banner if user is offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  return (
    <div className='flex font-circular'>
      <Sidebar />
      <section className='sm:ml-[25%] lg:ml-[20%] w-full'>
        {/* topbar */}
        <div className='bg-white fixed right-0 z-10 border-b border-gray-200 py-4 px-6 flex items-center justify-between w-full sm:w-3/4 lg:w-4/5 '>
          <div>
            <h1 className="sm:hidden text-blue-600 text-3xl font-medium tracking-tighter whitespace-nowrap ">btchr <span className="text-blue-900 text-3xl leading-none -ml-2.5">.</span></h1>
            <h1 className='hidden sm:flex text-gray-800 font-semibold tracking-tight text-lg'>Dashboard</h1>
          </div>
          <div className='flex items-center space-x-4 sm:mr-6'>
            <ShortenLink />

            <div className="relative text-gray-700">
              <div className="w-full max-w-sm ">
                <Popover className="relative">
                  {() => (
                    <>
                      <Popover.Button
                      >
                        <div className='sm:hover:cursor-default overflow-x-hidden focus:outline-none active:outline-none flex items-center text-left w-full space-x-2'>
                          <img className='w-8 h-8' src={userIcon} alt="" />
                          <div className='hidden sm:flex flex-col w-fit -space-y-1'>
                            <span className='text-gray-700'>{username}</span>
                            <span className='text-sm text-gray-500'>{user?.email}</span>
                          </div>
                        </div>
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="sm:hidden absolute -right-52 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                          <div className="p-4 bg-white overflow-hidden rounded-lg shadow-lg ">
                            <div className=' sm:hover:cursor-default overflow-x-hidden focus:outline-none active:outline-none flex items-center text-left w-full space-x-2'>
                              <img className='w-8 h-8' src={userIcon} alt="" />
                              <div className='flex flex-col w-fit -space-y-1'>
                                <span className='text-gray-700'>{username}</span>
                                <span className='text-sm text-gray-500'>{user?.email}</span>
                              </div>
                            </div>
                            <LogoutModal />
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <main className='' >
          <Outlet />
        </main>
        {/* main content */}

        {/* show banner if user is offline */}
        {!isOnline &&
          <section className='absolute inset-0 gop-0 z-50 text-center bg-slate-700/50 transition-all'><h1 className='bg-rose-500 text-white py-4'>Your device is offline. <a href={"/dashboard"} className="underline underline-offset-2">Reload</a></h1></section>
        }
      </section>
    </div>
  );
};

export default Dashboard;
