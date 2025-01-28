import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
// import { searchFunction } from '../Entity/SearchEntity';
import axios from 'axios';
import UseListHeader from './UseListHeader';
import { handleSort } from '../utils/sorting';
import { DeleteEntity } from '../utils/Delete';
import { useLoading } from '../Context/LoadingContext';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
import { StatusEntity } from '../utils/Status';
import Table from '../common/Table';

const UserList = () => {
    const hasFetched = useRef(false);
    const [user, setuser] = useState([]);
    const [filtereduser, setFiltereduser] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { isLoading, setIsLoading } = useLoading();

    // useEffect(() => {
    //     setIsLoading(true);

    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000);

    //     return () => clearTimeout(timer);
    // }, [setIsLoading]);


    useEffect(() => {
        async function userlist() {
            setIsLoading(true)
            try {
                const response = await api.get("/users/user/getalluser");
                console.log(response.data);
                setuser(response.data);
                setFiltereduser(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching user:", error);
            }finally{
                setIsLoading(false)
            }
        }

        userlist();
    }, []);


    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = user.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFiltereduser(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filtereduser, key, sortConfig, setSortConfig, setFiltereduser)
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentuser = filtereduser.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filtereduser.length / itemsPerPage);

    // for delete
    const handledelete = async (id) => {
        try {
            const success = await DeleteEntity('UserList', id);
            if (success) {
                setuser((prevUserList) => {
                    const updatedUserList = prevUserList.filter((user) => user.id !== id);
                    setFiltereduser(updatedUserList); // Update filtered users
                    return updatedUserList;
                });
            } else {
                console.error("Failed to delete the user.");
            }
        } catch (error) {
            console.error("Error while deleting user:", error);

        }
    };

    const handleToggleChange = async (id, currentStatus, field) => {
        try {
            await StatusEntity("UserList", id, currentStatus, setFiltereduser, filtereduser, field);
        } catch (error) {
            console.error(error);
        }
    };

    const updateuser=()=>{
        
    }

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: "Image", field: "pro_pic", sortable: false, minWidth: "100px" },
        { label: "Name", field: "name", sortable: true, minWidth: "180px" },
        { label: "Email", field: "email", sortable: true, minWidth: "180px" },
        { label: "Mobile", field: "mobile", sortable: true, minWidth: "180px" },
        { label: "Gender", field: "gender", sortable: true, minWidth: "180px" },
        { label: "Join Date", field: "reg_date", sortable: true, minWidth: "180px" },
        { label: "Status", field: "status", sortable: true, minWidth: "130px" },
        { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
      ];


    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <UseListHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                    <Table
                        columns={columns}
                        data={currentuser}
                        onSort={sortData}
                        onToggleChange={handleToggleChange}
                        onUpdate={updateuser}
                        onDelete={handledelete}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                        filteredData={filtereduser}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
