import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../App.css'
function Navbar() {

    const [showNav, setShowNav] = useState(false)

    return (
        <>
            <header className='hidden md:block text-white font-circular '>
                <div className='grid grid-cols-3 place-items-center'>
                    <nav className='space-x-4 justify-self-start'>
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#faqs">FAQs</a>
                    </nav>
                    <span className='flex items-center text-gray-100 font-bold text-4xl tracking-tighter'>btchr<span className='text-blue-700 text-6xl -mt-4'>.</span></span>
                    <div className='justify-self-end space-x-4'>
                        <Link className='border border-gray-700 rounded-lg w-full p-4 bg-gray-800 text-white' to="/login">Log in</Link>
                        <Link className='transition-all rounded-lg w-full p-4 bg-blue-700 text-white' to="/register">Sign up</Link>
                    </div>
                </div>
            </header>

            <header className='relative md:hidden'>
                <div className='flex items-end justify-center'>
                    <span className='text-center text-gray-100 font-bold text-4xl tracking-tighter'>btchr<span className='text-blue-700 text-6xl -mt-4'>.</span></span>
                    <div onClick={() => setShowNav(!showNav)} className='transition-all absolute right-0 bottom-1'>
                        {!showNav ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        }
                    </div>
                </div>
                <div className={`mobile-nav flex items-center justify-center transition-all w-screen h-screen fixed z-10 ${showNav ? "left-0 " : "left-[100vw]"} `}>
                    <div className='text-gray-200 text-xl w-full px-8'>
                        <nav className='flex flex-col space-y-8'>
                            <a onClick={() => setShowNav(!showNav)} href="#features">Features</a>
                            <a onClick={() => setShowNav(!showNav)} href="#pricing">Pricing</a>
                            <a onClick={() => setShowNav(!showNav)} href="#faqs">FAQs</a>
                        </nav>
                        <div className='flex flex-col space-y-3 my-16'>
                            <Link className='border border-gray-700 rounded-lg p-4 bg-gray-800 text-white' to="/login">Log in</Link>
                            <Link className='transition-all rounded-lg p-4  bg-blue-700 text-white' to="/register">Sign up</Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar