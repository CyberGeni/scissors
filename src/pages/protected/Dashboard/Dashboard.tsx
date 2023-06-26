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
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);
    const [showDetails, setShowDetails] = useState(false)

    // console.log("selected link", selectedLink)
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
            if (error) {
                console.error('Error fetching user links from Supabase:', error);
                // Handle the error case
            } else {
                // console.log(data)
                const formattedData = data as Link[]; // Explicitly cast the data to Link[]
                setLinks(formattedData);
                if (formattedData && formattedData.length > 0) {
                    setSelectedLink(formattedData[0]);
                }
            }
        };
        fetchUserLinks();

    }, [user]);



    return (
        <>
            <section className='mt-20'>
                <div className="relative flex overflow-x-hidden">
                    {/* links section */}
                    <div className='relative w-full md:w-fit col-span-2'>
                        <div className="w-full relative border-r border-gray-200">
                            {/* link header */}
                            <div className="w-auto px-6 py-4 bg-gray-50 flex items-center justify-between">
                                <h3>All links</h3>
                                <div className='flex rounded-md border border-gray-100 items-center bg-white space-x-2 px-5 py-3 shadow-[1px_1px_2px_0px_rgba(203,203,209,0.29)]'>
                                    <span className='text-gray-500'>Sort by</span>
                                    <img className='w-5 h-5' src={filterIcon} alt="" />
                                </div>
                            </div>
                            {/* list of links */}
                            <div className=' mb-20 sm:mb-0 overflow-y-scroll h-[79vh]'>
                                {/* check if there are links */}
                                {links.length === 0 && (
                                    <div className='my-6 w-full flex justify-center items-center'>
                                        <span className='text-gray-600'>You've not shortened any links yet.</span>
                                    </div>
                                )}
                                {links.map((link) => (
                                    <div
                                        key={link?.id}
                                        onClick={() => {
                                            setSelectedLink(link)
                                            setShowDetails(true)
                                        }} className='flex items-center justify-between px-6 py-4 border-y border-gray-200 '>
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
                    <div className={`bg-white transition-all absolute md:flex md:static w-full
                        ${showDetails ? "left-0" : "left-[100vh]"}
                    `}>
                        {selectedLink ? (
                            <div className=' min-h-screen w-full'>
                                <div onClick={() => setShowDetails(false)} className='hover:bg-gray-100 transition-all md:hidden m-4 flex items-center p-3 border border-gray-200 w-fit rounded-md'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    <span className='ml-1.5'>Go back</span>
                                </div>
                                {/* your link stats */}
                                <div className='bg-gray-100 w-full py-8 px-6 text-gray-900'>
                                    <h1 className='text-xl font-medium'>Your link stats</h1>
                                    <div className='my-6 gap-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
                                        <div className='bg-white rounded-md shadow p-6 space-y-6'>
                                            <div className='flex justify-between text-gray-500 '>
                                                <span className='font-medium'>Link clicks</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>

                                            </div>
                                            <h1 className='text-3xl font-bold'>2,000</h1>
                                        </div>
                                        <div className='bg-white rounded-md shadow p-6 space-y-6'>
                                            <div className='flex justify-between text-gray-500 '>
                                                <span className=' font-medium tracking-tight'>Top click source</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>

                                            </div>
                                            <h1 className='text-3xl font-bold'>Twitter</h1>
                                        </div>
                                        <div className='bg-white rounded-md shadow p-6 space-y-6'>
                                            <div className='flex justify-between text-gray-500 '>
                                                <span className='font-medium'>Top location</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>

                                            </div>
                                            <h1 className='text-3xl font-bold'>Nigeria</h1>
                                        </div>
                                    </div>

                                </div>
                                {/* your link */}
                                <div>
                                    <h1>Your link</h1>
                                    <div>
                                        <img src="" alt="" />
                                        <div>
                                            <h3>{selectedLink.short_url}</h3>
                                            <span>{selectedLink.original_url}</span>
                                            <span>{selectedLink.name}</span>
                                            <span className='underline my-0.5'>Edit source url</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                        </svg>

                                    </div>
                                </div>
                                
                            </div>
                        ) : (
                            <div>No data to show</div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
export default Dashboard;