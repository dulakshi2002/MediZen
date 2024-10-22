import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewReportsByPatient = () => {
    const [reports, setReports] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch reports for the logged-in patient
        const fetchReports = async () => {
            try {
                const response = await axios.get('/api/reports/patient', { withCredentials: true });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setErrorMessage('Failed to fetch reports. Please try again later.');
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">My Reports</h2>

            {errorMessage && (
                <p className="text-red-600 text-center mb-4">{errorMessage}</p>
            )}

            {reports.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-6 py-3 text-left font-semibold">Doctor Name</th>
                                <th className="px-6 py-3 text-left font-semibold">Report Type</th>
                                <th className="px-6 py-3 text-left font-semibold">Test Type</th>
                                <th className="px-6 py-3 text-left font-semibold">Issue Date</th>
                                <th className="px-6 py-3 text-left font-semibold">View Report</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-100">
                                    <td className="border-t px-6 py-4">{report.doctor?.name || 'N/A'}</td>
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

export default ViewReportsByPatient;
