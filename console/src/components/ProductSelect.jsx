import { Select, Form } from "antd";
import { API_ROUTES, BASE_URL,filterOption } from "../utils.jsx";
import { useEffect, useState } from "react";

const ProductSelect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const productOptions = products.map((product) => ({
    label: product.name,
    value: product.id,
  }));



  async function getData() {
    setIsLoading(true);
    const resp = await fetch(`${BASE_URL}/${API_ROUTES.productAll}`);
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    const respData = await resp.json();
    setProducts(respData);
    setIsLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Form.Item key="product" label="Product" name="product">
      <Select
        allowClear={true}
        showSearch={true}
        loading={isLoading}
        options={productOptions}
        filterOption={filterOption}
        placeholder="Select Product"
      ></Select>
    </Form.Item>
  );
};

export default ProductSelect;
