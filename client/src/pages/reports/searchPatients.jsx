import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/allPatients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // to include cookies if necessary
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Fetched users:", data); // Debugging: check if email and profilePicture are available
          setUsers(data);
          setFilteredUsers(data);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by search term
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Function to navigate to upload report page
  const uploadReport = (userId, username) => {
    navigate(`/upload-report/${userId}`, { state: { userName: username, patientId: userId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center text-#091057">Registered Patients</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead className='bg-blue-100'>
          <tr>
            <th className="py-2 px-4 border-b">Profile Picture</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">
                <img
                  src={user.profilePicture || 'https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg'}
                  alt="profile"
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => e.target.src = 'https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg'} // Fallback image if loading fails
                />
              </td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{user.isAdmin ? 'Admin' : 'User'}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => uploadReport(user._id, user.name)}
                  className="bg-blue-500 text-white py-1 px-2 rounded-lg"
                >
                  Upload Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
