import { useEffect, useState } from "react";

import { Form } from "antd";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  API_ROUTES,
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  getLookupData,
  openNotification,
  putItem,
} from "../utils.jsx";

const useService = () => {
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payViaInsurance, setPayViaInsurance] = useState(false);
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const editMode = id !== undefined;

  const results = useQueries({
    queries: [
      {
        queryKey: ["paymentCatalogAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.paymentCatalogAll),
      },

      {
        queryKey: ["singlePaint", id],
        placeholderData: [],
        enabled: editMode,
        queryFn: () => getLookupData(`${API_ROUTES.paints}/${id}`),
      },
    ],
  });
  const [paymentCatalogQuery, paintQuery] = results;

  let editValues = {
    initialPayment: 0,
    finalPayment: 0,
    grandTotal: 0,
    netProfit: 0,
    status: "DRAFT",
  };

  useEffect(() => {
    if (editMode && !paintQuery.isLoading) {
      const grandTotal = paintQuery.data.paint?.paints.reduce(
        (acc, cr) => acc + cr.quantity * cr.price,
        0,
      );
      const [selectedPayment] = paymentCatalogQuery.data.filter(
        (pc) => pc.id === paintQuery.data.paint?.paymentMethod.id,
      );
      setSelectedPayment(selectedPayment);
      setPayViaInsurance(paintQuery.data.paint?.payViaInsurance);
      form.setFieldsValue({
        customerName: paintQuery.data.customerName,
        customerPhone: paintQuery.data.customerPhone,
        customerCar: paintQuery.data.paint?.customerCar.id,
        plateNumber: paintQuery.data.paint?.customerCar.plateNumber,
        model: paintQuery.data.paint?.customerCar.model,
        make: paintQuery.data.paint?.customerCar.make,
        initialPayment: paintQuery.data.paint?.initialPayment,
        paints: paintQuery.data.paint?.paints.map((p) => ({
          ...p,
          total: p.quantity * p.price,
        })),
        initialPaymentDate:
          paintQuery.data.paint?.initialPaymentDate !== null
            ? dayjs(paintQuery.data.paint?.initialPaymentDate, DATE_FORMAT)
            : null,
        finalPaymentDate:
          paintQuery.data.paint?.finalPaymentDate !== null
            ? dayjs(paintQuery.data.paint?.finalPaymentDate, DATE_FORMAT)
            : null,
        finalPayment: paintQuery.data.paint?.finalPayment,
        estimateAmount: paintQuery.data.paint?.estimateAmount,
        paymentMethod: paintQuery.data.paint?.paymentMethod.id,
        status: paintQuery.data.paint?.status,
        grandTotal: grandTotal,
        netProfit: paintQuery.data.paint?.estimateAmount - grandTotal,
        insuranceName: paintQuery.data.paint?.insuranceName,
        payViaInsurance: paintQuery.data.paint?.payViaInsurance,
        accountNumber: paintQuery.data.paint?.paymentMethod.accountNumber,
        accountName: paintQuery.data.paint?.paymentMethod.accountName,
      });
    }
  }, [paintQuery, form, editMode, paymentCatalogQuery.data]);

  const { mutate: createItem, isLoading: isCreating } = useMutation({
    mutationFn: putItem,
    onSuccess: () => {
      form?.resetFields();
      navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`);
      openNotification(
        "post-success",
        "success",
        "Success",
        "Record save successfully",
      );
      queryClient.invalidateQueries("paints");
    },
    onError: (error) => {
      console.log("there was an error " + error);
    },
  });

  const { mutate: updateItem, isLoading: isEditing } = useMutation({
    mutationFn: putItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singlePaint", id] });
      queryClient.invalidateQueries("paints");

      form?.resetFields();
      navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`);
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



  return {form,paymentCatalogQuery,setSelectedPayment,selectedPayment,saveOnlyValidations,setPayViaInsurance,setSaveOnlyValidation,updateItem,editMode,createItem,editValues,payViaInsurance,id}


};

export default useService;
