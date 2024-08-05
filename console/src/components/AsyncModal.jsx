import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  API_ROUTES,
  BASE_URL,
  bulkTx,
  DATE_FORMAT,
  openNotification,
  putItem,
  toSalePayload,
} from "../utils.jsx";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AsyncModal = ({ postData, isSale, queryKey }) => {
  const [open, setOpen] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: updateItem, isLoading: confirmLoading } = useMutation({
    mutationFn: bulkTx,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate("/tx-success", { state: { isSale: isSale } });
      setOpen(false);
    },
    onError: (error) => {
      openNotification("sales-notification", "error", "Error", error.message);
      console.log("there was an error " + error);
    },
  });

  const showModal = () => {
    if (postData.length === 0) {
      openNotification(
        "sales-notification",
        "warning",
        "Warning",
        `Select at least 1 item to ${isSale ? "Sell" : "Buy"}`,
      );
      return;
    }
    setOpen(true);
  };
  const handleOk = () => {
    if (postData.length === 0) {
      openNotification(
        "sales-notification",
        "warning",
        "Warning",
        `Select at least 1 item to ${isSale ? "Sell" : "Buy"}`,
      );
      return;
    }
    updateItem({ postData, isSale });
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  async function saveSales() {
    try {
      Date.prototype.toISOString = function () {
        return dayjs(this).format(DATE_FORMAT);
      };
      setConfirmLoading(true);
      setError("");
      const resp = await fetch(`${BASE_URL}/${API_ROUTES.bulkSale}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSalePayload(postData, isSale)),
      });
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      navigate("/tx-success", { state: { isSale: isSale } });
    } catch (e) {
      console.error(e);
      openNotification("sales-notification", "error", "Error", e.message);
      setError(e.message);
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button type="primary" size="large" onClick={showModal}>
        {`${isSale ? "Sell..." : "Buy..."}`}
      </Button>
      <Modal
        title="Confirm action"
        open={open}
        onOk={handleOk}
        okText="Yes"
        cancelText="No"
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{`Are you sure you want to ${isSale ? "Sell" : "Buy"} these items?`}</p>
      </Modal>
    </>
  );
};
export default AsyncModal;
