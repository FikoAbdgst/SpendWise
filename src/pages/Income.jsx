import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

const Income = () => {
    const [isOpenModalAddIncome, setIsOpenModalAddIncome] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [incomes, setIncomes] = useState([]);

    // Form state
    const [incomeName, setIncomeName] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeDate, setIncomeDate] = useState('');

    // Load existing incomes from localStorage on mount
    useEffect(() => {
        const savedIncomes = localStorage.getItem('incomes');
        if (savedIncomes) {
            setIncomes(JSON.parse(savedIncomes));
        }
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

    const handleSubmit = () => {
        // Validate form
        if (!incomeName || !incomeAmount || !incomeDate || !selectedEmoji) {
            alert('Please fill all fields and select an icon');
            return;
        }

        // Create new income object
        const newIncome = {
            id: Date.now(), // Use timestamp as unique ID
            name: incomeName,
            amount: parseFloat(incomeAmount),
            date: incomeDate,
            emoji: selectedEmoji.emoji,
            createdAt: new Date().toISOString()
        };

        // Update state with new income
        const updatedIncomes = [...incomes, newIncome];
        setIncomes(updatedIncomes);

        // Save to localStorage
        localStorage.setItem('incomes', JSON.stringify(updatedIncomes));

        // Close modal and reset form
        setIsOpenModalAddIncome(false);
        resetForm();
    };

    return (
        <div className='p-4'>
            <h1 className="text-2xl font-bold mb-4">Income</h1>

            {/* Display incomes list */}
            {incomes.length > 0 ? (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Your Incomes</h2>
                    <div className="bg-white rounded-lg shadow">
                        {incomes.map((income) => (
                            <div key={income.id} className="border-b border-gray-100 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{income.emoji}</span>
                                    <div>
                                        <h3 className="font-medium">{income.name}</h3>
                                        <p className="text-sm text-gray-500">{new Date(income.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="font-semibold text-green-600">
                                    +${income.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No income entries yet
                </div>
            )}

            <button
                onClick={handleModalAddIncome}
                className='cursor-pointer px-3 py-2 bg-white rounded-lg shadow-md mt-2 text-purple-500'
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
                        <div className='bg-white p-5 rounded-lg w-96 max-w-full pointer-events-auto py-10'>
                            <div className='relative'>
                                <h1 className='text-2xl font-semibold mb-5'>Add Income</h1>
                                <button onClick={handleModalAddIncome} className='absolute top-0 right-0 cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 text-gray-500' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Emoji Picker Button */}
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

                                {/* Emoji Picker Dropdown */}
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
                                            className='absolute -top-3 -right-2 border border-gray-300 bg-white text-white p-1 rounded-full cursor-pointer'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-4 text-gray-500' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type='text'
                                placeholder='Income name'
                                className='w-full border border-gray-200 p-2 rounded-lg mb-3'
                                value={incomeName}
                                onChange={(e) => setIncomeName(e.target.value)}
                            />
                            <input
                                type='number'
                                placeholder='Income amount'
                                className='w-full border border-gray-200 p-2 rounded-lg mb-3'
                                value={incomeAmount}
                                onChange={(e) => setIncomeAmount(e.target.value)}
                            />
                            <input
                                type='date'
                                placeholder='Income date'
                                className='w-full border border-gray-200 p-2 rounded-lg mb-3'
                                value={incomeDate}
                                onChange={(e) => setIncomeDate(e.target.value)}
                            />
                            <button
                                className='bg-purple-500 text-white px-3 py-2 rounded-lg w-full hover:bg-purple-600 transition'
                                onClick={handleSubmit}
                            >
                                Add Income
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Income;