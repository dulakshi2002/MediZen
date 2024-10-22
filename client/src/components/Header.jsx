import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "./logo.png";
import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import axios for API call

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null); // State to store doctor profile
  const dropdownRef = useRef(null);

  // Fetch the doctor's profile if the current user is a doctor
  useEffect(() => {
    if (currentUser && currentUser.isDoctor) {
      const fetchDoctorProfile = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/doctors/doc/${currentUser._id}`
          );
          setDoctorProfile(response.data); // Store doctor profile information
        } catch (error) {
          console.error("Error fetching doctor profile:", error);
        }
      };
      fetchDoctorProfile();
    }
  }, [currentUser]);

  // Toggle dropdown visibility for user profile
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine the profile link based on user role and ID
  const getProfileLink = () => {
    if (currentUser.isAdmin) {
      return "/admin-profile";
    } else if (currentUser.isDoctor) {
      return `/doctor-profile/${currentUser._id}`; // Pass doctor ID for the profile link
    } else {
      return `/profile`; // Pass user ID for normal profile link
    }
  };

  // Get the profile picture for user/doctor
  const getProfilePicture = () => {
    if (currentUser.isDoctor && doctorProfile) {
      return doctorProfile.profilePicture || "/default-profile.png"; // Use doctor profile picture
    } else {
      return currentUser.profilePicture || "/default-profile.png"; // Use user profile picture
    }
  };

  return (
    <div className="bg-slate-200 z-50"> {/* Add z-index here */}
      <div className="flex justify-between items-center max-w-full mx-auto py-2 px-9 h-20"> {/* Fixed height of 20 */}
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-1">
          <Link to="/">
            <img src={logo} alt="MediZen Logo" className="h-12 md:h-16" />
          </Link>
        </div>

        {/* Right Section: Navigation Links */}
        <div className="hidden md:flex gap-3 items-center">
          <ul className="flex gap-3 items-center">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/patient-treatment">My Treatment</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>

            {currentUser ? (
              <li>
                <Link to={getProfileLink()}>
                  <img
                    src={getProfilePicture()} // Get profile picture dynamically
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/sign-in">Sign In</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Burger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {/* Mobile Menu Dropdown */}
{menuOpen && (
  <div className="md:hidden bg-slate-100 h-auto z-50">
    <ul className="flex flex-col space-y-2 p-4 items-end"> {/* Align items to the right */}
      <li>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>
      </li>
      <li>
        <Link to="/patient-treatment" onClick={() => setMenuOpen(false)}>
          My Treatment
        </Link>
      </li>
      <li>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact Us
        </Link>
      </li>

      {currentUser ? (
        <li>
          <Link to={getProfileLink()} onClick={() => setMenuOpen(false)}>
            <img
              src={getProfilePicture()} // Get profile picture dynamically
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
        </li>
      ) : (
        <li>
          <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
            Sign In
          </Link>
        </li>
      )}
    </ul>
  </div>
)}

    </div>
  );
}
