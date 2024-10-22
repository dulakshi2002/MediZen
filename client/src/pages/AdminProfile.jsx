import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminProfile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.username && formData.username.length < 8) {
      newErrors.username = 'Username must be at least 8 characters long';
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

      // Redirect based on user role
      if (data.isAdmin) {
        navigate('/admin-profile');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex-1 p-8 ml-64">
        <h1 className='text-3xl font-semibold text-center mb-7'>Admin Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-lg mx-auto'>
          <input
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt='profile'
            className='h-24 w-24 self-center cursor-pointer rounded-full object-cover'
            onClick={() => fileRef.current.click()}
          />
          
          <p className='text-sm self-center'>
            {imageError ? (
              <span className='text-red-700'>
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className='text-green-700'>Image uploaded successfully</span>
            ) : (
              ''
            )}
          </p>
          
          <input
            defaultValue={currentUser.username}
            type='text'
            id='username'
            placeholder='Username'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}

          <input
            defaultValue={currentUser.email}
            type='email'
            id='email'
            placeholder='Email'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='Password'
              className='bg-slate-100 rounded-lg p-3 w-full'
              onChange={handleChange}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-3 flex items-center'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        
        <div className='flex justify-between max-w-lg mx-auto mt-5'>
          <span
            onClick={handleDeleteAccount}
            className='text-red-700 cursor-pointer'
          >
            Delete Account
          </span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>
        
        <p className='text-red-700 text-center mt-5'>{error && 'Something went wrong!'}</p>
        <p className='text-green-700 text-center mt-5'>
          {updateSuccess && 'Admin profile updated successfully!'}
        </p>
      </div>
    </div>
  );
}
