import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/allPatients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.message || "Failed to fetch users");
        }
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const goToPatientTreatment = (userId) => {
    navigate(`/treatment-list/${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{ marginBottom: "20px", color: "#1E3A8A" }} // Inline style for the title
      >
        Treatment Management
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Username or Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
        style={{ border: "1px solid #D1D5DB" }} // Inline style for search input
      />

      <table
        className="min-w-full bg-white border border-gray-200"
        style={{ borderCollapse: "collapse", textAlign: "center" }} // Inline style for the table
      >
        <thead>
          <tr>
            <th
              className="py-2 px-4 border-b"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              Profile Picture
            </th>
            <th
              className="py-2 px-4 border-b"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              Username
            </th>
            <th
              className="py-2 px-4 border-b"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              Name
            </th>
            <th
              className="py-2 px-4 border-b"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              Email
            </th>
            <th
              className="py-2 px-4 border-b"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">
                <img
                  src={user.profilePicture}
                  alt="profile"
                  className="h-10 w-10 rounded-full object-cover"
                  style={{ margin: "0 auto" }} // Centering the image
                />
              </td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => goToPatientTreatment(user._id)}
                  className="bg-blue-500 text-white py-1 px-2 rounded-lg"
                >
                  View Treatments
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
