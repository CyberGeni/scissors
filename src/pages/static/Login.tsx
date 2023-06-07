import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabase'

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const [errorMessage, setErrorMessage] = useState('hello');
    // const [isEmailValid, setIsEmailValid] = useState(true);
    // const [isPasswordValid, setIsPasswordValid] = useState(true);
  
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.auth.getSession();
            console.log(data, error)

            if (data.session) {
                console.log('logged in')
                navigate('/dashboard')
            }
        })();
    }, [])

    const login = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        // TODO: add register functionality
        // validate input fields before submitting form here

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            console.log(error)
            return
        }

        console.log(data, error)
        navigate('/dashboard')
    }

    return (
        <div>
            <form action="" onSubmit={login}>
            <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                <button className='p-2 bg-blue-800 text-white'>login</button>
                {/* <p>{errorMessage}</p> */}
            </form>

        </div>
    )
}

export default Login