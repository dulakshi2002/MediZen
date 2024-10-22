import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewReportsByDoctor = () => {
    const [reports, setReports] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch reports uploaded by the logged-in doctor
        const fetchReports = async () => {
            try {
                const response = await axios.get('/api/reports/doctor', { withCredentials: true });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setErrorMessage('Failed to fetch reports. Please try again later.');
            }
        };

        fetchReports();
    }, []);

    // Function to handle updating a report
    const handleUpdate = (reportId) => {
        // Navigate to the update page for the specific report
        window.location.href = `/update-reports-doctor/${reportId}`;
    };

    // Function to handle deleting a report
    const handleDelete = async (reportId) => {
        try {
            const response = await axios.delete(`/api/reports/${reportId}`, { withCredentials: true });
            if (response.status === 200) {
                // Remove the deleted report from the state
                setReports(reports.filter((report) => report._id !== reportId));
                alert('Report deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            setErrorMessage('Failed to delete the report. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">My Uploaded Reports</h2>

            {errorMessage && (
                <p className="text-red-600 text-center mb-4">{errorMessage}</p>
            )}

            {reports.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-6 py-3 text-left font-semibold">Patient Name</th>
                                <th className="px-6 py-3 text-left font-semibold">Report Type</th>
                                <th className="px-6 py-3 text-left font-semibold">Test Type</th>
                                <th className="px-6 py-3 text-left font-semibold">Issue Date</th>
                                <th className="px-6 py-3 text-left font-semibold">View Report</th>
                                <th className="px-6 py-3 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-100">
                                    <td className="border-t px-6 py-4">{report.patient?.name || 'N/A'}</td>
                                    <td className="border-t px-6 py-4">{report.reportType}</td>
                                    <td className="border-t px-6 py-4">{report.testType}</td>
                                    <td className="border-t px-6 py-4">{new Date(report.reportIssuedDate).toLocaleDateString()}</td>
                                    <td className="border-t px-6 py-4">
                                        <a
                                            href={`http://localhost:3000/reports/${encodeURIComponent(report.reportFile.split('/').pop())}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            View Report
                                        </a>
                                    </td>
                                    <td className="border-t px-6 py-4">
                                        <button
                                            onClick={() => handleUpdate(report._id)}
                                            className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-600 transition-colors"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(report._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 mt-6">No reports found.</p>
            )}
        </div>
    );
};

export default ViewReportsByDoctor;
