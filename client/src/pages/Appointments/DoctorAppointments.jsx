import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker'; // For date filtering
import 'react-datepicker/dist/react-datepicker.css'; // Styles for the datepicker
import logo from '../../components/logo.png'; // Import the logo from the components folder

const DoctorAppointments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [startDate, setStartDate] = useState(new Date()); // Default to today's date for filtering

    const doctorId = currentUser.isDoctor ? currentUser._id : '';

    // Fetch doctor appointments, optionally filter by a date
    const fetchDoctorAppointments = async (filterDate = null) => {
        try {
            let url = `/api/appointments/doctor/${doctorId}`;
            if (filterDate) {
                // Format date to YYYY-MM-DD before sending to the backend
                const formattedDate = filterDate.toISOString().split('T')[0];
                console.log("Sending date to backend:", formattedDate); // Debug log for date
                url += `?date=${formattedDate}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch appointments');

            const data = await response.json();
            if (data.length > 0) {
                setAppointments(data);
            } else {
                setErrorMessage('No appointments found.');
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error fetching doctor appointments:', error);
        }
    };

    // PDF generation function with improved design
    const generatePDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString(); // Get the current date
    
        // Dynamically fetch doctor name and clinic name
        const doctorName = currentUser.name || 'Doctor'; // Assuming `currentUser` has the doctor's name
        const clinicName = 'MediZen';
    
        // Add the logo to the PDF header
        doc.addImage(logo, 'PNG', 10, 6, 40, 40); // Adjusted logo dimensions for better fit
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('Doctor Appointment Report (Current Week)', 55, 20); // Adjust the position for better alignment
    
        // Additional header details
        doc.setFontSize(12);
        doc.setTextColor(60);
        doc.text(`Doctor Name: Dr. ${doctorName}`, 55, 30); // Dynamic doctor name
        doc.text(`Hospital/Clinic: ${clinicName}`, 55, 35); // Clinic name (MediZen)
        doc.text(`Report Date: ${currentDate}`, 55, 40); // Add current date below the header
    
        // Draw a horizontal line below the header
        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);
    
        const weekStart = getWeekStart(new Date());
        const weekEnd = getWeekEnd(new Date());
    
        const currentWeekAppointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= weekStart && appointmentDate <= weekEnd;
        });
    
        const totalPatients = currentWeekAppointments.length;
        const totalEarnings = currentWeekAppointments.reduce((sum, appointment) => sum + appointment.channelingCost, 0);
    
        // Adjust startY to align properly with the updated header
        doc.autoTable({
            startY: 55,  // Adjust this to position the table correctly below the header
            headStyles: { fillColor: [63, 81, 181] }, // Indigo blue for the header
            styles: { halign: 'center', fontSize: 12 },
            head: [['Appointment Number', 'Patient Name', 'Date', 'Time', 'Channeling Cost']],
            body: currentWeekAppointments.map(appointment => [
                appointment.appointmentNumber,
                appointment.patientName,
                new Date(appointment.date).toLocaleDateString(),
                appointment.time,
                `$${appointment.channelingCost}`,
            ]),
        });
    
        // Add the total number of patients and earnings in a distinct way
        doc.setFontSize(14);
        doc.setTextColor(40, 167, 69); // Green color for total information
        const finalY = doc.lastAutoTable.finalY + 10; // Position based on the last table Y position
        doc.text(`Total Patients: ${totalPatients}`, 14, finalY);
        doc.text(`Total Earnings: $${totalEarnings}`, 14, finalY + 10);
    
        // Save the generated PDF
        doc.save('doctor_appointments_current_week.pdf');
    };
    
    

    // Helper function to get the start of the current week (Monday)
    const getWeekStart = (date) => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday as day 0
        const weekStart = new Date(currentDate.setDate(currentDate.getDate() + mondayOffset));
        weekStart.setHours(0, 0, 0, 0); // Set time to midnight
        return weekStart;
    };

    // Helper function to get the end of the current week (Sunday)
    const getWeekEnd = (date) => {
        const weekStart = getWeekStart(date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Add 6 days to get to Sunday
        weekEnd.setHours(23, 59, 59, 999); // Set time to the end of the day
        return weekEnd;
    };

    // Fetch appointments on component load
    useEffect(() => {
        if (doctorId) {
            fetchDoctorAppointments();
        }
    }, [doctorId]);

    // Handle date change for the filter
    const handleDateChange = (date) => {
        setStartDate(date);
        fetchDoctorAppointments(date); // Fetch appointments for the selected date
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Doctor Appointments</h2>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

            <button
                onClick={generatePDF}
                className="mb-6 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
            >
                Generate PDF Report (Current Week)
            </button>
            
            {/* Date filter with better design */}
            <div className="mb-6 flex justify-center items-center">
                <span className="mr-3 text-gray-700">Filter by Date:</span>
                <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    minDate={new Date()} // Restrict to today and future dates
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholderText="Select a date"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-indigo-600 text-white text-center">
                            <th className="py-3 px-6">Appointment Number</th>
                            <th className="py-3 px-6">Patient</th>
                            <th className="py-3 px-6">Date</th>
                            <th className="py-3 px-6">Time</th>
                            <th className="py-3 px-6">Channeling Cost</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {appointments.map(appointment => (
                            <tr key={appointment._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-6">{appointment.appointmentNumber}</td>
                                <td className="py-3 px-6">{appointment.patientName}</td>
                                <td className="py-3 px-6">{new Date(appointment.date).toLocaleDateString()}</td>
                                <td className="py-3 px-6">{appointment.time}</td>
                                <td className="py-3 px-6">Rs. {appointment.channelingCost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorAppointments;
