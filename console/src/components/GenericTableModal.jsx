import {Modal, Form} from "antd";
import {DATE_FORMAT, openNotification, putItem} from "../utils.jsx";
import dayjs from "dayjs";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function GenericTableModal({
                                              title,
                                              selectedItem,
                                              listPath,
                                              formMode,
                                              open,
                                              handleModalClose,
    queryKey,
                                              children,
                                          }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient()
    const {mutate: createItem, isLoading: isCreating} = useMutation({
        mutationFn: putItem,
        onSuccess: () => {
            form?.resetFields();
            openNotification(
                "post-success",
                "success",
                "Success",
                "Record save successfully",
            );
            queryClient.invalidateQueries({queryKey: [queryKey]})
            handleModalClose();
        },
        onError: (error) => {
            console.log("there was an error " + error);
        }
    });


    const {mutate: updateItem, isLoading: isEditing} = useMutation({
        mutationFn: putItem,
        onSuccess: () => {
            form?.resetFields();
            openNotification(
                "post-success",
                "success",
                "Success",
                "Record updated successfully",
            );
            queryClient.invalidateQueries({queryKey: [queryKey]})
            handleModalClose();
        },
        onError: (error) => {
            console.log("there was an error " + error);
        }
    });


    const isInProgress = isCreating || isEditing;


    const handleOk = async () => {
        const values = await form?.validateFields();
        let urlPath = `${listPath}`;
        let method = "POST";
        if (formMode === "UPDATE") {
            urlPath = `${listPath}/${selectedItem.id}`;
            method = "PUT";
            if (Object.hasOwn(selectedItem, "adjustmentDate")) {
                urlPath = `${listPath}`;
            }
        }

        if (formMode === "UPDATE") {
            updateItem({values, urlPath, method});
        } else {
            createItem({values, urlPath, method});
        }

    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        handleModalClose();
        form?.resetFields();
    };

    const handleSubmit = () => {
        console.log("submit");
    };

    let modifiedInitialValues = {...selectedItem};

    if ("UPDATE" === formMode) {
        if (Object.hasOwn(selectedItem, "createdAt")) {
            modifiedInitialValues = {
                ...modifiedInitialValues,
                createdAt: dayjs(selectedItem.createdAt, DATE_FORMAT),
            };
        }

        if (Object.hasOwn(selectedItem, "unitOfMeasure")) {
            modifiedInitialValues = {
                ...modifiedInitialValues,
                unitOfMeasure: selectedItem.unitOfMeasure.id,
            };
        }
    }

    if ("CREATE" === formMode) {
        modifiedInitialValues = {active: true};
    }

    const initialValues = modifiedInitialValues;

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            confirmLoading={isInProgress}
            onCancel={handleCancel}
            okText="Save"

        >
            <Form
                key={formMode}
                initialValues={initialValues}
                variant="outlined"
                layout="vertical"
                disabled={isInProgress}
                onFinish={handleSubmit}
                form={form}
            >
                {children}
            </Form>
        </Modal>
    );
}
