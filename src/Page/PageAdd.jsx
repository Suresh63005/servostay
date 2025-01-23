import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SidebarMenu from '../components/SideBar'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const PageAdd = () => {
  const location=useLocation();
  const id=location.state ? location.state.id : null;
  // console.log(id)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: id || null,
    ctitle: '',
    cstatus: 0,
    cdesc:'',
  });

  useEffect(() => {
    if (id) {
      getPage(id);
    }
  }, [id]);

  const getPage = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/pages/${id}`);
        console.log(response.data)
        const page = response.data;
        setFormData({
            id, 
            ctitle: page.title,
            cstatus: page.status,
            cdesc: page.description,
        });
    } catch (error) {
        console.error("Error fetching Page:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    const plainTextDescription = new DOMParser()
        .parseFromString(formData.cdesc, 'text/html')
        .body.innerText;

    const dataToSend = {
        ...formData,
        cdesc: plainTextDescription,
    };

    console.log("Data to be sent to the server:", dataToSend);

    try {
        const url = id 
            ? `http://localhost:5000/pages/upsert` 
            : `http://localhost:5000/pages/upsert`;

        const successMessage = id 
            ? "Page updated successfully!" 
            : "Page added successfully!";

        // Make API call
        const response = await axios.post(url, dataToSend, { withCredentials: true });

        if (response.status === 200 || response.status === 201) {
          NotificationManager.removeAll()
            NotificationManager.success(successMessage);
            setTimeout(() => {
                navigate("/page-list");
            }, 2000);
        } else {
            NotificationManager.removeAll()
            NotificationManager.error("Something went wrong. Please try again.");
        }
    } catch (error) {
        NotificationManager.removeAll()
        console.error("Error submitting Page:", error);
        NotificationManager.error("An error occurred while submitting the Page.");
    }
  };

  return (
    <div>
      <div className="flex bg-[#f7fbff]">
      {/* Sidebar */}
      
      <main className="flex-grow">
        <Header />
        <div className="container mx-auto">
          <div className="flex items-center mt-6  mb-4">
          <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{color:'#045D78'}} />
              </Link>
            <h2 className="text-lg font-semibold ml-4 header" >Page Management</h2>
          </div>

          {/* Form Container */}
          <div className="h-full px-6 max-w-5xl" style={{paddingTop:'24px'}}> 
            <div className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto" style={{scrollbarWidth:'none'}}>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1  mt-6">
                  {/* page name */}
                  <div className="flex flex-col">
                      <label  htmlFor="ctitle"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Page name </label>
                      <input id="ctitle" value={formData.ctitle} onChange={handleChange} name="ctitle" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        placeholder="Enter Page Title"
                      />
                    </div>
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                  {/* page Status */}
                  <div className="flex flex-col">
                    <label  htmlFor="cstatus"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" >Page  Status </label>
                    <select  name="cstatus"  id="cstatus" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"  >
                      <option value="" disabled >Select Status</option>
                      <option value={1}>Publish</option>
                      <option value={0}>Unpublish</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1  mt-6">
                  {/* page description  */}
                  <div className="flex flex-col">
                    <label htmlFor="cdesc" className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> Page Description </label>
                    <ReactQuill 
                      value={formData.cdesc} 
                      onChange={(value) => setFormData({ ...formData, cdesc: value })} 
                      required 
                      className="border rounded-lg mt-1 w-full h-40" 
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-start mt-12 gap-3">
                  <button  type="submit" className=" py-2 bg-[#045D78] text-white rounded-lg w-[150px] h-12 font-[Montserrat] font-bold" style={{ borderRadius: "8px", }} > Add Page </button>
                  <ToastContainer />
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

export default PageAdd