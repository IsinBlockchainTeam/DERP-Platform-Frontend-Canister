import FormLoader from "../../../components/Loading/FormLoader";
import React, { useState } from "react";
import { SignupRegisterStep } from "./Steps/SignupRegisterStep";
import { RegisterUserResponseDto } from "../../../dto/auth/RegisterUserDto";
import { SaveCredentialsStep } from "./Steps/SaveCredentialsStep";
import { useNavigate } from "react-router-dom";
import { CreateStoreStep } from "./Steps/CreateStoreStep";
import { CreateCompanyInfoStep } from "./Steps/CreateCompanyInfoStep";

enum signupSteps {
    REGISTER,
    SAVE_CREDENTIALS,
    CREATE_COMPANY_INFO,
    CREATE_STORE,
}

export function AdminRegisterSupplier() {
    // TODO: Probably to remove

    //const [step, setStep] = useState(signupSteps.REGISTER);
    //const [userData, setUserData] = useState<RegisterUserResponseDto | null>(null);
    //const [userInfo, setUserInfo] = useState<RegisterUserResponseDto | null>(null);
    //const navigate = useNavigate();
    //
    //const steps = {
    //  [signupSteps.REGISTER]: <SignupRegisterStep onCompleted={(user) => {
    //    setUserData(user);
    //    setStep(signupSteps.SAVE_CREDENTIALS);
    //  }} />,
    //
    //  [signupSteps.SAVE_CREDENTIALS]: <SaveCredentialsStep userData={userData!} onCompleted={() => {
    //    setStep(signupSteps.CREATE_COMPANY_INFO);
    //  }} />,
    //
    //  [signupSteps.CREATE_COMPANY_INFO]: <CreateCompanyInfoStep supplierData={userData} onCompleted={ () =>{
    //     setStep(signupSteps.CREATE_STORE);
    //  }} />,
    //
    //  [signupSteps.CREATE_STORE]: <CreateStoreStep supplierData={userData!} onCompleted={() => navigate('/admin/suppliers')}/>, 
    //};
    //
    //
    //return <main>
    //  {steps[step]}
    //</main>
}
