import { Button, Flex, Form, Input, InputNumber, Select, Space } from "antd";
import {
  API_ROUTES,
  getLookupData,
  optionLabelFilter,
  thousanSeparatorformatter,
  thousanSeparatorparser,
} from "../utils.jsx";
import { useQueries } from "@tanstack/react-query";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const SpareSection = ({
  form,
  saveOnlyValidations,
  sparefields,
  setSparefields,
  spares,
  setSpares,
  spareCatalogQuery,
}) => {
  const addField = () => {
    if (form.getFieldValue("selectedSpare") === undefined) {
      return;
    }

    const [spareObject] = spareCatalogQuery.data.filter(
      (s) => s.product.id === form.getFieldValue("selectedSpare"),
    );
    const nextKey = sparefields.length;
    setSparefields([
      ...sparefields,
      {
        key: nextKey,
        names: [
          `itemName_${nextKey}`,
          `unit_${nextKey}`,
          `price_${nextKey}`,
          `soh_${nextKey}`,
          `quantity_${nextKey}`,
          `total_${nextKey}`,
          `currentKm_${nextKey}`,
          `nextKm_${nextKey}`,
        ],
      },
    ]);
    setSpares((curr) => curr.filter((c) => c.product.id !== spareObject.product.id));
    form.setFieldsValue({
      [`itemName_${nextKey}`]: `${spareObject.product.code}-${spareObject.product.name}-${spareObject.product.category.name}`,
      [`price_${nextKey}`]: spareObject.product.salePrice,
      [`soh_${nextKey}`]: spareObject.stockOnhand,
      [`unit_${nextKey}`]: spareObject.product.unitOfMeasure.code,
    });
    form.resetFields(["selectedSpare"]);
  };

  const isOilByKey = (key) => {
    const itemName = form.getFieldValue(`itemName_${key}`);
    const [spareObject] = spareCatalogQuery.data.filter(
      (s) => `${s.product.code}-${s.product.name}-${s.product.category.name}` === itemName,
    );
    return spareObject.product.isOil;
  };

  const removeField = (key) => {
    const itemName = form.getFieldValue(`itemName_${key}`);
    const [removedSpareObject] = spareCatalogQuery.data.filter(
      (s) => `${s.product.code}-${s.product.name}-${s.product.category.name}` === itemName,
    );
    setSparefields(sparefields.filter((field) => field.key !== key));
    setSpares([...spares, removedSpareObject]);
  };

  const onPriceChange = (e, key) => {
    const quantity = form.getFieldValue(`quantity_${key}`) ?? 0;
    form.setFieldsValue({
      [`total_${key}`]: e * quantity,
    });
  };

  const onQuantityChange = (e, key) => {
    const price = form.getFieldValue(`price_${key}`) ?? 0;
    form.setFieldsValue({
      [`total_${key}`]: price * e,
    });
  };

  return (
    <Flex vertical>
      <Space style={{ marginBottom: "10px" }} align="baseline">
        <Form.Item name="selectedSpare">
          <Select
            placeholder="Select spare"
            options={spares.map((c) => ({
              value: c.product.id,
              label: `${c.product.code}-${c.product.name}-${c.product.category.name}`,
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

      {sparefields.map((field, index) => (
        <Space
          key={field.key}
          style={{ display: "flex", marginBottom: 5 }}
          align="baseline"
        >
          <Form.Item
            name={field.names[0]}
            label={field.key === 0 ? "Item" : ""}
          >
            <Input disabled style={{ width: "450px" }} placeholder="Item" />
          </Form.Item>

          <Form.Item
            name={field.names[1]}
            label={field.key === 0 ? "Unit" : ""}
          >
            <Input disabled style={{ width: "50px" }} />
          </Form.Item>
          <Form.Item
            name={field.names[2]}
            label={field.key === 0 ? "Price" : ""}
            rules={[
              ...(saveOnlyValidations
                ? []
                : [{ required: true, message: "Missing price" }]),
            ]}
          >
            <InputNumber
              style={{ width: "100px" }}
              formatter={thousanSeparatorformatter}
              parser={thousanSeparatorparser}
              min={1}
              onChange={(value) => onPriceChange(value, field.key)}
              placeholder="Price"
            />
          </Form.Item>


            <Form.Item
                name={field.names[3]}
                label={field.key === 0 ? "SOH" : ""}
            >
                <InputNumber
                    formatter={thousanSeparatorformatter}
                    parser={thousanSeparatorparser}
                    placeholder="SOH"
                    disabled={true}
                    min={1}

                />
            </Form.Item>

          <Form.Item
            name={field.names[4]}
            label={field.key === 0 ? "Quantity" : ""}
            rules={[
              ...(saveOnlyValidations
                ? []
                : [{ required: true, message: "Missing quantity" },

                      {
                          validator: async (_, value) => {
                              if(value>form.getFieldValue(`soh_${field.key}`)){
                                  console.log(value,form.getFieldValue(`soh_${field.key}`))
                                  return Promise.reject(
                                      new Error("Quantity should be less or equal to SOH"),
                                  );

                              }
                              return Promise.resolve();

                          },
                      }



                  ]),
            ]}
          >
            <InputNumber
              onChange={(value) => onQuantityChange(value, field.key)}
              formatter={thousanSeparatorformatter}
              parser={thousanSeparatorparser}
              placeholder="Quantity"
              min={1}
            />
          </Form.Item>

          <Space align={field.key === 0 ? undefined : "baseline"}>
            <Form.Item
              name={field.names[5]}
              label={field.key === 0 ? "Total" : ""}
            >
              <InputNumber
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                disabled
                style={{ width: "100px" }}
                placeholder="Total"
              />
            </Form.Item>

            {isOilByKey(field.key) && (
              <>
                <Form.Item
                  name={field.names[6]}
                  rules={[
                    ...(saveOnlyValidations
                      ? []
                      : [{ required: true, message: "Missing current Kms" }]),
                  ]}
                  label={field.key === 0 ? "Current Kms" : ""}
                >
                  <InputNumber
                    formatter={thousanSeparatorformatter}
                    parser={thousanSeparatorparser}
                    style={{ width: "150px" }}
                    placeholder="Current Kms"
                  />
                </Form.Item>

                <Form.Item
                  name={field.names[7]}
                  label={field.key === 0 ? "Next Kms" : ""}
                  rules={[
                    ...(saveOnlyValidations
                      ? []
                      : [{ required: true, message: "Missing next Kms" }]),
                  ]}
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

            <MinusCircleOutlined onClick={() => removeField(field.key)} />
          </Space>
        </Space>
      ))}
    </Flex>
  );
};

export default SpareSection;
