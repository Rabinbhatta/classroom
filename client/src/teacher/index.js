import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import "./styles.css";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Teacher = () => {
    const navigate = useNavigate()
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
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
            const response = await fetch(`http://localhost:3001/auth/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            console.log(result)
            getClassroom()
             // Refresh teacher and student lists
        } catch (error) {
            console.error('Create User failed', error);
        }}

    const getClassroom = async () => {
        try {
            const response = await fetch(`http://localhost:3001/classroom/${userinfo.user._id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log(result);
            setClassroom(result);
            setStudents(result.students);

        } catch (error) {
            console.error('Get Classroom failed', error);
        }
    };

    const checkRole = () => {
        if (userinfo.user.role !== "Teacher") {
            navigate("/");
        }
    }


    useEffect(() => {
        checkRole()
        getClassroom();
    }, []);

    return (
        <div className='teacher-container'>
            <Navbar />
            <div className='teacher'>
                {/* Student Table */}
                <div className='table'>
                    <h1>Student List</h1>
                    <table className="teacher-student-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={index}>
                                        <td><div className='flex'>
                                                {student.name}
                                                <div className='hover' onClick={()=>handleRemove(student._id)}>
                                                   <RiDeleteBin7Fill style={{ fontSize: '20px', color: "red" }} />
                                                </div>
                                                </div></td>
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
                
                {/* Classroom Table */}
                <div className='classtable'>
                    <h1>Classroom Details</h1>
                    {classroom ? (
                        <table className="teacher-student-table">
                            <thead>
                                <tr>
                                    <th>Classroom Name</th>
                                    <th>Teacher</th>
                                    <th>Students</th>
                                    <th>Day</th>
                                    <th>Session</th>
                                    <th>Subject</th>
                                    <th>Sub-time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classroom.sessions.length > 0 ? (
                                    classroom.sessions.map((session, idx) => {
                                        const timetableEntries = classroom.timetable.filter(
                                            (t) => t.day === session.day
                                        );

                                        if (timetableEntries.length === 0) {
                                            return (
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
                                                    <td>{session.day}</td>
                                                    <td>{session.startTime} - {session.endTime}</td>
                                                    <td colSpan="2">No Class</td>
                                                </tr>
                                            );
                                        }

                                        return timetableEntries.map((timetableEntry, i) => (
                                            <tr key={`${idx}-${i}`}>
                                                {i === 0 && idx === 0 && (
                                                    <>
                                                        <td rowSpan={classroom.sessions.length}>{classroom.name}</td>
                                                        <td rowSpan={classroom.sessions.length}>{classroom.teacher?.name || "N/A"}</td>
                                                        <td rowSpan={classroom.sessions.length}>
                                                            {classroom.students.map(student => student.name).join(', ') || "N/A"}
                                                        </td>
                                                    </>
                                                )}
                                                <td>{session.day}</td>
                                                <td>{session.startTime} - {session.endTime}</td>
                                                <td>{timetableEntry.subject}</td>
                                                <td>{timetableEntry.startTime} - {timetableEntry.endTime}</td>
                                            </tr>
                                        ));
                                    })
                                ) : (
                                    <tr>
                                        <td>{classroom.name}</td>
                                        <td>{classroom.teacher?.name || "N/A"}</td>
                                        <td>{classroom.students.map(student => student.name).join(', ') || "N/A"}</td>
                                        <td colSpan="4">No Sessions</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <p>No Classroom found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Teacher;
