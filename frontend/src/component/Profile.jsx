import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import img from "../assets/youtube.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { SiYoutubestudio } from "react-icons/si";

const Profile = () => {
 const navigate = useNavigate()
 const {userData} = useSelector(state=>state.user)
 const dispatch = useDispatch()
  const handleSignOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/signout" , {withCredentials:true})
            console.log(result.data)
            dispatch(setUserData(null))
            showCustomAlert("Signout Successfully")


        } catch (error) {
            console.log(error)
            showCustomAlert(error.response.data.message)

        }
    }
   const googleSignIn = async () => {
      try {
        const response = await signInWithPopup(auth,provider)
       console.log(response)
        let user = response.user
        let username = user.displayName
        let email = user.email
        let photoUrl = user.photoURL
        
        const result = await axios.post(serverUrl + "/api/auth/google-auth" , {username , email ,photoUrl} , {withCredentials:true})
        dispatch(setUserData(result.data))

            navigate("/")
            showCustomAlert("SignIn with Google Successfully")
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        showCustomAlert(error?.response?.data?.message || error?.message || "SignIn with Google Error");
      }
    }

  return (
    <div >
     

      {/* Dropdown Menu */}
      <div className="fixed md:absolute right-4 top-14 w-80 bg-[#282828] text-[#f1f1f1] rounded-2xl shadow-2xl border border-[#3e3e3e] z-50 overflow-hidden py-2 animate-in fade-in duration-150">
        {/* Profile Info */}
        {userData && (
          <div className="flex items-start gap-3.5 p-4 border-b border-[#3e3e3e]">
            <img
              src={userData?.photoUrl || img}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-[#444] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-[15px] truncate">
                {userData?.username}
              </h4>
              <p className="text-xs text-[#aaaaaa] truncate mt-0.5">
                {userData?.email}
              </p>
              <button
                type="button"
                className="text-xs text-[#3ea6ff] hover:underline font-medium mt-1.5 cursor-pointer block text-left"
                onClick={() => {
                  if (userData?.channel) {
                    navigate("/viewchannel");
                  } else {
                    navigate("/createchannel");
                  }
                }}
              >
                {userData?.channel ? "View channel" : "Create a channel"}
              </button>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col py-1.5">
          <button
            className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-[#383838] transition-colors text-sm font-normal text-[#f1f1f1] cursor-pointer text-left w-full"
            onClick={googleSignIn}
          >
            <FcGoogle className="text-xl flex-shrink-0" />
            <span>Sign in with Google</span>
          </button>

          <button
            className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-[#383838] transition-colors text-sm font-normal text-[#f1f1f1] cursor-pointer text-left w-full"
            onClick={() => navigate("/signup")}
          >
            <TiUserAddOutline className="text-xl flex-shrink-0 text-gray-300" />
            <span>Create new account</span>
          </button>

          <button
            className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-[#383838] transition-colors text-sm font-normal text-[#f1f1f1] cursor-pointer text-left w-full"
            onClick={() => navigate("/signin")}
          >
            <MdOutlineSwitchAccount className="text-xl flex-shrink-0 text-gray-300" />
            <span>Sign in with email/password</span>
          </button>

          {userData?.channel && (
            <button
              className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-[#383838] transition-colors text-sm font-normal text-[#f1f1f1] cursor-pointer text-left w-full border-t border-[#3e3e3e] mt-1 pt-2.5"
              onClick={() => navigate("/ptstudio/dashboard")}
            >
              <SiYoutubestudio className="text-xl text-[#ff4e45] flex-shrink-0" />
              <span>YouTube Studio</span>
            </button>
          )}

          {userData && (
            <button
              className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-[#383838] transition-colors text-sm font-normal text-[#f1f1f1] cursor-pointer text-left w-full border-t border-[#3e3e3e] mt-1 pt-2.5"
              onClick={handleSignOut}
            >
              <FiLogOut className="text-xl flex-shrink-0 text-gray-300" />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
