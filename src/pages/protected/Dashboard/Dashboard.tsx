import { User as MyUser } from '../../../types/userTypes'; // Import custom User type with alias
import filterIcon from '../../../assets/icons/filter.png';
import eye from '../../../assets/icons/eye.png';
import supabase from '../../../supabase';
import { useEffect, useState } from 'react';
// import { saveAs } from 'file-saver';
import '../../../Dashboard.css'
import EditLinkModal from '../../../components/Modals/EditLinkModal';
import axios from 'axios';

interface Link {
    id: string;
    url: string;
    original_url: string;
    short_url: string;
    name: string;
    linkName: string;
    customIdentifier: string;
    identifier: string;
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

    const downloadQRCode = async () => {
        const qrCodeImageUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${selectedLink?.short_url}&size=100x100`;
      
        try {
          const response = await axios({
            url: qrCodeImageUrl,
            method: 'GET',
            responseType: 'blob',
          });
      
          // Create a temporary <a> element
          const link = document.createElement('a');
      
          // Create a URL for the Blob object
          const url = URL.createObjectURL(response.data);
      
          // Set the href and download attributes of the <a> element
          link.href = url;
          link.download = 'qr-code.png'; // Specify the filename for the downloaded file
      
          // Programmatically trigger the click event on the <a> element
          link.click();
      
          // Clean up the created URL object
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading QR code:', error);
        }
      };
      
      
      
    return (
        <>
            <section className='dashboard bg-gray-200 mt-20 w-full'>
                <div className="relative flex w-full overflow-x-hidden">
                    {/* links section */}
                    <div className={`bg-white w-full sm:w-[75%] md:fixed md:w-[40%] lg:w-[35%] xl:w-[25%] col-span-2
                        ${showDetails ? "" : "fixed"}
                    `}>
                        <div className=" relative border-r border-gray-200">
                            {/* link header */}
                            <div className="w-auto px-6 py-4 bg-gray-50 flex items-center justify-between">
                                <h3>All links</h3>
                                <div className='flex rounded-md border border-gray-100 items-center bg-white space-x-2 px-5 py-3 shadow-[1px_1px_2px_0px_rgba(203,203,209,0.29)]'>
                                    <span className='text-gray-500'>Sort by</span>
                                    <img className='w-5 h-5' src={filterIcon} alt="" />
                                </div>
                            </div>
                            {/* list of links */}
                            <div className='overflow-x-hidden pb-20 sm:pb-0 overflow-y-scroll h-[76vh] lg:h-[77vh]'>
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
                                            console.log('details are supposed to show now')
                                        }} className={`flex transition-all items-center justify-between px-6 py-4 border-b border-gray-200 first-letter:
                                            ${link.id === selectedLink?.id ? "md:bg-gray-100" : ""}
                                        `}>
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
                    <div className={` h-fit md:pl-[53.4%] lg:pl-[43.85%] xl:pl-[31.2%] bg-white transition-all absolute md:flex md:static w-full
                        ${showDetails ? "left-0" : "left-[100vh]"}
                    `}>
                        {selectedLink ? (
                            <div className='w-full mb-16 md:mb-0'>
                                <div className='w-full'>
                                    <div onClick={() => setShowDetails(false)} className='hover:bg-gray-100 transition-all md:hidden m-4 flex items-center p-3 border border-gray-200 w-fit rounded-md'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                        </svg>
                                        <span className='ml-1.5'>Go back</span>
                                    </div>
                                    {/* your link stats */}
                                    <div className='bg-gray-100 w-full py-8 px-6 text-gray-900'>
                                        <h1 className='text-xl font-medium'>Your link stats</h1>
                                        <div className='my-6 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
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
                                    <div className='py-8 px-6 bg-gray-50/50 border-y'>
                                        <h1 className='text-xl font-medium'>Your link</h1>
                                        <div className='flex flex-col lg:flex-row my-6 gap-4'>
                                            <img className='object-cover w-full h-[210px] lg:h-auto md:w-[200px] rounded-md' src="https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png" alt="Image 500580 - Placeholder Transparent@pngkey.com" />
                                            <div className='flex justify-between w-full'>
                                                <div className='flex flex-col w-11/12'>
                                                    <a href={selectedLink?.short_url} className='text-gray-700 hover:underline transition-all ' target='_blank'>{selectedLink.short_url}</a>
                                                    <span className='text-gray-600'>{selectedLink.original_url}</span>
                                                    <span className='text-gray-600'>{selectedLink.name}</span>
                                                   <EditLinkModal selectedLink={selectedLink} />
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/* qr code */}
                                    <div className='py-8 px-6 bg-gray-50 border-y'>
                                        <h1 className='text-xl font-medium'>QR code</h1>
                                        <div className='flex flex-col sm:flex-row md:flex-col lg:flex-row my-6 gap-4'>
                                            <div className='p-2 h-fit rounded-md bg-white max-w-xs mx-auto'>
                                                <img className='object-cover w-[250px] rounded-md bg-white' src={`http://api.qrserver.com/v1/create-qr-code/?data=${selectedLink.short_url}&size=100x100`} alt={selectedLink.name} />
                                            </div>
                                            <div className='flex flex-col w-full'>
                                                <span className='text-gray-600 text-lg max-w-xs'>People can scan this QR code to access your link</span>
                                                <span className='text-gray-600 text-lg my-2'>Download now to share</span>
                                                <button onClick={downloadQRCode} className='flex w-fit px-5 py-3 lg:my-4 rounded-md text-gray-500 border border-gray-300 bg-gray-100 shadow-[0px_1px_1px_0px_rgba(203,200,212,0.35),0px_1px_1px_1px_#FFF_inset]'>
                                                    <span className='mr-2'>Download PNG</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </div>
                                    </div>


                                </div></div>

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