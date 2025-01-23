import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import ImageUploader from '../common/ImageUploader';
import axios from 'axios';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';
import api from '../utils/api';

const CupponAdd = () => {
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();
  const [formData, setFormData] = useState({ id: id || null, c_img: '', status: 0, c_title: '', cdate: '', ctitle: '', subtitle: '', min_amt: '', c_value: '', c_desc: '', });

  useEffect(() => {
    if (id) {
      getCuppon(id)
    }
  }, [])

  const getCuppon = async (id) => {
    try {
      const response = await api.get(`/coupons/${id}`)
      console.log(response.data)
      const cuppon = response.data

      setFormData({
        id,
        c_img: cuppon.c_img,
        cdate: new Date(cuppon.cdate).toISOString().split("T")[0],
        c_desc: cuppon.c_desc,
        c_title: cuppon.c_title,
        c_value: cuppon.c_value,
        cdate: cuppon.cdate,
        ctitle: cuppon.ctitle,
        min_amt: cuppon.min_amt,
        status: cuppon.status,
        subtitle: cuppon.subtitle

      })
    } catch (error) {
      console.error(error)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id: prevData.id
    }));
  }

  // random cuppon generation
  const makeEightDigitRand = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setFormData((prevData) => ({
      ...prevData,
      c_title: result,
    }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      c_img: imageUrl,
    }));

  };

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "from formdata");
    const url = id ? `http://localhost:5000/coupons/upsert` : `http://localhost:5000/coupons/upsert`;

    const successMessage = id ? `Coupon Updated Successfully` : `Coupon Added Successfully!`;

    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage)
        setTimeout(() => {
          navigate('/cuppon-list')
        }, 2000);
      } else {
        throw new Error('Unexpected server response')
      }
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting Category:", error);
      NotificationManager.error("Error submitting Category:", error);
    }
  }

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
                <ArrowBackIosNewIcon style={{color:'#045D78'}} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 " style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>Coupon Management</h2>
            </div>

            {/* Form Container */}
            <div className="h-full px-6 max-w-5xl" style={{ paddingTop: '24px' }}>
              <div className="bg-white h-[67vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                    {/* couppon image*/}
                    <div className="flex flex-col">
                      <label htmlFor="cupponimage" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Coupon Image</label>
                      <ImageUploader onUploadSuccess={handleImageUploadSuccess} />
                      {formData.c_img && (
                        <div className="mt-4">
                          <img
                            src={formData.c_img}
                            alt="Uploaded Preview"
                            className="w-32 h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    {/* Coupon expiry date */}
                    <div className="flex flex-col">
                      <label htmlFor="cdate" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Coupon Expiry Date
                      </label>
                      <input
                        type="date"
                        id="cdate"
                        value={formData.cdate ? formData.cdate.split("T")[0] : ""} 
                        onChange={handleChange}
                        name="cdate"
                        required
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                      />
                    </div>


                    {/* Coupon code */}
                    <div className="flex flex-col">
                      <label htmlFor="c_title" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon code </label>
                      <input id="c_title" name="c_title" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        value={formData.c_title}
                        onChange={handleChange}
                        placeholder="Enter Coupon code"
                      />
                    </div>
                    {/*btn*/}
                    <div className="flex flex-col">
                      {/* <label  htmlFor="cupponCode"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> cuppon Generate</label> */}
                      <button className='btn border rounded-lg ml-4 mt-[25px] w-full h-14' style={{ background: '#61eb34', height: '40px', width: '65px' }} onClick={(e) => { e.preventDefault(); makeEightDigitRand(); }}><img src="/image/cuppon/update_8303700.png" alt="refresh" height={20} width={20} className='ml-3' /></button>
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4  mt-6">
                    {/* Coupon title */}
                    <div className="flex flex-col">
                      <label htmlFor="ctitle" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Title </label>
                      <input id="ctitle" value={formData.ctitle} onChange={handleChange} name="ctitle" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        placeholder="Enter Coupon title"
                      />
                    </div>
                    {/* coupon subtitle */}
                    <div className="flex flex-col">
                      <label htmlFor="subtitle" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Sub Title </label>
                      <input id="subtitle" value={formData.subtitle} name="subtitle" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                        placeholder="Enter Coupon subtitle"
                      />
                    </div>

                    {/* coupon Status */}
                    <div className="flex flex-col">
                      <label htmlFor="status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]" > Status </label>

                      <select name="status" value={formData.status} onChange={handleChange} id="status" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-[#045D78] focus:bg-[#045D78] focus:border-[#045D78]  outline-none text-sm" >

                        <option value="" disabled selected>Select Status</option>
                        <option  value={1}>Publish</option>
                        <option value={0}>Unpublish</option>
                      </select>
                    </div>

                    {/* Couppon min order amount */}
                    <div className="flex flex-col">
                      <label htmlFor="min_amt" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Min Order Amount </label>
                      <input id="min_amt" name="min_amt" value={formData.min_amt} type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}

                      />
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* Couppon value */}
                    <div className="flex flex-col">
                      <label htmlFor="c_value" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Value </label>
                      <input id="c_value" name="c_value" value={formData.c_value} type="text" required className="border rounded-lg p-3 mt-1 " style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}

                      />
                    </div>

                    {/* Coupon Description */}
                    <div className="flex flex-col">
                      <label htmlFor="c_desc" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Description </label>
                      <textarea id="c_desc" value={formData.c_desc} name="c_desc" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className={` py-2 bg-[#045D78] text-white rounded-lg  w-[110px] h-10 font-poppins font-medium`} style={{ borderRadius: "8px", }} > {id ? 'Update Coupon' : 'Add Coupon'} </button>
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

export default CupponAdd