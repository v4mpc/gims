import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
} from "antd";
import {
  API_ROUTES,
  DATE_FORMAT,
  getLookupData,
  optionLabelFilter,
  thousanSeparatorformatter,
  thousanSeparatorparser,
  toCustomerCars,
} from "../../utils.jsx";
import { useQueries } from "@tanstack/react-query";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";

const { Option } = Select;

const { Text } = Typography;

const CreateService = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [fields, setFields] = useState([]);

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
          `quantity_${nextKey}','total_${nextKey}`,
        ],
      },
    ]);
    setServices(curr=>curr.filter(c=>c.id!==serviceObject.id));
    form.setFieldsValue({
      [`itemName_${nextKey}`]: serviceObject.name,
      [`price_${nextKey}`]: serviceObject.cost,
    });
    form.resetFields(["selectedService"]);
  };

  const removeField = (key) => {
    const itemName=form.getFieldValue(`itemName_${key}`);
    const [removedServiceObject]=serviceCatalogQuery.data.filter(s=>s.name===itemName);
    setFields(fields.filter((field) => field.key !== key));
    setServices([...services,removedServiceObject]);
  };

  const onValueChanged = (changed, all) => {
    // console.log(changed,all)
  };
  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      onValuesChange={onValueChanged}
      layout="vertical"
      autoComplete="off"
    >
      <Divider orientation="left" plain>
        Services
      </Divider>

      <Flex vertical>
        <Space style={{ marginBottom: "10px" }} align="baseline">
          <Form.Item name="selectedService">
            <Select
              placeholder="Select service"
              options={services.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              style={{ width: "400px" }}
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
            <Form.Item name={field.names[0]}>
              <Input disabled style={{ width: "250px" }} placeholder="Item" />
            </Form.Item>
            <Form.Item name={field.names[1]}>
              <InputNumber
                style={{ width: "150px" }}
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                min={1}
                placeholder="Price"
              />
            </Form.Item>

            <Form.Item name={field.names[2]}>
              <InputNumber
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                placeholder="Quantity"
                min={1}
              />
            </Form.Item>

            <Space align="baseline">
              <Form.Item name={field.names[3]}>
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
    </Form>
  );
};

export default CreateService;
