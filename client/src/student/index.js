import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import "./styles.css";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Student = () => {
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
    

    const getClassroom = async () => {
        try {
            const response = await fetch(`https://classroom-y3rg.onrender.com/classroom/student/${userinfo.user._id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log(result);
            if(response.ok){
                console.log("done")
                setClassroom(result);
                setStudents(result.students);
            }
            

        } catch (error) {
            console.error('Get Classroom failed', error);
        }
    };

    const checkRole = () => {
        if (userinfo.user.role !== "Student") {
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
                    <h1>Classmate</h1>
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
                        <h1>No Classroom found.</h1>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Student;
