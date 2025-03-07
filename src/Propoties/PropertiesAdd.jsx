import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { json, Link, useLocation, useNavigate } from "react-router-dom";
import SidebarMenu from "../components/SideBar";
import axios from "axios";
import ImageUploader from "../common/ImageUploader";
import Select from 'react-select';
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

const PropertiesAdd = () => {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();
  const location = useLocation()
  const id = location.state ? location.state.id : null;
  const [errors, setErrors] = useState({});
  const [error2, setError2] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentRule, setCurrentRule] = useState('');
  const { isLoading, setIsLoading } = useLoading();
  const [loading, setloading] = useState(false)
  const [cityOptions, setCityOptions] = useState([]);
  const timePickerRef = useRef(null);
  const [formData, setFormData] = useState({
    id: 0 || null,
    title: '',
    image: '',
    is_panorama: 0,
    price: null,
    status: null,
    address: '',
    facility: '',
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
  console.log(formData, "Form Data")
  const handleTimeChange = (selectedDates) => {
    if (selectedDates.length > 0) {
      const selectedTime = selectedDates[0];
      const formattedTime = selectedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Ensures 12-hour format with AM/PM
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

  // useEffect(() => {
  //   function handleScroll() {
  //     alert(1)
  //     if (checkInRef.current && checkInRef.current._flatpickr) {
  //       checkInRef.current._flatpickr.close(); // Close Flatpickr on scroll
  //     }
  //   }

  //   window.addEventListener("scroll", handleScroll, true);
  //   document.addEventListener("scroll", handleScroll, true);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll, true);
  //     document.removeEventListener("scroll", handleScroll, true);
  //   };
  // }, []);

  useEffect(() => {
    if (id) {
      getProperty();
    }
  }, [id]);

  const getProperty = async () => {
    try {
      const response = await api.get(`properties/${id}`)
      const Property = response.data;
      console.log("Property Data: ", Property);
      const rate = Math.min(Math.max(Property.rate, 0), 5);
      const convertToTimeFormat = (time) => {
        const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
        let hours = parseInt(hour);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minute}`;
      };
      setFormData({
        id,
        title: Property.title,
        image: Property.image,
        is_panorama: Property.is_panorama,
        price: Property.price,
        status: Property.status,
        address: Property.address,
        facility: Property.facility,
        description: Property.description,
        beds: Property.beds,
        bathroom: Property.bathroom,
        sqrft: Property.sqrft,
        rate: Property.rate,
        ptype: Property.ptype,
        latitude: Property.latitude,
        longtitude: Property.longtitude,
        mobile: Property.mobile,
        city: cityOptions.find((opt) => opt.value === Property.city) || null,
        listing_date: new Date(Property.listing_date).toISOString().split("T")[0],
        add_user_id: Property.add_user_id,
        rules: (() => {
          try {
            return JSON.parse(Property.rules);
          } catch (error) {
            return Property.rules ? [Property.rules] : [];
          }
        })(),
        country_id: Property.country_id,
        is_sell: Property.is_sell,
        adults: Property.adults,
        children: Property.children,
        infants: Property.infants,
        pets: Property.pets,
        setting_id: 1,
        extra_guest_charges: Property.extra_guest_charges,

        standard_rules: (() => {
          try {
            let rules = Property.standard_rules;

            // Parse first level (removes outer quotes)
            if (typeof rules === "string") {
              rules = JSON.parse(rules);
            }

            // Parse second level (removes escaped JSON)
            if (typeof rules === "string") {
              rules = JSON.parse(rules);
            }

            // Ensure `rules` is an object
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

      console.log("Property.city:", Property.city);
      console.log("cityOptions:", cityOptions);

    } catch (error) {
      console.error("Error fetching Property:", error);
    }
  }

  useEffect(() => {
    const fetchActiveCities = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("user");
        if (!token) {
          NotificationManager.error("No authentication token found!");
          return;
        }

        const response = await api.get('/cities/active-cities', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log("API Response:", response.data);
        if (response.status === 200 && response.data && response.data.cities) {
          const formattedCities = response.data.cities.map((city) => ({
            value: city.id,
            label: `${city.title} ${city.TblCountry ? `(${city.TblCountry.countryName})` : ''}`.trim()
          }));
          setCityOptions(formattedCities);
          console.log("Formatted Cities:", formattedCities);
        } else {
          console.error("Unexpected response:", response);
          NotificationManager.error("Unexpected response format. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        if (error.response) {
          NotificationManager.error(`Error: ${error.response.status} - ${error.response.data.message || 'Failed to fetch cities'}`);
        } else {
          NotificationManager.removeAll();
          NotificationManager.error("Network error. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };


    fetchActiveCities();
  }, [])


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

  // console.log('Rules before submission:', formData.rules);

  const handleRemoveRule = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      rules: prevData.rules.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    // Fetch countries
    api.get('/countries/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));

    // Fetch categories
    api.get('/categories/all')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));

    api.get('/facilities/all')
      .then(response => setFacilities(response.data))
      .catch(error => console.error('Error fetching facilities:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Fields that require positive integers
    if (['adults', 'children', 'infants', 'pets', 'price'].includes(name)) {
      const positiveNumberRegex = /^[0-9]*$/; // Only positive integers allowed

      // Validate input
      if (!positiveNumberRegex.test(value)) {
        // alert("Please enter a positive number.");
        return; // Stop further execution if invalid input
      }
      const formattedValue = value.replace(/^0+/, "") || "0";

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
      return;
    }

    // Update the form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id: prevData.id,
    }));
  };


  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      image: imageUrl,
    }));

  };
  // console.log(formData, "from formdata");

  const validateForm = (formData) => {
    let errors = {};
    const standard_rules = formData.standard_rules;
    // Required fields validation
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.city || formData.city.toString().trim() === "") {
      errors.city = "City is required";
    }
    if (!formData.country_id) errors.country_id = "Country is required";
    if (!formData.ptype) errors.ptype = "Property type is required";
    if (!formData.facility || formData.facility.toString().trim() === "") {
      errors.facility = "Facilities are required";
    }

    if (!standard_rules?.checkIn) {
      errors.checkIn = "Check-In time is required.";
    }
    if (!standard_rules?.checkOut) {
      errors.checkOut = "Check-Out time is required.";
    }

    // Ensure checkOut is later than checkIn
    if (standard_rules?.checkIn && standard_rules?.checkOut) {
      const checkInTime = new Date(`2000-01-01T${standard_rules.checkIn}`);
      const checkOutTime = new Date(`2000-01-01T${standard_rules.checkOut}`);

      // if (checkOutTime <= checkInTime) {
      //   errors.checkOut = "Check-Out time must be later than Check-In time.";
      // }
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

    // Extra Guest Charges Validation
    if (!formData.extra_guest_charges) {
      errors.extra_guest_charges = "Extra Guest Charges are required";
    } else if (isNaN(parseFloat(formData.extra_guest_charges)) || parseFloat(formData.extra_guest_charges) < 0) {
      errors.extra_guest_charges = "Extra Guest Charges must be a valid number";
    }

    // Image URL validation
    if (!formData.image.trim()) {
      errors.image = "Image is required";
    } else if (!/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(formData.image.trim())) {
      errors.image = "Invalid image URL (must be .jpg, .jpeg, .png, or .gif)";
    }

    // Mobile number validation (10 digits only)
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      errors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Ensure rules array is not empty
    if (!Array.isArray(formData.rules) || formData.rules.length === 0) {
      errors.rules = "At least one rule is required.";
    }

    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    // console.log(errors)
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }
    console.log("Form Submitted Successfully", formData);

    const formDataToSubmit = {
      ...formData,
      rules: JSON.stringify(formData.rules),
      standard_rules: JSON.stringify(formData.standard_rules),
    };
    console.log(formDataToSubmit)
    const successMessage = id ? 'Property Updated Successfully!' : 'Property Added Successfully!';
    try {
      const response = await api.post('/properties/upsert', formDataToSubmit, { withCredentials: true });
      console.log(response)
      // Check for success response
      if (response?.status === 200 || response?.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage);

        // Delay navigation slightly to ensure the toast is shown
        setTimeout(() => {
          navigate('/property-list');
        }, 2000);
      } else {
        // Handle unexpected response
        NotificationManager.removeAll();
        NotificationManager.error(response?.data?.message || 'An unexpected error occurred', 'Error');
      }
    } catch (error) {
      console.error('Error:', error);

      // Handle different error scenarios
      NotificationManager.removeAll();
      if (error?.response?.data?.message) {
        NotificationManager.error(error.response.data.message, 'Error');
      }
      else {
        NotificationManager.error('Please fill all the fields.', 'Error');
      }
    } finally {
      setloading(false)
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
        {/* Sidebar */}

        <main className="flex-grow">
          <Header />
          <div className="">
            <div className="flex items-center mt-6  mb-4">
              <Link onClick={() => { navigate(-1) }} className="cursor-pointer ml-6">
                <ArrowBackIosNewIcon style={{ color: '#045D78' }} />
              </Link>
              <h2
                className="text-lg font-semibold ml-4 "
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontFamily: "Montserrat",
                }}
              >
                Property Management
              </h2>
            </div>

            {/* Form Container */}
            <div
              className="h-full px-6 "
              style={{ paddingTop: "24px" }}
            >
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
                    {/* property title */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Property Title{" "}
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onChange={handleChange}
                        placeholder="Enter property title"
                      />
                      {errors?.title && <p className="error-text text-red-500 text-sm"> * {errors.title}</p>}

                    </div>

                    {/* Property Image */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="image"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Property Image
                      </label>
                      <ImageUploader onUploadSuccess={handleImageUploadSuccess} />

                      {formData.image && (
                        <div className="mt-4">
                          <img
                            src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)}
                            alt="Uploaded Preview"
                            className="w-[50px] h-[50px] object-cover rounded"
                          />
                        </div>
                      )}

                      {errors.image && <p className="error-text text-red-500 text-sm"> * {errors.image}</p>}
                    </div>


                    {/* property panorama */}
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

                    {/* property price per night */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="cupponCode"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Property Price Per Night{" "}
                      </label>
                      <input
                        id="PropertyPricePerNight"
                        value={formData.price}
                        name="price"
                        type="number"
                        min={0}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onChange={handleChange}
                        placeholder="Enter  Price Per Night"
                      />
                      {errors.price && <span className="text-red-500 text-sm">* {errors.price}</span>}
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                    {/* adults */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="adults"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Adults{" "}
                      </label>
                      <input
                        id="adults"
                        name="adults"
                        type="number"
                        min={0}
                        value={formData.adults}
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        placeholder="Enter Adults"
                      />
                      {errors.adults && <span className="text-red-500 text-sm">* {errors.adults}</span>}
                    </div>
                    {/* children */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="children"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Children{" "}
                      </label>
                      <input id="children" name="children" type="number" min={0} value={formData.children} onChange={handleChange} className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: "8px", border: "1px solid #EAEAFF", }} placeholder="Enter Children" />
                      {errors.children && <span className="text-red-500 text-sm">* {errors.children}</span>}

                    </div>
                    {/* infants */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="infants"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Infants{" "}
                      </label>
                      <input id="infants" name="infants" type="number" min={0} value={formData.infants} onChange={handleChange} className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: "8px", border: "1px solid #EAEAFF", }} placeholder="Enter Infants" />
                      {errors.infants && <span className="text-red-500 text-sm">* {errors.infants}</span>}
                    </div>
                    {/* pets */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="pets"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Pets{" "}
                      </label>
                      <input id="pets" name="pets" type="number" min={0} value={formData.pets} onChange={handleChange} className="border rounded-lg p-3 mt-1 w-full h-14" style={{ borderRadius: "8px", border: "1px solid #EAEAFF", }} placeholder="Enter Pets" />
                      {errors.pets && <span className="text-red-500 text-sm">* {errors.pets}</span>}
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3  mt-6">
                    {/*property country*/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_id"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Property Country ?
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

                    {/* propert status */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="propertySellOrRent"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
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
                      <label
                        htmlFor="country_id"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Extra Guest Charges
                      </label>
                      <input type="number"
                        id="extra_guest_charges"
                        name="extra_guest_charges"
                        value={formData.extra_guest_charges}

                        min={0}
                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onChange={handleChange}
                        placeholder="Enter Extra Guest Charges"
                      />
                      {errors.extra_guest_charges && <span className="text-red-500 text-sm">* {errors.extra_guest_charges}</span>}
                    </div>

                    {/* Standard Rules */}
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
                        // onClose={handleClose}
                        onOpen={(selectedDates, dateStr, instance) => {
                          const handleClickOutside = (e) => {
                            // If the click is outside the .flatpickr-calendar or the input, close
                            const calendarContainer = instance.calendarContainer;
                            if (calendarContainer && !calendarContainer.contains(e.target)) {
                              instance.close();
                            }
                          };

                          document.addEventListener("mousedown", handleClickOutside);
                          instance._handleClickOutside = handleClickOutside;
                        }}
                        onClose={(selectedDates, dateStr, instance) => {
                          // Remove the click listener
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
                            standard_rules: { ...prevData.standard_rules, checkOut: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) },
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

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* Property address */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Property Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}

                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}

                        onChange={handleChange}
                        placeholder="Enter Property Address "
                      />
                      {errors.address && <span className="text-red-500 text-sm">* {errors.address}</span>}
                    </div>

                    {/* Select Property Facility */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="facility"
                        className="text-sm font-medium text-start  text-[12px] font-[Montserrat]"
                      >
                        Select Property Facility
                      </label>

                      <Select
                        isMulti
                        name="facility"
                        value={facilities.filter((facility) =>
                          formData.facility.split(",").includes(facility.id.toString())
                        ).map(facility => ({ value: facility.id, label: facility.title }))}
                        options={facilities.map((facility) => ({
                          value: facility.id,
                          label: facility.title,
                        }))}
                        onChange={(selectedOptions) => {
                          const selectedIds = selectedOptions.map((option) => option.value);
                          setFormData((prevData) => ({
                            ...prevData,
                            facility: selectedIds.join(","),
                          }));
                        }}
                        className="block w-full text-sm border-color border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#045D78] focus:border-[#045D78]"
                        classNamePrefix="select"
                        placeholder="Select Facilities"
                        styles={{
                          control: (provided, { isFocused }) => ({
                            ...provided,
                            border: isFocused ? "2px solid #045D78" : " 1px solid #EAEAFF",
                            boxShadow: isFocused ? 'none' : 'none',
                            borderRadius: "8px",

                            fontSize: "12px",
                            maxHeight: "40px",
                            overflowY: 'scroll',
                            color: "#757575",
                            "&:hover": {

                            }
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
                          border: "1px solid #045D78"
                        }}
                      />
                      {errors.facility && <span className="text-red-500 text-sm">* {errors.facility}</span>}
                    </div>

                  </div>

                  <div className="grid gap-6 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                    {/* Property description */}

                    <div className="md:col-span-3 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                      {/* Total Beds */}
                      <div>
                        <label
                          htmlFor="beds"
                          className="text-sm font-medium  float-left text-[12px] font-[Montserrat]"
                        >
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

                      {/* Total bathrooms */}
                      <div>
                        <label
                          htmlFor="bathroom"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
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

                      {/* Property SQFT */}
                      <div>
                        <label
                          htmlFor="sqrft"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
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
                        <label
                          htmlFor="rate"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
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

                      {/* Property Type */}
                      <div className=" ">
                        <label
                          htmlFor="ptype"
                          className="text-sm  font-medium  text-[12px] font-[Montserrat]"
                        >
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

                      {/* Latitude */}
                      <div>
                        <label
                          htmlFor="latitude"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
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

                      {/* Longitude */}
                      <div>
                        <label
                          htmlFor="longitude"
                          className="text-sm font-medium float-left te  xt-[12px] font-[Montserrat]"
                        >
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

                      {/* Mobile Number */}
                      <div>
                        <label
                          htmlFor="mobile"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
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
                              handleChange(e); // Only update state if input is valid
                            }
                          }}
                        />
                        {errors.mobile && <span className="text-red-500 text-sm">* {errors.mobile}</span>}
                      </div>


                      {/* City, Country */}
                      <div className=" ">
                        <label
                          htmlFor="city"
                          className="text-sm  font-medium  text-[12px] font-[Montserrat]"
                        >
                          City, Country
                        </label>
                        <SelectComponent
                          name="city"
                          value={formData.city} // Ensure it's an object { value, label }
                          onChange={(selectedOption) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              city: selectedOption, // Store full object { value, label }
                            }))
                          }
                          options={cityOptions || []}
                        />

                      </div>

                      {/* listing date */}
                      <div>
                        <label
                          htmlFor="listing_date"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
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
                        <label
                          htmlFor="description"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Property Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          className="border rounded-lg p-3 mt-1 w-full resize-none h-64 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property Description"
                          onChange={handleChange}
                        >
                        </textarea>
                        {errors.description && <span className="text-red-500 text-sm">* {errors.description}</span>}
                      </div>
                      <div className="md:col-span-1 mb-7">
                        <label
                          htmlFor="rules"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Property Rules
                        </label>
                        <div
                          id="rules"
                          className="border rounded-lg p-3 mt-1 w-full h-64 overflow-auto focus:ring-blue-500 focus:border-blue-500 flex flex-col gap-2"
                        >
                          {/* Render existing rules */}
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
                          {/* Input area for new rule */}
                          <input
                            type="text"
                            placeholder="Write a rule and press Enter"
                            value={currentRule}
                            onChange={(e) => setCurrentRule(e.target.value)} // Update currentRule state
                            className="focus:outline-none input-tex text-sm border-t border-gray-300 pt-2 w-full"
                            onKeyDown={handleKeyPress}
                          />
                          {errors.rules && <span className="text-red-500 text-sm">* {errors.rules}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-start mt-6 gap-3">
                    <button type="submit" className={`px-4 py-2 mt-6 float-start bg-[#045D78] text-white rounded-lg  h-10 font-poppins font-medium `} style={{ borderRadius: '8px' }}   >
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
                            id ? "Update Property" : "Add Property"
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
  );
};

export default PropertiesAdd;