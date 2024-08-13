import React, { useState, useRef, useEffect } from 'react';
import "./styles.css";
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import Select from 'react-select';
import Navbar from '../navbar';
import { useNavigate } from 'react-router-dom';

// Example options - these would typically be fetched from your backend


const classroomSchema = yup.object().shape({
    name: yup.string().required('*Name is required'),
    teacher: yup.object().shape({
        value: yup.string().required('*Teacher is required'),
        label: yup.string().required('*Teacher is required')
    }).nullable().required('*Teacher is required'),
    students: yup.array().of(
        yup.object().shape({
            value: yup.string().required('*Student is required'),
            label: yup.string().required('*Student is required')
        })
    ).min(1, '*At least one student is required').required('*Students are required'),
    sessions: yup.array().of(
        yup.object().shape({
            startTime: yup.string().required('*Start Time is required'),
            endTime: yup.string().required('*End Time is required'),
            day: yup.string().required('*Day is required')
        })
    ).required('*Sessions are required')
});

const initialClassroomValues = {
    name: "",
    teacher: null,
    students: [],
    sessions: [
        { startTime: "", endTime: "", day: "" }
    ]
};

const customSelectStyles = {
    control: (provided) => ({
        ...provided,
        color: 'red',
        width: '58vh',
        height: '6.5vh',
        border: 'solid 2px #3E4A5F',
        outline: 'none',
        borderRadius: '10px',
        backgroundColor: '#191C23',
        padding: '5px 10px',
        fontSize: '16px',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#191C23',
        color: 'white',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#3E4A5F' : '#191C23',
        color: 'white',
        ':active': {
            backgroundColor: '#3E4A5F',
        },
    }),
};

const Classroom = () => {
    const navigate = useNavigate()
    const [teacherOptions,setTeacherOption] = useState([])
    const [studentOptions,setStudentsOption] = useState([])

    const getUser = async () => {
        try {
            const response = await fetch('https://classroom-y3rg.onrender.com/auth/getUser', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
    
            // Filter and separate data into teachers and students
            const teacherData = result.filter(user => user.role === "Teacher");
            const studentData = result.filter(user => user.role === "Student");
    
            // Map data to the format expected by react-select
            const teacherOptions = teacherData.map(teacher => ({
                value: teacher._id,
                label: teacher.name
            }));
    
            const studentOptions = studentData.map(student => ({
                value: student._id,
                label: student.name
            }));
    
            setTeacherOption(teacherOptions);
            setStudentsOption(studentOptions);
        } catch (error) {
            console.error('Get all User failed', error);
        }
    }
    

    const handleFormSubmit = async (values, { setSubmitting },) => {
        try {
            const response = await fetch('https://classroom-y3rg.onrender.com/classroom/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    teacher: values.teacher?.value,
                    students: values.students.map(student => student.value)
                }),
            });
            const result = await response.json();
            if(response.ok){
            navigate("/Principal",)
}        } catch (error) {
            console.error('Create classroom failed', error);
        } finally {
            setSubmitting(false);
        }
    };

  
    useEffect(() => {
        getUser()
    }, []);

    return (
        <>
            <Navbar />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialClassroomValues}
                validationSchema={classroomSchema}
            >
                {({
                    values,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting,
                }) => (
                    <form  onSubmit={handleSubmit} className="classroom-container">
                        <h1>Create Classroom</h1>
                        <div className="classroom">
                            <input
                                type="text"
                                name="name"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Classroom Name"
                            />
                            <Select
                                name="teacher"
                                options={teacherOptions}
                                value={values.teacher}
                                onChange={option => setFieldValue('teacher', option)}
                                placeholder="Select Teacher"
                                onBlur={handleBlur}
                                styles={customSelectStyles}
                            />
                            <Select
                                name="students"
                                options={studentOptions}
                                value={values.students}
                                onChange={option => setFieldValue('students', option)}
                                placeholder="Select Students"
                                isMulti
                                onBlur={handleBlur}
                                styles={customSelectStyles}
                            />
                            <FieldArray
                                name="sessions"
                                render={arrayHelpers => (
                                    <div>
                                        <h3>Sessions</h3>
                                        {values.sessions.map((session, index) => (
                                            <div key={index} className="session-row">
                                                <input
                                                    type="text"
                                                    name={`sessions[${index}].startTime`}
                                                    value={session.startTime}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Start Time"
                                                />
                                                <input
                                                    type="text"
                                                    name={`sessions[${index}].endTime`}
                                                    value={session.endTime}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="End Time"
                                                />
                                                <input
                                                    type="text"
                                                    name={`sessions[${index}].day`}
                                                    value={session.day}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Day"
                                                />
                                                <div>
                                                <button
                                                    type="button"
                                                    onClick={() => arrayHelpers.remove(index)}
                                                    className="remove-session"
                                                >
                                                    Remove
                                                </button>
                                                </div>
                                                
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => arrayHelpers.push({ startTime: "", endTime: "", day: "" })}
                                            className="add-session">
                                            Add Session
                                        </button>
                                    </div>
                                )}
                            />
                            <button className="login" type="submit" disabled={isSubmitting}>
                                Create
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default Classroom;
