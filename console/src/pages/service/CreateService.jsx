import { Divider, Form } from "antd";

import ServiceSection from "../../components/ServiceSection.jsx";
import SpareSection from "../../components/SpareSection.jsx";

const CreateService = () => {
  const [form] = Form.useForm();
  const onValueChanged = (changed, all) => {
    // console.log(changed,all)
  };

  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      onValuesChange={onValueChanged}
      layout="vertical"
      autoComplete="off"
    >
      {/*<Divider orientation="left" plain>*/}
      {/*  Services*/}
      {/*</Divider>*/}

      {/*<ServiceSection form={form} />*/}



        <Divider orientation="left" plain>
            Spares
        </Divider>


        <SpareSection form={form}/>


    </Form>
  );
};

export default CreateService;
