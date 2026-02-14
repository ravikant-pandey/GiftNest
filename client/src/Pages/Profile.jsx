import { useContext, useEffect, useState } from "react";
import { FiEdit2, FiLock, FiMail, FiPhone } from "react-icons/fi";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { backendUrl, getUserData, userData } = useContext(AppContext);

  // profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  // modals
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // GLOBAL LOADER
  const [loading, setLoading] = useState(false);

  // Sync user data when context loads
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setAvatar(userData.avatar || "");
    }
  }, [userData]);

  // Avatar Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.put(
        `${backendUrl}/user/update-avatar`,
        formData,
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        await getUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${backendUrl}/user/update-profile`,
        { name, email, phone },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        await getUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${backendUrl}/user/update-password`,
        { oldPassword, newPassword },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmDelete) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/user/delete-account`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  //  Page Loader when user not loaded
  if (!userData)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/*  GLOBAL FULLSCREEN LOADER */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-lg font-semibold animate-pulse">
            Processing...
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        {/* Avatar */}
        <div className="relative group w-32 h-32 mx-auto">
          <img
            src={avatar}
            className="w-32 h-32 rounded-full object-cover border-4"
          />

          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full">
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
            <FiEdit2 className="text-white text-2xl" />
          </label>
        </div>

        <h1 className="text-3xl font-bold mt-4">{name}</h1>

        <div className="flex md:flex-row flex-col items-center justify-center gap-6 mt-4 text-gray-600">
          <div className="flex items-center gap-2">
            <FiMail /> {email}
          </div>
          <div className="flex items-center gap-2">
            <FiPhone /> {phone}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 mx-auto"
          >
            <FiEdit2 /> Edit Profile
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-gray-700 text-white px-6 py-2 rounded flex items-center gap-2 mx-auto"
          >
            <FiLock /> Change Password
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-6 py-2 rounded flex items-center gap-2 mx-auto"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ✏ Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Name"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Email"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Phone"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
