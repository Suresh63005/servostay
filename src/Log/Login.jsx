import React, { useState } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api';
import Cookies from 'js-cookie';
import { Vortex } from 'react-loader-spinner';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  const [formData, setFormData] = useState({ username: "", password: "" });
  const location = useLocation();
  const [errors,setErrors]=useState({})

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setPasswordType(passwordVisible ? 'password' : 'text');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () =>{
    let newErrors = {}
    if(!formData.username) newErrors.username="Username is required";
    if(!formData.password) newErrors.password="Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    console.log(formData,"from datraaaaaaaaaaa")
    e.preventDefault();
    if(!validateForm()) return
    setloading(true)
    try {
      const res = await api.post('/admin/login', formData);
      NotificationManager.removeAll()
      NotificationManager.success('Admin logged in successfully!');
      Cookies.set('user', res.data.token, {
        expires: 1, 
        secure: true,
      });
     
      setTimeout(() => {
        const previousPage = location.state?.from || '/dashboard'; 
        navigate(previousPage, { replace: true });
      }, 2000); 
    } catch (err) {
      NotificationManager.removeAll()
      NotificationManager.error(err.res?.data?.error || "Invalid username or password!");
    } finally {
      setloading(false)
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <div className="h-full flex flex-col items-center justify-center"  style={{ background: '#045D78' }} >
        <div>
          <img src="/image/Group 2.svg" alt="" className="w-[250px] h-[220px]" />
        </div>
        <div className="text-center  gap-5">
          <span className="dentify-logoName" style={{ letterSpacing: '0.1rem' }}>
            SERVOSTAY
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-white p-6">
        <div
          className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-300"
          style={{
            boxShadow: `0px 0px 5px 0px #0000001A, 0px 0px 10px 0px #00000017, 0px 0px 13px 0px #0000000D, 0px 0px 15px 0px #00000003, 0px 0px 17px 0px #00000000`,
          }}
        >
          <h2 className="auth-head">Welcome </h2>
          <p className="text-[#045D78] float-left mb-[38px] ml-[5px] mt-[10px] leading-[26px]">
            Please Login to your Account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                onChange={handleChange}
                type="text"
                id="username"
                name="username"
                value={formData.username }
                className="w-full px-3 py-2 border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#045D78] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"
                placeholder="UserName"
              />
              {errors.username && <span className='text-red-500 text-sm'>* {errors.username}</span>}
            </div>

            <div className="flex relative">
              <input
                type={passwordType}
                onChange={handleChange}
                id="password"
                name="password"
                value={formData.password}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#045D78] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"
                placeholder="Password"
              />
              <span
                className="mt-2 cursor-pointer absolute right-4 visibilityIcon"
                onClick={handlePasswordVisibility}
              >
                {passwordVisible ? (
                  <VisibilityOutlinedIcon fontSize="30px" />
                ) : (
                  <VisibilityOffOutlinedIcon fontSize="30px" />
                )}
              </span>
            </div>
              {errors.password && <span className='text-red-500 text-sm'>* {errors.password}</span>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#045D78] mt-14 font-[poppins]"
                disabled={loading}
              >
                {loading ? (
                  <Vortex
                    visible={true}
                    height="25"
                    width="25"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['white', 'white', 'white', 'white', 'white', 'white']}
                  />
                ) : (
                  "Login"
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Login;