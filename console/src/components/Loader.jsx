import {Flex, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";


export default function Loader () {
    return (
      <Flex style={{height: '100vh'}} vertical>
          <Flex align="center" justify="center">
              <Spin size="large"
                  indicator={
                      <LoadingOutlined
                          style={{
                              fontSize: 50,
                          }}
                          spin
                      />
                  }
              />
          </Flex>
      </Flex>
    )
}