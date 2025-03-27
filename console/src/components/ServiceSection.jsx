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
} from "antd";
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
import { useEffect } from "react";

const ServiceSection = ({
  saveOnlyValidations,
  viewMode,
  services,
  setServices,
}) => {
  const form = Form.useFormInstance();
  const availableServices = form.getFieldValue("services") ?? [];
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
  }, [serviceCatalogQuery.data, setServices]);

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
          total: 0,
        },
      ],
    });
    form.resetFields(["selectedService"]);
    setServices((prevState) => prevState.filter((s) => s.id !== serviceId));
  };

  const removeField = (key) => {
    const fields = form.getFieldValue("services") || [];
    const [selectedService] = fields.filter((f, index) => index === key);
    const [foundService] = serviceCatalogQuery.data.filter(
      (s) => s.name === selectedService.item,
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
      <Divider orientation="left" plain>
        Services
      </Divider>

      {viewMode || (
        <Space style={{ marginBottom: "10px" }} align="baseline">
          <Form.Item name="selectedService">
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

      {availableServices.length === 0 && viewMode && <Empty />}

      <Form.List
        name="services"

      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 5 }}
                align="baseline"
              >
                <Form.Item
                  name={[name, "item"]}
                  label={key === 0 ? "Item" : ""}
                >
                  <Input style={{ width: "250px" }} disabled />
                </Form.Item>
                <Form.Item
                  name={[name, "price"]}
                  label={key === 0 ? "Price" : ""}
                  rules={[
                    ...(saveOnlyValidations
                      ? [{ required: true, message: "Missing price" }]
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
                      ? [{ required: true, message: "Missing quantity" }]
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
            ))}

          </>
        )}
      </Form.List>
    </Flex>
  );
};

export default ServiceSection;
