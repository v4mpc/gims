import {
  Col,
  Card,
  Row,
  Menu,
  Form,
  Button,
} from "antd";

import {useEffect, useState} from "react";
import {API_ROUTES, BASE_URL} from "../../utils.jsx";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import DesignerForm from "../components/DesignerForm.jsx";


const AceEditorControl = ({ value, onChange, onBlur, ...rest }) => {
  return (
    <AceEditor
      style={{ width: "100%" }}
      theme="monokai"
      showPrintMargin={true}
      showGutter={true}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      {...rest}
    />
  );
};

const FormAceEditorItem = ({ label, name, rules, ...rest }) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <AceEditorControl {...rest} />
    </Form.Item>
  );
};

const ReportDesigner = () => {
  const initialFormValues = {
    active: true,
    columnOption: "[]",
    filterOption: "[]",
  };

  const [selectedReport, setSelectedReport] = useState(initialFormValues);
  const [reports, setReports] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);



  const [formMode,setFormMode]=useState("CREATE");



  const items = reports.map((p,index) => ({
    key: p.reportKey,
    label: <span>{`${p.active ? "✅" : "⛔️"} ${index+1}. ${p.reportName}`}</span>,
  }));




  const handleShowCreateForm = () => {
    setSelectedKeys([]);
    setSelectedReport(initialFormValues);
    setFormMode("CREATE");

  };



  const handleSetSelectedReport = ({ key }) => {
    setSelectedKeys([key]);
    setSelectedReport(...reports.filter((r) => key === r.reportKey));
    setFormMode("UPDATE");
  };





  async function getData() {
    setIsLoading(true);
    const resp = await fetch(
        `${BASE_URL}/${API_ROUTES.customReport}`,
    );
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    const respData = await resp.json();
    const sortedItems = [...respData].sort((a, b) => a.displayOrder-b.displayOrder);
    setReports(sortedItems);
    setIsLoading(false);
  }


  useEffect(() => {
      getData()
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title="Report list" styles={{ body: { padding: "4px" } }}>
          <Menu
            onClick={handleSetSelectedReport}
            selectedKeys={selectedKeys}
            style={{
              borderWidth: "0px",
            }}
            mode="inline"
            items={items}
          />
        </Card>
      </Col>
      <Col span={18}>
        <Card
          title="Report details"

          extra={
            formMode==="CREATE" || (
              <Button type="primary" onClick={() => handleShowCreateForm()}>
                New Report
              </Button>
            )
          }
        >
          { formMode==="CREATE"?<DesignerForm key={formMode}  mode={formMode}  isLoading={isLoading} getData={getData} initialValues={initialFormValues} setIsLoading={setFormMode} handleShowCreateForm={handleShowCreateForm} />:<DesignerForm key={selectedReport.id}  isLoading={isLoading} initialValues={selectedReport} setIsLoading={setFormMode} getData={getData} handleShowCreateForm={handleShowCreateForm}/>}
        </Card>
      </Col>
    </Row>
  );
};

export default ReportDesigner;
