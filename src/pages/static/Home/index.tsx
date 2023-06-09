// import { useState } from 'react';
// import supabase from '../../../supabase';
import Navbar from '../../../components/Navbar';

// assets
import bgGradient from "../../../assets/images/hero-bg-gradient.png"
function Home() {

//   const [url, setUrl] = useState('');
//   const [shortenedUrl, setShortenedUrl] = useState('');

//   const handleSubmit = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();

//     // Generate a unique identifier for the shortened link
//     const generateUniqueId = () => {
//       const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//       const length = 6; // Adjust the desired length of the unique identifier

//       let result = '';
//       for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         result += characters.charAt(randomIndex);
//       }

//       return result;
//     };

//     const uniqueId = generateUniqueId();

//     // Save the original URL and unique identifier to the database
//     const { data, error } = await supabase
//       .from('links')
//       .insert([{ original_url: url, identifier: uniqueId }])
//       .single();
// console.log(data, error)
//     // Construct the shortened URL
//     const shortenedLink = `https://ascissorsproduct.netlify.app/${uniqueId}`;

//     // Update the state with the shortened URL
//     setShortenedUrl(shortenedLink);
//   };

  return (
    <div className='font-circular'>
      <div className="overflow-hidden fixed w-screen h-screen -z-10">
        <img className='w-full h-full object-cover object-center' src={bgGradient} alt="" />
      </div>
      {/* hero */}
      <section className=' text-center px-[5%] py-8'>
        <Navbar />
        <div className='p-4 mx-auto mt-[3%] border border-[#1D2939] min-h-[77vh] flex flex-col justify-center'>
          <h1 className='lg:max-w-3xl mx-auto text-5xl md:text-6xl lg:text-7xl p-4 font-bold from-[#D0D5DD] to-[#D0D5DD]/60 bg-gradient-to-b bg-clip-text text-transparent'>Make that <span className='from-[#D700EA]/70 from-20% via-[#0A5DEA] via-50% to-[#D700EA]/70 to-80% bg-gradient-to-bl bg-clip-text text-transparent'>event</span> link shorter. Super fast!</h1>
          <p className='text-gray-400 max-w-lg mx-auto my-8'>Say good bye to long, cumbersome URLs and hello to a simpler, sleeker way to shorten, share and manage your links.</p>
          <div className='max-w-lg mx-auto space-y-3 w-full'>
            <span className='text-gray-300'>Enter your link now to shorten it.</span>
            <form action="" className='flex sm:grid sm:grid-cols-4 space-x-2 '>
              <input className='text-gray-200 border-gray-600 border h-fit col-span-3 w-full p-4 rounded-lg bg-gray-800 shadow-gray-700/40 shadow-inner focus:outline-none placeholder:text-gray-400' type="text" placeholder='Enter link to be shortened' />
              <button className='h-fit w-fit whitespace-nowrap sm:w-full rounded-lg p-4 bg-blue-700 text-white shadow-gray-300/20 shadow-inner' type="submit">Shorten link</button>
            </form>
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