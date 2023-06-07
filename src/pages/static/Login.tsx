import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabase'

function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
 
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.auth.getSession();
            console.log(data, error)

            if (data.session) {
                console.log('logged in')
                navigate('/dashboard')
            }
        })();
    }, [navigate])

    const login = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true);

        // Reset validation status for each submit attempt
        setIsEmailValid(true);
        setIsPasswordValid(true);

        // Perform client-side form validation
        const isValidEmail = (email: string): boolean => {
            // Regular expression pattern for email validation
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            return emailPattern.test(email);
        };

        if (!email || !isValidEmail(email)) {
            setIsLoading(false);
            setIsEmailValid(false);
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!password) {
            setIsLoading(false);
            setErrorMessage('Please enter a password.');
            setIsPasswordValid(false);
        } else if (password.length < 6) {
            setIsLoading(false);
            setIsPasswordValid(false);
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        // sign in functionality
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        console.log(data, error)

        // error messages from supabase authentication
        if (error?.message) {
            if (error?.message == 'Invalid login credentials') {
                setErrorMessage('Your email or password is incorrect.');
            } else {
                // setErrorMessage(error?.message || '')
            }
            setIsLoading(false);
            return;
        }

        if (!error) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000);
            setIsLoading(true);
        }
    }


    return (
        <div>
            <form action="" onSubmit={login}>
                <input

                    type="email"
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${!isEmailValid ? 'border-red-500 border' : ''}`}
                />
                <input
                    type="password"
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${!isPasswordValid ? 'border-red-500 border' : ''}`}
                />
                <button className='p-2 disabled:bg-blue-300 bg-blue-800 text-white' type='submit' disabled={isLoading}>{isLoading ? 'logging in' : 'login'}</button>

            </form>
            <p>{errorMessage}</p>
            {success && <p>Success! Redirecting to dashboard...</p>}
        </div>
    )
}

export default Login