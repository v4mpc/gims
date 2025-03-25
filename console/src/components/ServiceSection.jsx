import { Button, Flex, Form, Input, InputNumber, Select, Space } from "antd";
import {
  API_ROUTES,
  getLookupData,
  optionLabelFilter,
  thousanSeparatorformatter,
  thousanSeparatorparser,
  updateTotalCost,
} from "../utils.jsx";
import { useQueries } from "@tanstack/react-query";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const ServiceSection = ({ saveOnlyValidations, viewMode }) => {
  const form = Form.useFormInstance();
  const [services, setServices] = useState([]);
  const results = useQueries({
    queries: [
      {
        staleTime: 1000 * 60 * 20,
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
    const serviceId = form.getFieldValue("selectedService");
    const [serviceObject] = serviceCatalogQuery.data.filter(
      (s) => s.id === serviceId,
    );
    const fields = form.getFieldValue("services") || [];
    form.setFieldsValue({
      services: [
        ...fields,
        {
          id: serviceObject.id,
          item: serviceObject.name,
          price: serviceObject.cost,
          quantity: serviceObject.quantity,
          total: Number(serviceObject.price) * Number(serviceObject.quantity),
        },
      ],
    });
    form.resetFields(["selectedService"]);
    setServices((prevState) => prevState.filter((s) => s.id !== serviceId));
  };

  const removeField = (key) => {
    console.log(key);
    const fields = form.getFieldValue("services") || [];
    const [selectedService] = fields.filter((f, index) => index === key);
    const [foundService] = serviceCatalogQuery.data.filter(
      (s) => s.id === selectedService.id,
    );
    setServices((prevState) => [
      ...prevState,
      { id: foundService.id, name: foundService.name },
    ]);

    form.setFieldsValue({
      services: fields.filter((_, index) => index !== key),
    });
    //update quantity here
    form.setFieldsValue({
      totals: updateTotalCost(form),
    });
  };

  return (
    <Flex vertical>
      {viewMode || (
        <Space style={{ marginBottom: "10px" }} align="baseline">
          <Form.Item
            rules={[
              ...(saveOnlyValidations
                ? []
                : [
                    {
                      validator: async (_, names) => {
                        if (
                          services.length === serviceCatalogQuery.data.length
                        ) {
                          return Promise.reject(
                            new Error("At least 1 service is required"),
                          );
                        }
                      },
                    },
                  ]),
            ]}
            name="selectedService"
          >
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
      )}

      {/*    start*/}
      <Form.List name="services">
        {(fields, { add, remove }) =>
          fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 5 }}
              align="baseline"
            >
              <Form.Item name={[name, "item"]} label={key === 0 ? "Item" : ""}>
                <Input style={{ width: "250px" }} placeholder="Item" />
              </Form.Item>
              <Form.Item
                name={[name, "price"]}
                label={key === 0 ? "Price" : ""}
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
                  placeholder="Price"
                />
              </Form.Item>

              <Form.Item
                name={[name, "quantity"]}
                label={key === 0 ? "Quantity" : ""}
                rules={[
                  ...(saveOnlyValidations
                    ? []
                    : [{ required: true, message: "Missing quantity" }]),
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
                    style={{ width: "200px" }}
                    placeholder="Total"
                  />
                </Form.Item>

                {viewMode || (
                  <MinusCircleOutlined onClick={() => removeField(key)} />
                )}
              </Space>
            </Space>
          ))
        }
      </Form.List>
      {/*    end*/}
    </Flex>
  );
};

export default ServiceSection;
