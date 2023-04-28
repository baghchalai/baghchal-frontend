import React from 'react';

const Input = ({ inputType, title, placeholder, handleClick, hidePassword, value, defaultValue }) => (
  <div className="mt-10 w-full">
    <p className="font-montserrat text-white font-semibold text-xl">
      {title}
    </p>
    {inputType === 'number' ? (
      <div className="dark:bg-baghchal-black-1 bg-white border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-baghchal-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
        <input
          defaultValue={defaultValue}
          value={value}
          type="number"
          className="flex w-full dark:bg-baghchal-black-1 bg-white outline-none"
          placeholder={placeholder}
          onChange={handleClick}
        />
      </div>
    ) : inputType === 'textarea' ? (
      <textarea
        defaultValue={defaultValue}
        rows={10}
        className="dark:bg-baghchal-black-1 bg-white border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-baghchal-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    ) : inputType === 'password' ? (
      <input
        defaultValue={defaultValue}
        value={value}
        type={hidePassword ? 'password' : 'text'}
        className="dark:bg-baghchal-black-1 bg-white border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-baghchal-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    ) : (
      <input
        defaultValue={defaultValue}
        value={value}
        className="dark:bg-baghchal-black-1 bg-white border dark:border-baghchal-black-1 border-baghchal-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-baghchal-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    )}
  </div>
);

export default Input;
