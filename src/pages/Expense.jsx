import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

const Expense = () => {
    const [isOpenModalAddExpense, setIsOpenModalAddExpense] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [expenses, setExpenses] = useState([]);

    // Form state
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState('');

    // Load existing expenses from localStorage on mount
    useEffect(() => {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            setExpenses(JSON.parse(savedExpenses));
        }
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

    const handleSubmit = () => {
        if (!expenseName || !expenseAmount || !expenseDate || !selectedEmoji) {
            alert('Please fill all fields and select an icon');
            return;
        }

        const newExpense = {
            id: Date.now(),
            name: expenseName,
            amount: parseFloat(expenseAmount),
            date: expenseDate,
            emoji: selectedEmoji.emoji,
            createdAt: new Date().toISOString()
        };

        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);

        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

        setIsOpenModalAddExpense(false);
        resetForm();
    };

    return (
        <div className='p-4'>
            <h1 className="text-2xl font-bold mb-4">Expense</h1>

            {expenses.length > 0 ? (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Your Expenses</h2>
                    <div className="bg-white rounded-lg shadow">
                        {expenses.map((expense) => (
                            <div key={expense.id} className="border-b border-gray-100 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{expense.emoji}</span>
                                    <div>
                                        <h3 className="font-medium">{expense.name}</h3>
                                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="font-semibold text-red-600">
                                    -${expense.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No expense entries yet
                </div>
            )}

            <button
                onClick={handleModalAddExpense}
                className='cursor-pointer px-3 py-2 bg-white rounded-lg shadow-md mt-2 text-red-500'
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
                        <div className='bg-white p-5 rounded-lg w-96 max-w-full pointer-events-auto py-10'>
                            <div className='relative'>
                                <h1 className='text-2xl font-semibold mb-5'>Add Expense</h1>
                                <button onClick={handleModalAddExpense} className='absolute top-0 right-0 cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 text-gray-500' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className='mb-3'>
                                <p className='text-sm text-gray-600 mb-1'>Choose Icon</p>
                                <div className='flex items-center'>
                                    <button
                                        onClick={toggleEmojiPicker}
                                        className='flex items-center justify-center border border-gray-200 p-2 rounded-lg mr-2 w-12 h-12'
                                    >
                                        {selectedEmoji ? (
                                            <span className='text-2xl'>{selectedEmoji.emoji}</span>
                                        ) : (
                                            <span className='text-gray-400'>+</span>
                                        )}
                                    </button>
                                    <div className='text-sm text-gray-600'>
                                        {selectedEmoji ? 'Emoji selected' : 'Pick Emoji'}
                                    </div>
                                </div>

                                {showEmojiPicker && (
                                    <div className='mt-2 border border-gray-200 rounded-lg bg-white z-50 relative'>
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiSelect}
                                            searchPlaceholder="Search emoji..."
                                            width="100%"
                                            height="350px"
                                        />
                                        <button
                                            onClick={closeEmojiPicker}
                                            className='absolute -top-3 -right-2 border border-gray-300 bg-white p-1 rounded-full cursor-pointer'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-4 text-gray-500' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <input type='text' placeholder='Expense name' className='w-full border border-gray-200 p-2 rounded-lg mb-3' value={expenseName} onChange={(e) => setExpenseName(e.target.value)} />
                            <input type='number' placeholder='Expense amount' className='w-full border border-gray-200 p-2 rounded-lg mb-3' value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
                            <input type='date' placeholder='Expense date' className='w-full border border-gray-200 p-2 rounded-lg mb-3' value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
                            <button className='bg-red-500 text-white px-3 py-2 rounded-lg w-full hover:bg-red-600 transition' onClick={handleSubmit}>Add Expense</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Expense;
