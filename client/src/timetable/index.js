import React, { useState, useEffect } from 'react';
import { Formik, FieldArray, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import './styles.css';

// Validation Schema
const timetableSchema = yup.object().shape({
    timetable: yup.array().of(
        yup.object().shape({
            subject: yup.string().required('*Subject Name is required'),
            startTime: yup.string().required('*Start Time is required'),
            endTime: yup.string().required('*End Time is required'),
            day: yup.string().required('*Day is required'),
        })
    ),
});

// Initial Values
const initialTimetableValues = {
    timetable: [{ subject: '', startTime: '', endTime: '', day: '' }],
};

const Timetable = () => {
    const navigate = useNavigate();
    const [dayOptions, setDayOptions] = useState([]);
    const [classid,setClassId] = useState(null)
    const token = localStorage.getItem('userinfo');
    const userinfo = token ? JSON.parse(token) : { user: { _id: '' }, token: '' };

    const getClassroom = async () => {
        try {
            const response = await fetch(`https://classroom-y3rg.onrender.com/classroom/${userinfo.user._id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            
            setClassId(result._id)
            setDayOptions(result.sessions.map(session => session.day)); // Assuming sessions have a day field
        } catch (error) {
            console.error('Get Classroom failed', error);
        }
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        console.log(classid._id)
        try {
            const response = await fetch(`https://classroom-y3rg.onrender.com/classroom/timetable/${classid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timetable: values.timetable,
                }),
            });
            const result = await response.json();
            console.log(result);
            

            if (result) {
                navigate('/Teacher', { state: result });
            }
        } catch (error) {
            console.error('Create timetable failed', error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        getClassroom();
    }, []);

    return (
        <div>
            <Navbar />
            <Formik
                initialValues={initialTimetableValues}
                validationSchema={timetableSchema}
                onSubmit={handleFormSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="classroom-container">
                        <div className="classroom">
                            <h2>Create Timetable</h2>
                            <FieldArray
                                name="timetable"
                                render={({ remove, push }) => (
                                    <div>
                                        {values.timetable.map((_, index) => (
                                            <><div key={index} className="session-row">
                                                <Field
                                                    type="text"
                                                    name={`timetable.${index}.subject`}
                                                    placeholder="Subject Name" />
                                                <ErrorMessage name={`timetable.${index}.subject`} component="div" className="error" />
                                                <Field
                                                    type="text"
                                                    name={`timetable.${index}.startTime`}
                                                    placeholder="Start Time (HH:MM)" />
                                                <ErrorMessage name={`timetable.${index}.startTime`} component="div" className="error" />
                                                <Field
                                                    type="text"
                                                    name={`timetable.${index}.endTime`}
                                                    placeholder="End Time (HH:MM)" />
                                                <ErrorMessage name={`timetable.${index}.endTime`} component="div" className="error" />
                                                <Field as="select" name={`timetable.${index}.day`} className="day-select">
                                                    <option value="" label="Select Day" />
                                                    {dayOptions.map((day, idx) => (
                                                        <option key={idx} value={day}>
                                                            {day}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name={`timetable.${index}.day`} component="div" className="error" />

                                            </div><button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="remove-session"
                                            >
                                                    Remove
                                                </button></>
                                        ))}
                                        <div>
                                        <button
                                            type="button"
                                            onClick={() => push({ subject: '', startTime: '', endTime: '', day: '' })}
                                            className="add-session"
                                        >
                                            Add Subject
                                        </button>
                                        </div>
                                        
                                    </div>
                                )}
                            />
                            <button className="login" type="submit" disabled={isSubmitting}>
                                Create
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Timetable;
