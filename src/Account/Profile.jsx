import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader'
import { NotificationManager,NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';

const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();
  const [passwordVisible,setPasswordVisible]=useState(false)
  const [passwordType,setPasswordType]=useState('password');
  const [formData, setFormData] = useState({
    id:0,
    username:'',
    email: '',
    password: '',
  });

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setPasswordType(passwordVisible ? 'password' :'text');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    
  };

    useEffect(()=>{
      async function fetchData(){
          try { 
              const response = await axios.get("http://localhost:5000/admin/userbytoken", {
                  withCredentials: true,  
                });
              
                setFormData({
                  id: response.data.id,
                  username:response.data.username,
                  password:response.data.password
                })
              console.log(response, "from response");

          } catch (error) {
              console.log(error)
          }
        }
      fetchData();
    },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log('Form submitted:', formData);
    try {
        const response = await axios.put(
            `http://localhost:5000/admin/update/${formData.id}`,
            formData,
            {
              withCredentials: true, 
            }
          );
          NotificationManager.removeAll();
          NotificationManager.success("updated Profile successfully");
    } catch (error) {
        NotificationManager.removeAll();
        NotificationManager.error("Error While Updating:", error);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
      <main className="flex-grow">
        <Header />
        <div className="container mx-auto">
          <div className="flex items-center mt-6  mb-4">
            <div className="flex items-center mt-6  mb-4">
              <Link onClick={()=>{navigate(-1)}}  className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{color:'#045D78'}} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 header">Account Management</h2>
            </div>
          </div>

          {/* Form Container */}
          <div className="h-full px-6 max-w-5xl" style={{paddingTop:'24px'}}> 
            <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-6">
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                  {/*  name */}
                  <div className="flex flex-col">
                      <label  htmlFor="username"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Profile name </label>
                      <input id="username" name="username" type="text" value={formData.username} required className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder="Enter User name or email address" 
                      />
                    </div>
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                  {/* password */}
                  <div className="flex flex-col relative">
                      <label  htmlFor="Password"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Password </label>
                      <input id="Password" name="password" value={formData.password} type={passwordType} required className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder="********************************"
                      />
                      <span className='mt-[30px]  cursor-pointer absolute right-4 visibilityIcon' onClick={handlePasswordVisibility}>
                        {passwordVisible ? (
                          <VisibilityOutlinedIcon fontSize='30px' />
                        ) : (
                          <VisibilityOffOutlinedIcon fontSize='30px' />
                        )
                        }
                      </span>
                    </div>
                </div>
                        
                {/* Action Buttons */}
                <div className="flex justify-start mt-6 gap-3">
                  <button  type="submit" className=" py-2 bg-[#045D78] text-white rounded-lg  w-[120px] h-10 font-[Poppins] font-medium" style={{ borderRadius: "8px", }} >Update Profile </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <NotificationContainer />
    </div>
    </div>
  )
}

export default Profile