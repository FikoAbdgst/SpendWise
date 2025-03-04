import React from "react";
import { BiWallet } from "react-icons/bi";
import { GrMoney } from "react-icons/gr";
import { LuWalletMinimal } from "react-icons/lu";

const CardsTotal = ({ darkMode, totalSaldo, totalPemasukan, totalPengeluaran }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } flex items-center gap-3 p-4 rounded-xl shadow transition-colors duration-200`}
      >
        <div className="bg-purple-500 p-3 rounded-full text-white shadow-lg">
          <BiWallet size={20} />
        </div>
        <div className="flex justify-center flex-col">
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            Sisa Saldo
          </p>
          <p className={`${darkMode ? "text-white" : "text-black"} font-semibold`}>
            Rp.{totalSaldo.toLocaleString()}
          </p>
        </div>
      </div>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } flex items-center gap-3 p-4 rounded-xl shadow transition-colors duration-200`}
      >
        <div className="bg-orange-500 p-3 rounded-full text-white shadow-lg">
          <LuWalletMinimal size={20} />
        </div>
        <div className="flex justify-center flex-col">
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            Total Pemasukan
          </p>
          <p className={`${darkMode ? "text-white" : "text-black"} font-semibold`}>
            Rp.{totalPemasukan.toLocaleString()}
          </p>
        </div>
      </div>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } flex items-center gap-3 p-4 rounded-xl shadow transition-colors duration-200`}
      >
        <div className="bg-red-500 p-3 rounded-full text-white shadow-lg">
          <GrMoney size={20} className={darkMode ? "text-white" : ""} />
        </div>
        <div className="flex justify-center flex-col">
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            Total Pengeluaran
          </p>
          <p className={`${darkMode ? "text-white" : "text-black"} font-semibold`}>
            Rp.{totalPengeluaran.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardsTotal;
