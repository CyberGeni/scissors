import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
        <h1>home page</h1>
        <form>
            <input type="text" placeholder='enter link to be shortened' />
            <button className='p-2 bg-blue-800 text-white'>shorten link</button>
        </form>
        <Link to="/login">login</Link>
        <Link to="/register">register</Link>
    </div>
  )
}

export default Home