import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoading } from '../Context/LoadingContext';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SelectComponent from '../common/SelectComponent';
import Cookies from "js-cookie";
import { statusoptions } from '../common/data';
import api from '../utils/api';
import { Vortex } from 'react-loader-spinner';

const CityAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state ? location.state.id : null;
  const [formData, setFormData] = useState({ id: id || null, title: '', img: null,imgPreview:null, status: 0, country_id: '' });
  const { isLoading, setIsLoading } = useLoading();
  const [loading,setloading]=useState(false)
  const [error, setError] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    if (id) {
      getCity()
    }
  }, [id]);

  const getCity = async () => {
    try {
      const response = await api.get(`/cities/${id}`)
      const City = response.data;
      console.log("City Data: ", response.data)
      setFormData({
        id,
        title: City.title,
        img: City.img,
        imgPreview:City.img,
        country_id: City.country_id,
        status: City.status
      })
    } catch (error) {
      console.error("Error fetching Category: ", error)
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("user");

        if (!token) {
          NotificationManager.error("No authentication token found. Please log in.");
          return;
        }

        const response = await api.get('/countries/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && Array.isArray(response.data)) {
          const formattedCountries = response.data.map((country) => ({
            value: country.id,
            label: country.title,
          }));

          setCountryOptions(formattedCountries);
        } else {
          NotificationManager.error("Failed to fetch countries or invalid response format.");
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        NotificationManager.error("Error fetching countries. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [setIsLoading]);

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
    let errors = {};
  
    if (!formData.title.trim()) {
      errors.title = "City Name is required.";
    } else if (formData.title.length < 3) {
      errors.title = "City Name must be at least 3 characters long.";
    }
  
    if (!formData.country_id) {
      errors.country_id = "Country selection is required.";
    }
  
    if (!id && !formData.img) {
      errors.img = "City Image is required.";
    } else if (formData.img && typeof formData.img === "object") {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(formData.img.type)) {
        errors.img = "Only JPG, PNG, or JPEG files are allowed.";
      }
    }
  
    if (formData.status === "" || formData.status === null) {
      errors.status = "City Status is required.";
    }
  
    setError(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    if (!validateForm()) {
      setloading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("id", formData.id || "");
      data.append("title", formData.title);
      data.append("status", formData.status);
      data.append("country_id", formData.country_id);

      if (formData.img && typeof formData.img === "object") {
        data.append("img", formData.img);
      }

      const token = Cookies.get("user");
      if (!token) {
        NotificationManager.error("No authentication token found. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await api.post("/cities/upsert", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
      });
      const successMessage = id ? 'City Updated Successfully!' : 'City Added Successfully!'
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage)
        setTimeout(() => {
          navigate('/city-list')
        }, 2000)
      } else {
        throw new Error('Unexpected server response')
      }
    } catch (error) {
      NotificationManager.removeAll();
      console.error('Error submitting city data:', error);
      NotificationManager.error('An error occurred. Please try again.');
    } finally {
      setloading(false)
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
        <main className="flex-grow h-[100vh]">
          <Header />
          <div className="">
            <div className="flex items-center mt-6 mb-4">
              <Link onClick={() => navigate(-1)} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 header">City Management</h2>
            </div>

            <div className="h-full px-6 " style={{ paddingTop: '24px' }}>
              <div className="bg-white  w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    <div className='flex flex-col'>
                      <label htmlFor="country" className="text-sm font-medium text-start text-[12px] font-[Montserrat]" >Select Country</label>
                      <SelectComponent
                        name="country_id"
                        value={formData.country_id}
                        onChange={(selectedOption) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            country_id: selectedOption.value,
                          }));
                        }}
                        options={countryOptions}
                        isLoading={isLoading}
                      />
                      {error.country_id && <p className="text-red-500 text-sm mt-1">{error.country_id}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="title" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">City Name</label>
                      <input
                        id="title"
                        name="title"
                        value={formData.title}
                        type="text"
                        // required
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                        placeholder='Enter City Name'
                      />
                      {error.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="img" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">City Image</label>
                      <input
                        id="img"
                        name="img"
                        type="file"
                        accept="image/*"
                        className="border rounded-lg p-2 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        onChange={handleFileChange}
                      />
                      {formData.imgPreview && (
                        <div className="mt-4">
                          <img src={formData.imgPreview} alt="Uploaded Preview" className="w-[50px] h-[50px] object-cover rounded" />
                        </div>
                      )}
                      {error.img && <p className="text-red-500 text-sm mt-1">{error.img}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">City Status</label>
                      <SelectComponent
                        name="status"
                        value={formData.status}
                        onChange={(selectedOption) => setFormData((prevData) => ({
                          ...prevData,
                          status: selectedOption.value,
                        }))}
                        options={statusoptions}
                      />
                    </div>
                  </div>

                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className={`py-2 px-4 bg-[#045D78] text-white rounded-lg h-10 font-poppins font-medium `} style={{ borderRadius: '8px' }}>
                      {
                        loading ? (
                          <Vortex 
                            visible={true}
                            height="25"
                            width="100%"
                            ariaLabel='vortex-loading'
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['white', 'white', 'white', 'white', 'white', 'white']}
                          />
                        ):(
                          id ? 'Update City' : 'Add City'
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
  );
};

export default CityAdd;
