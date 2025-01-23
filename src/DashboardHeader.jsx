import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="bg-[#f7fbff] p-4 sm:p-6 w-full max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="text-lg sm:text-2xl text-[#25064C] font-semibold whitespace-nowrap font-[Montserrat]">
          Report Dashboard
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
 