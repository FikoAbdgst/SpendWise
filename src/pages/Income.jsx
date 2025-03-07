import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

const Income = ({ darkMode }) => {
    const [isOpenModalAddIncome, setIsOpenModalAddIncome] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [incomeName, setIncomeName] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeDate, setIncomeDate] = useState('');

    const API_URL = process.env.NODE_ENV === 'production'
        ? 'https://backend-spendwise.vercel.app'
        : 'http://localhost:3000';


    // Fetch transactions from API
    const fetchIncomes = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/balance/recent-transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    limit: 50 // Adjust as needed
                }
            });

            // Filter transactions to only include income
            const incomeTransactions = response.data.data.filter(
                transaction => transaction.type === 'income'
            );

            setIncomes(incomeTransactions);
        } catch (err) {
            console.error('Error fetching incomes:', err);
            setError('Failed to load income data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load existing incomes from API on mount
    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleModalAddIncome = () => {
        setIsOpenModalAddIncome(!isOpenModalAddIncome);
        // Reset form when opening modal
        if (!isOpenModalAddIncome) {
            resetForm();
        }
    };

    const handleEmojiSelect = (emojiData) => {
        setSelectedEmoji(emojiData);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const closeEmojiPicker = () => {
        setShowEmojiPicker(false);
    };

    const resetForm = () => {
        setIncomeName('');
        setIncomeAmount('');
        setIncomeDate('');
        setSelectedEmoji(null);
    };

    const handleSubmit = async () => {
        // Validate form
        if (!incomeName || !incomeAmount || !incomeDate || !selectedEmoji) {
            alert('Please fill all fields and select an icon');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Create transaction with API
            await axios.post(
                `${API_URL}/balance/transaction`,
                {
                    type: 'income',
                    name: incomeName,
                    amount: parseFloat(incomeAmount),
                    date: incomeDate,
                    icon: selectedEmoji.emoji
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Refresh the incomes list
            fetchIncomes();

            // Close modal and reset form
            setIsOpenModalAddIncome(false);
            resetForm();
        } catch (err) {
            console.error('Error adding income:', err);
            alert(err.response?.data?.message || 'Failed to add income. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-2xl font-bold mb-4">Income</h1>

            {/* Error message if API request fails */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading indicator */}
            {loading && !isOpenModalAddIncome && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                </div>
            )}

            {/* Display incomes list */}
            {!loading && incomes.length > 0 ? (
                <div className="mb-6">
                    <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {incomes.map((income) => (
                            <div key={income.id} className={`p-4 flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{income.icon}</span>
                                    <div>
                                        <h3 className="font-medium">{income.name}</h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {formatDate(income.date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="font-semibold text-green-600">
                                    +${income.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : !loading && (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No income entries yet
                </div>
            )}

            <button
                onClick={handleModalAddIncome}
                className={`cursor-pointer px-3 py-2 rounded-lg shadow-md mt-2 text-purple-500 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                disabled={loading}
            >
                + Add Income
            </button>

            {isOpenModalAddIncome && (
                <>
                    {/* Overlay with opacity */}
                    <div
                        className='fixed inset-0 bg-black opacity-50 z-40'
                        onClick={handleModalAddIncome}
                    ></div>

                    {/* Modal content */}
                    <div className='fixed inset-0 flex justify-center items-center z-50 pointer-events-none'>
                        <div className={`p-5 rounded-lg w-96 max-w-full pointer-events-auto py-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <div className='relative'>
                                <h1 className='text-2xl font-semibold mb-5'>Add Income</h1>
                                <button onClick={handleModalAddIncome} className='absolute top-0 right-0 cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Emoji Picker Button */}
                            <div className='mb-3'>
                                <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Choose Icon</p>
                                <div className='flex items-center'>
                                    <button
                                        onClick={toggleEmojiPicker}
                                        className={`flex items-center justify-center border p-2 rounded-lg mr-2 w-12 h-12 ${darkMode ? 'border-gray-600' : 'border-gray-200'
                                            }`}
                                    >
                                        {selectedEmoji ? (
                                            <span className='text-2xl'>{selectedEmoji.emoji}</span>
                                        ) : (
                                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>+</span>
                                        )}
                                    </button>
                                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {selectedEmoji ? 'Emoji selected' : 'Pick Emoji'}
                                    </div>
                                </div>

                                {/* Emoji Picker Dropdown */}
                                {showEmojiPicker && (
                                    <div className={`mt-2 border rounded-lg z-50 relative ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                                        }`}>
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiSelect}
                                            searchPlaceholder="Search emoji..."
                                            width="100%"
                                            height="350px"
                                            theme={darkMode ? 'dark' : 'light'}
                                        />
                                        <button
                                            onClick={closeEmojiPicker}
                                            className={`absolute -top-3 -right-2 border p-1 rounded-full cursor-pointer ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type='text'
                                placeholder='Income name'
                                className={`w-full border p-2 rounded-lg mb-3 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                                    : 'border-gray-200 bg-white text-black placeholder-gray-500'
                                    }`}
                                value={incomeName}
                                onChange={(e) => setIncomeName(e.target.value)}
                            />
                            <input
                                type='number'
                                placeholder='Income amount'
                                className={`w-full border p-2 rounded-lg mb-3 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                                    : 'border-gray-200 bg-white text-black placeholder-gray-500'
                                    }`}
                                value={incomeAmount}
                                onChange={(e) => setIncomeAmount(e.target.value)}
                            />
                            <input
                                type='date'
                                placeholder='Income date'
                                className={`w-full border p-2 rounded-lg mb-3 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-white'
                                    : 'border-gray-200 bg-white text-black'
                                    }`}
                                value={incomeDate}
                                onChange={(e) => setIncomeDate(e.target.value)}
                            />

                            {loading ? (
                                <button
                                    className='bg-purple-400 text-white px-3 py-2 rounded-lg w-full flex justify-center'
                                    disabled
                                >
                                    <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                                    Processing...
                                </button>
                            ) : (
                                <button
                                    className='bg-purple-500 text-white px-3 py-2 rounded-lg w-full hover:bg-purple-600 transition'
                                    onClick={handleSubmit}
                                >
                                    Add Income
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Income;