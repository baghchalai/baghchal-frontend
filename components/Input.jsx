import React from 'react';

const Input = ({ inputType, title, placeholder, handleClick, hidePassword, value, defaultValue }) => (
  <div className="mt-6 w-full">
    <p className="font-montserrat font-semibold text-xl">
      {title}
    </p>
    {inputType === 'number' ? (
      <div className="border dark:border-baghchal-black-1 border-baghchal-gray-2 w-full outline-none font-poppinstext-baghchal-gray-2 text-base mt-4 px-4 py-2 flexBetween flex-row">
        <input
          defaultValue={defaultValue}
          value={value}
          type="number"
          className="flex w-full dark:bg-baghchal-black-1 outline-none"
          placeholder={placeholder}
          onChange={handleClick}
        />
      </div>
    ) : inputType === 'textarea' ? (
      <textarea
        defaultValue={defaultValue}
        rows={10}
        className="dark:bg-baghchal-black-1 border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-sm w-full outline-none font-poppins dark:text-white text-baghchal-gray-2 text-base mt-4 px-4 py-2"
        placeholder={placeholder}
        onChange={handleClick}
      />
    ) : inputType === 'password' ? (
      <input
        defaultValue={defaultValue}
        value={value}
        type={hidePassword ? 'password' : 'text'}
        className="dark:bg-baghchal-black-1 border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-sm w-full outline-none font-poppins dark:text-white text-baghchal-gray-2 text-base mt-4 px-4 py-2"
        placeholder={placeholder}
        onChange={handleClick}
      />
    ) : (
      <input
        defaultValue={defaultValue}
        value={value}
        className="dark:bg-baghchal-black-1 border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-sm w-full outline-none font-poppins text-white text-base mt-4 px-4 py-2"
        placeholder={placeholder}
        onChange={handleClick}
      />
    )}
  </div>
);

export default Input;
