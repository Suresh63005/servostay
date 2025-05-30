import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ImageUploader from '../common/ImageUploader';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api';
import SelectComponent from '../common/SelectComponent';
import { statusoptions } from '../common/data';
import { Vortex } from 'react-loader-spinner';

const CategoryAdd = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const id = location.state ? location.state.id : null;
  const { isLoading, setIsLoading } = useLoading();
  const [loading,setloading]=useState(false)
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({  id: id || null,  title: '',  img: '',imgPreview:null,  status: 0,});

  useEffect(() => {
    if (id) {
      getCategory()
    }
  }, [id])

  const getCategory = async () => {
    try {
      const response = await api.get(`/categories/${id}`)
      const Category = response.data;
      console.log("Category Data: ", response.data)
      setFormData({
        id,
        title: Category.title,
        img: Category.img,
        imgPreview:Category.img,
        status: Category.status,
      })
    } catch (error) {
      console.error("Error fetching Category:", error);
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
      id: prevData.id,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/svg+xml") {
        setError("Only SVG files are allowed.");
        setFormData((prevData) => ({ ...prevData, img: null, previewUrl: null }));
        return;
      }
        const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        img: file,
        imgPreview: previewUrl,
      }));
      setError(""); 
    }
  };

  const validateForm = ()=>{
    let newErrors = {};
    if(!formData.title.trim()) newErrors.title = "Category title is required";
    if(!formData.img) newErrors.img = "Category Image is required";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    if(!validateForm()) return;
    // if (!formData.img && !id) {
    //   setError("Image is required.");
    //   return;
    // }
  
    const successMessage = id ? 'Category Updated Successfully!' : 'Category Added Successfully!';
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("status", formData.status);
      if (id) {
        data.append("id", formData.id); 
      }
      if (formData.img) {
        data.append("img", formData.img);  
      }

      const response = await api.post("/categories/upsert", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log(response.data);
      NotificationManager.removeAll();
      NotificationManager.success(successMessage);
  
      setTimeout(() => {
        navigate("/category-list");
      }, 2000);
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting Category:", error);
      NotificationManager.error("Error submitting Category");
    } finally {
      setloading(false);
    }
  };
  
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
                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 " style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>Create Category</h2>
            </div>

            {/* Form Container */}
            <div className="h-full px-6  " style={{ paddingTop: '24px' }}>
              <div className="bg-white  w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* category name */}
                    <div className="flex flex-col">
                      <label htmlFor="category_name" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Category name </label>
                      <input id="category_name" name="title" value={formData.title} type="text" className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                        placeholder="Enter Category Title"
                      />
                      {error.title && <span className='text-red-500 text-sm'>* {error.title}</span>}
                    </div>

                    {/* category image*/}
                    <div className="flex flex-col">
                      <label htmlFor="category_image" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Category Image</label>

                      {/* <ImageUploader onUploadSuccess={handleImageUploadSuccess} /> */}
                      <input
                            type="file"
                            accept=".svg"
                            id='img'
                            name='img'
                            onChange={handleFileChange}
                            className="border rounded-lg p-2 mt-1 w-full h-14"
                            style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        />
                      {formData.imgPreview && (
                      <div className="mt-4">
                        <img
                          src={formData.imgPreview}
                          alt="Uploaded Preview"
                          className="w-[50px] h-[50px] object-cover rounded"
                        />
                      </div>
                    )}
                      {error.img && <span className='text-red-500 text-sm'>* {error.img}</span>}
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    {/* category Status */}
                    <div className="flex flex-col">
                      <label htmlFor="category_status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]" > Status </label>
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

                  <button type="submit" disabled={loading} className={`py-2 px-4 mt-6 float-start bg-[#045D78] text-white rounded-lg h-10 font-poppins font-medium `} style={{ borderRadius: '8px' }}   >
                    {loading ? (
                      <Vortex
                        visible={true}
                        height="25"
                        width="100%"
                        ariaLabel="vortex-loading"
                        wrapperStyle={{}}
                        wrapperClass="vortex-wrapper"
                        colors={['white', 'white', 'white', 'white', 'white', 'white']}
                      />
                    ): (
                      id ? `Update Category` : `Add  Category`
                    )}

                  </button>
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

export default CategoryAdd