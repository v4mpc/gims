import {Button, Table, Input, Flex} from "antd";

import {useSearchParams} from "react-router-dom";

import {useState, useRef} from "react";
import {DEFAULT_PAGE_SIZE, getData, SEARCH_BOX_WIDTH} from "../utils.jsx";
import GenericTableModal from "./GenericTableModal.jsx";
import {useQuery} from "@tanstack/react-query";

const {Search} = Input;

export default function GenericTable({itemColumns, listPath,queryKey, children}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const formModeRef = useRef("CREATE");
    const [open, setOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState("");
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: searchParams.get("page"),
            pageSize: searchParams.get("size"),
        }
    });
    const [searchQuery, setSearchQuery] = useState("");

    const {isLoading, data} = useQuery({
        queryKey: [queryKey, tableParams, searchQuery],
        queryFn: () => getData(listPath, tableParams, searchQuery)
    })


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
        }
        return obj;
    });


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
        setSearchParams((prev) => (
            searchQuery !== "" ? {
                q: searchQuery,
                page: pagination.current,
                size: pagination.pageSize
            } : {page: pagination.current, size: pagination.pageSize}
        ));
        setTableParams({
            pagination,
        });
    };


    const onSearch = (value) => {
        setSearchParams((prev) => (value.trim() !== "" ? {
            ...prev,
            q: value.trim(),
            page: 1,
            size: DEFAULT_PAGE_SIZE
        } : {page: 1, size: DEFAULT_PAGE_SIZE}));
        console.log(value)
        setSearchQuery(value.trim());
        setTableParams({pagination: {current: 1, pageSize: DEFAULT_PAGE_SIZE}});
    };

    return (

        <Flex gap="middle" vertical>
            <Flex justify="space-between">
                <Search
                    placeholder="Search item ..."
                    allowClear
                    onSearch={onSearch}
                    style={{width: SEARCH_BOX_WIDTH}}
                />

                <Button type="primary" onClick={() => handleCreateClicked()}>
                    Add
                </Button>
            </Flex>
            <Table
                onChange={handleTableChange}
                columns={itemColumns}
                dataSource={data?.content}
                bordered={true}
                pagination={{pageSize: DEFAULT_PAGE_SIZE, total: data?.totalElements, ...tableParams.pagination}}
                loading={isLoading}
                scroll={{x: 'max-content'}}
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
