import { useState } from 'react';
import { Link } from 'react-router-dom'
import supabase from '../../../supabase';
import Navbar from '../../../components/Navbar';

// assets
import bgGradient from "../../../assets/images/hero-bg-gradient.png"
function Home() {

  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
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

    // Save the original URL and unique identifier to the database
    const { data, error } = await supabase
      .from('links')
      .insert([{ original_url: url, identifier: uniqueId }])
      .single();
console.log(data, error)
    // Construct the shortened URL
    const shortenedLink = `https://ascissorsproduct.netlify.app/${uniqueId}`;

    // Update the state with the shortened URL
    setShortenedUrl(shortenedLink);
  };

  return (
    <div className='font-circular '>
      <div className="absolute w-screen h-screen -z-10">
        <img className='w-full h-full object-cover object-center' src={bgGradient} alt="" />
      </div>
      
      <Navbar />

      <form onSubmit={handleSubmit}>

        <input value={url}
          onChange={(e) => setUrl(e.target.value)} type="text" placeholder='enter link to be shortened' />
        <button className='p-2 bg-blue-800 text-white'>shorten link</button>
      </form>
      <p>here's your shortened url: {shortenedUrl}</p>
      <Link to="/login">login</Link>
      <Link to="/register">register</Link>
    </div>
  )
}

export default Home