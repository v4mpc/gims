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

const ServiceSection = ({ form,saveOnlyValidations,editMode,fields,setFields }) => {

  const [services, setServices] = useState([]);

  const results = useQueries({
    queries: [
      {
        queryKey: ["serviceAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.serviceCatalogsAll),
      },
    ],
  });

  const [serviceCatalogQuery] = results;

  useEffect(() => {
    setServices(serviceCatalogQuery.data);
  }, [serviceCatalogQuery.data]);

  const addField = () => {
    if (form.getFieldValue("selectedService") === undefined) {
      return;
    }

    const [serviceObject] = serviceCatalogQuery.data.filter(
      (s) => s.id === form.getFieldValue("selectedService"),
    );
    const nextKey = fields.length;
    setFields([
      ...fields,
      {
        key: nextKey,
        names: [
          `itemName_${nextKey}`,
          `price_${nextKey}`,
          `quantity_${nextKey}`,
          `total_${nextKey}`,
        ],
      },
    ]);
    setServices((curr) => curr.filter((c) => c.id !== serviceObject.id));
    form.setFieldsValue({
      [`itemName_${nextKey}`]: serviceObject.name,
      [`price_${nextKey}`]: serviceObject.cost,
    });
    form.resetFields(["selectedService"]);
  };

  const removeField = (key) => {
    const itemName = form.getFieldValue(`itemName_${key}`);
    const [removedServiceObject] = serviceCatalogQuery.data.filter(
      (s) => s.name === itemName,
    );
    setFields(fields.filter((field) => field.key !== key));
    setServices([...services, removedServiceObject]);
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
        <Form.Item
            rules={[
                ...(saveOnlyValidations
                    ? []
                    : [
                        {
                            validator: async (_, names) => {
                                console.log("am here");
                                if (services.length===serviceCatalogQuery.data.length) {
                                    return Promise.reject(
                                        new Error("At least 1 service is required"),
                                    );
                                }
                            },
                        },
                    ]),
            ]} name="selectedService">
          <Select
            placeholder="Select service"





            options={services.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            style={{ width: "450px" }}
            showSearch
            loading={serviceCatalogQuery.isLoading}
            filterOption={optionLabelFilter}
          ></Select>
        </Form.Item>

        <Button type="dashed" onClick={addField} icon={<PlusOutlined />}>
          Add
        </Button>
      </Space>

      {fields.map((field, index) => (
        <Space
          key={field.key}
          style={{ display: "flex", marginBottom: 5 }}
          align="baseline"
        >
          <Form.Item
            name={field.names[0]}
            label={field.key === 0 ? "Item" : ""}
          >
            <Input disabled style={{ width: "250px" }} placeholder="Item" />
          </Form.Item>
          <Form.Item
            name={field.names[1]}
            label={field.key === 0 ? "Price" : ""}
            rules={[
                ...(saveOnlyValidations
                    ? []
                    : [{ required: true, message: "Missing price" }]),
            ]}
          >
            <InputNumber
              style={{ width: "150px" }}
              formatter={thousanSeparatorformatter}
              parser={thousanSeparatorparser}
              min={1}
              onChange={(value) => onPriceChange(value, field.key)}
              placeholder="Price"
            />
          </Form.Item>

          <Form.Item
            name={field.names[2]}
            label={field.key === 0 ? "Quantity" : ""}

            rules={[
                ...(saveOnlyValidations
                    ? []
                    : [{ required: true, message: "Missing quantity" }]),
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
              name={field.names[3]}
              label={field.key === 0 ? "Total" : ""}
            >
              <InputNumber
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                disabled
                style={{ width: "200px" }}
                placeholder="Total"
              />
            </Form.Item>

            <MinusCircleOutlined onClick={() => removeField(field.key)} />
          </Space>
        </Space>
      ))}
    </Flex>
  );
};

export default ServiceSection;
