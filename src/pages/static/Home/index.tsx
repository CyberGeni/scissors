import { useState } from 'react';
import supabase from '../../../supabase';
import Navbar from '../../../components/Navbar';

// assets
import bgGradient from "../../../assets/images/hero-bg-gradient.png"
import chain from "../../../assets/images/hero-chain.png"
import chainBlurred from "../../../assets/images/hero-blurred-chain.png"
import TextCarousel from '../../../components/TextCarousel/TextCarousel';
function Home() {

  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
 // Generate a unique identifier for the shortened link
    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
    
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
      const shortenedLink = `https://btchr.url/${uniqueId}`;
    
      // Save the original URL and unique identifier to the database
      await supabase
        .from('links')
        .insert([
          {
            original_url: url,
            identifier: uniqueId,
            created_at: timestamp,
            short_url: shortenedLink,
          },
        ])
        .single();
    
      // Update the state with the shortened URL
      setShortenedUrl(shortenedLink);
    };
    

  return (
    <div className='font-circular'>
      <div className="overflow-hidden fixed w-screen h-screen -z-10">
        <img className='w-full h-full object-cover object-center' src={bgGradient} alt="" />
      </div>
      {/* hero */}
      <section className='relative text-center px-[5%] py-8'>
        <Navbar />
        <div className='p-4 mx-auto mt-[3%] border border-[#1D2939] min-h-[77vh] flex flex-col justify-center'>
          <img className='absolute w-14 md:w-20 lg:w-40 xl:w-44 2xl:w-48 top-32 left-0' src={chain} alt="" draggable={false}/>
          <img className='absolute w-14 md:w-20 lg:w-40 xl:w-44 2xl:w-48 bottom-16 right-40' src={chainBlurred} alt="" draggable={false} />
          <h1 className='lg:max-w-4xl mx-auto text-5xl md:text-7xl lg:text-[85px] p-4 font-medium from-[#D0D5DD] to-[#D0D5DD]/60 bg-gradient-to-b bg-clip-text text-transparent'>Make that <TextCarousel /> link shorter. Super fast!</h1>
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
                className='text-gray-200 border-gray-600 border h-fit col-span-3 w-full p-4 rounded-lg bg-gray-700 shadow-gray-600/40 shadow-inner focus:outline-none placeholder:text-gray-400' type="text" placeholder='Enter link to be shortened' />
              <button className='h-fit w-fit whitespace-nowrap sm:w-full rounded-lg p-4 bg-blue-700 text-white shadow-gray-300/20 shadow-inner' type="submit">Shorten link</button>
            </form>
            <p className='text-white'>your shortened url:{shortenedUrl}</p>
          </div>
        </div>
      </section>

      {/* <form onSubmit={handleSubmit}>

        <input value={url}
          onChange={(e) => setUrl(e.target.value)} type="text" placeholder='enter link to be shortened' />
        <button className='p-2 bg-blue-800 text-white'>shorten link</button>
      </form>
      <p>here's your shortened url: {shortenedUrl}</p>
      <Link to="/login">login</Link>
      <Link to="/register">register</Link> */}
    </div>
  )
}

export default Home