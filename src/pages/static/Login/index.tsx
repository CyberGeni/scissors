import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import supabase from '../../../supabase'
import '../../../index.css'
// assets
import eye from "../../../assets/icons/eye.svg"
import eyeSlash from "../../../assets/icons/eye-slash.svg"
import gradientBg from "../../../assets/images/gradient-bg.png"
import chain from "../../../assets/images/single-chain-login-register.png"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                console.log('logged in')
                navigate('/dashboard')
            }
        })();
    }, [location, navigate])

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    // Perform client-side form validation
    const isValidEmail = (email: string): boolean => {
        // Regular expression pattern for email validation
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailPattern.test(email);
    };
    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true);

        // run some client side validation

        // email validation
        if (!email || !isValidEmail(email)) {
            setIsLoading(false);
            setErrorMessage('Please enter a valid email address.');
            return;
        } else {
            setErrorMessage('');
        }
        // password validation
        if (!password) {
            setIsLoading(false);
            setErrorMessage('Please enter a password.');
        } else if (password.length < 6) {
            setIsLoading(false);
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        } else {
            setErrorMessage('');
        }

        // sign in functionality
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        // handling error messages from supabase authentication
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
        <div className="font-circular min-h-screen relative grid grid-cols-1 md:grid-cols-2">
            <div className='h-screen w-screen fixed -z-10'>
                <img className='w-full h-full object-cover' src={gradientBg} alt="" />
            </div>
            <div className='z-10 hidden fixed w-screen h-screen md:flex items-center justify-center'>
                <img className='w-48' src={chain} alt="" />
            </div>
            <div className=' flex flex-col justify-center text-center bg-gray-900 p-8 space-y-10 h-11/12 md:h-full w-11/12 md:w-full mx-auto my-auto rounded-md md:rounded-none'>
                <h1 className='text-gray-100 font-medium text-4xl tracking-tighter'>scissors sharp<span className='text-blue-700 text-6xl'>.</span></h1>
                <h3 className='text-gray-200 font-medium text-2xl tracking-tight'>Log in to your account</h3>
                <form className='relative z-20 max-w-sm 2xl:max-w-md w-full mx-auto text-gray-200 space-y-5' action="" onSubmit={login}>
                    {errorMessage && <p className='text-[#F97066] w-full bg-[#F14A4A]/10 border border-[#F14A4A]/20 py-2 rounded-md'>{errorMessage}</p>}
                    <div className=' flex flex-col items-start space-y-1'>
                        <label htmlFor="email">Email address</label>
                        <input
                            type='email'
                            placeholder='example@email.com'
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => setEmailTouched(true)}
                            className={` p-4 rounded-lg bg-gray-800 focus:outline-none w-full placeholder:text-gray-400 ${emailTouched && !isValidEmail(email) ? 'border-red-500 border' : 'border-gray-700 border'}`}
                        />
                        {emailTouched && !isValidEmail(email) && <small className='text-red-500'>Please enter a valid email address.</small>}
                    </div>
                    <div className='flex flex-col items-start space-y-1 relative'>
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => setPasswordTouched(true)}
                            className={`p-4 rounded-lg bg-gray-800 autofill:bg-gray-900  focus:outline-none w-full placeholder:text-gray-400 ${passwordTouched && (!password || password.length < 6) ? 'border-red-500 border' : 'border-gray-700 border'}`}
                        />
                        <img
                            className='absolute right-4 top-10 transition-all'
                            onClick={() => setShowPassword(!showPassword)}
                            src={showPassword ? eyeSlash : eye}
                            alt=""
                        />
                        {passwordTouched && (!password || password.length < 6) && <small className='text-red-500'>Password must be at least 6 characters long.</small>}
                    </div>
                    <div className='py-8 space-y-4'>
                        <button className='transition-all rounded-lg w-full p-4 disabled:bg-blue-900 disabled:opacity-50 bg-blue-700 text-white' type='submit' disabled={isLoading || (!password || password.length < 6) || !isValidEmail(email)}>
                            {
                                isLoading ?
                                    <div><span>Logging in...</span></div>
                                    :
                                    <span>Login</span>
                            }
                        </button>
                        <button disabled className='disabled:cursor-not-allowed flex items-center justify-center border border-gray-700 rounded-lg w-full p-4 bg-gray-800 text-white'>
                            Sign in with Google
                            <svg className='ml-3' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                <path d="M11.9999 23.0001C14.9699 23.0001 17.4599 22.0151 19.2799 20.3351L15.7249 17.5751C14.7399 18.2351 13.4799 18.6251 11.9999 18.6251C9.13492 18.6251 6.70992 16.6901 5.84492 14.0901H2.16992V16.9401C3.97992 20.5351 7.69992 23.0001 11.9999 23.0001Z" fill="#34A853" />
                                <path d="M5.845 14.0901C5.625 13.4301 5.5 12.7251 5.5 12.0001C5.5 11.2751 5.625 10.5701 5.845 9.91006V7.06006H2.17C1.4 8.59292 0.999321 10.2847 1 12.0001C1 13.7751 1.425 15.4551 2.17 16.9401L5.845 14.0901Z" fill="#FBBC05" />
                                <path d="M11.9999 5.375C13.6149 5.375 15.0649 5.93 16.2049 7.02L19.3599 3.865C17.4549 2.09 14.9649 1 11.9999 1C7.69992 1 3.97992 3.465 2.16992 7.06L5.84492 9.91C6.70992 7.31 9.13492 5.375 11.9999 5.375Z" fill="#EA4335" />
                            </svg>
                        </button>
                    </div>
                    <p className='text-white'>Don't have an account? <Link className='text-blue-500' to="/register">Create an account</Link></p>
                </form>
            </div>

            {success && <p>Success! Redirecting to dashboard...</p>}
        </div>
    )
}
export default Login