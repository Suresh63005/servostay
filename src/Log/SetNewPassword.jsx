import React from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const SetNewPassword = () => {
  return (
    <div className="h-screen grid grid-cols-2"> 
        {/* Left Side */}
        <div className="h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(141.69deg, #25064C 0%, rgba(32, 40, 59, 0.6) 100%)' }}>
            <div>
                <img src="/image/logo frame.svg" alt="" className='w-[337px] h-[291px]' />
            </div>
            <div className='text-center gap-5'>
                <span className="dentify-logoName" style={{  letterSpacing: '0.1rem' }}>
                    DENTIIFY
                </span>
            </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center bg-white p-6"> 
            <div className="w-full max-w-md bg-white rounded-xl p-8"
                style={{ boxShadow: ` 0px 2px 5px 0px #0000001A,    0px 10px 10px 0px #00000017,    0px 22px 13px 0px #0000000D,    0px 39px 15px 0px #00000003,    0px 60px 17px 0px #00000000`  }} >
                <h2 className='text-[28px] sm:leading-[44px] md:text-[36px] md:leading-[56px] lg:text-[34px] lg-leading[64px] float-left font-[poppins] whitespace-nowrap ' >Create New Password</h2>
                <p className='text-[#045D78] float-left mb-[38px] ml-[5px] mt-[10px] leading-[26px]' >set your new password here</p>
                
                <form className="space-y-4">
                    <div>
                        <input type="password" id="create_pass" className="w-full px-3 py-2 border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#045D78] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"  placeholder="Create Password"/> 
                    </div>
                    
                    <div className='flex relative'>
                        <input type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#045D78] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"  placeholder="Re-enter Password"/> <span className='mt-2 cursor-pointer absolute right-4 visibilityIcon' ><VisibilityOffOutlinedIcon fontSize='30px' /></span> 
                    </div>
                    <div>
                        <button  type="submit"  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#045D78] mt-14 font-[poppins]" >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default SetNewPassword;