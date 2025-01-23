import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarMenu from '../components/SideBar';
import { useLoading } from '../Context/LoadingContext';
import Loader from '../common/Loader';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const GalleryCategoryAdd = () => {
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const { isLoading, setIsLoading } = useLoading();
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [isPropertiesLoading, setPropertiesLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: id || null,
    pid: '',
    title: '',
    status: 0,
  });

  useEffect(()=>{
    if(id){
      fetchGalleryCategory(id)
    }
  },[id])

  const fetchGalleryCategory=async(id)=>{
    try {
      const response=await axios.get(`http://localhost:5000/galleryCategories/${id}`)
      const GCat=response.data;
      setFormData({
        id,
        pid : GCat.pid,
        title : GCat.title,
        status : GCat.status,
      })
    } catch (error) {
      console.error("Error fetching GalleryCategory:", error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  useEffect(() => {
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/properties', {
          withCredentials: true,
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        NotificationManager.error('Failed to fetch properties');
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    const url = `http://localhost:5000/galleryCategories/upsert`;
    const successMessage = id
      ? 'Gallery Category updated successfully!'
      : 'Gallery Category added successfully!';

    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        NotificationManager.success(successMessage);
        setTimeout(() => navigate('/gallery-category-list'), 2000);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (error) {
      console.error('Error submitting gallery category:', error);
      NotificationManager.error('Failed to submit the gallery category. Please try again.');
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">

        <main className="flex-grow">
          <Header />
          <div className="container mx-auto">
            <div className="flex items-center mt-6 mb-4">
              <h2
                className="text-lg font-semibold ml-4"
                style={{
                  color: '#000000',
                  fontSize: '24px',
                  fontFamily: 'Montserrat',
                }}
              >
                Gallery Category Management
              </h2>
            </div>

            {/* Form Container */}
            <div
              className="h-full px-6 max-w-5xl"
              style={{ paddingTop: '24px' }}
            >
              <div
                className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto"
              >
                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* Select Property */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="pid"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Select Property
                      </label>
                      <select
                        name="pid"
                        id="pid"
                        value={formData.pid || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="" disabled>
                          Select Property 
                        </option>
                        {isPropertiesLoading ? (
                          <option>Loading properties...</option>
                        ) : (
                          properties.map((property) => (
                            <option key={property.id} value={property.id}>
                              {property.title}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* Gallery Category Name */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Gallery Category Name
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        required
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: '8px',
                          border: '1px solid #EAEAFF',
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* Gallery Category Status */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="status"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Gallery Category Status
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value={1}>Publish</option>
                        <option value={0}>Unpublish</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                <div className="flex justify-start mt-6 gap-3">
                  <button type="submit"   className={`py-2 bg-[#045D78] text-white rounded-lg w-[250px] h-12 font-[Montserrat] font-bold`}  style={{ borderRadius: '8px' }}   >
                    {id ? 'Update Gallery Category' : 'Add Gallery Category'}
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

export default GalleryCategoryAdd;
