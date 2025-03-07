import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			localStorage.setItem("authToken", response.data.token);
			set({ isAuthenticated: true, user: response.data.user, error: null, isLoading: false, });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		const token = localStorage.getItem("authToken");
		if (!token) {
			set({ isAuthenticated: false, user: null, isCheckingAuth: false });
			return;
		}
		try {
			const response = await axios.get(`${API_URL}/check-auth`, {
				headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
			});
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			localStorage.removeItem("authToken"); // Remove invalid token
			set({ isAuthenticated: false, user: null, isCheckingAuth: false });
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

	changePassword: async (oldPassword, newPassword, confirmPassword) => {
		set({ isLoading: true, error: null });
		const token = localStorage.getItem("authToken"); // Get token from storage
		if (!token) {
			set({ isLoading: false, error: "Token not found. Please log in again." });
			return;
		}
		try {
			const response = await axios.post(
				`${API_URL}/change-password`,
				{ oldPassword, newPassword, confirmPassword },
				{ headers: { Authorization: `Bearer ${token}` } } // Send token in headers
			);
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({ isLoading: false, error: error?.response?.data?.message || "Error changing password" });
			throw error;
		}
	},
}));