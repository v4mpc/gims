import GenericTable from "../../components/GenericTable.jsx";
import {API_ROUTES} from "../../utils.jsx";

import {Checkbox} from "antd";
import vehicleColumns from "./Columns.jsx";
import {useState} from "react";
import {MakeModelForm, MakeOnlyForm} from "./Forms.jsx";


export default function Vehicle() {

    const [makeOnly, setMakeOnly] = useState(false);


    const onChange = (e) => {
        setMakeOnly(e.target.checked);
    };
    const makes = [
        {
            id: 1,
            name: "Toyota"
        },
        {
            id: 2,
            name: "BMW"
        }
    ]


    return (
        <GenericTable itemColumns={vehicleColumns} listPath={API_ROUTES.vehicles} queryKey="vehicles">
            <Checkbox onChange={onChange}>Make only</Checkbox>
            {makeOnly ? <MakeOnlyForm/> : <MakeModelForm makes={makes}/>}
        </GenericTable>
    );
}
