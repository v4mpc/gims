import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";
import listServiceColumns from "./listServiceColumns.jsx";

export default function ListService() {
  return (
    <GenericTable
      key="list-service-table"
      itemColumns={listServiceColumns}
      showAddButton={false}
      listPath={API_ROUTES.services}
      createLink="create"
      queryKey="services"
      rowKey={(record) => record.service.id}
    />
  );
}
