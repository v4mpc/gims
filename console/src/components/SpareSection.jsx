import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tooltip,
} from "antd";
import {
  API_ROUTES,
  generateSpareName,
  getLookupData,
  optionLabelFilter,
  thousanSeparatorformatter,
  thousanSeparatorparser,
  updateTotalCost,
} from "../utils.jsx";
import { useQueries } from "@tanstack/react-query";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const SpareSection = ({ viewMode, spares, setSpares }) => {
  const form = Form.useFormInstance();
  const availableSpares = form.getFieldValue("spares") ?? [];
  const results = useQueries({
    queries: [
      {
        queryKey: ["spareAll"],
        placeholderData: [],
        queryFn: () =>
          getLookupData(`${API_ROUTES.stockOnhandAll}?nonZeroSoh=false`),
      },
    ],
  });

  const [spareCatalogQuery] = results;

  useEffect(() => {
    setSpares(spareCatalogQuery.data);
  }, [spareCatalogQuery.data]);

  const addField = () => {
    if (form.getFieldValue("selectedSpare") === undefined) {
      return;
    }

    const spareId = form.getFieldValue("selectedSpare");
    const [spareObject] = spareCatalogQuery.data.filter(
      (s) => s.product.id === spareId,
    );

    const fields = form.getFieldValue("spares") || [];
    form.setFieldsValue({
      spares: [
        ...fields,
        {
          id: spareObject.product.id,
          itemId: spareObject.product.id,
          item: generateSpareName(spareObject.product),
          price: spareObject.product.salePrice,
          unit: spareObject.product.unitOfMeasure.code,
          soh: spareObject.stockOnhand,
          total: 0,
          currentKm: 0,
          nextKm: 0,
        },
      ],
    });

    form.resetFields(["selectedSpare"]);
    setSpares((prevState) => prevState.filter((s) => s.product.id !== spareId));
  };

  const isOilByKey = (key) => {
    const [spare] = form
      .getFieldValue(`spares`)
      .filter((value, index) => index === key);
    const [spareObject] = spareCatalogQuery.data.filter(
      (s) => s.product.id === spare.id,
    );
    return spareObject.product.isOil;
  };

  const removeField = (key) => {
    const fields = form.getFieldValue("spares") || [];
    const [selectedSpares] = fields.filter((f, index) => index === key);
    const [foundSpare] = spareCatalogQuery.data.filter(
      (s) => s.product.id === selectedSpares.id,
    );
    setSpares((prevState) => [...prevState, foundSpare]);

    form.setFieldsValue({
      spares: fields.filter((_, index) => index !== key),
    });
    //update quantity here
    form.setFieldsValue({
      totals: updateTotalCost(form),
    });
  };

  return (
    <Flex vertical>
      <Divider orientation="left" plain>
        <Tooltip title="Spare is SpareCode/SpareName/SpareCategory">
          <span>Spares</span>
        </Tooltip>
      </Divider>

      {viewMode || (
        <Space style={{ marginBottom: "10px" }} align="baseline">
          <Form.Item name="selectedSpare">
            <Select
              placeholder="Select spare"
              options={spares
                .filter((fc) => fc.stockOnhand > 0)
                .map((c) => ({
                  value: c.product.id,
                  label: generateSpareName(c.product),
                }))}
              style={{ width: "450px" }}
              showSearch
              loading={spareCatalogQuery.isLoading}
              filterOption={optionLabelFilter}
            ></Select>
          </Form.Item>

          <Button type="dashed" onClick={addField} icon={<PlusOutlined />}>
            Add
          </Button>
        </Space>
      )}

      {availableSpares.length === 0 && viewMode && <Empty />}

      <Form.List name="spares">
        {(fields, { add, remove }) =>
          fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 5 }}
              align="baseline"
            >
              <Form.Item name={[name, "itemId"]} hidden={true}>
                <InputNumber disabled />
              </Form.Item>

              <Form.Item name={[name, "item"]} label={key === 0 ? "Item" : ""}>
                <Input disabled style={{ width: "450px" }} placeholder="Item" />
              </Form.Item>

              <Form.Item name={[name, "unit"]} label={key === 0 ? "Unit" : ""}>
                <Input disabled style={{ width: "50px" }} />
              </Form.Item>
              <Form.Item
                name={[name, "price"]}
                label={key === 0 ? "Price" : ""}
                rules={[{ required: true, message: "Missing price" }]}
              >
                <InputNumber
                  style={{ width: "100px" }}
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  min={1}
                  placeholder="Price"
                />
              </Form.Item>

              <Form.Item name={[name, "soh"]} label={key === 0 ? "Stock" : ""}>
                <InputNumber
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  disabled={true}
                  min={1}
                />
              </Form.Item>

              <Form.Item
                name={[name, "quantity"]}
                label={key === 0 ? "Quantity" : ""}
                rules={[
                  { required: true, message: "Missing quantity" },

                  {
                    validator: async (_, value) => {
                      const [spare] = form
                        .getFieldValue("spares")
                        .filter((value, index) => index === key);

                      if (value > spare.soh) {
                        return Promise.reject(
                          new Error(
                            "Quantity should be less or equal to Stock",
                          ),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  placeholder="Quantity"
                  min={1}
                />
              </Form.Item>

              <Space align={key === 0 ? undefined : "baseline"}>
                <Form.Item
                  name={[name, "total"]}
                  label={key === 0 ? "Total" : ""}
                >
                  <InputNumber
                    formatter={thousanSeparatorformatter}
                    parser={thousanSeparatorparser}
                    disabled
                    style={{ width: "100px" }}
                    placeholder="Total"
                  />
                </Form.Item>

                {isOilByKey(key) && (
                  <>
                    <Form.Item
                      name={[name, "currentKm"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing current Kms",
                        },
                      ]}
                      label={key === 0 ? "Current Kms" : ""}
                    >
                      <InputNumber
                        formatter={thousanSeparatorformatter}
                        parser={thousanSeparatorparser}
                        style={{ width: "150px" }}
                        placeholder="Current Kms"
                      />
                    </Form.Item>

                    <Form.Item
                      name={[name, "nextKm"]}
                      label={key === 0 ? "Next Kms" : ""}
                      rules={[{ required: true, message: "Missing next Kms" }]}
                    >
                      <InputNumber
                        formatter={thousanSeparatorformatter}
                        parser={thousanSeparatorparser}
                        style={{ width: "150px" }}
                        placeholder="Next Kms"
                      />
                    </Form.Item>
                  </>
                )}

                {viewMode || (
                  <MinusCircleOutlined onClick={() => removeField(key)} />
                )}
              </Space>
            </Space>
          ))
        }
      </Form.List>
    </Flex>
  );
};

export default SpareSection;
