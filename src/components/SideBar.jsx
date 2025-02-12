import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { FaUser, FaLayerGroup } from "react-icons/fa";
import { MdOutlineBluetooth } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { FaRegFolder } from "react-icons/fa";
import { TiUserOutline } from "react-icons/ti";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import { CiLogout } from "react-icons/ci";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { CiWallet } from "react-icons/ci";
import { RiWallet3Line } from "react-icons/ri";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { CiImageOn } from "react-icons/ci";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { BsFileEarmarkPlus } from "react-icons/bs";
import { IoCheckboxOutline } from "react-icons/io5";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { GoHome } from "react-icons/go";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { IoLayersOutline } from "react-icons/io5";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import axios from "axios";
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import Loader from "../common/Loader";
import api from "../utils/api"

const SidebarMenu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const toggleSidebar1 = () => {
    setIsSidebarOpen(false);
  };

  const location = useLocation();

  const logout = async () => {
    setLoading(true);
    try {
      await api.post(`admin/logout`, {}, { withCredentials: true });
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error during logout:", error.response?.data || error.message);
    }
  };

  const [formData, setFormData] = useState({ weblogo: "", webname: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");

        if (response.status === 200) {
          const settingsData = response.data;
          setFormData({
            weblogo: settingsData.weblogo,
            webname: settingsData.webname
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error.response?.data || error.message);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="flex">
      {loading && <Loader />}


      {!isLargeScreen && (
        <button
          className="fixed top-4 left-4 z-50  text-[] p-2 rounded-full lg:hidden"
          onClick={toggleSidebar}
        >
          <RxHamburgerMenu size={24} />
        </button>
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white  transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 z-40 lg:relative lg:translate-x-0 lg:shadow-none`}
      >
        <Sidebar width="250px" style={{ overflowY: 'auto', height: '100vh' }}>
        <div className="h-[80px] bg-white flex justify-center items-center gap-2" style={{ border: "none" }}>
            {/* Fallback image */}
            <img
              src={formData.weblog || '/image/Frame 1984078701.png'} 
              alt="Logo"
              className="h-[40px] w-[40px]"
            />
            <div className="flex flex-col">
              {/* Fallback webname */}
              <span className="text-2xl">{formData.webname || 'SERVOSTAY'}</span>
              <span className="text-[10px] ml-2 text-slate-500 italic">A Home away from Home</span>
            </div>
          </div>

          <div style={{ overflowY: 'auto', height: 'calc(100vh - 80px)', scrollbarWidth: 'none' }}>
            <Menu iconShape="circle">
              {/* dashBoard */}
              <MenuItem icon={<DashboardCustomizeOutlinedIcon fontSize="small" />}
                active={location.pathname === "/dashboard"}
                onClick={() => {
                  navigate("/dashboard");
                  toggleSidebar1();
                }}


              >
                Dashboard
              </MenuItem>

              {/* country */}
              <SubMenu label="Country" active={location.pathname === "/add-country" || location.pathname === "/country-list"} icon={<RoomOutlinedIcon fontSize="small" />}>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/add-country");
                    toggleSidebar1();
                  }}

                >
                  Add Country
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/country-list");
                    toggleSidebar1();
                  }}

                >
                  List Countries
                </MenuItem>
              </SubMenu>

        {/* City */}
        <SubMenu label="City" active={location.pathname === "/add-city" || location.pathname === "/city-list"} icon={<LocationCityOutlinedIcon fontSize="small"  />}>
                  <MenuItem icon={<KeyboardArrowRightOutlinedIcon/>} className="sub-menu-item"
                    onClick={()=>{
                      navigate("/add-city");
                      toggleSidebar1();
                    }}
                  >
                    Add City                    
                  </MenuItem>
                  <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/city-list");
                    toggleSidebar1();
                  }}
                >
                Cities List
                </MenuItem>
        </SubMenu>

              {/* category */}
              <SubMenu label="Category" active={location.pathname === "/add-category" || location.pathname === "/category-list"} icon={<CategoryOutlinedIcon fontSize="small" />}>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/add-category");
                    toggleSidebar1();
                  }}

                >
                  Add Category
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/category-list");
                    toggleSidebar1();
                  }}

                >
                  List Categories
                </MenuItem>
              </SubMenu>

              {/* cuppon */}
              {/* <SubMenu label="Coupon" active={location.pathname === "/add-cuppon" || location.pathname === "/cuppon-list"} icon={<TbSquareRoundedPercentage />}>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/add-cuppon");
                    toggleSidebar1();
                  }}

                >
                  Add Coupon
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/cuppon-list");
                    toggleSidebar1();
                  }}

                >
                  List Coupons
                </MenuItem>
              </SubMenu> */}

              {/* payment gateway */}
              {/* <MenuItem icon={<RiWallet3Line />}
                active={location.pathname === "/payment-list"}
                onClick={() => {
                  navigate("/payment-list");
                  toggleSidebar1();
                }}
              >
                Payment Gateway
              </MenuItem> */}

              {/* propoties */}
              <SubMenu label="Properties" active={location.pathname === "/create-property" || location.pathname === "/property-list"} icon={<HomeOutlinedIcon fontSize="small" />}>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/create-property");
                    toggleSidebar1();
                  }}

                >
                  Add  Properties
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/property-list")
                    toggleSidebar1();
                  }}

                >
                  List Properties
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"

                  onClick={() => {
                    navigate("/property-ical");
                    toggleSidebar1();
                  }}

                >
                  Sync Ical Prop
                </MenuItem>
              </SubMenu>

              {/* Extra Images */}
              <SubMenu label="Extra Images" active={location.pathname === "/create-extra-image" || location.pathname === "/extra-image-list"} icon={<AddPhotoAlternateOutlinedIcon fontSize="small" />}>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/create-extra-image");
                    toggleSidebar1();
                  }}

                >
                  Add Extra Images
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/extra-image-list");
                    toggleSidebar1();
                  }}

                >
                  List Extra Images
                </MenuItem>
              </SubMenu>

              {/* Facility */}

              <SubMenu label="Facilities" active={location.pathname === "/create-facility" || location.pathname === "/facility-list"} icon={<ManageAccountsOutlinedIcon fontSize="small"/>}>

                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/create-facility");
                    toggleSidebar1();
                  }}

                >
                  Add Facility
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/facility-list");
                    toggleSidebar1();
                  }}

                >
                  List Facilities
                </MenuItem>
              </SubMenu>

              {/* Booking */}
              <SubMenu label="Booking " active={location.pathname === "/pending-book-list" || location.pathname === "/approved-book-list" || location.pathname === "/check-in-list" || location.pathname === "/completed-list" || location.pathname === "/cancelled-list"} icon={<CalendarMonthOutlinedIcon fontSize="small" />}>
                {/* Pending Booking */}
             

                {/*  Approved Booking */}
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/approved-book-list");
                    toggleSidebar1();
                  }}

                >
                  Approved
                </MenuItem>

                {/* Check In Booking */}
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/check-in-list");
                    toggleSidebar1();
                  }}

                >
                  Check-In
                </MenuItem>

                {/* Completed Booking */}
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/completed-list");
                    toggleSidebar1();
                  }}

                >
                  Completed
                </MenuItem>

                {/* Cancelled Booking */}
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"


                  onClick={() => {
                    navigate("/cancelled-list");
                    toggleSidebar1();
                  }}

                >
                  Cancelled
                </MenuItem>
              </SubMenu>

              {/* page */}
              {/* <SubMenu label="Page "  icon={<BsFileEarmarkPlus />}>
          <MenuItem icon={<KeyboardArrowRightOutlinedIcon/>} className="sub-menu-item"
            active={location.pathname === "/create-page"}
            onClick={() => navigate("/create-page")}
          >
            Add Page
          </MenuItem>
          <MenuItem icon={<KeyboardArrowRightOutlinedIcon/>} className="sub-menu-item"
            active={location.pathname === "/page-list"}
            onClick={() => navigate("/page-list")}
          >
            List Page
          </MenuItem>
        </SubMenu> */}

              {/* faq */}

              <SubMenu label="FAQ's " active={location.pathname === "/create-faq" || location.pathname === "/faq-list"} icon={<CheckBoxOutlinedIcon fontSize="small" />}>

                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"
                  // active={location.pathname === "/create-faq"}
                  onClick={() => {
                    navigate("/create-faq");
                    toggleSidebar1();
                  }}
                >
                  Add FAQ's
                </MenuItem>
                <MenuItem icon={<KeyboardArrowRightOutlinedIcon />} className="sub-menu-item"
                  // active={location.pathname === "/faq-list"}
                  onClick={() => {
                    navigate("/faq-list");
                    toggleSidebar1();
                  }}
                >
                  List FAQ's
                </MenuItem>
              </SubMenu>

              {/* userlist */}
              <MenuItem
                active={location.pathname === "/user-list"} icon={<GroupAddOutlinedIcon fontSize="small" />}
                onClick={() => {
                  navigate("/user-list");
                  toggleSidebar1();
                }}
              >
                User List
              </MenuItem>

              {/* account */}
              <MenuItem
                active={location.pathname === "/profile"} icon={<PersonOutlineOutlinedIcon  fontSize="small"/>}
                onClick={() => {
                  navigate("/profile");
                  toggleSidebar1();
                }}
              >
                Account
              </MenuItem>

              {/* admin */}
              <MenuItem
                active={location.pathname === "/admin"} icon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
                onClick={() => {
                  navigate("/admin");
                  toggleSidebar1();
                }}
              >
                Admin
              </MenuItem>

              {/* settings */}
              <MenuItem
                active={location.pathname === "/settings"} icon={<SettingsOutlinedIcon fontSize="small" />}
                onClick={() => {
                  navigate("/settings");
                  toggleSidebar1();
                }}
              >
                Settings
              </MenuItem>

              {/*  role change */}
              <MenuItem
                active={location.pathname === "/role"} icon={<MultipleStopOutlinedIcon fontSize="small" />}
                onClick={() => {
                  navigate("/role");
                  toggleSidebar1();
                }}
              >
                Role Request
              </MenuItem>

              {/* logout */}
              <MenuItem
                active={location.pathname === "/"} icon={<LogoutOutlinedIcon fontSize="small" />}
                onClick={logout}
              >
                Logout
              </MenuItem>

            </Menu>
          </div>
        </Sidebar>
      </div>

      {/* Overlay for Small Screens */}
      {!isLargeScreen && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default SidebarMenu;
