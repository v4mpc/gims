import {Button, Divider, Flex, Form, Space} from "antd";

import ServiceSection from "../../components/ServiceSection.jsx";
import SpareSection from "../../components/SpareSection.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaymentMethodSection from "../../components/PaymentMethodSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import {API_ROUTES, DEFAULT_PAGE_SIZE, openNotification, putItem} from "../../utils.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {StatusTag} from "../../components/StatusTag.jsx";

const CreateService = () => {
  const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
    const queryClient = useQueryClient();

    const editMode = id !== undefined;
    let editValues = {
        initialPayment: 0,
        finalPayment: 0,
        grandTotal: 0,
        status: "DRAFT",
    };




    const { mutate: createItem, isLoading: isCreating } = useMutation({
        mutationFn: putItem,
        onSuccess: () => {
            form?.resetFields();
            navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`);
            openNotification(
                "post-success",
                "success",
                "Success",
                "Record save successfully",
            );
            queryClient.invalidateQueries("services");
        },
        onError: (error) => {
            console.log("there was an error " + error);
        },
    });

    const { mutate: updateItem, isLoading: isEditing } = useMutation({
        mutationFn: putItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["singleService", id] });
            queryClient.invalidateQueries("services");

            form?.resetFields();
            navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`);
            openNotification(
                "post-success",
                "success",
                "Success",
                "Record updated successfully",
            );
        },
        onError: (error) => {
            console.log("there was an error " + error);
        },
    });




    const onValueChanged = (changed, all) => {
    // console.log(changed,all)
  };



    const saveForLater = () => {
        setSaveOnlyValidation(true);

        form.setFields([
            {
                name: "paints",
                errors: [], // Clear any existing errors
            },
            {
                name: "initialPayment",
                errors: [],
            },

            {
                name: "initialPaymentDate",
                errors: [],
            },

            {
                name: "finalPaymentDate",
                errors: [],
            },
        ]);

        const fields = form.getFieldValue("paints") || [];
        // TODO understand flatmap
        form.setFields(
            fields.flatMap((_, index) => [
                { name: ["paints", index, "item"], errors: [] },
                { name: ["paints", index, "price"], errors: [] },
                { name: ["paints", index, "quantity"], errors: [] },
            ]),
        );

        setTimeout(() => {
            form
                .validateFields()
                .then((values) => {
                    let status = "DRAFT";
                    const { estimateAmount, initialPayment, finalPayment } = values;
                    if (initialPayment + finalPayment < estimateAmount) {
                        status = "PARTIALLY_PAID";
                    }
                    if (initialPayment + finalPayment === 0) {
                        status = "UNPAID";
                    }

                    if (!editMode) {
                        const updatedValues = { ...values, status: status };
                        const data = {
                            values: updatedValues,
                            urlPath: API_ROUTES.paints,
                            method: "POST",
                        };
                        createItem(data);
                    } else {
                        const updatedValues = { ...values, status: status };
                        const data = {
                            values: updatedValues,
                            urlPath: `${API_ROUTES.paints}/${id}`,
                            method: "PUT",
                        };
                        updateItem(data);
                    }
                })
                .catch((errorInfo) => {
                    console.error("Validation failed:", errorInfo);
                });
        }, 0);
    };



  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      initialValues={editValues}

      onValuesChange={onValueChanged}
      layout="vertical"
      autoComplete="off"
    >
        <Flex justify="flex-end">
            <StatusTag status={form.getFieldValue("status")} />
        </Flex>
      <Divider orientation="left" plain>
        Customer
      </Divider>
      <CustomerSection form={form} />

      <Divider orientation="left" plain>
        Services
      </Divider>

      <ServiceSection form={form} />

      <Divider orientation="left" plain>
        Spares
      </Divider>

      <SpareSection form={form} />
        <Divider orientation="left" plain>
            Payments
        </Divider>
        <PaymentSection saveOnlyValidations={true}/>



        <Divider orientation="left" plain />

        <Flex justify="space-between">
            <Space>
                <Button
                    htmlType="button"
                    onClick={() => navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`)}
                >
                    Cancel
                </Button>

                <Button htmlType="button" onClick={form.resetFields}>
                    Reset
                </Button>
            </Space>
            <Space>
                {/*<Button type="dashed" onClick={finalize} htmlType="button">*/}
                {/*    Print invoice*/}
                {/*</Button>*/}

                <Button type="primary" onClick={saveForLater} htmlType="button">
                    Save for later
                </Button>

                {/*<Button type="primary" htmlType="button" onClick={finalize}>*/}
                {/*    Finalize*/}
                {/*</Button>*/}
            </Space>
        </Flex>






    </Form>
  );
};

export default CreateService;
