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
  Select,
  Space,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AsyncModal from "../components/AsyncModal.jsx";
import ThousandSeparator from "../components/ThousandSeparator.jsx";
import { useQueries } from "@tanstack/react-query";
import {API_ROUTES, getLookupData, thousanSeparatorformatter, thousanSeparatorparser} from "../utils.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

export default function GenericBuy({ urlPath, isSale, queryKey }) {
  const [searchCategory, setSearchCategory] = useState("ALL");

  const results = useQueries({
    queries: [
      {
        queryKey: [queryKey],
        placeholderData: [],
        queryFn: () => getLookupData(urlPath),
      },
      {
        queryKey: ["categoriesAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.categoriesAll),
      },
    ],
  });
  const [resultsQuery, categoriesQuery] = results;

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
          <Text>{record.productCode}</Text>
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
          <InputNumber formatter={thousanSeparatorformatter} parser={thousanSeparatorparser}
            min={0}
            onBlur={(e) => handleInputQuantityChanged(record, e)}
            max={record.stockOnHand}
            defaultValue={record.saleQuantity}
          />
        ) : (
          <InputNumber
              formatter={thousanSeparatorformatter} parser={thousanSeparatorparser}
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
      resultsQuery.data.map((p) => ({
        id: p.product.id,
        productName: p.product.name,
        buyPrice: p.product.buyPrice,
        salePrice: p.product.salePrice,
        stockOnHand: p.stockOnhand,
        unit: p.product.unitOfMeasure.code,
        saleQuantity: 0,
        categoryName: p.product.category.name,
        categoryId: p.product.category.id,
        productCode: p.product.code,
        saleDate: dayjs(),
      })),
    );
  }, [resultsQuery.data]);

  const filteredCategoryDataSource = stockOnhand.filter((item) => {
    if (searchCategory === "ALL") {
      return true;
    }
    return item.categoryId === searchCategory;
  });

  const filteredDataSource = filteredCategoryDataSource.filter((item) =>
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

  const filterChanged = (value) => {
    setSearchCategory(value);
  };

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

  const categories = [{ id: "ALL", name: "ALL" }, ...categoriesQuery.data];

  return (
    <>
      <Row gutter={16}>
        <Col span={9}>
          <Flex gap="middle" vertical>
            <Flex justify="space-between">
              <Space>
                <Select
                  showSearch
                  placeholder="Filter by category"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: '200px' }}
                  onChange={filterChanged}
                  loading={categoriesQuery.isLoading}
                  defaultValue="ALL"
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                />

                <Input
                  placeholder="Search Product..."
                  allowClear
                  onChange={(e) => handleFilterProducts(e.target.value)}
                />
              </Space>
            </Flex>

            <Table
              columns={productColumns}
              dataSource={notSales}
              bordered={true}
              loading={resultsQuery.isLoading}
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
