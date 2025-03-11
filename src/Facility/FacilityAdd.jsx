import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';
import api from '../utils/api'
import { statusoptions } from '../common/data'
import SelectComponent from '../common/SelectComponent'
import { Vortex } from 'react-loader-spinner';

const FacilityAdd = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const id = location.state ? location.state.id : null
  const [formData, setFormData] = useState({ id: id || null, title: "", img: null,imgPreview:null, status: 0 });
  const { isLoading, setIsLoading } = useLoading();
  const [loading,setloading]=useState(false)
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchFacility(id)
    }
  }, [id])

  const fetchFacility = async (id) => {
    try {
      const response = await api.get(`/facilities/${id}`);
      const facility = response.data
      setFormData({
        id,
        title: facility.title,
        img: facility.img,
        imgPreview: facility.img,
        status: facility.status

      })
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  }

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
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setFormData((prevData) => ({
        ...prevData,
        img: file, 
        imgPreview: previewUrl 
      }));
    }
    setError('');
  };
  
  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Facility Name is required.";
    } else if (formData.title.length < 3) {
      newErrors.title = "Facility Name must be at least 3 characters long.";
    }

    if (!formData.img) {
      newErrors.img = "Facility Image is required.";
    }

    if (formData.status === null || formData.status === undefined) {
      newErrors.status = "Facility Status is required.";
    }    

    setError  (newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setloading(true)

    if (!formData.img) {
      setError("Image is required.");
      return;
    }

    try {
      const form=new FormData();
      form.append("title",formData.title)
      form.append("status",formData.status)

      if(id){
        form.append("id",formData.id)
      }
      if (formData.img) {
        form.append("img", formData.img); 
      }

      const response = await api.post('/facilities/upsert', form,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const successMessage = id ? "facility updated successfully!" : "facility added successfully!";
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage);
        setTimeout(() => {
          navigate("/facility-list");
        }, 2000);
      } else {
        NotificationManager.success("Something went wrong. Please try again.");
      }
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting facility data:", error);
      NotificationManager.error("An error occurred. Please try again.");
    }finally{
      setloading(false)
    }
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
        {/* Sidebar */}
        <main className="flex-grow h-[100vh]">
          <Header />
          <div className="">
            <div className="flex items-center mt-6  mb-4">
              <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{color:'#045D78'}} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 header" >Facility Management</h2>
            </div>

            {/* Form Container */}
            <div className="h-full px-6 " style={{ paddingTop: '24px' }}>
              <div className="bg-white  w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none" >
                {/* <p className='text-left font-bold font-[Montserrat]' >Create Service</p> */}
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* facility name */}
                    <div className="flex flex-col">
                      <label htmlFor="title" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Facility Name</label>
                      <input id="title" name="title" type="text" value={formData.title} placeholder='Enter Facility Name' className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                      />
                      {error.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
                    </div>

                    {/* facility image*/}
                    <div className="flex flex-col">
                      <label htmlFor="img" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Facility Image</label>
                      <input type="file" accept='.svg' name="img" id="img" onChange={handleFileChange} className="border rounded-lg p-2 mt-1 w-full h-14" />
                      {formData.imgPreview && (
                        <div className="mt-4">
                          <img
                            src={formData.imgPreview}
                            alt="Uploaded Preview"
                            className="w-[50px] h-[50px] object-cover rounded"
                          />
                        </div>
                      )}
                      {error.img && <p className="text-red-500 text-sm mt-1">{error.img}</p>}
                      </div>

                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    {/* facility image Status */}
                    <div className="flex flex-col">
                      <label htmlFor="status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]" >Facility Status </label>
                      <SelectComponent
                      
                      name="status"
                      value={formData.status}
                      onChange={(selectedOption) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          status: selectedOption.value,
                        }));
                      }}
                      options={statusoptions}
                    />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className={`py-2 px-4 bg-[#045D78] text-white rounded-lg   h-10 font-poppins font-medium `} style={{ borderRadius: "8px", }} >
                    {
                        loading ? (
                          <Vortex
                            visible={true}
                            height="25"
                            width="100%"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['white', 'white', 'white', 'white', 'white', 'white']}
                          />
                        ):
                        (
                          id ? "Update Facility" : "Add Facility"
                        )
                      }
                    </button>
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

export default FacilityAdd