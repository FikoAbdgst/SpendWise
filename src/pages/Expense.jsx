import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

const Expense = ({ darkMode }) => {
    const [isOpenModalAddExpense, setIsOpenModalAddExpense] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState('');

    const API_URL = 'http://localhost:3000/api';

    // Fetch transactions from API
    const fetchExpenses = async () => {
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

            // Filter transactions to only include expenses
            const expenseTransactions = response.data.data.filter(
                transaction => transaction.type === 'expense'
            );

            setExpenses(expenseTransactions);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to load expense data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load existing expenses from API on mount
    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleModalAddExpense = () => {
        setIsOpenModalAddExpense(!isOpenModalAddExpense);
        if (!isOpenModalAddExpense) {
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
        setExpenseName('');
        setExpenseAmount('');
        setExpenseDate('');
        setSelectedEmoji(null);
    };

    const handleSubmit = async () => {
        if (!expenseName || !expenseAmount || !expenseDate || !selectedEmoji) {
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
                    type: 'expense',
                    name: expenseName,
                    amount: parseFloat(expenseAmount),
                    date: expenseDate,
                    icon: selectedEmoji.emoji
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Refresh the expenses list
            fetchExpenses();

            // Close modal and reset form
            setIsOpenModalAddExpense(false);
            resetForm();
        } catch (err) {
            console.error('Error adding expense:', err);
            alert(err.response?.data?.message || 'Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-2xl font-bold mb-4">Expense</h1>

            {/* Error message if API request fails */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading indicator */}
            {loading && !isOpenModalAddExpense && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                </div>
            )}

            {!loading && expenses.length > 0 ? (
                <div className="mb-6">
                    <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {expenses.map((expense) => (
                            <div key={expense.id} className={`p-4 flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{expense.icon}</span>
                                    <div>
                                        <h3 className="font-medium">{expense.name}</h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {formatDate(expense.date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="font-semibold text-red-600">
                                    -${expense.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : !loading && (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No expense entries yet
                </div>
            )}

            <button
                onClick={handleModalAddExpense}
                className={`cursor-pointer px-3 py-2 rounded-lg shadow-md mt-2 text-red-500 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                disabled={loading}
            >
                + Add Expense
            </button>

            {isOpenModalAddExpense && (
                <>
                    <div
                        className='fixed inset-0 bg-black opacity-50 z-40'
                        onClick={handleModalAddExpense}
                    ></div>
                    <div className='fixed inset-0 flex justify-center items-center z-50 pointer-events-none'>
                        <div className={`p-5 rounded-lg w-96 max-w-full pointer-events-auto py-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <div className='relative'>
                                <h1 className='text-2xl font-semibold mb-5'>Add Expense</h1>
                                <button onClick={handleModalAddExpense} className='absolute top-0 right-0 cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

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
                                placeholder='Expense name'
                                className={`w-full border p-2 rounded-lg mb-3 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                                    : 'border-gray-200 bg-white text-black placeholder-gray-500'
                                    }`}
                                value={expenseName}
                                onChange={(e) => setExpenseName(e.target.value)}
                            />

                            <input
                                type='number'
                                placeholder='Expense amount'
                                className={`w-full border p-2 rounded-lg mb-3 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                                    : 'border-gray-200 bg-white text-black placeholder-gray-500'
                                    }`}
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                            />

                            <input
                                type='date'
                                placeholder='Expense date'
                                className={`w-full border p-2 rounded-lg mb-3 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-white'
                                    : 'border-gray-200 bg-white text-black'
                                    }`}
                                value={expenseDate}
                                onChange={(e) => setExpenseDate(e.target.value)}
                            />

                            {loading ? (
                                <button
                                    className='bg-red-400 text-white px-3 py-2 rounded-lg w-full flex justify-center'
                                    disabled
                                >
                                    <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                                    Processing...
                                </button>
                            ) : (
                                <button
                                    className='bg-red-500 text-white px-3 py-2 rounded-lg w-full hover:bg-red-600 transition'
                                    onClick={handleSubmit}
                                >
                                    Add Expense
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Expense;