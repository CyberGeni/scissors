import { User as MyUser } from '../../types/userTypes'; // Import custom User type with alias
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import supabase from '../../supabase'
import urlRegex from 'url-regex';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } from 'react-share';

export default function ShortenLinkModal() {
    const [user, setUser] = useState<MyUser | null>(null); // Use the custom User type
    const [linkName, setLinkName] = useState('')
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore next line
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [shortenedUrl, setShortenedUrl] = useState('')
    const [customIdentifier, setCustomIdentifier] = useState('')
    const [customIdentifierAvailability, setCustomIdentifierAvailability] = useState<boolean | null>(null);
    const [checkIdentifierLoading, setCheckIdentifierLoading] = useState(false)

    // form validation states
    const [nameTouched, setNameTouched] = useState(false)
    const [urlTouched, setUrlTouched] = useState(false)
    const [customIdentifierTouched, setCustomIdentifierTouched] = useState(false)

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

    // check if link from user input is valid
    const isValidUrl = urlRegex({ exact: true, strict: false }).test(url)

    // check identifier availability
    useEffect(() => {
        const isMounted = true;
        const checkIdentifierAvailability = async () => {
            if (customIdentifier) {
                setCheckIdentifierLoading(true);
                const { data, error } = await supabase
                    .from('links')
                    .select('identifier')
                    .eq('identifier', customIdentifier)
                    .limit(1)
                    .single();

                if (error) {
                    console.error('Error checking identifier availability:', error);
                    setCustomIdentifierAvailability(true); // Reset availability state on error
                } else {
                    const isAvailable = data === null; // Check if data is null (no rows returned)
                    setCustomIdentifierAvailability(isAvailable);
                }
                setCheckIdentifierLoading(false);
            } else {
                setCustomIdentifierAvailability(null);
            }
        };
        const delay = setTimeout(() => {
            if (isMounted) {
                checkIdentifierAvailability();
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [customIdentifier, customIdentifierAvailability]);

    // Generate a unique identifier for the shortened link
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setIsLoading(true)
        // Check if the URL has a valid protocol
        const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
        const formattedUrl = hasProtocol ? url : `https://${url}`;

        // Generate a unique identifier for the shortened link
        const generateUniqueId = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 6; // Adjust the desired length of the unique identifier

            let result = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
            return result;
        };
        const generatedIdentifier = generateUniqueId();
        const timestamp = new Date().toISOString();

        // Construct the shortened URL
        const shortenedLink = `https://btchr.vercel.app/${customIdentifier || generatedIdentifier}`;

        // Save the original URL and unique identifier to the database
        const { data, error } = await supabase
            .from('links')
            .insert([
                {
                    name: linkName,
                    original_url: formattedUrl,
                    short_url: shortenedLink,
                    identifier: customIdentifier || generatedIdentifier,
                    created_at: timestamp,
                    user_id: user?.id || null,
                },
            ])
            .single();

        if (error) {
            console.error('Error inserting link into Supabase:', error);
            // Handle the error case
        } else {
            setSuccess(true)
            console.log('Link inserted successfully:', data);
            // Handle the success case
        }
        setIsLoading(false)
        // Update the state with the shortened URL
        setUrl(formattedUrl)
        setShortenedUrl(shortenedLink);
    };


    const [isOpen, setIsOpen] = useState(false)
    function closeModal() {
        setIsOpen(false)
    }
    function openModal() {
        setIsOpen(true)
    }


    // copy to clipboard functionality
    const [copyButtonText, setCopyButtonText] = useState('Copy')
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => {
                setCopyButtonText('Copy');
            }, 2500); // Reset the text to 'Copy' after 3 seconds
        });
    };

    // share to socials functionality
    async function shareContent() {
        try {
            await navigator.share({
                title: "",
                text: "",
                url: shortenedUrl
            })
            console.log('shared successfully')
        } catch (error) {
            console.error("Error sharing: ", error)
        }
    }
    return (
        <>
            <div className="">
                <button
                    type="button"
                    onClick={openModal}
                    className='h-fit w-fit whitespace-nowrap sm:w-full rounded-lg px-4 py-3 bg-blue-700 text-white shadow-gray-300/20 shadow-inner'>
                    Shorten new link
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="font-circular relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="text-gray-700 fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-medium leading-6 text-gray-900 pb-4 text-center"
                                    >
                                        {success ? (
                                            <span>🎉 Yayyy... you've shortened a link! 🎉</span>
                                        ) : (
                                            <span>Create a new shortened link</span>
                                        )}

                                    </Dialog.Title>
                                    {!success && (
                                        <form className="mt-2 space-y-4">
                                            <div className='flex flex-col space-y-1'>
                                                <label className="text-sm font-medium text-gray-700">
                                                    What's the name of your link?
                                                </label>
                                                <input
                                                    onChange={(e) => setLinkName(e.target.value)}
                                                    value={linkName}
                                                    onBlur={() => setNameTouched(true)}
                                                    className='border border-gray-200 rounded-md px-3 py-3' type="text" placeholder="btchr's launch party" />
                                                {nameTouched && (!linkName || linkName.length < 2) && <small className='text-red-500'>Please add a name for your link</small>}
                                            </div>
                                            <div className='flex flex-col space-y-1'>
                                                <label className="text-sm font-medium text-gray-700">
                                                    Enter your link
                                                </label>
                                                <input
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    value={url}
                                                    onBlur={() => setUrlTouched(true)}
                                                    className='border border-gray-200 rounded-md px-3 py-3' type="text" placeholder='example.com' />
                                                {urlTouched && (!url || url.length < 1) && <small className='text-red-500'>Please enter the link you need to shorten</small>}
                                                {urlTouched && !isValidUrl && (url.length > 0) && <small className='text-red-500'>Please enter a valid link</small>}
                                            </div>
                                            <div className='flex flex-col space-y-1'>
                                                <label className="text-sm font-medium text-gray-700">
                                                    Customise your link <small className='text-gray-500'>(optional)</small>
                                                </label>
                                                <div className='border border-gray-200 rounded-md px-3 py-3 '>
                                                    <span>btchr.vercel.app/</span>
                                                    <input
                                                        onChange={(e) => setCustomIdentifier(e.target.value)}
                                                        value={customIdentifier}
                                                        onBlur={() => setCustomIdentifierTouched(true)}
                                                        className='placeholder:pl-1' type="text" placeholder='launchParty' />
                                                </div>
                                                {customIdentifierTouched && customIdentifier && (/[^a-zA-Z0-9-]/.test(customIdentifier)) && customIdentifier.length >= 3 && (
                                                    <small className='text-red-500'>Special characters are not allowed. Only letters, numbers and hyphen (-) are allowed.'</small>
                                                )}
                                                {customIdentifierTouched && customIdentifier && customIdentifier.length <= 2 && (
                                                    <small className='text-red-500'>If you must add a custom URL, it should be more than 2 characters</small>
                                                )}
                                                {checkIdentifierLoading && !(/[^a-zA-Z0-9-]/.test(customIdentifier)) && customIdentifier.length >= 3 && (
                                                    <small className='text-gray-500'>Checking for availability...</small>
                                                )}
                                                {customIdentifier && !(/[^a-zA-Z0-9-]/.test(customIdentifier)) && customIdentifier.length >= 3 && !checkIdentifierLoading && !customIdentifierAvailability && (
                                                    <small className='text-red-500'>This link is not available</small>
                                                )}
                                                {customIdentifier && !(/[^a-zA-Z0-9-]/.test(customIdentifier)) && customIdentifier.length >= 3 && !checkIdentifierLoading && customIdentifierAvailability && (
                                                    <small className='text-green-500'>This link is available</small>
                                                )}
                                                {!customIdentifier && !checkIdentifierLoading && (
                                                    <small className='text-gray-500'></small>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                    {success && (
                                        <div className='text-center mx-auto my-4 space-y-4 '>
                                            <span>Share this link to the world:</span>
                                            <div className='flex justify-center mt-3 space-x-2 border-b border-gray-200 pb-4'>
                                                <a className='underline bg-gray-200 p-2 rounded' href={shortenedUrl} target='_blank'>{shortenedUrl}</a>
                                                <button onClick={handleCopyToClipboard} className='hover:bg-gray-100 transition-all flex items-center w-fit px-3 py-1 border border-gray-200 rounded'>{copyButtonText}
                                                    {copyButtonText === 'Copy' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                                        </svg>

                                                    )}
                                                </button>
                                            </div>
                                            <div className='flex justify-center space-x-2 text-gray-700'>
                                                <button className='flex items-center justify-center border border-gray-200 rounded-full w-10 h-10 hover:bg-gray-100 transition-all'>
                                                    <FacebookShareButton
                                                        url={shortenedUrl}
                                                        hashtag="#btchr"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-gray-700"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"></path></svg>
                                                    </FacebookShareButton>
                                                </button>
                                                <button className='flex items-center justify-center border border-gray-200 rounded-full w-10 h-10 hover:bg-gray-100 transition-all'>
                                                    <WhatsappShareButton
                                                        url={shortenedUrl}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-gray-700"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg>
                                                    </WhatsappShareButton>
                                                </button>
                                                <button className='flex items-center justify-center border border-gray-200 rounded-full w-10 h-10 hover:bg-gray-100 transition-all'>
                                                    <TwitterShareButton
                                                        url={shortenedUrl}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-gray-700"><path d="M15.3499 5.5498C13.7681 5.5498 12.4786 6.81785 12.4504 8.39633L12.4223 9.97138C12.4164 10.3027 12.143 10.5665 11.8117 10.5606C11.7881 10.5602 11.7646 10.5584 11.7413 10.5552L10.1805 10.3423C8.12699 10.0623 6.15883 9.11711 4.27072 7.54387C3.67275 10.8535 4.84 13.147 7.65342 14.9157L9.40041 16.014C9.68095 16.1904 9.7654 16.5608 9.58903 16.8413C9.54861 16.9056 9.49636 16.9616 9.43504 17.0064L7.84338 18.1693C8.78973 18.2288 9.68938 18.1873 10.435 18.0385C15.1526 17.097 18.2897 13.5468 18.2897 7.69084C18.2897 7.21275 17.2774 5.5498 15.3499 5.5498ZM10.4507 8.36066C10.4983 5.69559 12.6735 3.5498 15.3499 3.5498C16.7132 3.5498 17.9465 4.10658 18.8348 5.00515C19.5462 4.9998 20.1514 5.17966 21.5035 4.35943C21.1693 5.9998 21.0034 6.71177 20.2897 7.69084C20.2897 15.3324 15.5926 19.0487 10.8264 19.9998C7.5587 20.6519 2.80646 19.5812 1.44531 18.1584C2.13874 18.1051 4.95928 17.8018 6.58895 16.6089C5.20994 15.6984 -0.278631 12.4679 3.32772 3.78617C5.02119 5.76283 6.73797 7.10831 8.47807 7.82262C9.63548 8.29774 9.91978 8.28825 10.4507 8.36066Z"></path></svg>
                                                    </TwitterShareButton>
                                                </button>
                                                <button className='flex items-center justify-center border border-gray-200 rounded-full w-10 h-10 hover:bg-gray-100 transition-all'>
                                                    <EmailShareButton
                                                        url={shortenedUrl}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-700" viewBox="0 0 24 24"><path fill="currentColor" d="m18.73 5.41l-1.28 1L12 10.46L6.55 6.37l-1.28-1A2 2 0 0 0 2 7.05v11.59A1.36 1.36 0 0 0 3.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0 0 22 18.64V7.05a2 2 0 0 0-3.27-1.64z" /></svg>
                                                    </EmailShareButton>
                                                </button>

                                                <button onClick={shareContent} className='flex items-center justify-center border border-gray-200 rounded-full w-10 h-10 hover:bg-gray-100 transition-all'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className=" flex justify-between mt-4">
                                        {!success && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-200 px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >Cancel</button>
                                        )}

                                        {success && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-200 px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={() => window.location.reload()}
                                            >Close</button>
                                        )}
                                        {!success && (
                                            <button
                                                type="button"
                                                className="disabled:cursor-not-allowed disabled:hover:bg-blue-100 disabled:opacity-60 disabled:text-blue-700 rounded-md border border-transparent bg-blue-100 px-6 py-3 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={handleSubmit}
                                                disabled={isLoading || (!url || linkName.length < 2) || !isValidUrl || !customIdentifierAvailability || (/[^a-zA-Z0-9-]/.test(customIdentifier))}>   {
                                                    isLoading ?
                                                        <div><span>Creating your link...</span></div>
                                                        :
                                                        <span>Create</span>
                                                }
                                            </button>
                                        )}

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}
