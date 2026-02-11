import { useContext, useState, useEffect } from "react";
import { FiEdit2, FiCamera, FiCheck, FiX, FiDelete } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { sellerData, setSellerData, backendUrl, getSellerData } =
    useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // loaders
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  // profile states
  const [store, setStore] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  // password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // delete states
  const [open, setOpen] = useState(false);

  // autofill seller data
  useEffect(() => {
    if (sellerData) {
      setStore(sellerData.store || "");
      setEmail(sellerData.email || "");
      setPhone(sellerData.phone || "");
      setDescription(sellerData.description || "");
      setAddress(sellerData.address || "");
    }
  }, [sellerData]);

  // LOGO UPLOAD
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLogoLoading(true);

      const formData = new FormData();
      formData.append("logo", file);

      const { data } = await axios.put(
        `${backendUrl}/seller/update-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (data.success) {
        toast.success(data.message);
        await getSellerData();
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
        `${backendUrl}/seller/update-store`,
        { store, email, phone, description, address },
        { withCredentials: true },
      );

      if (data.success) {
        await getSellerData();
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
        `${backendUrl}/seller/update-password`,
        { oldPassword, newPassword },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await getSellerData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  // HANDLE DELETE

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`${backendUrl}/seller/delete-store`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("sellerLoggedIn");
        setSellerData(null);
        setOpen(false);

        setTimeout(() => {
          navigate("/seller/login");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
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
                src={sellerData?.logo}
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

            <h3 className="text-lg font-semibold">{store}</h3>
          </div>

          {/* PROFILE FORM */}
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-semibold">Store Information</h1>

              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
              >
                {editMode ? <FiX /> : <FiEdit2 />}
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                disabled={!editMode}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Description"
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

              <input
                disabled={!editMode}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Address"
              />

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2 items-center"
              >
                <FiEdit2 /> Change Password
              </button>
              <div>
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex gap-2 items-center"
                >
                  <FiDelete /> Delete Store
                </button>

                {/* Confirm Modal */}
                {open && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Delete Store?
                      </h2>

                      <p className="text-gray-600 mt-2">
                        This action cannot be undone. This will permanently
                        delete the store and all its data.
                      </p>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

export default Profile;

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
