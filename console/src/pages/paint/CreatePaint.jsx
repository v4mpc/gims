import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Flex, Form, Space } from "antd";
import { DEFAULT_PAGE_SIZE, updateTotalCost } from "../../utils.jsx";

import { StatusTag } from "../../components/StatusTag.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaintSection from "../../components/PaintSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import CollapseSection from "../../components/CollapseSection.jsx";
import styles from "../../components/CustomForm.module.css";
import { usePaintFormPatch } from "../../hooks/usePaintFormPatch.jsx";
import { DownloadOutlined } from "@ant-design/icons";
import PaymentSummary from "../../components/PaymentSummary.jsx";

const CreatePaint = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { paintQuery, editMode, viewMode } = usePaintFormPatch(form, id);

  const onValuesChanged = (changed, all) => {
    if (Object.hasOwn(changed, "paints")) {
      form.setFieldsValue({
        totals: updateTotalCost(form),
        services: all.services.map((s) => ({
          ...s,
          total: Number(s.quantity) * Number(s.price),
        })),
      });
    }
  };

  // const saveForLater = () => {
  //   setSaveOnlyValidation(true);
  //
  //   form.setFields([
  //     {
  //       name: "paints",
  //       errors: [], // Clear any existing errors
  //     },
  //     {
  //       name: "initialPayment",
  //       errors: [],
  //     },
  //
  //     {
  //       name: "initialPaymentDate",
  //       errors: [],
  //     },
  //
  //     {
  //       name: "finalPaymentDate",
  //       errors: [],
  //     },
  //   ]);
  //
  //   const fields = form.getFieldValue("paints") || [];
  //   // TODO understand flatmap
  //   form.setFields(
  //     fields.flatMap((_, index) => [
  //       { name: ["paints", index, "item"], errors: [] },
  //       { name: ["paints", index, "price"], errors: [] },
  //       { name: ["paints", index, "quantity"], errors: [] },
  //     ]),
  //   );
  //
  //   setTimeout(() => {
  //     form
  //       .validateFields()
  //       .then((values) => {
  //         let status = "DRAFT";
  //         const { estimateAmount, initialPayment, finalPayment } = values;
  //         if (initialPayment + finalPayment < estimateAmount) {
  //           status = "PARTIALLY_PAID";
  //         }
  //         if (initialPayment + finalPayment === 0) {
  //           status = "UNPAID";
  //         }
  //
  //         if (!editMode) {
  //           const updatedValues = { ...values, status: status };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: API_ROUTES.paints,
  //             method: "POST",
  //           };
  //           createItem(data);
  //         } else {
  //           const updatedValues = { ...values, status: status };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: `${API_ROUTES.paints}/${id}`,
  //             method: "PUT",
  //           };
  //           updateItem(data);
  //         }
  //       })
  //       .catch((errorInfo) => {
  //         console.error("Validation failed:", errorInfo);
  //       });
  //   }, 0);
  // };
  //
  // const finalize = async () => {
  //   setSaveOnlyValidation(false);
  //
  //   setTimeout(() => {
  //     form
  //       .validateFields()
  //       .then((values) => {
  //         if (!editMode) {
  //           const updatedValues = { ...values, status: "PAID" };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: API_ROUTES.paints,
  //             method: "POST",
  //           };
  //           createItem(data);
  //         } else {
  //           const updatedValues = { ...values, status: "PAID" };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: `${API_ROUTES.paints}/${id}`,
  //             method: "PUT",
  //           };
  //           updateItem(data);
  //         }
  //
  //         console.log("Form values:", values);
  //       })
  //       .catch((errorInfo) => {
  //         console.error("Validation failed:", errorInfo);
  //       });
  //   }, 0);
  // };

  return (
    <Form
      key="paintForm"
      variant="outlined"
      form={form}
      layout="vertical"
      className={viewMode ? styles.customForm : ""}
      autoComplete="off"
      onValuesChange={onValuesChanged}
      disabled={viewMode}
    >
      <Flex justify="space-between">
        <StatusTag status={paintQuery.data.paint?.status} />
        <h3>Paint details</h3>
        <Button type="dashed" disabled={false} icon={<DownloadOutlined />}>
          Download invoice
        </Button>
      </Flex>
      <Divider orientation="left" plain>
        Customer
      </Divider>

      <CustomerSection form={form} />

      <Divider orientation="left" plain>
        Items
      </Divider>
      <PaintSection />
      <CollapseSection />
      <PaymentSection viewMode={viewMode} />
      <PaymentSummary />
      <Divider orientation="left" plain />
        <Flex justify="space-between">
      <Space>
        <Button
          disabled={false}
          color="danger"
          variant="solid"
          onClick={() => navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`)}
        >
          Close
        </Button>
      </Space>
      <Space>
        {viewMode || (
          <>
            <Button type="primary" htmlType="button">
              Save for later
            </Button>

            <Button type="primary">Finalize</Button>
          </>
        )}
      </Space>
    </Flex>
    </Form>
  );
};
export default CreatePaint;
