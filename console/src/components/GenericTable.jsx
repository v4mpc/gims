import { Button, Table, Input, Flex, Select, Space } from "antd";

import { useSearchParams } from "react-router-dom";

import { useState, useRef } from "react";
import {
  API_ROUTES,
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  getData,
  getLookupData,
  SEARCH_BOX_WIDTH,
} from "../utils.jsx";
import GenericTableModal from "./GenericTableModal.jsx";
import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

const { Search } = Input;

export default function GenericTable({
  itemColumns,
  listPath,
  queryKey,
  showCategoryFilter = false,
  showAddButton = true,
  createLink = null,
  children,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const formModeRef = useRef("CREATE");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: searchParams.get("page"),
      pageSize: searchParams.get("size"),
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");
  const navigate = useNavigate();

  const results = useQueries({
    queries: [
      {
        queryKey: [queryKey, tableParams, searchQuery, searchCategory],
        placeholderData: [],
        queryFn: () =>
          getData(listPath, tableParams, searchQuery, searchCategory),
      },
      {
        queryKey: ["categoriesAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.categoriesAll),
      },
    ],
  });
  const [resultsQuery, categoriesQuery] = results;

  itemColumns = itemColumns.map((obj) => {
    if (obj.key === "action") {
      return {
        ...obj,
        render: (_, record) => (
          <Button type="primary" onClick={() => handleSetItem(record)}>
            Edit
          </Button>
        ),
      };
    } else if (obj.key === "adjust") {
      return {
        ...obj,
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() =>
              handleSetItem({
                ...record,
                productId: record.product.id,
                adjustmentDate: dayjs().format(DATE_FORMAT),
                name: record.product.name,
              })
            }
          >
            Adjust
          </Button>
        ),
      };
    } else if (obj.key === "paint") {
        return {
            ...obj,
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() =>navigateToLink(`${record.paint.id}`)}
                >
                    Edit
                </Button>
            ),
        };
    }else if(obj.key==="service"){
        return {
            ...obj,
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() =>navigateToLink(`${record.service.id}`)}
                >
                    {record.service.status==="PAID"?"View":"Edit"}
                </Button>
            ),
        };
    }

    return obj;
  });

  const navigateToLink = (link) => {
    navigate(link);
  };

  const handleSetItem = (item) => {
    formModeRef.current = "UPDATE";
    setSelectedItem(item);
    setOpen(true);
  };

  const handleCreateClicked = () => {
    formModeRef.current = "CREATE";
    setOpen(true);
  };

  const handelModalClose = () => {
    setOpen(false);
  };
  const handleTableChange = (pagination) => {
    setSearchParams((prev) =>
      searchQuery !== ""
        ? {
            q: searchQuery,
            page: pagination.current,
            size: pagination.pageSize,
          }
        : { page: pagination.current, size: pagination.pageSize },
    );
    setTableParams({
      pagination,
    });
  };

  const onSearch = (value) => {
    setSearchParams((prev) =>
      value.trim() !== ""
        ? {
            ...prev,
            q: value.trim(),
            page: 1,
            size: DEFAULT_PAGE_SIZE,
          }
        : { page: 1, size: DEFAULT_PAGE_SIZE },
    );
    setSearchQuery(value.trim());
    setTableParams({ pagination: { current: 1, pageSize: DEFAULT_PAGE_SIZE } });
  };

  const categories = [{ id: "ALL", name: "ALL" }, ...categoriesQuery.data];

  const filterChanged = (value) => {
    setSearchCategory(value);
  };

  return (
    <Flex gap="middle" vertical>
      <Flex justify="space-between">
        <Space>
          {showCategoryFilter && (
            <Select
              showSearch
              style={{ width: "200px" }}
              placeholder="Filter by category"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={filterChanged}
              loading={categoriesQuery.isLoading}
              defaultValue="ALL"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          )}
          <Search
            placeholder="Search item ..."
            allowClear
            onSearch={onSearch}
            style={{ width: SEARCH_BOX_WIDTH }}
          />
        </Space>

        {showAddButton && (
          <Button type="primary" onClick={() => handleCreateClicked()}>
            Add
          </Button>
        )}

        {createLink != null && (
          <Button type="primary" onClick={()=>navigate(createLink)}>
            Add
          </Button>
        )}
      </Flex>
      <Table
        onChange={handleTableChange}
        columns={itemColumns}
        dataSource={resultsQuery.data?.content}
        bordered={true}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
          total: resultsQuery.data?.totalElements,
          ...tableParams.pagination,
        }}
        loading={results.isLoading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
      {open && (
        <GenericTableModal
          key={selectedItem?.id}
          title={
            formModeRef.current === "UPDATE" ? "Update item" : "Create item"
          }
          formMode={formModeRef.current}
          selectedItem={selectedItem}
          listPath={listPath}
          open={open}
          handleModalClose={handelModalClose}
          queryKey={queryKey}
        >
          {children}
        </GenericTableModal>
      )}
    </Flex>
  );
}
