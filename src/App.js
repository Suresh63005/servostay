import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Log/Login.jsx";
import ForgotPassword from "./Log/ForgotPassword.jsx";
import SetNewPassword from "./Log/SetNewPassword.jsx";
import SendOTP from "./Log/SendOTP.jsx";
import Dashboard from "./Dashboard.jsx";
import CountryAdd from "./Country/CountryAdd.jsx";
import CountryList from "./Country/CountryList.jsx";
import CategoryAdd from "./Category/CategoryAdd.jsx";
import CategoryList from "./Category/CategoryList.jsx";
import CupponAdd from "./Cuppon/CupponAdd.jsx";
import CupponList from "./Cuppon/CupponList.jsx";
import Profile from "./Account/Profile.jsx";
import PaymentGatewayList from "./PaymentGateway/PaymentGatewayList.jsx";
import EnquiryList from "./Enquiry/EnquiryList.jsx";
import PayOutList from "./PayOut/PayOutList.jsx";
import PropertiesList from "./Propoties/PropertiesList.jsx";
import PropertiesAdd from "./Propoties/PropertiesAdd.jsx";
import ExtraImageList from "./ExtraImage/ExtraImageList.jsx";
import ExtraImageAdd from "./ExtraImage/ExetraImageAdd.jsx";
import FacilityList from "./Facility/FacilityList.jsx";
import FacilityAdd from "./Facility/FacilityAdd.jsx";
import GalleryCategoryList from "./GalleryCategory/GalleryCategoryList.jsx";
import GalleryCategoryAdd from "./GalleryCategory/GalleryCategoryAdd.jsx";
import GalleryList from "./Gallery/GalleryList.jsx";
import GalleryAdd from "./Gallery/GalleryAdd.jsx";
import PackageList from "./Package/PackageList.jsx";
import PackageAdd from "./Package/PackageAdd.jsx";
import PendingBook from "./Booking/PendingBook.jsx";
import Settings from "./Setting/Settings.jsx";
import ApprovedBook from "./Booking/ApprovedBook.jsx";
import CheckInBook from "./Booking/CheckInBook.jsx";
import CompletedBook from "./Booking/CompletedBook.jsx";
import CancelledBook from "./Booking/CancelledBook.jsx";
import UserList from "./UserList/UserList.jsx";
import PageList from "./Page/PageList.jsx";
import PageAdd from "./Page/PageAdd.jsx";
import FaqList from "./Faq/FaqList.jsx";
import FaqAdd from "./Faq/FaqAdd.jsx";
import SidebarMenu from "./components/SideBar.jsx";
import NotFound from "./NotFound.jsx";
import { AuthProvider } from "./Context/AuthContext.js";
import PrivateRoute from "./Context/PrivateRoute.js";
import RoleChange from "./Roles/RoleChange.jsx";
import AdminList from "./Admin/AdminList.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import ProtectedRoute from "./ProtectedRoute.js";
import ProductTable from "./common/ProductTable.js";
import UserTable from "./common/UserTable.js";
import CityAdd from "./City/CityAdd.jsx";
import CityList from "./City/CityList.jsx";
import PropotiesIcal from "./Propoties/PropertiesIcal.jsx";


const LayoutWithSidebar = ({ children }) => (
  <div className="h-screen flex">
    <SidebarMenu />
    <div className="flex-1">{children}</div>
  </div>
);

function App() {
  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker
  //     .register("/firebase-messaging-sw.js")
  //     .then((registration) => {
  //       console.log("Service Worker registered:", registration);
  //     })
  //     .catch((error) => {
  //       console.error("Service Worker registration failed:", error);
  //     });
  // }

  return (
    <div className="App">
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>

              {/* Excluded routes */}
              <Route path="/" element={<Login />} />
              <Route path="/pp" element={<ProductTable />} />
              <Route path="/ppp" element={<UserTable />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/sendotp" element={<SendOTP />} />
              <Route path="/setnewpassword" element={<SetNewPassword />} />

              {/* Routes with Sidebar */}
              <Route  path="/dashboard"  element={<ProtectedRoute> <LayoutWithSidebar> <Dashboard /> </LayoutWithSidebar> </ProtectedRoute> }/>
              <Route
                path="/add-country"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CountryAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/country-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CountryList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-category"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CategoryAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CategoryList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-city"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CityAdd/>
                  </LayoutWithSidebar>
                </ProtectedRoute>}
              />
              <Route
                path="/city-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CityList/>
                  </LayoutWithSidebar>
                </ProtectedRoute>}
              />
              <Route
                path="/add-cuppon"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CupponAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cuppon-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CupponList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PaymentGatewayList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enquiry-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <EnquiryList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payout-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PayOutList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/property-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PropertiesList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property-ical"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PropotiesIcal />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-property"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PropertiesAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/extra-image-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <ExtraImageList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-extra-image"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <ExtraImageAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/facility-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <FacilityList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-facility"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <FacilityAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/gallery-category-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <GalleryCategoryList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-gallery-category"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <GalleryCategoryAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/gallery-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <GalleryList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-gallery"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <GalleryAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/package-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PackageList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-package"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PackageAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/page-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PageList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-page"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PageAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/role"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    {" "}
                    <RoleChange />{" "}
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/faq-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <FaqList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-faq"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <FaqAdd />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pending-book-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <PendingBook />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approved-book-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <ApprovedBook />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/check-in-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CheckInBook />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/completed-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CompletedBook />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cancelled-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <CancelledBook />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />

              {/* For profile and settings */}
              <Route
                path="/profile"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <Profile />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <Settings />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-list"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <UserList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={<ProtectedRoute>
                  <LayoutWithSidebar>
                    <AdminList />
                  </LayoutWithSidebar>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
