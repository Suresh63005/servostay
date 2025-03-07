import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../Context/LoadingContext";
import { useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import api from "../utils/api";
import CountryCodeOptions from "../utils/CountryCodes";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { statusoptions } from "../common/data";
import SelectComponent from "../common/SelectComponent";
import { Vortex } from "react-loader-spinner";

const CountryAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const { isLoading, setIsLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [errors,setErrors]=useState({})

  const [formData, setFormData] = useState({
    id: id || null,
    title: "",
    img: null, 
    imgPreview: null, 
    status: 0,
    currency: "",
    // city: "",
  });

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      getCountry(id);
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, location, setIsLoading]);

  const getCountry = async (id) => {
    try {
      const response = await api.get(`/countries/${id}`);
      const country = response.data;
      setFormData({
        id: country.id,
        title: country.title,
        img: country.img,
        imgPreview: country.img,
        status: country.status,
        currency: country.currency,
        city: country.city,
      });
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        img: file, 
        imgPreview: previewUrl, 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Country Name is required";
    if (!formData.currency.trim()) newErrors.currency = "Currency is required";
    // if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.img) newErrors.img = "Country Image is required"; 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("status", formData.status);
      form.append("currency", formData.currency);
      // form.append("city", formData.city);

      if (formData.img) {
        form.append("img", formData.img); 
      }else{
        form.delete("img")
      }

      if (id) {
        form.append("id", id);
      }

      const apiEndpoint = `countries/upsert`;
      const response = await api.post(apiEndpoint, form, {
        withCredentials: true,
      });

      console.log("API Response:", response.data);

      const successMessage = id
        ? "Country updated successfully!"
        : "Country added successfully!";
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll()
        NotificationManager.success(successMessage);
        setTimeout(() => {
          navigate("/country-list");
        }, 2000);
      }
      console.log("Form Submitted Successfully!")
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message);
      NotificationManager.removeAll()
      NotificationManager.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
              <Link onClick={() => navigate(-1)} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{ color: "#045D78" }} />
              </Link>
              <h2
                className="text-lg font-semibold ml-4"
                style={{ color: "#000000", fontSize: "24px", fontFamily: "Montserrat" }}
              >
                Country Management
              </h2>
            </div>
            <div className="h-full px-6 " style={{ paddingTop: "24px" }}>
              <div
                className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_name"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Country Name
                      </label>
                      <input
                        id="country_name"
                        value={formData.title}
                        onChange={handleChange}
                        name="title"
                        type="text"
                        // required
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        placeholder="Enter Country name"
                      />
                      {errors.title && <span className="text-red-500 text-sm">* {errors.title}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="currency"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Currency
                      </label>
                      <SelectComponent
                        name="currency"
                        value={formData.currency}
                        onChange={(selectedOption) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            currency: selectedOption.value,
                          }))
                        }
                        options={CountryCodeOptions}
                      />
                    {errors.currency && <span className="text-red-500 text-sm"> * {errors.currency}</span>}
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_image"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Country Image
                      </label>
                      <input
                        type="file"
                        name="img"
                        id="img"
                        onChange={handleChange}
                        accept="image/*"
                        className="border rounded-lg p-2 mt-1 w-full h-14"
                      />
                      {formData.imgPreview && (
                        <div className="mt-2">
                          <img
                            src={formData.imgPreview}
                            alt="Uploaded Preview"
                            className="w-[50px] h-[50px] object-cover rounded"
                          />
                        </div>
                      )}
                      {errors.img && <span className="text-red-500">* {errors.img}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="status"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Status
                      </label>
                      <SelectComponent
                        name="status"
                        value={formData.status}
                        onChange={(selectedOption) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            status: selectedOption.value,
                          }))
                        }
                        options={statusoptions}
                      />
                    </div>
                  </div>

                  <div className="flex justify-start mt-6 gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="py-2 px-4 bg-[#045D78] text-white rounded-lg h-10 font-poppins font-medium"
                    >
                      {loading ? (
                        <Vortex
                          visible={true}
                          height="25"
                          width="100%"
                          ariaLabel="vortex-loading"
                          colors={["white", "white", "white","white", "white", "white"]}
                        />
                      ) : id ? (
                        "Update Country"
                      ) : (
                        "Add Country"
                      )}
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

export default CountryAdd;
