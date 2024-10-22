import { useState } from 'react';
import axios from 'axios';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Surgery',
  'Gynecology',
  'Hematology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology',
  'Family Medicine',
  'Internal Medicine',
  'Pulmonology',
  'Rheumatology',
  'Anesthesiology',
  'Pathology',
];

export default function DoctorForm() {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [timeRanges, setTimeRanges] = useState({});
  const [maxAppointmentsPerDay, setMaxAppointmentsPerDay] = useState(0);
  const [channelingCost, setChannelingCost] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // State for field-specific errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Validation
    const errors = {};
    const nameRegex = /^[A-Za-z\s]*$/; // Only letters and spaces
    if (!nameRegex.test(name) || name.trim() === '') {
      errors.name = 'Name should contain only letters and cannot be empty';
    }
    if (maxAppointmentsPerDay <= 0) {
      errors.maxAppointmentsPerDay = 'Max appointments must be a positive number';
    }
    if (channelingCost < 0) {
      errors.channelingCost = 'Channeling cost must be a non-negative number';
    }

    // If there are validation errors, show them and prevent submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Prepare timeRanges based on selected availableDates and their time input
    const formattedTimeRanges = availableDates.map((day) => ({
      day: day,
      from: timeRanges[day]?.from || '', // Ensure a value is set
      to: timeRanges[day]?.to || '',     // Ensure a value is set
    })).filter(range => range.from && range.to); // Only keep ranges that have both values

    const formData = {
      name,
      specialization,
      availableDates,
      timeRanges: formattedTimeRanges, // Use the formatted time ranges
      maxAppointmentsPerDay,
      channelingCost,
      email,
      password,
    };

    try {
      await axios.post('http://localhost:3000/api/doctors/add', formData);
      alert('Doctor added successfully');
      // Reset form fields
      setName('');
      setSpecialization('');
      setAvailableDates([]);
      setTimeRanges({});
      setMaxAppointmentsPerDay(0);
      setChannelingCost(0);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Error adding doctor. Please try again.');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const nameRegex = /^[A-Za-z\s]*$/; // Allow only letters and spaces
    if (nameRegex.test(value)) {
      setName(value);
      setFieldErrors((prevErrors) => ({ ...prevErrors, name: '' })); // Clear errors if input is valid
    }
  };

  const handleMaxAppointmentsChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only numbers
      setMaxAppointmentsPerDay(Number(value));
      setFieldErrors((prevErrors) => ({ ...prevErrors, maxAppointmentsPerDay: '' }));
    }
  };

  const handleChannelingCostChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only numbers
      setChannelingCost(Number(value));
      setFieldErrors((prevErrors) => ({ ...prevErrors, channelingCost: '' }));
    }
  };

  const handleDateToggle = (day) => {
    setAvailableDates(prevState => {
      if (prevState.includes(day)) {
        return prevState.filter(d => d !== day);
      } else {
        return [...prevState, day];
      }
    });
  };

  const handleTimeRangeChange = (day, field, value) => {
    setTimeRanges(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Add Doctor</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Doctor Name</label>
            <input
              type="text"
              placeholder="Enter doctor's name"
              value={name}
              onChange={handleNameChange}
              onKeyDown={(e) => {
                if (!/^[A-Za-z\s]*$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                  e.preventDefault();
                }
              }}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.name && <p className="text-red-600">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-600">Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Available Days</label>
            <div className="grid grid-cols-2 gap-4">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={availableDates.includes(day)}
                    onChange={() => handleDateToggle(day)}
                    className="mr-2"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {availableDates.map((day) => (
            <div key={day} className="mt-4 border border-gray-300 p-4 rounded-md">
              <h3 className="text-lg font-semibold">{day}</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="block text-gray-600">From</label>
                  <input
                    type="time"
                    value={timeRanges[day]?.from || ''}
                    onChange={(e) => handleTimeRangeChange(day, 'from', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-600">To</label>
                  <input
                    type="time"
                    value={timeRanges[day]?.to || ''}
                    onChange={(e) => handleTimeRangeChange(day, 'to', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-gray-600">Max Appointments Per Day</label>
            <input
              type="number"
              placeholder="Enter max appointments"
              value={maxAppointmentsPerDay}
              onChange={handleMaxAppointmentsChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.maxAppointmentsPerDay && <p className="text-red-600">{fieldErrors.maxAppointmentsPerDay}</p>}
          </div>

          <div>
            <label className="block text-gray-600">Channeling Cost</label>
            <input
              type="number"
              placeholder="Enter channeling cost"
              value={channelingCost}
              onChange={handleChannelingCostChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.channelingCost && <p className="text-red-600">{fieldErrors.channelingCost}</p>}
          </div>

          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Doctor
          </button>
        </form>
      </div>
    </div>
  );
}
