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


const LayoutWithSidebar = ({ children }) => (
  <div className="h-screen flex">
    <SidebarMenu />
    <div className="flex-1">{children}</div>
  </div>
);

function App() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  return (
    <div className="App">
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Excluded routes */}
              <Route path="/" element={<Login />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/sendotp" element={<SendOTP />} />
              <Route path="/setnewpassword" element={<SetNewPassword />} />

              {/* Routes with Sidebar */}
              <Route
                path="/dashboard"
                element={
                  <LayoutWithSidebar>
                    <Dashboard />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/add-country"
                element={
                  <LayoutWithSidebar>
                    <CountryAdd />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/country-list"
                element={
                  <LayoutWithSidebar>
                    <CountryList />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/add-category"
                element={
                  <LayoutWithSidebar>
                    <CategoryAdd />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/category-list"
                element={
                  <LayoutWithSidebar>
                    <CategoryList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/add-cuppon"
                element={
                  <LayoutWithSidebar>
                    <CupponAdd />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/cuppon-list"
                element={
                  <LayoutWithSidebar>
                    <CupponList />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/payment-list"
                element={
                  <LayoutWithSidebar>
                    <PaymentGatewayList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/enquiry-list"
                element={
                  <LayoutWithSidebar>
                    <EnquiryList />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/payout-list"
                element={
                  <LayoutWithSidebar>
                    <PayOutList />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/property-list"
                element={
                  <LayoutWithSidebar>
                    <PropertiesList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-property"
                element={
                  <LayoutWithSidebar>
                    <PropertiesAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/extra-image-list"
                element={
                  <LayoutWithSidebar>
                    <ExtraImageList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-extra-image"
                element={
                  <LayoutWithSidebar>
                    <ExtraImageAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/facility-list"
                element={
                  <LayoutWithSidebar>
                    <FacilityList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-facility"
                element={
                  <LayoutWithSidebar>
                    <FacilityAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/gallery-category-list"
                element={
                  <LayoutWithSidebar>
                    <GalleryCategoryList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-gallery-category"
                element={
                  <LayoutWithSidebar>
                    <GalleryCategoryAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/gallery-list"
                element={
                  <LayoutWithSidebar>
                    <GalleryList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-gallery"
                element={
                  <LayoutWithSidebar>
                    <GalleryAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/package-list"
                element={
                  <LayoutWithSidebar>
                    <PackageList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-package"
                element={
                  <LayoutWithSidebar>
                    <PackageAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/page-list"
                element={
                  <LayoutWithSidebar>
                    <PageList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-page"
                element={
                  <LayoutWithSidebar>
                    <PageAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/role"
                element={
                  <LayoutWithSidebar>
                    {" "}
                    <RoleChange />{" "}
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/faq-list"
                element={
                  <LayoutWithSidebar>
                    <FaqList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/create-faq"
                element={
                  <LayoutWithSidebar>
                    <FaqAdd />
                  </LayoutWithSidebar>
                }
              />

              <Route
                path="/pending-book-list"
                element={
                  <LayoutWithSidebar>
                    <PendingBook />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/approved-book-list"
                element={
                  <LayoutWithSidebar>
                    <ApprovedBook />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/check-in-list"
                element={
                  <LayoutWithSidebar>
                    <CheckInBook />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/completed-list"
                element={
                  <LayoutWithSidebar>
                    <CompletedBook />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/cancelled-list"
                element={
                  <LayoutWithSidebar>
                    <CancelledBook />
                  </LayoutWithSidebar>
                }
              />

              {/* For profile and settings */}
              <Route
                path="/profile"
                element={
                  <LayoutWithSidebar>
                    <Profile />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/settings"
                element={
                  <LayoutWithSidebar>
                    <Settings />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/user-list"
                element={
                  <LayoutWithSidebar>
                    <UserList />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/admin"
                element={
                  <LayoutWithSidebar>
                    <AdminList />
                  </LayoutWithSidebar>
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
