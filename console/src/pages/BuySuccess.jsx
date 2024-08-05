import { Button, Result } from "antd";
import { Link, useLocation } from "react-router-dom";

const BuySuccess = () => {
  const location = useLocation();
  console.log(location.state);


  // TODO:: Should not be able to navigate to this page is isSale not set
  return (
    <Result
      status="success"
      title={`Successfully ${location.state?.isSale ? "Sold" : "Bought new"} Products`}
      subTitle="Happy Selling"
      extra={[
        <Button type="primary" key="console">
          <Link to="/dashboard">Go Dashboard</Link>
        </Button>,
        <Button key="buy">
          {location.state?.isSale ? (
            <Link to="/sell">Sell Again</Link>
          ) : (
            <Link to="/buy">Buy Again</Link>
          )}
        </Button>,
      ]}
    />
  );
};
export default BuySuccess;
