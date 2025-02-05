import { CreateInterfaceReqDto, InterfaceType } from "../../../dto/ErpInterfacesDto"
import WondTcposInterfaceFormPart from "./WondInterfaceFormPart"
import KumoInterfaceFormPart from "./KumoInterfaceFormPart"
import EbicsInterfaceFormPart from "./EbicsInterfaceFormPart"
import BaseInterfaceFormPart from "./BaseInterfaceFormPart"

interface Props {
    merchantId: number,
    iface: Partial<CreateInterfaceReqDto>,
    onChange: (iface: Partial<CreateInterfaceReqDto>) => void,
    title: string,
    updating: boolean
}


const typesFormMap = {
    [InterfaceType.WOND]: WondTcposInterfaceFormPart,
    [InterfaceType.KUMO]: KumoInterfaceFormPart,
    [InterfaceType.EBICS]: EbicsInterfaceFormPart
}

const InterfaceForm = (props: Props) => {
    const onChange = (i: Partial<CreateInterfaceReqDto>) => {
        console.log("On change interface")
        console.log(i)
        props.onChange(i)
    }


    const Component = props.iface.interfaceType ? typesFormMap[props.iface.interfaceType] : null;
    const componentProps = { ...props, onChange };

    return <>
        <h1 className="text-3xl font-light">{props.title}</h1>
        <BaseInterfaceFormPart {...componentProps} />
        {
            props.iface.interfaceType && Component ?
                <Component {...componentProps} interfaceType={props.iface.interfaceType} />
            : <></>
        }
    </>
}

export default InterfaceForm;