import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../Constants';
import { useToast } from '../ContextProvider/ToastContext';
import { useUser } from '../ContextProvider/UserContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';

const Profile = () => {
  const { notify } = useToast();
  const { imageUrl, updateImage } = useUser();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)


  useEffect(()=>{
    const token = localStorage.getItem('profileDataUser');
    if(!token){
      navigate('/login')
    }
  },[navigate])



  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    dob: '',
    contact: '',
    address: '',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${backendURL}/profile`, {
          headers: {
            Authorization: localStorage.getItem('profileDataUser'),
          },
        });
  
        const user = response.data;
        setFormData({
          username: user.username || '',
          age: user.age || '',
          dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
          contact: user.contact || '',
          address: user.address || '',
          imageUrl: user.image_url || '',
          description: user.description || '',
        });
        
        // Ensure the image URL is set after setting the form data
        if (user.image_url) {
          updateImage(user.image_url)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
    // eslint-disable-next-line
  }, []);
  

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const formattedFormData = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null,
      };
  
      await axios.put(
        `${backendURL}/profile/edit`,
        formattedFormData,
        {
          headers: {
            Authorization: localStorage.getItem('profileDataUser'),
          },
        }
      );
      updateImage(formattedFormData.imageUrl);
      setIsEditing(false);
    setLoading(false)

      notify('Updated Success', 'success');
    } catch (error) {
    setLoading(false)

      console.error('Update profile error:', error);
    }
  };
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log(imageUrl)

  return (
    loading ? <Loading /> : (
      <>
    <div className="max-w-2xl mx-auto mt-8 p-8 border rounded-lg shadow-md bg-white">
      <h2 className="text-3xl font-semibold mb-6 flex items-center justify-between">
        User Profile
        {isEditing ? (
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEditClick}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
          >
            Edit
          </button>
        )}
      </h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.username}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Image URL:</label>
          {isEditing ? (
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.imageUrl}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Age:</label>
          {isEditing ? (
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.age}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth:</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.dob}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Contact:</label>
          {isEditing ? (
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.contact}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Address:</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.address}</div>
          )}
        </div>

    

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Description:</label>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-gray-800 font-medium">{formData.description}</div>
          )}
        </div>
      </form>
    </div>
    </>
    )
  );
};

export default Profile;
