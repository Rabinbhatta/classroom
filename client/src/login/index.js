import React from 'react';
import './styles.css';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';


const loginSchema = yup.object().shape({
  email: yup.string().email('*Invalid email').required('*Email is required'),
  password: yup.string().required('*Password is required'),
});

const initialLoginValues = {
  email: '',
  password: '',
};

const Login = () => {
  const navigate =  useNavigate()
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();
     
      localStorage.setItem("userinfo",JSON.stringify(result))
      if(result.user.role == "Principal"){
            navigate("/Principal")
      }
      if(result.user.role == "Teacher"){
            navigate("/Teacher")
      }
      if(result.user.role == "Student"){
        navigate("/Student")
  }
      
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialLoginValues}
        validationSchema={loginSchema}
      >
        {({
          values,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>
            <div className="form">
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

              <button className="login hover" type="submit" disabled={isSubmitting}>
                Login
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
