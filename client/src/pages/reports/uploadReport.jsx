import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadReportForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, patientId } = location.state; // Retrieve patientId and userName from passed state

    const [reportType, setReportType] = useState('');
    const [testType, setTestType] = useState('');
    const [reportIssuedDate, setReportIssuedDate] = useState('');
    const [reportFile, setReportFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('patientId', patientId);
        formData.append('reportType', reportType);
        formData.append('testType', testType);
        formData.append('reportIssuedDate', reportIssuedDate);
        formData.append('reportFile', reportFile);

        try {
            const res = await axios.post('/api/reports/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                // Show success message and clear form fields
                setSuccessMessage('Your report has been submitted successfully.');
                setReportType('');
                setTestType('');
                setReportIssuedDate('');
                setReportFile(null);
                setErrorMessage('');

                // Navigate after 3 seconds (if desired)
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/view-reports-doctor');
                }, 3000);
            }
        } catch (err) {
            console.error('Error during form submission:', err);
            // Show error message
            setErrorMessage('There was an error submitting your report. Please try again.');
            setSuccessMessage('');
        }
    };

    // Render test type options based on selected report type
    const renderTestTypes = () => {
        switch (reportType) {
            case 'Lab Report':
                return (
                    <>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Blood Count"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Blood Count
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Urin Test"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Urin Test
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Tumor Markers"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Tumor Markers
                        </label>
                    </>
                );
            case 'Radiology Report':
                return (
                    <>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="X-Ray"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            X-Ray
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="MRI"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            MRI
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="CT Scan"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            CT Scan
                        </label>
                    </>
                );
            case 'Pathology Report':
                return (
                    <>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Anatomical Pathology"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Anatomical Pathology
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Clinical Pathology"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Clinical Pathology
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Molecular Pathology"
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Molecular Pathology
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Upload Medical Records</h2>

            {/* Success and Error Messages */}
            {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
                {/* Patient Name (read-only) */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Patient Name</label>
                    <input
                        type="text"
                        value={userName}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                    />
                </div>

                {/* Report Type Dropdown */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Report Type</option>
                        <option value="Lab Report">Lab Report</option>
                        <option value="Radiology Report">Radiology Report</option>
                        <option value="Pathology Report">Pathology Report</option>
                    </select>
                </div>

                {/* Test Type Radio Buttons */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Test Type</label>
                    <div className="flex flex-wrap gap-4">
                        {renderTestTypes()}
                    </div>
                </div>

                {/* Report Issue Date */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Report Issue Date</label>
                    <input
                        type="date"
                        value={reportIssuedDate}
                        onChange={(e) => setReportIssuedDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Report</label>
                    <input
                        type="file"
                        accept=".pdf, image/*" // Accept only PDFs and images
                        onChange={(e) => setReportFile(e.target.files[0])}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UploadReportForm;
