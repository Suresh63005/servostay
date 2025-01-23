import React, { useState, useRef } from "react";

const SendOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move focus to the next input if the current is filled
      if (index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    // Perform OTP verification
    console.log("Entered OTP:", otpValue);
    // navigate to the next page if needed
  };

  return (
    <div className="h-screen grid grid-cols-2">
      {/* Left Side */}
      <div className="h-full flex flex-col items-center justify-center"  style={{ background: "linear-gradient(141.69deg, #25064C 0%, rgba(32, 40, 59, 0.6) 100%)",}} >
        <div>
          <img  src="/image/logo frame.svg"  alt="Logo"  className="w-[337px] h-[291px]"/>
        </div>
        <div className="text-center gap-5">
          <span className="dentify-logoName" style={{letterSpacing: "0.1rem" }}  >
            DENTIIFY
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-white p-6">
        <div  className="w-full max-w-md bg-white rounded-xl p-8" style={{boxShadow: `0px 2px 5px 0px #0000001A, 0px 10px 10px 0px #00000017, 0px 22px 13px 0px #0000000D, 0px 39px 15px 0px #00000003, 0px 60px 17px 0px #00000000`,  }} >
          <h2 className="auth-head" > OTP Verification </h2>
          <p  className="text-[#045D78] font-[poppins] text-[13px] float-left leading[25px] mb-[30px] mt-[5px]" > Please enter 6-digits OTP sent to your ****sk.galfar.com </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2" >
              {otp.map((data, index) => (
               
                <input  type="text"  maxLength={1}  key={index}  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  id="email"
                  required
                  className="w-[45px] me-3  px-3 py-2 border border-[#0F2047] rounded-md focus:outline-none focus:ring-2 focus:ring-[#045D78] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"
                  placeholder=" _"
                />
              ))}
            </div>

            <div>
              <button  type="submit"  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#045D78] mt-12 font-[poppins]" >Verify</button>
            </div>
            <div className="font-[poppins] text-[#045D78]">
              Didn't Get OTP?{" "}
              <span className="font-medium text-[#0F2047] mx-2"> Re-Send</span>{" "}
              <span className="font-medium text-[12px] text-[#808080]">
                00:30
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendOTP;
