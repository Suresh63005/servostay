import React, { useEffect } from 'react';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import DashboardHeader from './DashboardHeader';
import DashboardCard from './DashboardCard';
import { useLoading } from './Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from './common/Loader';

const Dashboard = () => {
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);
  return (
    <div className="h-screen flex ">
      {isLoading && <Loader />}
      {/* Sidebar */}
      

      <div className="flex flex-1 flex-col bg-[#f7fbff] overflow-auto">
        {/* Header */}
        <Header />
        {/* dashboard header */}
        <DashboardHeader />

        {/* Cards Section */}
        <DashboardCard />
      </div>
    </div>
  );
};

export default Dashboard;
