import { Button, Divider, Flex, Form, Space } from "antd";

import ServiceSection from "../../components/ServiceSection.jsx";
import SpareSection from "../../components/SpareSection.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import { DEFAULT_PAGE_SIZE, updateTotalCost } from "../../utils.jsx";

import styles from "../../components/CustomForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { StatusTag } from "../../components/StatusTag.jsx";
import { useFormPatch } from "../../hooks/useFormPatch.jsx";
import PaymentSummary from "../../components/PaymentSummary.jsx";
import { useState } from "react";
import { useSaveServiceForm } from "../../hooks/useSaveServiceForm.jsx";
import {DownloadOutlined} from "@ant-design/icons";

const CreateService = () => {
  const [form] = Form.useForm();
  const [spares, setSpares] = useState([]);
  const [services, setServices] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { serviceQuery,editMode,viewMode } = useFormPatch(
    form,
    id,
    setSpares,
    setServices,
  );

  const { saveOnlyValidations, saveForLater, editPrint, finalize } =
    useSaveServiceForm(form, id, editMode);

  const onValueChanged = (changed, all) => {
    if (Object.hasOwn(changed, "payments")) {
      form.setFieldsValue({
        totals: updateTotalCost(form),
      });
    }

    if (Object.hasOwn(changed, "services")) {
      form.setFieldsValue({
        totals: updateTotalCost(form),
        services: all.services.map((s) => ({
          ...s,
          total: Number(s.quantity) * Number(s.price),
        })),
      });
    }

    if (Object.hasOwn(changed, "spares")) {
      form.setFieldsValue({
        totals: updateTotalCost(form),
        spares: all.spares.map((s) => ({
          ...s,
          total: Number(s.quantity) * Number(s.price),
        })),
      });
    }
  };

  const items = [
    {
      label: "Finalize",
      key: 1,
    },

    {
      label: "Discard",
      key: 2,
    },
  ];

  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      className={viewMode ? styles.customForm : ""}
      onValuesChange={onValueChanged}
      layout="vertical"
      autoComplete="off"
      disabled={viewMode}
    >
      <Flex justify="space-between">
        <StatusTag status={serviceQuery.data.service?.status} />
        <h3>Service details</h3>
        <Button type="dashed" disabled={false} icon={<DownloadOutlined />} onClick={editPrint}>
          Download invoice
        </Button>
      </Flex>
      <Divider orientation="left" plain>
        Customer
      </Divider>

      <CustomerSection form={form} />

      <ServiceSection
        saveOnlyValidations={saveOnlyValidations}
        viewMode={viewMode}
        services={services}
        setServices={setServices}
      />

      <SpareSection
        saveOnlyValidations={saveOnlyValidations}
        viewMode={viewMode}
        spares={spares}
        setSpares={setSpares}
      />

      <PaymentSection viewMode={viewMode} />
      <PaymentSummary />

      <Divider orientation="left" plain />
      <Flex justify="space-between">
        <Space>
          <Button
            disabled={false}
            color="danger"
            variant="solid"
            onClick={() =>
              navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`)
            }
          >
            Close
          </Button>
        </Space>
        <Space>


          {viewMode || (
            <>
              <Button type="primary" onClick={saveForLater} htmlType="button">
                Save for later
              </Button>

              <Button type="primary" onClick={finalize}>
                Finalize
              </Button>
            </>
          )}
        </Space>
      </Flex>
    </Form>
  );
};

export default CreateService;
