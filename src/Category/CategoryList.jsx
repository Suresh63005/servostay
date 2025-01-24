import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidebarMenu from "../components/SideBar";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { FaPen, FaTrash } from "react-icons/fa";
import CategoryHeader from "./CategoryHeader";
import axios from "axios";
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { DeleteEntity } from '../utils/Delete';
import { handleSort } from "../utils/sorting";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { StatusEntity } from "../utils/Status";
import api from "../utils/api";
import Table from "../common/Table";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true)
      try {
        const response = await api.get("/categories/all");

        console.log("Fetched categories:", response.data);
        setCategories(response.data);
        setFilteredCategories(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }finally{
        setIsLoading(false)
      }
    }
    fetchCategories();
  }, []);



  // Handle search
  // Search functionality
  const handleSearch = (event) => {
    const querySearch = event.target.value.toLowerCase();
    const filteredData = categories.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'object' && value !== null
          ? Object.values(value).some(nestedValue =>
            String(nestedValue).toLowerCase().includes(querySearch)
          )
          : String(value).toLowerCase().includes(querySearch)
      )
    );
    setFilteredCategories(filteredData);
    setCurrentPage(1);
  };

  // Handle sorting
  const sortData = (key) => {
    handleSort(filteredCategories, key, sortConfig, setSortConfig, setFilteredCategories);
  };

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handledelete = async (id) => {
    const success = await DeleteEntity('Category', id);
    if (success) {
      const updatedCategories = categories.filter((category) => category.id !== id);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
  };

  // for update 
  const updateCategory = (id) => {
    navigate('/add-category', { state: { id: id } })
  };

  const handleToggleChange = async (id, currentStatus, field) => {
    try {
      await StatusEntity("Category", id, currentStatus, setFilteredCategories, filteredCategories, field);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
    { label: "Category Image", field: "img", sortable: false, minWidth: "100px" },
    { label: "Category Title", field: "title", sortable: true, minWidth: "180px" },
    { label: "Status", field: "status", sortable: true, minWidth: "100px" },
    { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
  ];
  return (
    <div>
      {/* {isLoading && <Loader />} */}
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="flex flex-1 flex-col bg-[#f7fbff]">
          {/* Header */}
          <Header />
          {/* Searching, sorting, and main content area */}
          <CategoryHeader onSearch={handleSearch} />
          {/* Card */}
          <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
          <Table
              columns={columns}
              data={currentCategories}
              onSort={sortData}
              onToggleChange={handleToggleChange}
              onUpdate={updateCategory}
              onDelete={handledelete}
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              filteredData={filteredCategories}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CategoryList;
