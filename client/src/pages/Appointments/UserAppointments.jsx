import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser ? currentUser._id : null;

    // Fetch user appointments
    const fetchUserAppointments = async () => {
        if (!userId) {
            setErrorMessage('User not logged in');
            return;
        }

        const response = await fetch(`/api/appointments/user/${userId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                setAppointments(data);
            } else {
                setErrorMessage('No appointments found.');
            }
        } else {
            setErrorMessage('Error fetching appointments.');
        }
    };

    useEffect(() => {
        fetchUserAppointments();
    }, [userId]);

    const handleCancel = async (id) => {
        const response = await fetch(`/api/appointments/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setAppointments(appointments.filter(appointment => appointment._id !== id));
        } else {
            setErrorMessage('Error canceling appointment.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">My Appointments</h2>
            {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-indigo-700 text-white">
                            <th className="py-4 px-6 text-left text-sm font-semibold tracking-wider">Appointment Number</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold tracking-wider">Patient Name</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold tracking-wider">Doctor</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold tracking-wider">Specialization</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold tracking-wider">Date</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold tracking-wider">Time Range</th>
                            <th className="py-4 px-6 text-center text-sm font-semibold tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-6 text-center text-gray-500">No appointments found.</td>
                            </tr>
                        ) : (
                            appointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-50">
                                    <td className="py-4 px-14">{appointment.appointmentNumber}</td>
                                    <td className="py-4 px-6">{appointment.patientName}</td>
                                    <td className="py-4 px-6">Dr. {appointment.doctorId ? appointment.doctorId.name : 'Unknown Doctor'}</td>
                                    <td className="py-4 px-6">{appointment.doctorId ? appointment.doctorId.specialization : 'N/A'}</td>
                                    <td className="py-4 px-6">{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td className="py-4 px-6">
                                        {appointment.doctorId && appointment.doctorId.timeRanges.length > 0
                                            ? `${appointment.doctorId.timeRanges[0].from} - ${appointment.doctorId.timeRanges[0].to}`
                                            : 'Not available'}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <Link
                                            to={`/appointments/update/${appointment._id}`}
                                            className="inline-block text-blue-600 hover:text-blue-900 transition duration-300"
                                        >
                                            Update
                                        </Link>
                                        <button
                                            onClick={() => handleCancel(appointment._id)}
                                            className="ml-4 inline-block text-red-600 hover:text-red-900 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserAppointments;
