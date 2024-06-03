"use client";

import React from "react";

interface InputProps {
  label: string;
  placeholder: string;
  type: string | "text" | "number" | "textArea";
  value: string;
  onChange: any;
  name: string;
  required: boolean;
  error: string | null | undefined;
  classes: string | undefined;
  iconClass: string | undefined;
  LeftIcon: null | undefined | (() => React.ReactNode);
  RightIcon: null | undefined | (() => React.ReactNode);
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  name,
  required,
  error,
  classes,
  iconClass,
  LeftIcon,
  RightIcon,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          className="text-sm font-semibold text-black dark:text-white"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="w-full relative">
        {LeftIcon && (
          <div
            className={`absolute top-[50%] left-3 transform -translate-y-1/2 ${iconClass}`}
          >
            {LeftIcon()}
          </div>
        )}
        {type === "textArea" ? (
          <textarea
            id={name}
            className={`w-full border-gray-300 shadow dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary bg-white dark:bg-customGrey-blackBg ${classes}`}
            name={name}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        ) : (
          <input
            id={name}
            type={type}
            className={`w-full border-gray-300 shadow dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary bg-white dark:bg-customGrey-blackBg ${classes}`}
            name={name}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}
        {RightIcon && (
          <div
            className={`absolute top-[50%] right-10 transform -translate-y-1/2 ${iconClass}`}
          >
            {RightIcon()}
          </div>
        )}
      </div>
      <p className="m-0 text-red-500 font-bold text-[13px] ms-2 mt-1">
        {error}
      </p>
    </div>
  );
};

export default Input;