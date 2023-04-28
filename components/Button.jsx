const Button = ({ classStyles, btnName, handleClick }) => (
  <button type="button" onClick={handleClick} className={`bg-baghchal-gray-2 text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-montserrat font-semibold text-white focus:scale-105 transition-all ease-in-out ${classStyles}`}>{btnName}</button>
);

export default Button;
