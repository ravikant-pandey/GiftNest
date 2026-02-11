import { useContext, useState, useEffect } from "react";
import { FiEdit2, FiCamera, FiCheck, FiX, FiDelete } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Admin = () => {
  const { admin, backendUrl, fetchAdminData } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // loaders
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  // profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // autofill seller data
  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
      setEmail(admin.email || "");
      setPhone(admin.phone || "");
    }
  }, [admin]);

  // LOGO UPLOAD
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLogoLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.put(
        `${backendUrl}/admin/update-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (data.success) {
        toast.success(data.message);
        await fetchAdminData();
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLogoLoading(false);
    }
  };

  // PROFILE UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);

      const { data } = await axios.put(
        `${backendUrl}/admin/update-profile`,
        { name, email, phone },
        { withCredentials: true },
      );

      if (data.success) {
        await fetchAdminData();
        toast.success(data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  // PASSWORD UPDATE
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const { data } = await axios.put(
        `${backendUrl}/admin/update-password`,
        { oldPassword, newPassword },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={admin?.avatar}
                alt="logo"
                className={`w-32 h-32 rounded-full object-cover border-4 border-gray-300 ${logoLoading && "opacity-40"}`}
              />

              {logoLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {editMode && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow">
                  <FiCamera />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <h3 className="text-lg font-semibold">{admin.name}</h3>
          </div>

          {/* PROFILE FORM */}
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-semibold">Admin Information</h1>

              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
              >
                {editMode ? <FiX /> : <FiEdit2 />}
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                disabled={!editMode}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Name"
              />
              <input
                disabled={!editMode}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Email"
              />

              <input
                disabled={!editMode}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Phone"
              />
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2 items-center"
              >
                <FiEdit2 /> Change Password
              </button>

              {editMode && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-green-600 text-white px-6 py-2 rounded flex gap-2 items-center disabled:opacity-60"
                  >
                    {profileLoading ? (
                      "Updating..."
                    ) : (
                      <>
                        <FiCheck /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <PasswordModal
        showModal={showModal}
        setShowModal={setShowModal}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordLoading={passwordLoading}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default Admin;

// Password Model
const PasswordModal = ({
  showModal,
  setShowModal,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordLoading,
  handlePasswordSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="border p-2 w-full rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="border p-2 w-full rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 w-full rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handlePasswordSubmit}
              disabled={passwordLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {passwordLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
