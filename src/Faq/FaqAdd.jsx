import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import api from '../utils/api';
import SelectComponent from '../common/SelectComponent';
import { statusoptions } from '../common/data';
import { Vortex } from 'react-loader-spinner';

const FaqAdd = () => {
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  const [formData, setFormData] = useState({ id: id || null, question: '', answer: '', status: 0, });

  useEffect(() => {
    if (id) {
      getFAQ(id);
    }
  }, [id]);

  const getFAQ = async (id) => {
    try {
      const response = await api.get(`/faqs/${id}`);
      const faq = response.data;
      setFormData({
        id,
        question: faq.question,
        answer: faq.answer,
        status: faq.status,
      });
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id: prevData.id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);
    setloading(true)
    try {
      const url = `faqs/upsert`;
      const successMessage = id ? "FAQ updated successfully!" : "FAQ added successfully!";
      const response = await api.post(url, formData, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage);
        setTimeout(() => {
          navigate("/faq-list");
        }, 2000);
      } else {
        NotificationManager.success("Something went wrong. Please try again.");
      }
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting FAQ:", error);
      NotificationManager.error("An error occurred while submitting the FAQ. Please check your inputs or try again later.");
    } finally {
      setloading(false)
    }
  };

  return (
    <div>
      <div className="flex bg-[#f7fbff]">
        {/* Sidebar */}
        <main className="flex-grow h-[100vh]">
          <Header />
          <div className="container mx-auto">
            <div className="flex items-center mt-6  mb-4">
              <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
              </Link>
              <h2 className="text-lg font-semibold ml-4 header" >FAQ Management</h2>
            </div>

            {/* Form Container */}
            <div className="h-full px-6 max-w-5xl" style={{ paddingTop: '24px' }}>
              <div className="bg-white  w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* faq question */}
                    <div className="flex flex-col">
                      <label htmlFor="question" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> FAQ Question </label>
                      <input id="question" value={formData.question} onChange={handleChange} name="question" type="text" required className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }} placeholder="Enter question " />
                    </div>

                    {/* faq answer */}
                    <div className="flex flex-col">
                      <label htmlFor="answer" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> FAQ Answer </label>
                      <input id="answer" value={formData.answer} onChange={handleChange} name="answer" type="text" required className="border input-tex rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: '8px', border: '1px solid #EAEAFF' }} placeholder="Enter Anwer " />
                    </div>

                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    {/* page Status */}
                    <div className="flex flex-col">
                      <label htmlFor="status" className="text-sm font-medium text-start text-[12px] font-[Montserrat]" >FAQ  Status </label>

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
                    <button type="submit" className={`py-2 px-4 bg-[#045D78] text-white rounded-lg  h-10 font-poppins font-medium `} style={{ borderRadius: "8px", }} >
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
                        ) :
                          (
                            id ? "Update FAQ" : "Add FAQ"
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

export default FaqAdd