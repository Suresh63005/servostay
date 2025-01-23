import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import SidebarMenu from '../components/SideBar'
import axios from 'axios'
import ImageUploader from '../common/ImageUploader';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api'
import JoditEditor from 'jodit-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


const Settings = () => {
  const privacyEditorRef = useRef(null);
  const termsEditorRef = useRef(null);
  const cancellationEditorRef = useRef(null);
  const editor = useRef(null)
  const [privacycontent, setprivacyContent] = useState('')
  const [termscontent, settermscontent] = useState('')
  const [cancellationContent, setCancellationContent] = useState('')
  const [formData, setFormData] = useState({ id: '', webname: '', weblogo: '', timezone: 'Asia/Kolkata', currency: '', tax: '', sms_type: '',one_key: '',  privacy_policy: '', terms_conditions: '', admin_tax: '', cancellation_policy: '', refund_policy: '' });
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showOneKey, setShowOneKey] = useState(false);

  const togglePasswordVisibility = (data) => {
    if(data === "api_key"){
      setShowApiKey(!showApiKey);
    }else if(data === "one_key"){
      setShowOneKey(!showOneKey);
    }
  };
  const config = {
    height: 300,
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'font',
      'fontsize',
      'paragraph',
      'align',
      '|',
      'table',
      'link',
      'image',
      '|',
      'code',
      'undo',
      'redo',
      '|',
      'fullsize',
    ],
    extraButtons: [], 
    removeButtons: ['about', 'video', 'audio', 'undo', 'redo', 'speech'],
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarSticky: true,
    uploader: {
      insertImageAsBase64URI: true,
    },
    filebrowser: {
      ajax: { url: '/files' },
      uploader: { url: '/upload' },
    },
    table: {
      allowCellResize: true,
      defaultWidth: '100%',
    },
    allowResizeX: true,
    allowResizeY: true,
    showPoweredByJodit: false, 
    disablePlugins: ['poweredByJodit', 'speech'],
    spellcheck: false, 
  };
   
  

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");

        if (response.status === 200) {
          const settingsData = response.data;
          setFormData({
            ...formData,
            ...settingsData,
          });
          setprivacyContent(settingsData.privacy_policy);
          settermscontent(settingsData.terms_conditions);
          setCancellationContent(settingsData.cancellation_policy);
        }
      } catch (error) {
        console.error("Error fetching settings:", error.response?.data || error.message);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      weblogo: imageUrl,
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update formData with editor content
    const privacyPolicyText = new DOMParser().parseFromString(privacycontent, 'text/html').body.innerText;
    const termsConditionsText = new DOMParser().parseFromString(termscontent, 'text/html').body.innerText;
    const cancellationPolicyText = new DOMParser().parseFromString(cancellationContent, 'text/html').body.innerText;
    const updatedData = {
      ...formData,
      privacy_policy: privacyPolicyText,
      terms_conditions: termsConditionsText,
      cancellation_policy: cancellationPolicyText,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/settings/update/${formData.id}`,
        updatedData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        NotificationManager.removeAll();
        NotificationManager.success('Settings updated successfully');
      }
    } catch (error) {
      NotificationManager.removeAll();
      NotificationManager.error(error.response?.data || error.message);
    }
  };


  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
        {/* Sidebar */}
        <main className="flex-grow">
          <Header />
          <div className="container mx-auto">
            <div className="flex items-center mt-6">
              {/* <Link to="/rolesList" className="cursor-pointer ml-6">
              
            </Link> */}
              <div className="flex items-center mt-6  mb-4">
                <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                  <ArrowBackIosNewIcon style={{color:'#045D78'}} />
                </Link>
                <h2 className="text-lg font-semibold ml-4 header" >Settings Management</h2>
              </div>
            </div>

            {/* Form Container */}
            <div className="h-full px-6 max-w-5xl" >
              <div className="bg-white h-[67vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                    {/* website Name*/}
                    <div className="flex flex-col">
                      <label htmlFor="webname" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{ color: 'red' }}>*</span> Website Name </label>
                      <input id="webname" name="webname" type="text" value={formData.webname} required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                      />
                    </div>

                    {/* website image */}
                    <div className="flex flex-col">
                      <label htmlFor="weblogo" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"><span style={{ color: 'red' }}>*</span>Website Image</label>
                      <ImageUploader onUploadSuccess={handleImageUploadSuccess} />
                      <img width={100} src={formData.weblogo} alt="" />
                    </div>
                    
                    <div className="grid gap-32  w-max sm:grid-cols-1 md:grid-cols-3  ">
                      {/* currency */}
                      <div className="flex flex-col">
                        <label htmlFor="currency" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                          <span style={{ color: 'red' }}>*</span> Currency
                        </label>
                        <input
                          id="currency"
                          name="currency"
                          type="text"
                          value={formData.currency}
                          required
                          className="border rounded-lg p-3 mt-1 w-full h-14"
                          style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                          onChange={handleChange}
                        />
                      </div>

                      {/* tax */}
                      <div className="flex flex-col">
                        <label htmlFor="tax" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                          <span style={{ color: 'red' }}>*</span>Tax
                        </label>
                        <input
                          id="tax"
                          name="tax"
                          type="text"
                          required
                          value={formData.tax}
                          className="border rounded-lg p-3 mt-1 w-full h-14"
                          style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                          onChange={handleChange}
                          placeholder="e.g 5"
                        />
                      </div>

                      {/* admin tax */}
                      <div className="flex flex-col">
                        <label htmlFor="admin_tax" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                          <span style={{ color: 'red' }}>*</span>Admin Tax
                        </label>
                        <input
                          id="admin_tax"
                          name="admin_tax"
                          type="text"
                          required
                          value={formData.admin_tax}
                          className="border rounded-lg p-3 mt-1 w-full h-14"
                          style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                          onChange={handleChange}
                          placeholder="e.g 5"
                        />
                      </div>
                    </div>
                    
                  </div>
                

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* 2 factor api key */}
                    <div className="flex flex-col">
                        <label htmlFor="sms_type" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                          <span style={{ color: 'red' }}>*</span> 2 Factor API Key
                        </label>
                        <div className="relative">
                          <input
                            name="sms_type"
                            id="sms_type"
                            type={showApiKey ? 'text' : 'password'}
                            value={formData.sms_type}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
                            onChange={handleChange}
                            placeholder="Select or type SMS type"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            onClick={()=>{togglePasswordVisibility("api_key")}}
                          >
                            {showApiKey ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="one_key" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{ color: 'red' }}></span> User App Onesignal App Id</label>
                      <div className='relative'>
                        <input id="one_key" name="one_key" type={showOneKey ? 'text' : 'password'} required value={formData.one_key} className="border rounded-lg p-3 mt-1 w-full h-14 pr-10" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                          onChange={handleChange}
                          placeholder='**'
                        />
                        <button type='button' onClick={()=>{togglePasswordVisibility("one_key")}} className='absolute inset-y-0 right-0 pr-3 flex  items-center text-sm leading-5'>{showOneKey ? <FaEyeSlash /> : <FaEye />}</button>
                      </div>
                    </div>
                  
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* * rich text editor*/}
                    <div className="flex flex-col">
                      <label htmlFor="wlimit" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{ color: 'red' }}>*</span> Terms & Conditions</label>
                      {/* <JoditEditor ref={editor} value={privacycontent} config={config} onBlur={newContent => setprivacyContent(newContent)}> */}
                      <JoditEditor ref={privacyEditorRef} value={privacycontent} config={config} onBlur={newContent => setprivacyContent(newContent)}>

                      </JoditEditor>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="wlimit" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{ color: 'red' }}>*</span> Privacy & Policy </label>
                      <JoditEditor ref={termsEditorRef} value={termscontent} config={config} onBlur={newContent => settermscontent(newContent)}>

                      </JoditEditor>
                    </div>
                  </div>

                  <div clasName="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    <div className='flex flex-col'>
                      <label htmlFor="cancellation_policy" className="text-sm font-medium text-start text-[12px] font-[Montserrat] mt-8"> <span style={{ color: 'red' }}>*</span> Cancellation Policy</label>
                      <JoditEditor ref={cancellationEditorRef} value={cancellationContent} config={config} onBlur={newContent => setCancellationContent(newContent)}>

                      </JoditEditor>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className=" py-2  text-white rounded-lg bg-[#045D78] w-[140px] h-10 font-[Poppins] font-medium" style={{ borderRadius: "8px", }} >Update Setting's </button>
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

export default Settings