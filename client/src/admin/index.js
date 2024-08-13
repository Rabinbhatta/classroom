import React, { useEffect, useState, useRef } from 'react';
import "./styles.css";
import Navbar from '../navbar/index.js';
import { useNavigate } from 'react-router-dom';
import { FaPlusSquare } from "react-icons/fa";
import { Formik } from 'formik';
import * as yup from 'yup';
import { IoMdClose } from "react-icons/io";
import { RiDeleteBin7Fill } from "react-icons/ri";

// Validation schema for registering new users
const registerSchema = yup.object().shape({
    name: yup.string().required('*Name is required'),
    email: yup.string().email('*Invalid email').required('*Email is required'),
    password: yup.string().required('*Password is required'),
});

const initialRegisterValues = {
    name: "",
    email: '',
    password: '',
    role: ""
};

const Admin = () => {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const [role, setRole] = useState("Teacher");
    const registerRef = useRef(null);

    // State to hold teacher, student, and classroom data
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);

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
    const handleRemove = async(id)=>{
        try {
            const response = await fetch(`https://classroom-y3rg.onrender.com/auth/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            console.log(result)
            getClassroom();
            getUser(); // Refresh teacher and student lists
        } catch (error) {
            console.error('Create User failed', error);
        }
    }

    

    // Fetch teacher and student data
    const getUser = async () => {
        try {
            const response = await fetch('https://classroom-y3rg.onrender.com/auth/getUser', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();

            const teacherData = result.filter(user => user.role === "Teacher");
            const studentData = result.filter(user => user.role === "Student");

            setTeachers(teacherData);
            setStudents(studentData);
        } catch (error) {
            console.error('Get all User failed', error);
        }
    }

    // Fetch classroom data
    const getClassroom = async () => {
        try {
            const response = await fetch('https://classroom-y3rg.onrender.com/classroom/getClassroom', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log(result)
            setClassrooms(result);
        } catch (error) {
            console.error('Get all Classroom failed', error);
        }
    }

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch('https://classroom-y3rg.onrender.com/auth/createUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            getUser(); // Refresh teacher and student lists
        } catch (error) {
            console.error('Create User failed', error);
        } finally {
            setSubmitting(false);
            setIsClicked(false); // Close the form after submission
        }
    }

    // Redirect if the user is not a Principal
    const checkRole = () => {
        if (userinfo.user.role !== "Principal") {
            navigate("/");
        }
    }

    useEffect(() => {
        getClassroom();
        checkRole();
        getUser();
    }, []);

    // Handle click outside the register form to close it
    const handleClickOutside = (event) => {
        if (registerRef.current && !registerRef.current.contains(event.target)) {
            setIsClicked(false);
        }
    };

    useEffect(() => {
        if (isClicked) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isClicked]);

    return (
        <div className='admin-dashboard'>
            <Navbar/>
            <div className='main-container'>
                <div className='table-container'>
                    {/* Teacher Table */}
                    <div className='table'>
                        <h1>Teacher List</h1>
                        <table className="teacher-student-table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className='flex'>
                                            <div>Teacher</div>
                                            <div className='add-teacher'>
                                                <div className='end'>
                                                    <FaPlusSquare style={{ fontSize: '15px', color: "white" }} />
                                                </div>
                                                <button onClick={() => { setIsClicked(true); setRole("Teacher"); }}>Add Teacher</button>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.length > 0 ? (
                                    teachers.map((teacher, index) => (
                                        <tr key={index}>
                                            <td><div className='flex'>
                                                {teacher.name}
                                                <div className='hover' onClick={()=>handleRemove(teacher._id)}>
                                                    <RiDeleteBin7Fill style={{ fontSize: '20px', color: "red" }} />
                                                </div>
                                                </div></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>No Teacher</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Student Table */}
                    <div className='table'>
                        <h1>Student List</h1>
                        <table className="teacher-student-table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className='flex'>
                                            <div>Student</div>
                                            <div className='add-teacher'>
                                                <div className='end'>
                                                    <FaPlusSquare style={{ fontSize: '15px', color: "white" }} />
                                                </div>
                                                <button onClick={() => { setIsClicked(true); setRole("Student"); }}>Add Student</button>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className='flex'>
                                                {student.name}
                                                <div className='hover' onClick={()=>handleRemove(student._id)}>
                                                   <RiDeleteBin7Fill style={{ fontSize: '20px', color: "red" }} />
                                                </div>
                                                </div>
                                                
                                                </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>No Student</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     
                    
                </div>

            </div>
                            {/* Classroom Table */}
                            <div className='classtable'>
                        <h1>Classroom List</h1>
                        <table className="teacher-student-table">
                            <thead>
                                <tr>
                                    <th>Classroom Name</th>
                                    <th>Teacher</th>
                                    <th>Students</th>
                                    <th>Sessions</th>
                                </tr>
                            </thead>
                            <tbody>
    {classrooms.length > 0 ? (
        classrooms.map((classroom, index) => (
            classroom.sessions.length > 0 ? (
                classroom.sessions.map((session, idx) => (
                    <tr key={idx}>
                        {idx === 0 && (
                            <>
                                <td rowSpan={classroom.sessions.length}>{classroom.name}</td>
                                <td rowSpan={classroom.sessions.length}>{classroom.teacher?.name || "N/A"}</td>
                                <td rowSpan={classroom.sessions.length}>
                                    {classroom.students.map(student => student.name).join(', ') || "N/A"}
                                </td>
                            </>
                        )}
                        <td>
                            <strong>{session.subject}</strong> - {session.day}: {session.startTime} - {session.endTime}
                        </td>
                    </tr>
                ))
            ) : (
                <tr key={index}>
                    <td>{classroom.name}</td>
                    <td>{classroom.teacher?.name || "N/A"}</td>
                    <td>{classroom.students.map(student => student.name).join(', ') || "N/A"}</td>
                    <td>No Sessions</td>
                </tr>
            )
        ))
    ) : (
        <tr>
            <td colSpan="4">No Classroom</td>
        </tr>
    )}
</tbody>

                        </table>
                    </div>

            {/* Register Form */}
            {isClicked && (
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{ ...initialRegisterValues, role }}
                    validationSchema={registerSchema}
                >
                    {({
                        values,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form ref={registerRef} onSubmit={handleSubmit} className="register-container">
                            <div className='close' onClick={() => setIsClicked(false)}>
                                <IoMdClose style={{ fontSize: '45px', color: "red" }} />
                            </div>
                            <h1>Register</h1>
                            <div className="register">
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Name"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Email"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                                <select
                                    name="role"
                                    value={values.role}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                >
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                </select>
                                <button className="login" type="submit" disabled={isSubmitting}>
                                    Register
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            )}
        </div>
    );
}

export default Admin;
