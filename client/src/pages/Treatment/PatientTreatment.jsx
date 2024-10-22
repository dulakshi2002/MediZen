// src/pages/Treatment/PatientTreatment.js

import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Use this to get patient ID from Redux store

export default function PatientTreatment() {
  const currentUser = useSelector((state) => state.user.currentUser); // Ensure this points to the user object
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
  }); // State for name, age, weight, and height
  const [showPatientEditForm, setShowPatientEditForm] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const lineClampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  useEffect(() => {
    // If user is admin or doctor, no need to fetch patient data
    if (currentUser.isAdmin || currentUser.isDoctor) {
      setLoading(false);
      return;
    }

    const fetchPatientDetails = async () => {
      if (!currentUser || !currentUser._id) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/attributes/${currentUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPatientDetails(data); // Set the patient's details
        } else {
          setError(data.message || "Failed to fetch patient details");
        }
      } catch (err) {
        setError("An error occurred while fetching patient details");
      }
    };

    const fetchTreatments = async () => {
      if (!currentUser || !currentUser._id) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/treatments/${currentUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTreatments(data.treatments);
          setPatientName(data.patientName); // Set the patient username here
        } else {
          setError(data.message || "Failed to fetch treatments");
        }
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching treatments");
        setLoading(false);
      }
    };

    fetchPatientDetails();
    fetchTreatments();
  }, [currentUser]);

  const handlePatientDetailsChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleUpdatePatientDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/user/update-attributes/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: patientDetails.name,
            age: patientDetails.age,
            weight: patientDetails.weight,
            height: patientDetails.height,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setShowPatientEditForm(false);
        setPatientDetails({
          ...patientDetails,
          name: data.name,
          age: data.age,
          weight: data.weight,
          height: data.height,
        }); // Update the state with new details
      } else {
        setError(data.message || "Failed to update patient details");
      }
    } catch (err) {
      setError("An error occurred while updating patient details");
    }
  };

  const handleViewDetails = (treatment) => {
    setSelectedTreatment(treatment);
  };

  const handleCloseDetails = () => {
    setSelectedTreatment(null);
  };

  // Role-Based Access Control: Display message for Admins and Doctors
  if (currentUser.isAdmin || currentUser.isDoctor) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600">
          Patient is not available
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        My Treatments
      </h1>

      {/* Patient Details Card */}
      {!showPatientEditForm ? (
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto mb-6">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
            Patient Information
          </h2>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              Name: {patientDetails.name || "Not provided"}
            </p>
            <p>Age: {patientDetails.age || "Not provided"}</p>
            <p>
              Weight:{" "}
              {patientDetails.weight
                ? `${patientDetails.weight} kg`
                : "Not provided"}
            </p>
            <p>
              Height:{" "}
              {patientDetails.height
                ? `${patientDetails.height} cm`
                : "Not provided"}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowPatientEditForm(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Edit Patient Details
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleUpdatePatientDetails}
          className="mt-6 max-w-lg mx-auto p-4 border rounded-md bg-white shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={patientDetails.name}
              onChange={handlePatientDetailsChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {/* Display error message if any */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={patientDetails.age}
              onChange={handlePatientDetailsChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={patientDetails.weight}
              onChange={handlePatientDetailsChange}
              className="w-full p-2 border rounded-md"
              required
              min="0.5"
              max="500"
              step="0.1"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={patientDetails.height}
              onChange={handlePatientDetailsChange}
              className="w-full p-2 border rounded-md"
              required
              min="30"
              max="350"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-4"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setShowPatientEditForm(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Treatment Cards */}
      {!selectedTreatment ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {treatments.map((treatment) => (
            <div
              key={treatment._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl relative cursor-pointer"
              onClick={() => handleViewDetails(treatment)}
            >
              <h2 className="text-xl font-semibold text-blue-600">
                {treatment.treatmentName}
              </h2>
              <hr className="border-gray-300" />
              <div className="flex flex-col gap-2">
                <p className="text-md text-gray-700">
                  Doctor Name:{" "}
                  <span className="font-medium">{treatment.doctorName}</span>
                </p>
                <p className="text-md text-gray-700">
                  Prescribed Date:{" "}
                  <span className="font-medium">
                    {new Date(treatment.prescribedDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-md text-gray-700" style={lineClampStyle}>
                  Description:{" "}
                  <span className="font-medium">{treatment.description}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Detail View Form (Read-Only)
        <div className="mt-6 max-w-lg mx-auto p-4 border rounded-md bg-white shadow-lg">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
            Treatment Details
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Treatment Name
            </label>
            <input
              type="text"
              value={selectedTreatment.treatmentName}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Prescribed Date
            </label>
            <input
              type="text"
              value={new Date(
                selectedTreatment.prescribedDate
              ).toLocaleDateString()}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Doctor Name</label>
            <input
              type="text"
              value={selectedTreatment.doctorName}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={selectedTreatment.description}
              readOnly
              className="w-full p-4 border rounded-md bg-gray-200"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCloseDetails}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
