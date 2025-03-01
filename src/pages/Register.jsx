// pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password, confirmPassword } = formData;

        // Validasi input
        if (!username || !password || !confirmPassword) {
            setError('Semua field harus diisi');
            return;
        }

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok');
            return;
        }

        // Ambil data users dari localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Cek apakah username sudah terdaftar
        if (users.some(user => user.username === username)) {
            setError('Username sudah terdaftar');
            return;
        }

        // Tambahkan user baru
        const newUser = {
            username,
            password
        };

        localStorage.setItem('users', JSON.stringify([...users, newUser]));
        setSuccess('Registrasi berhasil! Silahkan login.');

        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Masukkan username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Masukkan password"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Konfirmasi Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Masukkan konfirmasi password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p>Sudah punya akun? <Link to="/login" className="text-blue-500">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;