import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploader from '../common/ImageUploader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';

const PackageAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const [formData, setFormData] = useState({
    id: id || null,
    title: '',
    day: '',
    price: '',
    img: '',
    status: 0,
    description: '',
  });

  useEffect(() => {
    if (id) {
      getPackage(id).then(() => {
        console.log("Updated Form Data:", formData);
      });
    }
  }, [id]);

  const getPackage = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/packages/${id}`, {
        withCredentials: true,
      });
      const packages = response.data;
      console.log(packages, "Packages Data");

      setFormData((prevData) => ({
        ...prevData,
        id: packages.id || id,
        title: packages.title || '',
        status: packages.status || 0,
        description: packages.description || '',
        day: packages.day || '',
        price: packages.price || '',
        img: packages.image || '', // Ensure the key matches the API response
      }));
    } catch (error) {
      console.error("Error fetching Package:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id: prevData.id
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

    const plainTextDescription = new DOMParser()
      .parseFromString(formData.description, 'text/html')
      .body.innerText;

    const dataToSend = {
      ...formData,
      description: plainTextDescription,
    };

    console.log("Data to be sent to the server:", dataToSend);

    try {
      const url = id ? `http://localhost:5000/packages/upsert` : `http://localhost:5000/packages/upsert`;
      const successMessage = id ? "Package updated successfully!" : "Package added successfully!";
      const response = await axios.post(url, dataToSend, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage);
        setTimeout(() => {
          navigate("/package-list");
        }, 2000);
      } else {
        NotificationManager.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting Package:", error);
      NotificationManager.error("An error occurred while submitting the Package.");
    }
  };

  return (
    <div>
      <div className="flex bg-[#f7fbff]">
        <main className="flex-grow">
          <Header />
          <div className="container mx-auto">
            <div className="flex items-center mt-6 mb-4">
              <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{color:'#045D78'}} />
              </Link>
              <h2
                className="text-lg font-semibold ml-4"
                style={{
                  color: '#000000',
                  fontSize: '24px',
                  fontFamily: 'Montserrat',
                }}
              >
                Package Management
              </h2>
            </div>

            <div className="h-full px-6 max-w-5xl" style={{ paddingTop: '24px' }}>
              <div
                className="bg-white h-[67vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}
              >
                <form onSubmit={handleSubmit} className="mt-4">
                  {/* Package Name */}
                  <div className="flex flex-col mt-6">
                    <label
                      htmlFor="package_name"
                      className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                    >
                      Package Name
                    </label>
                    <input
                      id="package_name"
                      value={formData.title}
                      onChange={handleChange}
                      name="title"
                      type="text"
                      required
                      className="border rounded-lg p-3 mt-1 w-full h-14"
                      placeholder="Enter package name"
                      style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                    />
                  </div>

                  {/* Package Total Day */}
                  <div className="flex flex-col mt-6">
                    <label
                      htmlFor="day"
                      className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                    >
                      Total Day
                    </label>
                    <input
                      id="day"
                      value={formData.day}
                      onChange={handleChange}
                      name="day"
                      type="text"
                      required
                      className="border rounded-lg p-3 mt-1 w-full h-14"
                      placeholder="Enter total days"
                      style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                    />
                  </div>

                  {/* Package Price */}
                  <div className="flex flex-col mt-6">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                    >
                      Package Price
                    </label>
                    <input
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      name="price"
                      type="text"
                      required
                      className="border rounded-lg p-3 mt-1 w-full h-14"
                      placeholder="Enter package price"
                      style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                    />
                  </div>

                  {/* Package Description */}
                  <div className="flex flex-col mt-6">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                    >
                      Description
                    </label>
                    <ReactQuill
                      value={formData.description}
                      onChange={(value) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          description: value,
                        }))}
                      required
                      className="border rounded-lg mt-1 w-full h-40"
                    />
                  </div>

                  {/* Package Image */}
                  <div className="flex flex-col mt-12">
                    <label
                      htmlFor="image"
                      className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                    >
                      Package Image
                    </label>
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
                  </div>

                  {/* Status */}
                  <div className="flex flex-col mt-6">
                    <label
                      htmlFor="status"
                      className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value={1}>Publish</option>
                      <option value={0}>Unpublish</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className={`py-2 mt-6 float-start bg-[#045D78] text-white rounded-lg w-[150px] h-12 font-[Montserrat] font-bold`} style={{ borderRadius: '8px' }}   >
                      {id ? 'Update Package' : 'Add Package'}
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

export default PackageAdd;
