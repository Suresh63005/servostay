import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiUsersBold } from "react-icons/pi";
import { LuCheckSquare } from "react-icons/lu";
import { BsCheck2Circle } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineCalendarToday } from "react-icons/md";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axios from "axios";
import api from "./utils/api";
import { BeatLoader } from "react-spinners";
import CountUp from "react-countup"; // Import CountUp

const DashboardCard = () => {
    const [dataCounts, setDataCounts] = useState(null); // Initially null to track loading state
    const [isLoading, setIsLoading] = useState(true);

    const endpoints = [
        { key: "countryCount", url: "/countries/count" },
        { key: "categoryCount", url: "/categories/count" },
        { key: "couponCount", url: "/coupons/count" },
        { key: "paymentCount", url: "/payment-methods/count" },
        { key: "propertyCount", url: "/properties/count" },
        { key: "facilityCount", url: "/facilities/count" },
        { key: "bookedCount", url: "/bookings/count?status=Booked" },
        { key: "confirmedCount", url: "/bookings/count?status=Confirmed" },
        { key: "checkInCount", url: "/bookings/count?status=Check_in" },
        { key: "completedCount", url: "/bookings/count?status=Completed" },
        { key: "extraImagesCount", url: "/extra/count" },
        { key: "usersCount", url: "/users/user/count" },
    ];

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const requests = endpoints.map(endpoint => api.get(endpoint.url));
                const responses = await Promise.all(requests);
                const counts = responses.reduce((acc, response, index) => {
                    acc[endpoints[index].key] = response.data.count || 0;
                    return acc;
                }, {});
                setDataCounts(counts);
            } catch (error) {
                console.error("Error fetching counts:", error);
            } finally {
                setIsLoading(false); // Ensure loading state is set to false once complete
            }
        };
        fetchCounts();
    }, []);

    const cards = [
        {
            card_logoIcon: <IoLocationOutline className="text-[#045D78] text-[25px]" />,
            card_title: "Countries",
            card_desc: "Number of countries",
            card_data_key: "countryCount",
        },
        {
            card_logoIcon: <GiHamburgerMenu className="text-[#045D78] text-[25px]" />,
            card_title: "Categories",
            card_desc: "Number of Categories",
            card_data_key: "categoryCount",
        },
        {
            card_logoIcon: <CardGiftcardOutlinedIcon className="text-[#045D78] text-[25px]" />,
            card_title: "Coupons",
            card_desc: "Number of Coupons",
            card_data_key: "couponCount",
        },
        {
            card_logoIcon: <CurrencyRupeeIcon className="text-[#045D78] text-[25px]" />,
            card_title: "Payment Methods",
            card_desc: "Number of Payment Methods",
            card_data_key: "paymentCount",
        },
        {
            card_logoIcon: <HomeOutlinedIcon className="text-[#045D78] text-[25px]" />,
            card_title: "Properties",
            card_desc: "Number of Properties",
            card_data_key: "propertyCount",
        },
        {
            card_logoIcon: <ManageAccountsOutlinedIcon className="text-[#045D78] text-[25px]" />,
            card_title: "Facilities",
            card_desc: "Number of Facilities",
            card_data_key: "facilityCount",
        },
        {
            card_logoIcon: <MdOutlineCalendarToday className="text-[#045D78] text-[25px]" />,
            card_title: "Bookings",
            card_desc: "Number of Bookings",
            card_data_key: "bookedCount",
        },
        {
            card_logoIcon: <LuCheckSquare className="text-[#045D78] text-[25px]" />,
            card_title: "Confirmed Bookings",
            card_desc: "Number of Confirmed Bookings",
            card_data_key: "confirmedCount",
        },
        {
            card_logoIcon: <IoEyeOutline className="text-[#045D78] text-[25px]" />,
            card_title: "Check-In",
            card_desc: "Number of Check-In",
            card_data_key: "checkInCount",
        },
        {
            card_logoIcon: <BsCheck2Circle className="text-[#045D78] text-[25px]" />,
            card_title: "Completed Bookings",
            card_desc: "Number of Completed Bookings",
            card_data_key: "completedCount",
        },
        {
            card_logoIcon: <PermMediaOutlinedIcon className="text-[#045D78] text-[25px]" />,
            card_title: "Extra Images",
            card_desc: "Number of Extra Images",
            card_data_key: "extraImagesCount",
        },
        {
            card_logoIcon: <PiUsersBold className="text-[#045D78] text-[25px]" />,
            card_title: "Users",
            card_desc: "Number of Users",
            card_data_key: "usersCount",
        },
    ];

    return (
        <div className="overflow-auto scrollbar-none">
            <div className="py-1 px-3 overflow-x-auto scrollbar-none">
                <div className="relative sm:rounded-lg">
                    <div className="px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-1 flex items-center gap-4 max-w-xs w-full"
                                >
                                    <div className="bg-[#F2F6FE] p-3 rounded-lg flex items-center justify-center w-[40%] h-[100%]">
                                        {card.card_logoIcon}
                                    </div>
                                    <div>
                                        <div className="text-[28px] mt-2 font-bold text-[#045D78] ">
                                            {isLoading ? (
                                                <BeatLoader size={5} color="#045D78" />
                                            ) : (
                                                <CountUp
                                                    start={0}
                                                    end={dataCounts?.[card.card_data_key] ?? 0}
                                                    duration={10}
                                                    separator=","
                                                />
                                            )}
                                        </div>
                                        <h4 className="text-[15px] font-bold uppercase text-[#555456] leading-none">
                                            {card.card_title}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
