import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import SidebarMenu from '../components/SideBar'
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import axios from 'axios';
import ImageUploader from '../common/ImageUploader';

const GalleryAdd = () => {
  const navigate = useNavigate();
  const location=useLocation()
  const id = location.state ? location.state.id : null;
  const { isLoading, setIsLoading } = useLoading();
  const [image, setImage] = useState(null);
  const [properties, setProperties] = useState([]);
  const [galleryCategory, setgalleryCategory] = useState([]);
  const [formData, setFormData] = useState({
    id : id || null,
    pid: '',
    cat_id: '',
    img: '',
    status: 0,
  });

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  useEffect(() => {
    if(id){
      fetchGallery(id)
    }
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/properties', {
          withCredentials: true,
      });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    const fetchGalleryCategory=async()=>{
      try {
          const response=await axios.get(`http://localhost:5000/galleryCategories/all`)
          setgalleryCategory(response.data)
      } catch (error) {
          console.error("Error fetching galleries:", error);
      }
  }

    fetchProperties();
    fetchGalleryCategory();
  }, []);

  const fetchGallery=async(id)=>{
    try {
      const response=await axios.get(`http://localhost:5000/galleries/${id}`)
      const gallery=response.data;
      setFormData({
        id,
        pid : gallery.pid,
        cat_id : gallery.cat_id,
        img: gallery.img,
        status: gallery.status,
      })
    } catch (error) {
      
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id : prevData.id
    }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      img: imageUrl,
    }));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post("http://localhost:5000/galleries/upsert",
         formData
         ,
         {
          withCredentials: true, 
        }
        );
      console.log("Gallery added successfully:", response.data);
      alert("Gallery added successfully!");
      navigate("/gallery-list");
    } catch (error) {
      console.error("Error adding Gallery:", error);
      alert("An error occurred while adding the Gallery.");
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
            {/* <Link to="/rolesList" className="cursor-pointer ml-6">
              
            </Link> */}
            <h2 className="text-lg font-semibold ml-4 header" >Gallery Management</h2>
          </div>

          {/* Form Container */}
          <div className="h-full px-6 max-w-5xl" style={{paddingTop:'24px'}}> 
            <div className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto " style={{scrollbarWidth:'none'}} >
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1  mt-6">
                <div className="flex flex-col">
                    <label  htmlFor="pid"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" > Select Property </label>
                    <select  name="pid"  id="pid"  value={formData.pid} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" onChange={handleChange} >
                      <option value="" disabled selected>Select Property</option>
                        {isLoading ? (
                          <option>Loading properties...</option>
                        ) : (
                          properties.map((properties) => (
                            <option key={properties.id} value={properties.id}>
                              {properties.title}
                            </option>
                          ))
                        )}
                    </select>
                  </div>
                                  
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1  mt-6">
                <div className="flex flex-col">
                    <label  htmlFor="cat_id"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" > Select Gallery Category </label>
                    <select  name="cat_id"  id="cat_id" value={formData.cat_id} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" onChange={handleChange} >
                      <option value="" disabled selected>Choose Gallery Category</option>
                      {isLoading ? (
                          <option>Loading Gallery Category...</option>
                        ) : (
                          galleryCategory.map((galleryCategory) => (
                            <option key={galleryCategory.id} value={galleryCategory.id}>
                              {galleryCategory.title}
                            </option>
                          ))
                        )}            
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* facility image*/}
                    <div className="flex flex-col">
                      <label  htmlFor="img"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Gallery  Image</label>
                      <ImageUploader onUploadSuccess={handleImageUploadSuccess}/>
                      {formData.img && (
                      <div className="mt-4">
                        <img
                          src={formData.img}
                          alt="Uploaded Preview"
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    </div>
                    
                </div>

                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                  {/* gallery Status */}
                  <div className="flex flex-col">
                    <label  htmlFor="status"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" >Gallery Status </label>
                    <select  name="status"  id="status" value={formData.status}  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" onChange={handleChange} >
                      <option value="" disabled selected>Select Status</option>
                      <option value={1}>Publish</option>
                      <option value={0}>Unpublish</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-start mt-6 gap-3">
                  <button  type="submit" className=" py-2 bg-[#045D78] text-white rounded-lg w-[150px] h-12 font-[Montserrat] font-bold" style={{ borderRadius: "8px", }} > Add Gallery </button>
                </div>
              </form>

            </div>
          </div>
        </div>
        {/* Footer */}
        {/* <Footer /> */}
      </main>
    </div>
    </div>
  )
}

export default GalleryAdd