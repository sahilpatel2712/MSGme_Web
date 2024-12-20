"use client";

import { BackIcon, LogoutIcon } from "@/utils/svgs";
import { useRouter } from "next/navigation";

const SettingsHeader = ({
  showLogout,
  headerText,
  logout,
}: {
  headerText: string;
  showLogout: Boolean | undefined;
  logout?: any;
}) => {
  const navigation = useRouter();
  return (
    <section className="w-full flex justify-between items-center p-4 h-[70px] text-black dark:text-white bg-white dark:bg-customGrey-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <button
          className=" rounded-full bg-gray-50  p-2 flex justify-center items-center  active:scale-[.97] dark:bg-gray-700"
          onClick={() => navigation.back()}
        >
          {BackIcon()}
        </button>
        <p className="text-[20px] font-bold">{headerText}</p>
      </div>
      {showLogout && (
        <button
          className="bg-[#FFEEEE] dark:bg-gray-700 text-[#E75F5F] dark:text-red-500 font-semibold flex gap-1 p-3 py-2 rounded-full items-center active:scale-[.97]"
          onClick={() => logout.mutate()}
        >
          <span>Logout</span>
          {LogoutIcon()}
        </button>
      )}
    </section>
  );
};

export default SettingsHeader;
