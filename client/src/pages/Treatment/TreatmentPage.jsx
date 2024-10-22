import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Treatment() {
  const { userId } = useParams(); // Get userId from the URL
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editTreatmentId, setEditTreatmentId] = useState(null);
  const [showPatientEditForm, setShowPatientEditForm] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    treatmentName: "",
    prescribedDate: "",
    doctorName: "",
    description: "",
  });
  const [filterDate, setFilterDate] = useState(""); // Filter for prescribed date
  const [searchDoctorName, setSearchDoctorName] = useState(""); // Search for doctor name

  // State for validation errors
  const [patientErrors, setPatientErrors] = useState({});
  const [treatmentErrors, setTreatmentErrors] = useState({});

  const lineClampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await fetch(`/api/user/attributes/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPatientDetails(data);
        } else {
          setError(data.message || "Failed to fetch patient details");
        }
      } catch (err) {
        setError("An error occurred while fetching patient details");
      }
    };

    const fetchTreatments = async () => {
      try {
        const res = await fetch(`/api/treatments/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTreatments(data.treatments);
          setPatientName(data.patientName);
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
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTreatment({ ...newTreatment, [name]: value });
  };

  const handlePatientDetailsChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const validatePatientDetails = () => {
    const errors = {};
    const age = parseInt(patientDetails.age, 10);
    const weight = parseFloat(patientDetails.weight);
    const height = parseFloat(patientDetails.height);

    if (!patientDetails.name) {
      errors.name = "Name is required.";
    }
    if (!age || age < 1 || age > 120) {
      errors.age = "Age must be between 1 and 120.";
    }
    if (!weight || weight < 0.5 || weight > 500) {
      errors.weight = "Weight must be between 0.5 kg and 500 kg.";
    }
    if (!height || height < 30 || height > 350) {
      errors.height = "Height must be between 30 cm and 350 cm.";
    }

    setPatientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTreatmentDetails = () => {
    const errors = {};
    const today = new Date();
    const prescribedDate = new Date(newTreatment.prescribedDate);

    if (!newTreatment.treatmentName) {
      errors.treatmentName = "Treatment Name is required.";
    }
    if (!newTreatment.prescribedDate) {
      errors.prescribedDate = "Prescribed Date is required.";
    } else if (prescribedDate < today) {
      errors.prescribedDate = "Prescribed Date cannot be in the past.";
    }
    if (!newTreatment.doctorName) {
      errors.doctorName = "Doctor Name is required.";
    }
    if (!newTreatment.description) {
      errors.description = "Description is required.";
    }

    setTreatmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdateTreatment = async (e) => {
    e.preventDefault();

    // Validate treatment details
    if (!validateTreatmentDetails()) {
      return;
    }

    try {
      const method = editTreatmentId ? "PUT" : "POST";
      const endpoint = editTreatmentId
        ? `/api/treatments/update/${editTreatmentId}`
        : "/api/treatments/add";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTreatment,
          patientId: userId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (editTreatmentId) {
          setTreatments((prev) =>
            prev.map((treatment) =>
              treatment._id === editTreatmentId ? data.treatment : treatment
            )
          );
        } else {
          setTreatments((prevTreatments) => [
            data.treatment,
            ...prevTreatments,
          ]);
        }
        setNewTreatment({
          treatmentName: "",
          prescribedDate: "",
          doctorName: "",
          description: "",
        });
        setShowForm(false);
        setEditTreatmentId(null);
      } else {
        setError(data.message || "Failed to add or update treatment");
      }
    } catch (err) {
      setError("An error occurred while adding or updating treatment");
    }
  };

  const handleUpdatePatientDetails = async (e) => {
    e.preventDefault();

    // Validate patient details
    if (!validatePatientDetails()) {
      return;
    }

    try {
      const res = await fetch(`/api/user/update-attributes/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientDetails),
      });

      const data = await res.json();
      if (res.ok) {
        setShowPatientEditForm(false);
        setPatientDetails(data);
      } else {
        setError(data.message || "Failed to update patient details");
      }
    } catch (err) {
      setError("An error occurred while updating patient details");
    }
  };

  const handleEditTreatment = (treatment) => {
    setNewTreatment({
      treatmentName: treatment.treatmentName,
      prescribedDate: treatment.prescribedDate.slice(0, 10),
      doctorName: treatment.doctorName,
      description: treatment.description,
    });
    setEditTreatmentId(treatment._id);
    setShowForm(true);
  };

  const handleDeleteTreatment = async (treatmentId) => {
    if (!window.confirm("Are you sure you want to delete this treatment?")) {
      return;
    }

    try {
      const res = await fetch(`/api/treatments/delete/${treatmentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTreatments((prev) =>
          prev.filter((treatment) => treatment._id !== treatmentId)
        );
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete treatment");
      }
    } catch (err) {
      setError("An error occurred while deleting treatment");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditTreatmentId(null);
    setShowPatientEditForm(false);
    setNewTreatment({
      treatmentName: "",
      prescribedDate: "",
      doctorName: "",
      description: "",
    });
    setPatientErrors({});
    setTreatmentErrors({});
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Filtered treatments based on the date and doctor name
  const filteredTreatments = treatments.filter((treatment) => {
    const matchesDate = filterDate
      ? treatment.prescribedDate.slice(0, 10) === filterDate
      : true;
    const matchesDoctor = treatment.doctorName
      .toLowerCase()
      .includes(searchDoctorName.toLowerCase());
    return matchesDate && matchesDoctor;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        {showForm
          ? editTreatmentId
            ? "Edit Treatment"
            : "Add New Treatment"
          : "Patient Treatments"}
      </h1>

      {!showForm && !showPatientEditForm ? (
        <>
          {/* Patient Details Card */}
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

          {/* Add New Treatment Button */}
          <div className="flex justify-center mb-6 max-w-lg mx-auto">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Add New Treatment
            </button>
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">
                Filter by Prescribed Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">
                Search by Doctor Name
              </label>
              <input
                type="text"
                placeholder="Enter doctor's name"
                value={searchDoctorName}
                onChange={(e) => setSearchDoctorName(e.target.value)}
                className="p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Treatment Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTreatments.map((treatment) => (
              <div
                key={treatment._id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl relative"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <i
                    className="ri-pencil-line cursor-pointer text-blue-500"
                    onClick={() => handleEditTreatment(treatment)}
                  ></i>
                  <i
                    className="ri-delete-bin-line cursor-pointer text-red-500"
                    onClick={() => handleDeleteTreatment(treatment._id)}
                  ></i>
                </div>
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
        </>
      ) : showPatientEditForm ? (
        /* Edit Patient Details Form */
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
            {patientErrors.name && (
              <p className="text-red-500 text-sm">{patientErrors.name}</p>
            )}
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
            {patientErrors.age && (
              <p className="text-red-500 text-sm">{patientErrors.age}</p>
            )}
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
            />
            {patientErrors.weight && (
              <p className="text-red-500 text-sm">{patientErrors.weight}</p>
            )}
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
            />
            {patientErrors.height && (
              <p className="text-red-500 text-sm">{patientErrors.height}</p>
            )}
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
      ) : (
        /* Add or Edit Treatment Form */
        <form
          onSubmit={handleAddOrUpdateTreatment}
          className="mt-6 max-w-lg mx-auto p-4 border rounded-md bg-white shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Treatment Name
            </label>
            <input
              type="text"
              name="treatmentName"
              value={newTreatment.treatmentName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {treatmentErrors.treatmentName && (
              <p className="text-red-500 text-sm">
                {treatmentErrors.treatmentName}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Prescribed Date
            </label>
            <input
              type="date"
              name="prescribedDate"
              value={newTreatment.prescribedDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {treatmentErrors.prescribedDate && (
              <p className="text-red-500 text-sm">
                {treatmentErrors.prescribedDate}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              value={newTreatment.doctorName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {treatmentErrors.doctorName && (
              <p className="text-red-500 text-sm">
                {treatmentErrors.doctorName}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={newTreatment.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {treatmentErrors.description && (
              <p className="text-red-500 text-sm">
                {treatmentErrors.description}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-4"
            >
              {editTreatmentId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => {
                handleCancel();
              }}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
