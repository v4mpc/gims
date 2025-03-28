import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";

import listPaintColumns from "./listPaintColumns.jsx";



export default function ListPaint() {
    return (
        <GenericTable  rowKey={(record) => record.paint.id} itemColumns={listPaintColumns} showAddButton={false} listPath={API_ROUTES.paints} createLink="create" queryKey="paints"/>)
}
