import React from "react";
import { BiWallet } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const formatRupiah = (amount) => {
  // Make sure amount is a number
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  return `Rp.${numAmount.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const CardsTotal = ({ darkMode, totalSaldo, totalPemasukan, totalPengeluaran }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Saldo Card */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
      >
        <div className="relative p-4">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500 opacity-10 -mr-8 -mt-8"></div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-lg text-white shadow-lg flex-shrink-0">
              <BiWallet size={24} />
            </div>
            <div className="flex flex-col z-10">
              <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Sisa Saldo
              </p>
              <p className={`${darkMode ? "text-white" : "text-gray-800"} font-bold text-lg md:text-xl`}>
                {formatRupiah(totalSaldo)}
              </p>
            </div>
          </div>
        </div>
        <div className={`h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600`}></div>
      </div>

      {/* Pemasukan Card */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
      >
        <div className="relative p-4">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-green-500 opacity-10 -mr-8 -mt-8"></div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg text-white shadow-lg flex-shrink-0">
              <IoWalletOutline size={24} />
            </div>
            <div className="flex flex-col z-10">
              <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Total Pemasukan
              </p>
              <p className={`${darkMode ? "text-white" : "text-gray-800"} font-bold text-lg md:text-xl`}>
                {formatRupiah(totalPemasukan)}
              </p>
            </div>
          </div>
        </div>
        <div className={`h-1 w-full bg-gradient-to-r from-green-400 to-green-600`}></div>
      </div>

      {/* Pengeluaran Card */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1`}
      >
        <div className="relative p-4">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-red-500 opacity-10 -mr-8 -mt-8"></div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-lg text-white shadow-lg flex-shrink-0">
              <RiMoneyDollarCircleLine size={24} />
            </div>
            <div className="flex flex-col z-10">
              <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Total Pengeluaran
              </p>
              <p className={`${darkMode ? "text-white" : "text-gray-800"} font-bold text-lg md:text-xl`}>
                {formatRupiah(totalPengeluaran)}
              </p>
            </div>
          </div>
        </div>
        <div className={`h-1 w-full bg-gradient-to-r from-red-400 to-red-600`}></div>
      </div>
    </div>
  );
};

export default CardsTotal;