import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "./../utils/ApiFunctions";

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    gender: "",
    birthDate: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await getUserById(userId);
        setUserData({
          fullName: user.fullName,
          gender: user.gender,
          birthDate: user.birthDate,
          city: user.city,
        });
        setLoading(false);
      } catch (error) {
        setError(`Error fetching user data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser(userId, userData);
      setLoading(false);
      alert("User profile updated successfully!");
    } catch (error) {
      setError(`Error updating user profile: ${error.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Tên đầy đủ:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="gender">Giới tính:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={userData.gender}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="birthDate">Ngày sinh:</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={userData.birthDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city">Thành phố bạn đang ở:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={userData.city}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
