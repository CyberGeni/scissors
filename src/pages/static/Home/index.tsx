import { useState } from 'react';
import supabase from '../../../supabase';
import Navbar from '../../../components/Navbar';
import '../../../App.css'
// assets
import bgGradient from "../../../assets/images/hero-bg-gradient.png"
import chain from "../../../assets/images/hero-chain.png"
import chainBlurred from "../../../assets/images/hero-blurred-chain.png"
import TextCarousel from '../../../components/TextCarousel/TextCarousel';
import urlRegex from 'url-regex';
function Home() {

  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [urlTouched, setUrlTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [shortenLinkText, setShortenLinkText] = useState('Shorten link')
  // check if link from user input is valid
  const isValidUrl = urlRegex({ exact: true, strict: false }).test(url)

  // Generate a unique identifier for the shortened link
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

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
    const uniqueId = generateUniqueId();
    const timestamp = new Date().toISOString();

    // Construct the shortened URL
    const shortenedLink = `https://btchr.vercel.app/${uniqueId}`;
    setIsLoading(true);
    setShortenLinkText('Shortening link...')
    // Save the original URL and unique identifier to the database
    await supabase
      .from('links')
      .insert([
        {
          original_url: formattedUrl,
          identifier: uniqueId,
          created_at: timestamp,
          short_url: shortenedLink,
        },
      ])
      .single();

    // Update the state with the shortened URL
    setShortenedUrl(shortenedLink);
    setIsLoading(false);
    setShortenLinkText('Shorten link')
  };
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
    <div className='font-circular'>
      <div className="overflow-hidden fixed w-screen h-screen -z-10">
        <img className='w-full h-full object-cover object-center' src={bgGradient} alt="" />
      </div>
      {/* hero */}
      <section className='relative text-center px-[5%] py-8'>
        <Navbar />
        <div className='p-4 mx-auto mt-[3%] border border-[#1D2939] min-h-[77vh] flex flex-col justify-center'>
          <img className='absolute w-14 md:w-20 lg:w-40 xl:w-44 2xl:w-48 top-32 left-0' src={chain} alt="" draggable={false} />
          <img className='absolute w-14 md:w-20 lg:w-40 xl:w-44 2xl:w-48 bottom-16 right-40' src={chainBlurred} alt="" draggable={false} />
          <h1 className='hero-text lg:max-w-4xl mx-auto text-5xl md:text-7xl lg:text-[85px] p-4 font-medium'>Make that <TextCarousel /> link shorter. Super fast!</h1>
          <p className='text-gray-400 max-w-lg mx-auto my-8'>Say good bye to long, cumbersome URLs and hello to a simpler, sleeker way to shorten, share and manage your links.</p>
          <div className='max-w-lg mx-auto space-y-3 w-full'>
            <span className='text-gray-300'>Enter your link now to shorten it.</span>
            <form
              onSubmit={handleSubmit}
              action=""
              className='flex sm:grid sm:grid-cols-4 space-x-2 '>
              <input
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => setUrlTouched(true)}
                className='text-gray-200 border-gray-600 border h-fit col-span-3 w-full p-4 rounded-lg bg-gray-700 shadow-gray-600/40 shadow-inner focus:outline-none placeholder:text-gray-400' type="text" placeholder='Enter link to be shortened' />
              <button className='h-fit w-fit whitespace-nowrap sm:w-full rounded-lg p-4 bg-blue-700 text-white shadow-gray-300/20 shadow-inner disabled:opacity-50' type="submit" disabled={isLoading || (url.length > 0 && !isValidUrl)}>{shortenLinkText}</button>
            </form>
            {!isValidUrl && urlTouched && (<p className='text-left w-fit text-red-500 mx-0 '>Please enter a valid link</p>)}

            {shortenedUrl && (
              <div className='flex items-center space-x-3 text-gray-100 bg-gray-600/50 rounded px-4 py-2 w-fit mx-auto backdrop-blur-sm'>
                <a href={shortenedUrl} className='text-white underline underline-offset-1' target='_blank'>{shortenedUrl}</a>
                <button onClick={handleCopyToClipboard} className='transition-all flex items-center w-fit px-3 py-1 border border-gray-200 rounded focus:outline-none'>{copyButtonText}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                </button>
                <button onClick={shareContent} className='hover:bg-gray-700/60 transition-all'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>

                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home