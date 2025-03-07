import React, { useState } from 'react';
import Input from '../components/Input';
import { motion } from "framer-motion";
import { Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { isLoading, changePassword, error } = useAuthStore();
    const { token } = useParams();
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
        try {
			await changePassword(token, newPassword);

			toast.success("Password changed successfully, redirecting to login page...");
            localStorage.removeItem("authToken");
            useAuthStore.getState().logout();
            setTimeout(() => {
                navigate("/login")
            }, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error changing password");
		}
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
        overflow-hidden'>
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Change Password
                </h2>
                <form onSubmit={handleChangePassword}>
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Old Password'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)} />
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='New Password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} />
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                        {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}
                    <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-green-600	hover:to-emerald-700 focus:outline-none focus:ring-2
                        focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}>
                        {isLoading ? "Changing..." : "Change Password"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    )
}

export default ChangePassword