import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <header className='text-white'>
            <div className='grid grid-cols-3  place-items-center'>
                <nav className='justify-self-start'>
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#faqs">FAQs</a>
                </nav>
                <h1 className='text-gray-100 font-medium text-4xl tracking-tighter'>scissors sharp<span className='text-blue-700 text-6xl'>.</span></h1>
                <div className='justify-self-end'>
                    <Link className='border border-gray-700 rounded-lg w-full p-4 bg-gray-800 text-white' to="/login">Log in</Link>
                    <Link className='transition-all rounded-lg w-full p-4 disabled:bg-blue-900 bg-blue-700 text-white' to="/register">Sign up</Link>
                </div>
            </div>
        </header>
    )
}

export default Navbar