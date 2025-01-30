import React, { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import Header from '../components/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import api from '../utils/api';
import { statusoptions } from '../common/data';
import SelectComponent from '../common/SelectComponent';
import { Vortex } from 'react-loader-spinner';

const ExtraImageAdd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state ? location.state.id : null;
    const [properties, setProperties] = useState([]);
    const [PImages, setPImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setloading] = useState(false);
    const [formData, setFormData] = useState({ id: id || null, pid: '', status: '', img: null,imgPreview:null });

    useEffect(() => {
        if (id) {
            getExtraImage();
        }
        const timer = setTimeout(() => {
            // setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [id, location]);

    const getExtraImage = async () => {
        try {
            const response = await api.get(`/extra/${id}`);
            const ExtraImage = response.data;
            console.log(ExtraImage, "from extra images");
            setFormData({
                id,
                pid: ExtraImage.pid,
                img: ExtraImage.images, 
                imgPreview:ExtraImage.images.map(img => img.url), 
                status: ExtraImage.status
            });
        } catch (error) {
            console.error("Error fetching Extra Images", error);
        }
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties');
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error.response ? error.response.data : error.message);
            }
        };
        fetchProperties();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        setPImages(Array.from(files));
    
        // Create preview URLs for the newly uploaded images
        const previewUrls = Array.from(files).map((file) => URL.createObjectURL(file));
        setFormData((prevData) => ({
            ...prevData,
            img: files,  
            imgPreview: previewUrls,  
        }));
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
    
        const form = new FormData();
        form.append('pid', formData.pid);
        form.append('status', formData.status);
        if (formData.id) {
            form.append('id', formData.id);
        }
    
        // Append each file correctly
        PImages.forEach((img) => {
            form.append('img', img);  
        });
    
        try {
            const response = await api.post('/extra/upsert', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            if (response.status === 200 || response.status === 201) {
                NotificationManager.removeAll()
                NotificationManager.success(id ? `Extra Image Updated Successfully` : `Extra Image Added Successfully!`);
                setTimeout(() => navigate("/extra-image-list"), 2000);
            }
        } catch (error) {
            NotificationManager.removeAll()
            NotificationManager.error('Error adding/updating extra image');
            console.error('Error:', error.response ? error.response.data : error.message);
        } finally {
            setloading(false);
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
                            <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
                            </Link>
                            <h2 className="text-lg font-semibold ml-4" style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>Extra Image Management</h2>
                        </div>
                        <div className="h-full px-6 " style={{ paddingTop: '24px' }}>
                            <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                                <form className="mt-4" onSubmit={handleSubmit}>
                                    <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                                        {/* Select Property */}
                                        <div className="flex flex-col">
                                            <label htmlFor="pid" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Select Property</label>
                                            <SelectComponent
                                                name="pid"
                                                value={formData.pid}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        pid: selectedOption.value,
                                                    }));
                                                }}
                                                options={properties.map((property) => ({
                                                    value: property.id, label: property.title
                                                }))}
                                            />
                                        </div>
                                        {/* Property Image */}
                                        <div className="flex flex-col">
                                            <label htmlFor="img" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Property Image</label>
                                            <input type="file" name="img" id="img" onChange={handleImageUpload} multiple accept='image/*' className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm" />
                                            {formData.imgPreview && formData.imgPreview.length > 0 && (
                                                <div className="mt-2 flex gap-3">
                                                    {formData.imgPreview && formData.imgPreview.length > 0 && (
                                                        <div className="mt-2 flex gap-3">
                                                            {formData.imgPreview.map((previewUrl, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={previewUrl} // Preview the uploaded image
                                                                    alt={`Uploaded Preview ${index}`}
                                                                    className="w-[50px] h-[50px] object-cover rounded"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-4">
                                        {/* Property Image Status */}
                                        <div className="flex flex-col">
                                            <label htmlFor="status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Property Image Status</label>
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
                                    <button type="submit" className={`py-2 px-4 mt-6 float-start bg-[#045D78] text-white rounded-lg  h-10 font-poppins font-medium `} style={{ borderRadius: '8px' }}>
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
                                            ) : (
                                                id ? 'Update Image' : 'Add Image'
                                            )
                                        }
                                    </button>
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

export default ExtraImageAdd;
