import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { FaPen, FaTrash } from "react-icons/fa";
import PropotiesHeader from "./PropotiesHeader";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DeleteEntity } from "../utils/Delete";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";
import { StatusEntity } from "../utils/Status";
import Loader from "../common/Loader";
import { useLoading } from "../Context/LoadingContext";
import "react-notifications/lib/notifications.css";
import Modal from "react-modal";

const PropotiesIcal = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    calendarUrl: "",
    calendarName: "",
    propertyId: null,
  });
  const [copied, setCopied] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        const fetchedProperties = response.data.map((property) => {
          return {
            ...property,
            rules: (() => {
              try {
                return JSON.parse(property.rules);
              } catch (error) {
                return property.rules ? [property.rules] : [];
              }
            })(),
          };
        });
        console.log(response.data);
        // setProperties(response.data);
        // setFilteredProperties(response.data);
        setProperties(fetchedProperties);
        setFilteredProperties(fetchedProperties);
      } catch (error) {
        console.error(
          "Error fetching properties:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchProperties();
  }, []);

  // Search functionality
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredData = properties.filter((property) =>
      Object.values(property).some((value) =>
        typeof value === "object" && value !== null
          ? Object.values(value).some((nestedValue) =>
              String(nestedValue).toLowerCase().includes(query)
            )
          : String(value).toLowerCase().includes(query)
      )
    );
    setFilteredProperties(filteredData);
    setCurrentPage(1);
  };

  // Sorting functionality
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredProperties].sort((a, b) => {
      if (key === "id" || key === "totalProperties") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      return a[key] < b[key]
        ? direction === "asc"
          ? -1
          : 1
        : direction === "asc"
        ? 1
        : -1;
    });

    setFilteredProperties(sortedData);
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const { isLoading, setIsLoading } = useLoading();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    alert(e)

    try {
      const url = `bookings/import-ical`;
      const successMessage = "URL Imported successfully!";
      const response = await api.post(url, formData, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        NotificationManager.removeAll();
        NotificationManager.success(successMessage);
      } else {
        NotificationManager.success("Something went wrong. Please try again.");
      }
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting FAQ:", error);
      NotificationManager.error(
        "An error occurred while submitting the FAQ. Please check your inputs or try again later."
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const indexOfLastItem = currentPage * itemsPerPage;
  console.log(indexOfLastItem);
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  console.log(indexOfFirstItem);
  const currentProperties = filteredProperties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  console.log(currentProperties);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  console.log(totalPages);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(paginate);

  return (
    <div>
      {isLoading && <Loader />}
      <div className="h-screen flex">
        {/* Sidebar */}

        <div className="flex flex-1 flex-col bg-[#f7fbff]">
          {/* Header */}
          <Header />
          {/* Searching, sorting, and main content area */}
          <PropotiesHeader onSearch={handleSearch} />
          {/* Card */}
          <div className=" px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
            <div
              className={`bg-white w-full rounded-xl border border-[#EAE5FF]  overflow-x-auto scrollbar-thin  table-container `}
            >
              <div className="relative sm:rounded-lg max-h-[370px] scrollbar-thin overflow-y-auto  table-scroll">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                    <tr>
                      <th className="px-2 py-2 min-w-[100px]">
                        Sr. No
                        <div className="inline-flex items-center ml-2">
                          <GoArrowUp
                            className="text-white hover:text-gray-700 cursor-pointer"
                            onClick={() => handleSort("slno")}
                          />
                          <GoArrowDown
                            className="text-white hover:text-gray-700 cursor-pointer"
                            onClick={() => handleSort("slno")}
                          />
                        </div>
                      </th>
                      <th className=" py-2 min-w-[140px]">Property Image</th>

                      <th className=" py-2 min-w-[150px]">
                        property Tittle
                        <div className="inline-flex items-center ml-2">
                          <GoArrowUp
                            className="text-white hover:text-gray-700 cursor-pointer"
                            onClick={() => handleSort("propertyTittle")}
                          />
                          <GoArrowDown
                            className="text-white hover:text-gray-700 cursor-pointer"
                            onClick={() => handleSort("propertyTittle")}
                          />
                        </div>
                      </th>
                      <th className=" py-2 min-w-[150px]">
                        import
                        <div className="inline-flex items-center ml-2"></div>
                      </th>
                      <th className=" py-2 min-w-[150px]">
                        export
                        <div className="inline-flex items-center ml-2"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentProperties.length > 0 ? (
                      currentProperties.map((property, index) => (
                        <tr key={property.id} className="h-[70px]">
                          <td className="text-center ">
                            {index + 1 + indexOfFirstItem}
                          </td>
                          <td className="text-center ">
                            {property.image && property.image.trim() !== "" ? (
                              <img
                                src={property.image}
                                className="w-10 h-10 object-cover rounded-full"
                                height={50}
                                width={50}
                                loading="lazy"
                                alt=""
                                onError={(e) => {
                                  if (
                                    e.target.src !==
                                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                  ) {
                                    e.target.src =
                                      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
                                  }
                                }}
                              />
                            ) : (
                              <img
                                src={
                                  "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                }
                                height={50}
                                width={50}
                                loading="lazy"
                                alt=""
                              />
                            )}
                          </td>
                          <td className=" ">{property.title || "N/A"}</td>

                          <td className=" py-2">
                            <NotificationContainer />
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                              className="bg-green-100 text-green-500  px-6 py-2 rounded-full hover:bg-green-200 font-semibold transition mr-2"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  propertyId: property.id,
                                }))
                              }
                            >
                              Import Ical
                            </button>
                          </td>
                          <td className=" py-2">
                            <NotificationContainer />
                            <CopyToClipboard
                              text={`https://property-rental-backend-two.vercel.app/bookings/export-ical/${property?.id}`}
                              onCopy={() => setCopied(true)}
                            >
                              <button className="bg-blue-100 text-blue-500  px-6 py-2 rounded-full hover:bg-blue-200 font-semibold transition mr-2">
                                Export Ical
                              </button>
                            </CopyToClipboard>
                            {copied &&
                              NotificationManager.success(
                                "Copied to clipboard!"
                              )}
                          </td>

                          <div
                            class="modal fade"
                            id="exampleModal"
                            tabindex="-1"
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                          >
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5
                                    class="modal-title"
                                    id="exampleModalLabel"
                                  >
                                    Import a new Calendar
                                  </h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div class="modal-body">
                                  <div className="">
                                    Import other calendars you use and we'll
                                    automatically keep this listing's
                                    availability up-to-date.
                                  </div>

                                  <form
                                    action=""
                                    onSubmit={handleSubmit}
                                    className="mt-3"
                                  >
                                    <div className="flex  flex-col">
                                      <label
                                        htmlFor="calendarUrl"
                                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                                      >
                                        {" "}
                                        Calendar Addres(URL){" "}
                                      </label>
                                      <input
                                        id="calendarUrl"
                                        name="calendarUrl"
                                        type="text"
                                        value={formData?.calendarUrl || ""}
                                        required
                                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                                        onChange={handleChange}
                                        placeholder="Paste Calendar Address(URL) here"
                                      />
                                    </div>

                                    <div className=" flex mt-3 flex-col">
                                      <label
                                        htmlFor="calendarName"
                                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                                      >
                                        {" "}
                                        Name Your Calendar
                                      </label>
                                      <input
                                        id="calendarName"
                                        name="calendarName"
                                        type="text"
                                        value={formData.calendarName}
                                        required
                                        className="border input-tex rounded-lg p-3 mt-1 w-full h-14"
                                        style={{
                                          borderRadius: "8px",
                                          border: "1px solid #EAEAFF",
                                        }}
                                        onChange={handleChange}
                                        placeholder="Custome Name for this Calendar"
                                      />
                                    </div>
                                    <button
                                    type="submit"
                                    
                                    className="px-6 mt-3 py-2 text-[white] rounded bg-[#045D78]"
                                  >
                                    Save changes
                                  </button>
                                  </form>
                                </div>
                                <div class="modal-footer">
                                  <button
                                    type="button"
                                    class="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="20" className="text-center py-4">
                          No properties found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
              <span className="text-sm font-normal text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {indexOfFirstItem + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(indexOfLastItem, filteredProperties.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProperties.length}
                </span>
              </span>
              <ul className="inline-flex -space-x-px  rtl:space-x-reverse text-sm h-8">
                <li>
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    className={`previous-button ${
                      filteredProperties.length === 0
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      currentPage === 1 || filteredProperties.length === 0
                    }
                    title={
                      filteredProperties.length === 0 ? "No data available" : ""
                    }
                  >
                    <img src="/image/action/Left Arrow.svg" alt="Left" />{" "}
                    Previous
                  </button>
                </li>
                <li className="ms-2 me-2">
                  <span className="current-page ">
                    Page {filteredProperties.length > 0 ? currentPage : 0} of{" "}
                    {filteredProperties.length > 0 ? totalPages : 0}
                  </span>
                </li>
                <li>
                  <button
                    style={{ background: "#045D78" }}
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    className={`next-button ${
                      filteredProperties.length === 0
                        ? "cursor-not-allowed button-disable"
                        : ""
                    }`}
                    disabled={
                      currentPage === totalPages ||
                      filteredProperties.length === 0
                    }
                    title={
                      filteredProperties.length === 0 ? "No data available" : ""
                    }
                  >
                    Next{" "}
                    <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropotiesIcal;
