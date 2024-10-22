import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Surgery', 'Gynecology', 'Hematology', 'Neurology',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Urology', 'Family Medicine',
    'Internal Medicine', 'Pulmonology', 'Rheumatology',
    'Anesthesiology', 'Pathology',
];

const AppointmentBooking = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [patientName, setPatientName] = useState('');
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]); // Combined error messages

    const navigate = useNavigate();

    // Fetch available doctors based on the selected date and specialization
    const fetchAvailableDoctors = async () => {
        if (!selectedDate || !selectedSpecialization) return;

        try {
            const response = await fetch(`/api/appointments/available?date=${selectedDate}&specialization=${selectedSpecialization}`);
            const data = await response.json();

            if (data.length > 0) {
                setFilteredDoctors(data);
                clearError('doctorAvailability');
            } else {
                setFilteredDoctors([]);
                addError('doctorAvailability', 'No doctors available for the selected date and specialization.');
            }
        } catch (error) {
            addError('doctorAvailability', 'Error fetching available doctors.');
        }
    };

    // Prevent selecting past dates
    const minDate = new Date().toISOString().split('T')[0];

    // Handle patient name input, allowing only letters and spaces
    const handlePatientNameChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/; // Regex to allow only letters and spaces
        if (regex.test(value)) {
            setPatientName(value); // Update state if valid
            clearError('patientName');
        } else {
            addError('patientName', 'Patient name can only contain letters and spaces.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedDoctor) {
            addError('doctor', 'Please select a doctor.');
            return;
        }
    
        const userId = currentUser._id;
        if (!userId) {
            console.error('Invalid user ID');
            return;
        }
    
        const appointmentData = {
            userId,
            doctorId: selectedDoctor,
            date: selectedDate,
            channelingCost: filteredDoctors.find(doc => doc._id === selectedDoctor)?.channelingCost,
            patientName,
        };
    
        console.log(appointmentData); // Log appointment data
    
        try {
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });
    
            const result = await response.json();
            if (result.success) {
                const selectedDoctorDetails = filteredDoctors.find((doc) => doc._id === selectedDoctor);
                setAppointmentDetails({
                    ...result.newAppointment,
                    doctorName: selectedDoctorDetails?.name,
                });
                setErrorMessages([]);
            } else {
                addError('submission', result.message);
            }
        } catch (error) {
            console.error(error); // Log the error
            addError('submission', 'Error booking appointment.');
        }
    };
    
    const addError = (field, message) => {
        setErrorMessages((prevMessages) => [...prevMessages.filter((err) => err.field !== field), { field, message }]);
    };

    const clearError = (field) => {
        setErrorMessages((prevMessages) => prevMessages.filter((err) => err.field !== field));
    };

    useEffect(() => {
        fetchAvailableDoctors();
    }, [selectedDate, selectedSpecialization]);

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-3xl font-bold text-center text-indigo-700">Book an Appointment</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                    <input
                        type="text"
                        value={patientName}
                        onChange={handlePatientNameChange} // Only allow letters
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={minDate} // Disable past dates
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <select
                        value={selectedSpecialization}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                        required
                    >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                        required
                    >
                        <option value="">Select Doctor</option>
                        {filteredDoctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                        ))}
                    </select>
                </div>

                {/* Display all error messages under the form */}
                {errorMessages.length > 0 && (
                    <div className="bg-red-100 p-4 rounded-lg mb-6">
                        {errorMessages.map((error, idx) => (
                            <p key={idx} className="text-red-500 text-sm">{error.message}</p>
                        ))}
                    </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition duration-300">
                    Book Appointment
                </button>
            </form>

            {/* Appointment Details Popup */}
            {appointmentDetails && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-indigo-700 text-center mb-4">Appointment Confirmed</h3>
                        <div className="space-y-2 text-center">
                            <p className="text-gray-700"><strong>Patient:</strong> {appointmentDetails.patientName}</p>
                            <p className="text-gray-700"><strong>Doctor:</strong> {appointmentDetails.doctorName}</p>
                            <p className="text-gray-700"><strong>Date:</strong> {new Date(appointmentDetails.date).toLocaleDateString()}</p>
                            <p className="text-gray-700"><strong>Appointment Number:</strong> {appointmentDetails.appointmentNumber}</p>
                            <p className="text-gray-700"><strong>Channeling Cost:</strong> Rs. {appointmentDetails.channelingCost}</p>
                            <p className="text-gray-700"><strong>Time:</strong> {appointmentDetails.time}</p>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setAppointmentDetails(null)}
                                className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentBooking;
