import React, { useState } from "react";
import { Modal, Form, Input, Upload, message, Avatar, Tooltip } from "antd";
import {
  UserOutlined,
  UploadOutlined,
  CameraOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "/src/store/useAuthStore";
import useUpdateProfile from "/src/hooks/useUpdateProfile";
import { ChefHat } from "lucide-react";

const ProfileModal = ({ visible, onCancel }) => {
  const { authUser } = useAuthStore();
  const { updateProfile, loading, error, success } = useUpdateProfile();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFinish = async (values) => {
    try {
      const result = await updateProfile(uploadedFile, values.username);
      if (success) {
        message.success("Profile updated successfully!", 2);
        onCancel(); // Close the modal on successful update
      } else {
        throw new Error(result || "Unknown error");
      }
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isValidType =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isValidType) {
        message.error("You can only upload JPG/PNG files!");
        return false;
      }
      const isLessThan2MB = file.size / 1024 / 1024 < 2;
      if (!isLessThan2MB) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }
      setUploadedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      return false;
    },
    showUploadList: false,
  };

  // If no authenticated user, don't render the modal
  if (!authUser) return null;

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <EditOutlined className="text-olive" />
          <span>Profile Settings</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="profile-settings-modal"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Tooltip title="Upload Profile Picture">
            <Upload {...uploadProps} maxCount={1}>
              <div className="cursor-pointer group relative">
                <Avatar
                  src={previewImage || authUser.ProfilePicURL}
                  icon={<ChefHat size={100} />}
                  size={160}
                  className="border-4 border-olive/30 group-hover:brightness-75 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CameraOutlined className="text-3xl text-white bg-black/50 p-2 rounded-full" />
                </div>
              </div>
            </Upload>
          </Tooltip>

          {previewImage && (
            <div className="absolute bottom-2 right-2 bg-olive text-white rounded-full p-1.5 shadow-md">
              <CheckCircleOutlined />
            </div>
          )}
        </div>
      </div>

      <Form
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
        initialValues={{
          username: authUser.name,
          email: authUser.email,
        }}
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Username required!" },
            { min: 3, message: "Username must be at least 3 characters" },
            { max: 20, message: "Username cannot exceed 20 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-olive" />}
            placeholder="Username"
            className="py-3 px-4 rounded-lg border border-olive/30 focus:border-olive focus:ring-2 focus:ring-olive/50 transition duration-300"
          />
        </Form.Item>

        <Form.Item name="email">
          <Input
            disabled
            value={authUser.email}
            className="py-3 px-4 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg"
          />
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-olive text-white rounded-lg 
            hover:bg-olive/90 focus:outline-none focus:ring-4 focus:ring-olive/50
            transition duration-300 transform active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center space-x-2 font-semibold tracking-wider shadow-md"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Profile"
            )}
          </button>
        </Form.Item>
      </Form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center mt-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-center mt-4">
          Profile updated successfully!
        </div>
      )}
    </Modal>
  );
};

export default ProfileModal;
