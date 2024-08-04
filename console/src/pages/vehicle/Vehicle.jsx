import GenericTable from "../../components/GenericTable.jsx";
import {API_ROUTES, getData, getLookupData} from "../../utils.jsx";

import {Checkbox} from "antd";
import vehicleColumns from "./Columns.jsx";
import {useState} from "react";
import {MakeModelForm, MakeOnlyForm} from "./Forms.jsx";
import {useQuery} from "@tanstack/react-query";


export default function Vehicle() {


    const makeQuery = useQuery(
    {queryKey: ['vehiclesAll'], placeholderData: [], queryFn: () => getLookupData(API_ROUTES.vehiclesAll)},
    )

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
            <Checkbox onChange={onChange} checked={makeOnly}>Make only</Checkbox>
            {makeOnly ? <MakeOnlyForm/> : <MakeModelForm makeQuery={makeQuery}/>}
        </GenericTable>
    );
}
