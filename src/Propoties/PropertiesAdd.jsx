
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import api from "../utils/api";
import { RxCrossCircled } from "react-icons/rx";
import { NotificationContainer, NotificationManager } from "react-notifications";
import 'react-notifications/lib/notifications.css';
import Loader from "../common/Loader";
import { useLoading } from "../Context/LoadingContext";
import { statusoptions } from "../common/data";
import SelectComponent from "../common/SelectComponent";
import Cookies from "js-cookie";
import { Vortex } from "react-loader-spinner";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Select from 'react-select';

const PropertiesAdd = () => {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const [errors, setErrors] = useState({});
  const [currentRule, setCurrentRule] = useState('');
  const { isLoading, setIsLoading } = useLoading();
  const [loading, setloading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);

  const timePickerRef = useRef(null);
  const [formData, setFormData] = useState({
    id: 0 || null,
    title: '',
    image: null,
    imagePreview: '',
    is_panorama: 0,
    price: null,
    status: null,
    address: '',
    facility: [],
    description: '',
    beds: null,
    bathroom: null,
    sqrft: null,
    rate: null,
    ptype: null,
    latitude: '',
    longtitude: '',
    mobile: '',
    city: null,
    listing_date: '',
    add_user_id: 1,
    rules: [],
    country_id: null,
    is_sell: 0,
    adults: null,
    children: null,
    infants: null,
    pets: null,
    setting_id: 1,
    extra_guest_charges: '',
    standard_rules: {
      checkIn: '',
      checkOut: '',
      smokingAllowed: false,
    },
  });

  console.log(formData.city,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")

  useEffect(() => {
    console.log("loading state:", loading);
  }, [loading]);

  useEffect(() => {
    console.log("formData.city changed:", formData.city);
  }, [formData.city]);

  const handleTimeChange = (selectedDates) => {
    if (selectedDates.length > 0) {
      const selectedTime = selectedDates[0];
      const formattedTime = selectedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setFormData((prevData) => ({
        ...prevData,
        standard_rules: { ...prevData.standard_rules, checkIn: formattedTime },
      }));
    }
  };

  const checkInRef = useRef(null);
  const handleClickOutside = (event) => {
    if (checkInRef.current && checkInRef.current.input && !checkInRef.current.input.contains(event.target)) {
      if (checkInRef.current._flatpickr) {
        checkInRef.current._flatpickr.close();
      }
    }
  };



  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (id) {
      getProperty();
    }
  }, [id]);

  useEffect(() => {
    const fetchActiveCities = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("user");
        if (!token) {
          NotificationManager.error("No authentication token found!");
          return;
        }
        const response = await api.get("/cities/active-cities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Cities API Response:", response.data);
        if (response.status === 200 && response.data && response.data.cities) {
          const formattedCities = response.data.cities.map((city) => ({
            value: city.id,
            label: `${city.title} ${city.TblCountry ? `(${city.TblCountry.countryName})` : ""}`.trim(),
          }));
          setCityOptions(formattedCities);
          console.log("Formatted Cities:", formattedCities);
        } else {
          console.error("Unexpected cities response:", response);
          NotificationManager.error("Unexpected response format. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        NotificationManager.error("Failed to fetch cities. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveCities();
  }, []);

  useEffect(() => {
    if (id && cityOptions && cityOptions.length > 0) {
      getProperty();
    }
  }, [id, cityOptions]);

  const flattenArray = (arr) =>
    arr.reduce(
      (acc, val) => (Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val)),
      []
    );

  const getProperty = async () => {
    try {
      const response = await api.get(`properties/${id}`);
      const Property = response.data;
      console.log("Property Data:", JSON.stringify(Property, null, 2));

      let rulesArray;
      if (Array.isArray(Property.rules)) {
        rulesArray = flattenArray(Property.rules);
      } else if (typeof Property.rules === "string") {
        try {
          const parsed = JSON.parse(Property.rules);
          rulesArray = Array.isArray(parsed) ? flattenArray(parsed) : [parsed];
        } catch (error) {
          if (Property.rules.includes("\n")) {
            rulesArray = Property.rules.split("\n").map(rule => rule.trim()).filter(Boolean);
          } else {
            rulesArray = Property.rules.split(",").map(rule => rule.trim()).filter(Boolean);
          }
        }
      } else {
        rulesArray = [];
      }

      let cityObj = null;

      if (Property.cities && Property.cities.title) {
        if (Property.cities.id) {
          cityObj = cityOptions.find(city => city.value === Property.cities.id) || null;
        } else {
          // Fallback: match by title
          cityObj = cityOptions.find(city => city.label.includes(Property.cities.title)) || null;
        }
      } else if (Property.city) {
        cityObj = cityOptions.find(city => city.value === Number(Property.city)) || null;
      }
      

      // Ensure cityObj matches an option in cityOptions
      if (cityObj && cityOptions.length > 0) {
        const matchingCity = cityOptions.find(
          option => option.value === cityObj.value && option.label.includes(cityObj.label)
        );
        cityObj = matchingCity || cityObj;
      }

      console.log("Computed cityObj:", cityObj);

      console.log(cityOptions.find(option => option?.value === formData?.city),"qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

      setFormData({
        id,
        title: Property.title || "",
        image: Property.image || null,
        imagePreview: Property.image || "",
        is_panorama: Property.is_panorama || 0,
        price: Property.price || null,
        status: Property.status || null,
        address: Property.address || "",
        facility: (() => {
          if (Array.isArray(Property.facility)) {
            return Property.facility;
          }
          try {
            const parsed = JSON.parse(Property.facility);
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return Property.facility
              ? Property.facility.split(",").map(item => Number(item.trim())).filter(Boolean)
              : [];
          }
        })(),
        description: Property.description || "",
        beds: Property.beds || null,
        bathroom: Property.bathroom || null,
        sqrft: Property.sqrft || null,
        rate: Property.rate || null,
        ptype: Property.ptype || null,
        latitude: Property.latitude || "",
        longtitude: Property.longtitude || "",
        mobile: Property.mobile || "",
        // city: Property.city || null,
        city: cityObj || null,
        listing_date: Property.listing_date
          ? new Date(Property.listing_date).toISOString().split("T")[0]
          : "",
        add_user_id: Property.add_user_id || 1,
        rules: rulesArray,
        country_id: Property.country_id || null,
        is_sell: Property.is_sell || 0,
        adults: Property.adults || null,
        children: Property.children || null,
        infants: Property.infants || null,
        pets: Property.pets || null,
        setting_id: 1,
        extra_guest_charges: Property.extra_guest_charges || "",
        standard_rules: (() => {
          try {
            let rules = Property.standard_rules;
            if (typeof rules === "string") {
              rules = JSON.parse(rules);
            }
            if (typeof rules === "string") {
              rules = JSON.parse(rules);
            }
            if (!rules || typeof rules !== "object") {
              rules = {};
            }
            return {
              checkIn: rules.checkIn || "",
              checkOut: rules.checkOut || "",
              smokingAllowed: rules.smokingAllowed ?? false,
            };
          } catch (error) {
            console.error("Error parsing standard_rules:", error);
            return { checkIn: "", checkOut: "", smokingAllowed: false };
          }
        })(),
      });
    } catch (error) {
      console.error("Error fetching Property:", error);
      NotificationManager.error("Failed to fetch property data.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentRule.trim() !== '') {
      e.preventDefault();
      setFormData((prevData) => ({
        ...prevData,
        rules: [...prevData.rules, currentRule.trim()],
      }));
      setCurrentRule('');
      setErrors((prevErrors) => ({
        ...prevErrors,
        rules: "",
      }));
    }
  };

  const handleRemoveRule = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      rules: prevData.rules.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    api.get('/countries/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));
    api.get('/categories/all')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
    api.get('/facilities/all')
      .then(response => setFacilities(response.data))
      .catch(error => console.error('Error fetching facilities:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log("handleChange:", { name, value, files });

    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        image: file,
        imagePreview: previewUrl,
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    } else if (["adults", "children", "infants", "pets", "price"].includes(name)) {
      if (/^\d*$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value === "" ? null : Number(value),
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const validateForm = (formData) => {
    console.log("Validating formData:", formData);
    let errors = {};
    const standard_rules = formData.standard_rules;
    try {
      if (!formData.title.trim()) errors.title = "Title is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.description.trim()) errors.description = "Description is required";
      if (!formData.city || !formData.city.value || !formData.city.label) {
        errors.city = cityOptions.length === 0
          ? "No cities available. Please try again later."
          : "Please select a valid city";
      } else if (!cityOptions.some(option => option.value === formData.city.value)) {
        errors.city = "Selected city is not valid";
      }
      if (!formData.country_id) errors.country_id = "Country is required";
      if (!formData.ptype) errors.ptype = "Property type is required";
      if (!formData.facility || formData.facility.length === 0) {
        errors.facility = "Facilities are required";
      }
      if (!standard_rules?.checkIn) {
        errors.checkIn = "Check-In time is required.";
      }
      if (!standard_rules?.checkOut) {
        errors.checkOut = "Check-Out time is required.";
      }
      if (standard_rules?.smokingAllowed === undefined || standard_rules.smokingAllowed === "") {
        errors.smokingAllowed = "Please select Smoking Allowed option.";
      }
      const parseNumber = (value) => (value === null || value === "" ? 0 : parseFloat(value));
      if (isNaN(parseNumber(formData.price)) || parseNumber(formData.price) <= 0) {
        errors.price = "Price must be a positive number";
      }
      if (isNaN(parseNumber(formData.adults)) || parseNumber(formData.adults) < 1) {
        errors.adults = "Adults must be at least 1";
      }
      if (isNaN(parseNumber(formData.children)) || parseNumber(formData.children) < 0) {
        errors.children = "Children must be 0 or more";
      }
      if (isNaN(parseNumber(formData.infants)) || parseNumber(formData.infants) < 0) {
        errors.infants = "Infants must be 0 or more";
      }
      if (isNaN(parseNumber(formData.pets)) || parseNumber(formData.pets) < 0) {
        errors.pets = "Pets must be 0 or more";
      }
      if (isNaN(parseNumber(formData.beds)) || parseNumber(formData.beds) < 0) {
        errors.beds = "Beds must be 0 or more";
      }
      if (isNaN(parseNumber(formData.bathroom)) || parseNumber(formData.bathroom) < 0) {
        errors.bathroom = "Bathrooms must be 0 or more";
      }
      if (isNaN(parseNumber(formData.sqrft)) || parseNumber(formData.sqrft) <= 0) {
        errors.sqrft = "Square foot must be a positive number";
      }
      if (!formData.latitude) {
        errors.latitude = "Latitude is required";
      } else if (isNaN(parseFloat(formData.latitude))) {
        errors.latitude = "Latitude must be a valid number";
      }
      if (!formData.longtitude) {
        errors.longtitude = "Longitude is required";
      } else if (isNaN(parseFloat(formData.longtitude))) {
        errors.longtitude = "Longitude must be a valid number";
      }
      if (!formData.extra_guest_charges) {
        errors.extra_guest_charges = "Extra Guest Charges are required";
      } else if (isNaN(parseFloat(formData.extra_guest_charges)) || parseFloat(formData.extra_guest_charges) < 0) {
        errors.extra_guest_charges = "Extra Guest Charges must be a valid number";
      }
      if (!id && !formData.image) {
        errors.image = "Image is required for new properties";
      } else if (id && !formData.image && !formData.imagePreview) {
        errors.image = "Image cannot be removed during update";
      }
      if (!formData.mobile.trim()) {
        errors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
        errors.mobile = "Mobile number must be exactly 10 digits";
      }
      if (!Array.isArray(formData.rules) || formData.rules.length === 0) {
        errors.rules = "At least one rule is required.";
      }
      console.log("Validation errors:", errors);
      return errors;
    } catch (error) {
      console.error("Validation error:", error);
      errors.validation = "Failed to validate form data";
      return errors;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    console.log("formData.city:", formData.city);
    setloading(true);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setloading(false);
      return;
    }

    console.log("Submitting formData:", formData);

    const formDataToSubmit = new FormData();
    try {
      formDataToSubmit.append("id", formData.id || 0);
      formDataToSubmit.append("title", formData.title);
      if (formData.image instanceof File) {
        formDataToSubmit.append("image", formData.image);
      } else {
        formDataToSubmit.append("image", formData.image || "");
      }
      formDataToSubmit.append("is_panorama", formData.is_panorama);
      formDataToSubmit.append("price", formData.price || 0);
      formDataToSubmit.append("status", formData.status || "");
      formDataToSubmit.append("address", formData.address);
      formDataToSubmit.append("facility", JSON.stringify(formData.facility));
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("beds", formData.beds || 0);
      formDataToSubmit.append("bathroom", formData.bathroom || 0);
      formDataToSubmit.append("sqrft", formData.sqrft || 0);
      formDataToSubmit.append("rate", formData.rate || "");
      formDataToSubmit.append("ptype", formData.ptype || "");
      formDataToSubmit.append("latitude", formData.latitude);
      formDataToSubmit.append("longtitude", formData.longtitude);
      formDataToSubmit.append("mobile", formData.mobile);
      formDataToSubmit.append("city", String(formData.city?.value) || "");
      formDataToSubmit.append("listing_date", formData.listing_date);
      formDataToSubmit.append("add_user_id", formData.add_user_id);
      formDataToSubmit.append("rules", JSON.stringify(formData.rules));
      formDataToSubmit.append("country_id", formData.country_id || "");
      formDataToSubmit.append("is_sell", formData.is_sell);
      formDataToSubmit.append("adults", formData.adults || 0);
      formDataToSubmit.append("children", formData.children || 0);
      formDataToSubmit.append("infants", formData.infants || 0);
      formDataToSubmit.append("pets", formData.pets || 0);
      formDataToSubmit.append("setting_id", formData.setting_id);
      formDataToSubmit.append("extra_guest_charges", formData.extra_guest_charges || 0);
      formDataToSubmit.append("standard_rules", JSON.stringify(formData.standard_rules));
      console.log("Serialized city for FormData:", String(formData.city?.value) || "");
      for (let [key, value] of formDataToSubmit.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }
    } catch (error) {
      console.error("Error preparing FormData:", error);
      NotificationManager.error("Failed to prepare form data.", "Error");
      setloading(false);
      return;
    }

    try {
      const response = await api.post('/properties/upsert', formDataToSubmit, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
      console.log("API Response:", response);

      if (response?.status === 200 || response?.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(id ? 'Property Updated Successfully!' : 'Property Added Successfully!');
        setTimeout(() => {
          navigate('/property-list');
        }, 2000);
      } else {
        NotificationManager.removeAll();
        NotificationManager.error(response?.data?.message || 'An unexpected error occurred', 'Error');
      }
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error Response:', error.response?.data);
      NotificationManager.removeAll();
      if (error.code === 'ECONNABORTED') {
        NotificationManager.error('Request timed out. Please try again.', 'Error');
      } else {
        NotificationManager.error(error.response?.data?.message || 'Failed to submit property.', 'Error');
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
        <main className="flex-grow">
          <Header />
          <div className="">
            <div className="flex items-center mt-6 mb-4">
              <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
              </Link>
              <h2
                className="text-lg font-semibold ml-4"
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontFamily: "Montserrat",
                }}
              >
                Property Management
              </h2>
            </div>
            <div className="h-full px-6" style={{ paddingTop: "24px" }}>
              <div
                className="bg-white h-[67vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6"
                style={{
                  maxHeight: "calc(100vh - 100px)",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                    <div className="flex flex-col">
                      <label htmlFor="title" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Property Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        onChange={handleChange}
                        placeholder="Enter property title"
                      />
                      {errors?.title && <p className="text-red-500 text-sm"> * {errors.title}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="image" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Property Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleChange}
                        accept="image/*"
                        className="border rounded-lg p-2 mt-1 w-full h-14"
                      />
                      {formData.imagePreview && (
                        <div className="mt-2">
                          <img
                            src={formData.imagePreview}
                            alt="Uploaded Preview"
                            className="w-[50px] h-[50px] object-cover rounded"
                          />
                        </div>
                      )}
                      {errors.image && <span className="text-red-500 text-sm">* {errors.image}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="is_panorama" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Is Panorama
                      </label>
                      <SelectComponent
                        name="is_panorama"
                        value={formData.is_panorama}
                        onChange={(selectedOption) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            is_panorama: selectedOption.value,
                          }));
                        }}
                        options={[
                          { value: 1, label: 'yes' },
                          { value: 0, label: 'No' },
                        ]}
                        defaultplaceholder={'Select Panorama'}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="cupponCode" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Property Price Per Night
                      </label>
                      <input
                        id="PropertyPricePerNight"
                        value={formData.price}
                        name="price"
                        type="number"
                        min={0}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        onChange={handleChange}
                        placeholder="Enter Price Per Night"
                      />
                      {errors.price && <span className="text-red-500 text-sm">* {errors.price}</span>}
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                    <div className="flex flex-col">
                      <label htmlFor="adults" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Adults
                      </label>
                      <input
                        id="adults"
                        name="adults"
                        type="number"
                        min={0}
                        value={formData.adults}
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        placeholder="Enter Adults"
                      />
                      {errors.adults && <span className="text-red-500 text-sm">* {errors.adults}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="children" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Children
                      </label>
                      <input
                        id="children"
                        name="children"
                        type="number"
                        min={0}
                        value={formData.children}
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        placeholder="Enter Children"
                      />
                      {errors.children && <span className="text-red-500 text-sm">* {errors.children}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="infants" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Infants
                      </label>
                      <input
                        id="infants"
                        name="infants"
                        type="number"
                        min={0}
                        value={formData.infants}
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        placeholder="Enter Infants"
                      />
                      {errors.infants && <span className="text-red-500 text-sm">* {errors.infants}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="pets" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Pets
                      </label>
                      <input
                        id="pets"
                        name="pets"
                        type="number"
                        min={0}
                        value={formData.pets}
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        placeholder="Enter Pets"
                      />
                      {errors.pets && <span className="text-red-500 text-sm">* {errors.pets}</span>}
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                    <div className="flex flex-col">
                      <label htmlFor="country_id" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Property Country
                      </label>
                      <SelectComponent
                        name="country_id"
                        value={formData.country_id}
                        onChange={(selectedOption) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            country_id: selectedOption.value,
                          }));
                        }}
                        options={countries.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />
                      {errors.country_id && <span className="text-red-500 text-sm">* {errors.country_id}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="propertySellOrRent" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Property Status
                      </label>
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
                    <div className="flex flex-col">
                      <label htmlFor="country_id" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Extra Guest Charges
                      </label>
                      <input
                        type="number"
                        id="extra_guest_charges"
                        name="extra_guest_charges"
                        value={formData.extra_guest_charges}
                        min={0}
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        onChange={handleChange}
                        placeholder="Enter Extra Guest Charges"
                      />
                      {errors.extra_guest_charges && <span className="text-red-500 text-sm">* {errors.extra_guest_charges}</span>}
                    </div>
                    <div>
                      <label className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                        Check-In Time
                      </label>
                      <Flatpickr
                        ref={checkInRef}
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: "h:i K",
                          time_24hr: false,
                        }}
                        value={formData.standard_rules?.checkIn || ""}
                        onChange={handleTimeChange}
                        onOpen={(selectedDates, dateStr, instance) => {
                          const handleClickOutside = (e) => {
                            const calendarContainer = instance.calendarContainer;
                            if (calendarContainer && !calendarContainer.contains(e.target)) {
                              instance.close();
                            }
                          };
                          document.addEventListener("mousedown", handleClickOutside);
                          instance._handleClickOutside = handleClickOutside;
                        }}
                        onClose={(selectedDates, dateStr, instance) => {
                          if (instance._handleClickOutside) {
                            document.removeEventListener("mousedown", instance._handleClickOutside);
                            delete instance._handleClickOutside;
                          }
                        }}
                        className="border rounded-lg p-3 h-11 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12:00 PM"
                      />
                      {errors.checkIn && <span className="text-red-500 text-sm">* {errors.checkIn}</span>}
                    </div>
                    <div>
                      <label className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                        Check-Out Time
                      </label>
                      <Flatpickr
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: "h:i K",
                          time_24hr: false,
                        }}
                        value={formData.standard_rules?.checkOut || ""}
                        onChange={([date]) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            standard_rules: {
                              ...prevData.standard_rules,
                              checkOut: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
                            },
                          }));
                        }}
                        className="border rounded-lg p-3 h-11 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12:00 PM"
                      />
                      {errors.checkOut && <span className="text-red-500 text-sm">* {errors.checkOut}</span>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Smoking Allowed
                      </label>
                      <SelectComponent
                        style={{ height: "55px" }}
                        name="smokingAllowed"
                        value={
                          formData.standard_rules?.smokingAllowed !== undefined
                            ? formData.standard_rules.smokingAllowed.toString()
                            : ""
                        }
                        onChange={(selectedOption) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            standard_rules: {
                              ...prevData.standard_rules,
                              smokingAllowed: selectedOption.value === "true",
                            },
                          }));
                        }}
                        options={[
                          { value: "", label: "Select" },
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 mt-6">
                    <div className="flex flex-col">
                      <label htmlFor="address" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Property Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
                        onChange={handleChange}
                        placeholder="Enter Property Address"
                      />
                      {errors.address && <span className="text-red-500 text-sm">* {errors.address}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="facility" className="text-sm font-medium text-start text-[12px] font-[Montserrat]">
                        Select Property Facility
                      </label>
                      <Select
                        isMulti
                        name="facility"
                        value={facilities
                          .filter((fac) => formData.facility.includes(fac.id))
                          .map((fac) => ({ value: fac.id, label: fac.title }))}
                        options={facilities.map((fac) => ({
                          value: fac.id,
                          label: fac.title,
                        }))}
                        onChange={(selectedOptions) => {
                          const selectedIds = selectedOptions.map((option) => option.value);
                          setFormData((prevData) => ({
                            ...prevData,
                            facility: selectedIds,
                          }));
                        }}
                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#045D78] focus:border-[#045D78]"
                        classNamePrefix="select"
                        placeholder="Select Facilities"
                        styles={{
                          control: (provided, { isFocused }) => ({
                            ...provided,
                            border: isFocused ? "2px solid #045D78" : "1px solid #EAEAFF",
                            boxShadow: isFocused ? "none" : "none",
                            borderRadius: "8px",
                            fontSize: "12px",
                            maxHeight: "40px",
                            overflowY: "scroll",
                            color: "#757575",
                          }),
                          placeholder: (provided) => ({
                            ...provided,
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "100%",
                            textAlign: "center",
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            height: "40px",
                            padding: "0 8px",
                          }),
                        }}
                      />
                      {errors.facility && <span className="text-red-500 text-sm">* {errors.facility}</span>}
                    </div>
                  </div>
                  <div className="grid gap-6 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                    <div className="md:col-span-3 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                      <div>
                        <label htmlFor="beds" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Total Beds
                        </label>
                        <input
                          type="number"
                          id="beds"
                          name="beds"
                          min={0}
                          value={formData.beds}
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Beds Count"
                          onChange={handleChange}
                        />
                        {errors.beds && <span className="text-red-500 text-sm">* {errors.beds}</span>}
                      </div>
                      <div>
                        <label htmlFor="bathroom" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Total Bathroom
                        </label>
                        <input
                          type="number"
                          id="bathroom"
                          name="bathroom"
                          min={0}
                          value={formData.bathroom}
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Bathroom Count"
                          onChange={handleChange}
                        />
                        {errors.bathroom && <span className="text-red-500 text-sm">* {errors.bathroom}</span>}
                      </div>
                      <div>
                        <label htmlFor="sqrft" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Property SQRFT
                        </label>
                        <input
                          type="number"
                          id="sqrft"
                          min={0}
                          value={formData.sqrft}
                          name="sqrft"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property SQFT"
                          onChange={handleChange}
                        />
                        {errors.sqrft && <span className="text-red-500 text-sm">* {errors.sqrft}</span>}
                      </div>
                      <div>
                        <label htmlFor="rate" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Property Rating
                        </label>
                        <input
                          type="number"
                          id="rate"
                          min={1}
                          value={formData.rate || ""}
                          name="rate"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property Rating"
                          onChange={(e) => {
                            const value = Math.min(Number(e.target.value), 5);
                            setFormData((prevData) => ({
                              ...prevData,
                              rate: value,
                            }));
                          }}
                        />
                        {formData.rate > 5 && (
                          <span className="text-red-500 text-xs">
                            Rating cannot be more than 5.
                          </span>
                        )}
                      </div>
                      <div className=" ">
                        <label htmlFor="ptype" className="text-sm font-medium text-[12px] font-[Montserrat]">
                          Select Property Type
                        </label>
                        <SelectComponent
                          name="ptype"
                          value={formData.ptype}
                          onChange={(selectedOption) => {
                            setFormData((prevData) => ({
                              ...prevData,
                              ptype: selectedOption.value,
                            }));
                          }}
                          options={categories.map((category) => (
                            { value: category.id, label: category.title }
                          ))}
                        />
                        {errors.ptype && <span className="text-red-500 text-sm">* {errors.ptype}</span>}
                      </div>
                      <div>
                        <label htmlFor="latitude" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Latitude
                        </label>
                        <input
                          type="text"
                          id="latitude"
                          value={formData.latitude}
                          name="latitude"
                          className="border input-tex rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Latitude"
                          onChange={handleChange}
                        />
                        {errors.latitude && <span className="text-red-500 text-sm">* {errors.latitude}</span>}
                      </div>
                      <div>
                        <label htmlFor="longitude" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Longitude
                        </label>
                        <input
                          type="text"
                          id="longitude"
                          value={formData.longtitude}
                          name="longtitude"
                          className="border input-tex rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Longitude"
                          onChange={handleChange}
                        />
                        {errors.longtitude && <span className="text-red-500 text-sm">* {errors.longtitude}</span>}
                      </div>
                      <div>
                        <label htmlFor="mobile" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          maxLength={10}
                          pattern="[0-9]{10}"
                          className="border rounded-lg p-3 mt-1 w-full h-[40px] focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Mobile Number"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                        />
                        {errors.mobile && <span className="text-red-500 text-sm">* {errors.mobile}</span>}
                      </div>
                      <div className=" ">
                        <label htmlFor="city" className="text-sm font-medium text-[12px] font-[Montserrat]">
                          City
                        </label>
                        <SelectComponent
                          name="city"
                          value={formData?.city?.value || null}
                          onChange={(selectedOption) => {
                            console.log("City selected:", selectedOption);
                            setFormData((prevData) => ({
                              ...prevData,
                              city: selectedOption,
                            }));
                          }}
                          options={cityOptions || []}
                          defaultplaceholder="Select a City"
                          isClearable={false}
                        />


                        {errors.city && <span className="text-red-500 text-sm">* {errors.city}</span>}
                      </div>
                      <div>
                        <label htmlFor="listing_date" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Listing Date 
                        </label>
                        <input
                          type="date"
                          id="listing_date"
                          value={formData.listing_date}
                          name="listing_date"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Date"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor="description" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Property Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          className="border rounded-lg p-3 mt-1 w-full resize-none h-64 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property Description"
                          onChange={handleChange}
                        ></textarea>
                        {errors.description && <span className="text-red-500 text-sm">* {errors.description}</span>}
                      </div>
                      <div className="md:col-span-1 mb-7">
                        <label htmlFor="rules" className="text-sm font-medium float-left text-[12px] font-[Montserrat]">
                          Property Rules
                        </label>
                        <div
                          id="rules"
                          className="border rounded-lg p-3 mt-1 w-full h-64 overflow-auto focus:ring-blue-500 focus:border-blue-500 flex flex-col gap-2"
                        >
                          {formData.rules.map((rule, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                            >
                              <span className="text-sm font-medium">{rule}</span>
                              <button
                                type="button"
                                className="text-red-500 text-lg"
                                onClick={() => handleRemoveRule(index)}
                              >
                                <RxCrossCircled />
                              </button>
                            </div>
                          ))}
                          <input
                            type="text"
                            placeholder="Write a rule and press Enter"
                            value={currentRule}
                            onChange={(e) => setCurrentRule(e.target.value)}
                            className="focus:outline-none input-tex text-sm border-t border-gray-300 pt-2 w-full"
                            onKeyDown={handleKeyPress}
                          />
                          {errors.rules && <span className="text-red-500 text-sm">* {errors.rules}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start mt-6 gap-3">
                    <button
                      type="submit"
                      disabled={loading || cityOptions.length === 0}
                      className={`px-4 py-2 mt-6 float-start bg-[#045D78] text-white rounded-lg h-10 font-poppins font-medium ${loading || cityOptions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ borderRadius: '8px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Button clicked");
                      }}
                    >
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
                      ) : (
                        id ? "Update Property" : "Add Property"
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

export default PropertiesAdd;