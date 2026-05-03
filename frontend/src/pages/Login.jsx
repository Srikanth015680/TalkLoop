import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, Loader2, Lock, Mail} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import { login } from '../store/slice/authSlice'; 
import TalkLoop from "../assets/TalkLoopLogo.png"



{/* <MessageSquare className='text-green-600 w-6 h-6' /> */}
const Login = () => {
  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { isLoggingIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate(); // ✅ add this

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation (optional but good)
    if (!formData.email || !formData.password) return;

    const res = await dispatch(login(formData));

    // only navigate if login success
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/"); 
    }
  }

  return (
    <>
      <div className="min-h-screen bg-green-50 grid grid-cols-1 lg:grid-cols-2">

        {/* Left side form */}
        <div className='flex flex-col justify-center items-center px-6 py-12'>
          <div className='w-full max-w-md'>

            {/* logo and heading */}
            <div className='flex flex-col items-center text-center mb-10'>
              <div className="bg-green-200 p-3 rounded-lg">
                <img src={TalkLoop} alt="Logo" className='h-8 w-8'/>
              </div>

              <h1 className='text-2xl font-bold mt-4 text-gray-800'>Welcome Back</h1>
              <p className='text-gray-500'>Sign into your account</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>

              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <div className='flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-green-500'>
                  <Mail className='w-5 h-5 text-green-500 mr-2' />
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder='example@gmail.com'
                    type="email"
                    className='w-full py-2 outline-none bg-transparent'
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                <div className='flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-green-500'>
                  <Lock className='w-5 h-5 text-green-500 mr-2' />

                  <input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder='••••••••'
                    type={showPass ? "text" : "password"}
                    className='w-full py-2 outline-none bg-transparent'
                  />

                  <button
                    onClick={() => setShowPass(!showPass)}
                    type='button'
                    className='text-green-600'
                  >
                    {showPass ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={isLoggingIn}
                type='submit'
                className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition'
              >
                {
                  isLoggingIn ? (
                    <>
                      <Loader2 className='animate-spin w-4 h-4' /> Loading...
                    </>
                  ) : (
                    "Sign In"
                  )
                }
              </button>

            </form>

            {/* Footer */}
            <div className='mt-6 text-center text-sm text-gray-600'>
              <p>
                Don’t have an account?{" "}
                <Link to="/register" className='text-green-600 hover:underline'>
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Right side */}
        <AuthImagePattern
          subtitle={"Sign In to continue your conversation and catch up with your messages."}
          title={'Welcome back!'}
        />

      </div>
    </>
  )
}

export default Login;