import React, { useState } from 'react';
import axios from 'axios';
import { backendURL } from '../../Constants';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Components/Loading';
import { useToast } from '../../ContextProvider/ToastContext';

const Signup = () => {
    const initialForm = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
    const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false)
  const { notify } = useToast();


    const navigate = useNavigate();

    const handleSignup = async (e) => {
        setLoading(true)
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            console.error('Passwords do not match');
            notify('Password does not match', 'success')
            return;
        }

        try {
            await axios.post(`${backendURL}/auth/signup`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            // Redirect to the login page after successful signup
            setFormData(initialForm);
            setLoading(false)
            setTimeout(() => {
                notify('User has been Created', 'success')
            }, 600);
            navigate('/login');

        } catch (error) {
            setLoading(false)
            notify('something went wrong!!', 'success')
            console.error('Signup error:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        loading ? <Loading /> : (
        <div>
            <form onSubmit={handleSignup}>

                <div className="container px-5 py-24 mx-auto flex ">
    <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col mx-auto w-full mt-10 md:mt-0 shadow-2xl">
      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font text-center">Signup</h2>

      <div className="relative mb-4">
        <label htmlFor="username" className="leading-7 text-sm text-gray-600">Full Name: </label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required/>
      </div>

      <div className="relative mb-4">

        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required/>
      </div>

    

      <div className="relative mb-4">
        <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required/>
      </div>

      <div className="relative mb-4">
        <label htmlFor="confirmPassword" className="leading-7 text-sm text-gray-600">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required/>
      </div>

      <button type="submit" className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Sign In</button>
      
    </div>
  </div>
            </form>
        </div>
        )
    );

};

export default Signup;
