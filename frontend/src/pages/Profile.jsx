import { Camera, Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName,
    email: authUser?.email,
    avatar: authUser?.avatar?.url,
  });

  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      setFormData({ ...formData, avatar: file });
    };
  };

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("avatar", formData.avatar);
     dispatch(updateProfile(data)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  });
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
            <p className="mt-2 text-gray-500">Your profile information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImage || formData.avatar || "/avatar-holder.avif"
                }
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover object-top border-4 border-gray-200"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-gray-800 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile
                    ? "animate-pulse pointer-events-none"
                    : ""
                }`}
              >
                <Camera className="text-white w-4 h-4" />
                <input
                  type="file"
                  onChange={handleImageUpload}
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            <p className="text-sm text-gray-500">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUpdatingProfile ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Update Profile"
              )}
            </button>
          </div>

          {/* Account Info */}
          <div className="border-t pt-4 space-y-2">
            <h2 className="text-lg font-medium text-gray-700">
              Account Information
            </h2>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Member Since</span>
              <span>{authUser?.createdAt?.split("T")[0]}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Account Status</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;