import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';



const StatistikTotal = ({ darkMode, totalSaldo, totalPemasukan, totalPengeluaran }) => {

    const chartData = [
        { name: 'Total Saldo', value: totalSaldo, color: '#8B5CF6' }, // Warna ungu
        { name: 'Total Pengeluaran', value: totalPengeluaran, color: '#EF4444' }, // Warna merah
        { name: 'Total Pemasukan', value: totalPemasukan, color: '#F97316' }, // Warna oranye
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'} p-3 shadow-md rounded-md border`}>
                    <p className="font-semibold text-sm" style={{ color: data.color }}>{data.name}</p>
                    <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} text-sm`}>
                        Amount: <span className='font-bold tracking-tight'>Rp.{data.value.toLocaleString()}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="flex justify-center items-center gap-8 mt-4">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className={`${darkMode ? 'text-white' : 'text-black'} font-medium text-sm`}>
                            {entry.value}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="w-full lg:w-[60%]">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full h-full p-5 rounded-xl shadow transition-colors duration-200`}>
                <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>Statistik Keuangan</h2>
                <div className="w-full h-[calc(100%-40px)] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>

                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="40%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} text-sm font-medium`}
                                fill={darkMode ? "#D1D5DB" : "#6B7280"}
                            >
                                Total Saldo
                            </text>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xl font-bold"
                                fill={darkMode ? "#FFFFFF" : "#000000"}
                            >
                                Rp{totalSaldo.toLocaleString()}
                            </text>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                content={<CustomLegend />}
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default StatistikTotal