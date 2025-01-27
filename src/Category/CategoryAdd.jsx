import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ImageUploader from '../common/ImageUploader';
import axios from 'axios';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api';
import Select from 'react-select';
import SelectComponent from '../common/SelectComponent';
import { statusoptions } from '../common/data';

const CategoryAdd = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const id = location.state ? location.state.id : null;
  console.log(id, "form id")
  const { isLoading, setIsLoading } = useLoading();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: id || null,
    title: '',
    img: '',
    status: 0,
  });
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

  const handleImageUploadSuccess = (imageUrl) => {
    const extension = imageUrl.split(".").pop().toLowerCase();
    if (extension !== "svg") {
      setError("Only SVG files are allowed");
      return;
    }
    setError("");
    setFormData((prevData) => ({
      ...prevData,
      img: imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.img) {
      setError("Image is required.");
      return;
    }

    // console.log("Form submitted:", formData);
    const url = `categories/upsert`;
    const successMessage = id ? 'Category Updated Succesfully!' : 'Category Added Successfully!'
    try {
      const response = await api.post(url, formData, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage)
        setTimeout(() => {
          navigate("/category-list");
        }, 2000);
      } else {
        throw new Error('Unexpected server response')
      }

    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting Category:", error);
      NotificationManager.error("Error submitting Category:", error);
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
            <div className="flex items-center mt-6  mb-4">
              <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 " style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>Create Category</h2>
            </div>

            {/* Form Container */}
            <div className="h-full px-6 max-w-5xl " style={{ paddingTop: '24px' }}>
              <div className="bg-white h-[67vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* category name */}
                    <div className="flex flex-col">
                      <label htmlFor="category_name" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Category name </label>
                      <input id="category_name" name="title" value={formData.title} type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                        placeholder="Enter Category Title"
                      />
                    </div>

                    {/* category image*/}
                    <div className="flex flex-col">
                      <label htmlFor="category_image" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Category Image</label>
                      <ImageUploader onUploadSuccess={handleImageUploadSuccess} />
                      {formData.img && (
                        <div className="mt-4">
                          <img
                            src={formData.img}
                            alt="Uploaded Preview"
                            className="w-32 h-32 object-cover rounded"
                          />
                        </div>
                      )}
                      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
                  <button type="submit" className={`py-2 mt-6 float-start bg-[#045D78] text-white rounded-lg h-10 font-poppins font-medium ${id ? 'w-[140px]' : 'w-[120px]'}`} style={{ borderRadius: '8px' }}   >
                    {id ? 'Update Category' : 'Add  Category'}
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