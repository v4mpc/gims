import {
  Button,
  Col,
  Row,
  Table,
  InputNumber,
  Flex,
  Typography,
  DatePicker,
  Tag,
  Input,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AsyncModal from "../components/AsyncModal.jsx";
import ThousandSeparator from "../components/ThousandSeparator.jsx";
import { useQuery } from "@tanstack/react-query";
import { getLookupData } from "../utils.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

export default function GenericBuy({ urlPath, isSale, queryKey }) {
  const { isLoading, data: stockOnhandData } = useQuery({
    queryKey: [queryKey],
    placeholderData: [],
    queryFn: () => getLookupData(urlPath),
  });

  const [stockOnhand, setStockOnhand] = useState([]);
  const [searchText, setSearchText] = useState("");
  const productColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product",
      key: "product",

      render: (_, record) => (
        <Flex vertical gap="middle">
          <Text strong>{record.productName}</Text>
          <Flex gap="middle" vertical={false}>
            <Tag>{record.categoryName}</Tag>

            <Tag bordered={false} color="processing">
              Sell <ThousandSeparator value={record.salePrice} /> TZS
            </Tag>

            <Tag bordered={false} color="processing">
              Buy <ThousandSeparator value={record.buyPrice} /> TZS
            </Tag>
          </Flex>
        </Flex>
      ),
    },

    {
      title: "Stock on hand",
      dataIndex: "stockOnhand",
      key: "stockOnhand",
      render: (_, record) => <ThousandSeparator value={record.stockOnHand} />,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleProductAdd(record)}
          icon={<PlusOutlined />}
        ></Button>
      ),
    },
  ];
  const saleColumns = [
    ...productColumns.filter((pc) => pc.title !== "Action"),
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) =>
        isSale ? (
          <InputNumber
            min={0}
            onBlur={(e) => handleInputQuantityChanged(record, e)}
            max={record.stockOnHand}
            defaultValue={record.saleQuantity}
          />
        ) : (
          <InputNumber
            min={0}
            onBlur={(e) => handleInputQuantityChanged(record, e)}
            defaultValue={record.saleQuantity}
          />
        ),
    },

    {
      title: "Date",
      key: "saleDate",
      render: (_, record) => (
        <DatePicker
          value={record.saleDate}
          onChange={(e) => handleInputDateChanged(record, e)}
        />
      ),
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleProductRemove(record)}
          icon={<MinusOutlined />}
        ></Button>
      ),
    },
  ];

  useEffect(() => {
    setStockOnhand(
      stockOnhandData.map((p) => ({
        id: p.product.id,
        productName: p.product.name,
        buyPrice: p.product.buyPrice,
        salePrice: p.product.salePrice,
        stockOnHand: p.stockOnhand,
        unit: p.product.unitOfMeasure.code,
        saleQuantity: 0,
        categoryName: p.product.category.name,
        saleDate: dayjs(),
      })),
    );
  }, [stockOnhandData]);

  const filteredDataSource = stockOnhand.filter((item) =>
    searchText === ""
      ? item
      : item.productName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const notSales = filteredDataSource.filter((p) => p.saleQuantity <= 0);
  const sales = stockOnhand.filter((p) => p.saleQuantity > 0);
  const totalSales = sales.reduce((acc, curr) => {
    if (isSale) {
      return acc + curr.saleQuantity * curr.salePrice;
    }
    return acc + curr.saleQuantity * curr.buyPrice;
  }, 0);

  function handleProductAdd(product) {
    setStockOnhand((stockOnHand) =>
      stockOnHand.map((p) =>
        product.id === p.id ? { ...p, saleQuantity: 1 } : { ...p },
      ),
    );
  }

  function handleProductRemove(product) {
    setStockOnhand((products) =>
      products.map((p) =>
        product.id === p.id ? { ...p, saleQuantity: 0 } : p,
      ),
    );
  }

  function handleInputQuantityChanged(product, e) {
    const inputValue = Number(e.target.value);
    if (inputValue == null) return;
    setStockOnhand((products) =>
      products.map((p) =>
        product.id === p.id ? { ...p, saleQuantity: inputValue } : p,
      ),
    );
  }

  function handleInputDateChanged(product, dateValue) {
    if (dateValue == null) return;
    setStockOnhand((products) =>
      products.map((p) =>
        product.id === p.id ? { ...p, saleDate: dateValue } : p,
      ),
    );
  }

  function handleFilterProducts(typedValue) {
    setSearchText(typedValue);
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={9}>
          <Flex gap="middle" vertical>
            <Input
              placeholder="Search Product..."
              onChange={(e) => handleFilterProducts(e.target.value)}
            />
            <Table
              columns={productColumns}
              dataSource={notSales}
              bordered={true}
              loading={isLoading}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Flex>
        </Col>
        <Col span={15}>
          <Flex gap="middle" vertical>
            <Text strong>Items to {`${isSale ? "Sell" : "Buy"}`}</Text>
            <Table
              columns={saleColumns}
              dataSource={sales}
              bordered={true}
              scroll={{ x: "max-content" }}
              rowKey="id"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={4} index={0}>
                      <Text strong>Total Cost</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={2} index={1}>
                      <Text strong>{totalSales.toLocaleString()} TZS</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Flex>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <AsyncModal
            postData={sales}
            isSale={isSale}
            queryKey={queryKey}
          ></AsyncModal>
        </Col>
      </Row>
    </>
  );
}
