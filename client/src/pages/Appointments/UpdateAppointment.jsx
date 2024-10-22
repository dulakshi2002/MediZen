import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Surgery', 'Gynecology', 'Hematology', 'Neurology',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Urology', 'Family Medicine',
    'Internal Medicine', 'Pulmonology', 'Rheumatology',
    'Anesthesiology', 'Pathology',
];

const UpdateAppointment = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [availableAppointments, setAvailableAppointments] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    // Fetch available doctors based on selected date and specialization
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

    // Check doctor's availability on the selected day
    const checkDoctorAvailability = async () => {
        if (!selectedDoctor || !selectedDate) return;

        try {
            const response = await fetch(`/api/appointments/doctor/${selectedDoctor}?date=${selectedDate}`);
            const appointments = await response.json();
            const doctor = filteredDoctors.find((doc) => doc._id === selectedDoctor);

            const selectedDay = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });

            // Check if doctor is available on the selected day
            const isAvailable = doctor.timeRanges.some((range) => range.day === selectedDay);

            if (!isAvailable) {
                setAvailableAppointments(0); // Doctor not available on selected day
                addError('doctorAvailability', `Doctor is not available on ${selectedDay}.`);
                return;
            }

            // Check if the doctor is fully booked for the selected date
            // if (appointments.length >= doctor.maxAppointmentsPerDay) {
            //     setAvailableAppointments(0);
            //     addError('doctorAvailability', 'The doctor is fully booked on the selected date.');
            // } else {
            //     setAvailableAppointments(doctor.maxAppointmentsPerDay - appointments.length);
            //     clearError('doctorAvailability');
            // }
        } catch (error) {
            addError('doctorAvailability', 'Error checking doctor availability.');
        }
    };

    // Fetch available doctors when date or specialization changes
    useEffect(() => {
        fetchAvailableDoctors();
    }, [selectedDate, selectedSpecialization]);

    // Check doctor's availability when doctor or date changes
    useEffect(() => {
        checkDoctorAvailability();
    }, [selectedDoctor, selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor) {
            addError('doctor', 'Please select a doctor.');
            return;
        }

        const appointmentData = {
            userId: currentUser._id,
            doctorId: selectedDoctor,
            date: selectedDate,
            channelingCost: filteredDoctors.find(doc => doc._id === selectedDoctor)?.channelingCost,
        };

        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            const result = await response.json();
            if (result.success) {
                navigate('/appointments/my');
            } else {
                addError('submission', result.message);
            }
        } catch (error) {
            addError('submission', 'Error updating appointment.');
        }
    };

    const addError = (field, message) => {
        setErrorMessages((prevMessages) => [...prevMessages.filter((err) => err.field !== field), { field, message }]);
    };

    const clearError = (field) => {
        setErrorMessages((prevMessages) => prevMessages.filter((err) => err.field !== field));
    };

    // Disable past dates in the date picker
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-3xl font-bold text-center text-indigo-700">Update Appointment</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={minDate}
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
                        {specializations.map(spec => (
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

                {availableAppointments !== null && availableAppointments > 0 && (
                    <p className="text-sm text-green-600 mb-6">
                        {availableAppointments} appointment slots remaining for the selected date.
                    </p>
                )}

                {errorMessages.length > 0 && (
                    <div className="bg-red-100 p-4 rounded-lg mb-6">
                        {errorMessages.map((error, idx) => (
                            <p key={idx} className="text-red-500 text-sm">{error.message}</p>
                        ))}
                    </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition duration-300">
                    Update Appointment
                </button>
            </form>
        </div>
    );
};

export default UpdateAppointment;
