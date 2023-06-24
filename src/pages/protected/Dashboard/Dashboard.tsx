import { User as MyUser } from '../../../types/userTypes'; // Import custom User type with alias
import filterIcon from '../../../assets/icons/filter.png';
import eye from '../../../assets/icons/eye.png';
import supabase from '../../../supabase';
import { useEffect, useState } from 'react';

interface Link {
    id: string;
    url: string;
    original_url: string;
    short_url: string;
    name: string;
    // Add other properties as needed
}

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<MyUser | null>(null); // Use the custom User type
    const [links, setLinks] = useState<Link[]>([]);

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

    // fetch user links
    useEffect(() => {
        const fetchUserLinks = async () => {
            console.log('Fetching user links...');
            // Fetch all links associated with the user
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('user_id', user?.id);
            console.log('Links:', data);
            if (error) {
                console.error('Error fetching user links from Supabase:', error);
                // Handle the error case
            } else {
                console.log(data)
                setLinks(data as Link[]);
            }
        };

        fetchUserLinks();
    }, [user]);



    return (
        <>
            <section className='mt-20'>
                {/* links section */}
                <div className='relative'>
                    <div className="w-full lg:w-[30%] border-r border-gray-200">
                        {/* link header */}
                        <div className="w-full lg:w-[22.9%] fixed px-6 py-4 bg-gray-50 flex items-center justify-between">
                            <h3>All links</h3>
                            <div className='flex rounded-md border border-gray-100 items-center bg-white space-x-2 px-5 py-3 shadow-[1px_1px_2px_0px_rgba(203,203,209,0.29)]'>
                                <span className='text-gray-500'>Sort by</span>
                                <img className='w-5 h-5' src={filterIcon} alt="" />
                            </div>
                        </div>
                        {/* list of links */}
                        <div className='w-full pt-[82px] overflow-y-scroll h-[90vh]'>
                            {/* check if there are links */}
                            {links.length === 0 && (
                                <div className='my-6 w-full flex justify-center items-center'>
                                    <span className='text-gray-600'>You've not shortened any links yet.</span>
                                </div>
                            )}

                            {links.map((link) => (
                                <div className='flex items-center justify-between px-6 py-4 border-y border-gray-200 '>
                                    {/* text */}
                                    <div className='tracking-tight flex flex-col w-full'>
                                        <span className='text-gray-700 text-lg font-medium tracking-tighter mb-0.5'>{link?.short_url}</span>
                                        <span className='text-gray-600'>{link?.original_url}</span>
                                        <span className='text-gray-600'>{link?.name}</span>
                                    </div>
                                    {/* views */}
                                    <div className='flex flex-col items-center -space-y-0.5'>
                                        <span className='text-gray-500 font-medium'>123</span>
                                        <img className='w-5' src={eye} alt="" />
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>


                {/* details section */}
                <div>

                </div>
            </section>
        </>
    )
}
export default Dashboard;