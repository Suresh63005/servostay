import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import ImageUploader from '../common/ImageUploader';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';
import api from '../utils/api';
import { statusoptions } from '../common/data';
import SelectComponent from '../common/SelectComponent';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import { Vortex } from 'react-loader-spinner';

const CupponAdd = () => {
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();
  const [loading,setloading]=useState(false)
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

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        c_img: file, 
        imgPreview: previewUrl, 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        id: prevData.id
      }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    try {
      const form=new FormData();
      form.append("c_title",formData.c_title)
      form.append("ctitle",formData.ctitle)
      form.append("subtitle",formData.subtitle)
      form.append("c_value",formData.c_value)
      form.append("c_desc",formData.c_desc)
      form.append("cdate",formData.cdate)
      form.append("min_amt",formData.min_amt)
      form.append("status",formData.status)
      if (formData.img) {
        form.append("c_img", formData.c_img); 
      }

      if (id) {
        form.append("id", id);
      }
      const url =`coupons/upsert`;
      const successMessage = id ? `Coupon Updated Successfully` : `Coupon Added Successfully!`;
      const response = await api.post(url, form, { withCredentials: true });
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
              <h2 className="text-lg font-semibold ml-4 " style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>Coupon Management</h2>
            </div>

            {/* Form Container */}
            <div className="px-6 " style={{ paddingTop: '24px' }}>
              <div className="bg-white h-[380px]  w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                    {/* couppon image*/}
                    <div className="flex flex-col">
                      <label htmlFor="cupponimage" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Coupon Image</label>
                      <input type="file" name="c_img" id="c_img" onChange={handleChange} accept='image/*' className="border rounded-lg p-2 mt-1 w-full h-14" />
                      {formData.c_img && (
                        <div className="mt-2">
                          <img
                            src={formData.c_img}
                            alt="Uploaded Preview"
                            className="w-[50px] h-[50px] object-cover rounded"
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
                      <input id="c_title" name="c_title" type="text" required className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        value={formData.c_title}
                        onChange={handleChange}
                        placeholder="Enter Coupon code"
                      />
                    </div>
                    {/*btn*/}
                    <div className="flex flex-col">
                      {/* <label  htmlFor="cupponCode"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> cuppon Generate</label> */}
                      <button className='btn border text-[#fff] rounded-lg  mt-[25px] w-full h-14' style={{ background: '#045D78', height: '40px', width: '65px' }} onClick={(e) => { e.preventDefault(); makeEightDigitRand(); }}> <AutorenewOutlinedIcon className='text-[#f0f0f0]'/></button>
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4  mt-6">
                    {/* Coupon title */}
                    <div className="flex flex-col">
                      <label htmlFor="ctitle" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Title </label>
                      <input id="ctitle" value={formData.ctitle} onChange={handleChange} name="ctitle" type="text" required className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        placeholder="Enter Coupon title"
                      />
                    </div>
                    {/* coupon subtitle */}
                    <div className="flex flex-col">
                      <label htmlFor="subtitle" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Sub Title </label>
                      <input id="subtitle" value={formData.subtitle} name="subtitle" type="text" required className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                        placeholder="Enter Coupon subtitle"
                      />
                    </div>

                    {/* coupon Status */}
                    <div className="flex flex-col">
                      <label htmlFor="status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]" > Status </label>

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
                        defaultplaceholder={'Select Status'}
                      />
                    </div>

                    {/* Couppon min order amount */}
                    <div className="flex flex-col">
                      <label htmlFor="min_amt" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Min Order Amount </label>
                      <input id="min_amt" name="min_amt" value={formData.min_amt} placeholder='Enter Min Order Amount' type="text" required className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}

                      />
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* Couppon value */}
                    <div className="flex flex-col">
                      <label htmlFor="c_value" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Value </label>
                      <input id="c_value" name="c_value" placeholder='Enter Coupon Value' value={formData.c_value} type="text" required className="border input-tex rounded-lg p-3 mt-1 " style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Coupon Description */}
                    <div className="flex flex-col">
                      <label htmlFor="c_desc" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Coupon Description </label>
                      <textarea id="c_desc" placeholder='Enter Description' value={formData.c_desc} name="c_desc" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className={` py-2 px-4 bg-[#045D78] text-white rounded-lg   h-10 font-poppins font-medium`} style={{ borderRadius: "8px", }} >
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
                        ):(
                          id ? 'Update Coupon' : 'Add Coupon'
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

export default CupponAdd