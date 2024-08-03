const ThousandSeparator = ({ value }) => {
  const addThousandSeparator = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <span>{addThousandSeparator(value)}</span>;
};

export default ThousandSeparator;
