import { User as MyUser } from '../../types/userTypes'; // Import custom User type with alias
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import supabase from '../../supabase'
import urlRegex from 'url-regex';

export default function ShortenLinkModal() {
    const [user, setUser] = useState<MyUser | null>(null); // Use the custom User type
    const [linkName, setLinkName] = useState('')
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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
        console.log(customIdentifierAvailability)
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
            console.log('Link inserted successfully:', data);
            // Handle the success case
        }
        setIsLoading(false)
        // Update the state with the shortened URL
        closeModal()
        setLinkName('')
        setUrl('')
        setCustomIdentifier('')
        setShortenedUrl(shortenedLink);
    };


    const [isOpen, setIsOpen] = useState(false)
    function closeModal() {
        setIsOpen(false)
    }
    function openModal() {
        setIsOpen(true)
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
                                        Create a new shortened link
                                    </Dialog.Title>
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
                                            {customIdentifierTouched && customIdentifier && (/[^a-zA-Z0-9-]/.test(customIdentifier)) && customIdentifier.length >= 2 && (
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
                                            {/* {customIdentifier  && customIdentifier.length >= 3 && !checkIdentifierLoading && customIdentifierAvailability && (
                                                <small className='text-red-500'>No special characters apart from hyphen (-) allowed</small>
                                            )} */}
                                            {!customIdentifier && !checkIdentifierLoading && (
                                                <small className='text-gray-500'></small>
                                            )}

                                        </div>
                                    </form>

                                    <div className=" flex justify-between mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-200 px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}

                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="disabled:cursor-not-allowed disabled:hover:bg-blue-100 disabled:opacity-60 disabled:text-blue-700 rounded-md border border-transparent bg-blue-100 px-6 py-3 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleSubmit}
                                            disabled={isLoading || (!url || linkName.length < 2) || !isValidUrl || !customIdentifierAvailability}
                                        >   {
                                                isLoading ?
                                                    <div><span>Creating your link...</span></div>
                                                    :
                                                    <span>Create</span>
                                            }
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
