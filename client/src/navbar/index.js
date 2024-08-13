import React, { useState, useRef, useEffect } from 'react';
import "./styles.css";
import { FaPlusSquare } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
   
    
    const navigate = useNavigate()
    const token = localStorage.getItem("userinfo");
    const userinfo = token ? JSON.parse(token) : {
        user: {
            _id: "",
            name: "",
            email: "",
            password: "",
            role: ""
        },
        token: ""
    };


    const [admin,setAdmin] = useState(()=>{
        if(userinfo.user.role == "Principal"){
            return "Principal"
        }else if(userinfo.user.role == "Teacher") {
            return "Teacher"
        }
    })

    const handleLogout = ()=>{
        localStorage.removeItem("userinfo")
        navigate("/")
    }

    return (
        <div className='navbar-container'>
            <div className='userinfo' >
                <div>{userinfo.user.name} - {userinfo.user.role}</div>
                <div className='hover' onClick={()=>navigate(`/${userinfo.user.role}`)}>Home</div>
            </div>
            <div className='end'>
            { admin=="Principal" && <div className='end icon hover'>
                     <div>
                        <FaPlusSquare style={{ fontSize: '20px', color: "white" }} />
                    </div><button className='hover' onClick={() => navigate("/Classroom")}>Create a classroom</button>
                </div> || admin=="Teacher" &&  <div className='end icon hover'>
                     <div>
                        <FaPlusSquare style={{ fontSize: '20px', color: "white" }} />
                    </div><button className='hover' onClick={() => navigate("/Timetable")}>Create a timetable</button>
                </div> }
                <div className='end icon hover'>
                    <div>
                        <IoLogOut style={{ fontSize: '25px', color: "white" }} />
                    </div>
                    <button className='hover' onClick={handleLogout}>LogOut</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
