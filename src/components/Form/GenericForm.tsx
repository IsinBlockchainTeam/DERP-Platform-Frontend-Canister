import React, { useEffect, useState } from "react";

export type GenericFormData = {
    [key: string]: string;
};

type InputNode = {
    typeNodeName: 'input';
    type: 'text' | 'email' | 'number' | 'password' | 'url' | 'tel';
    placeholder: string;
    maxLength?: number;
}

type SelectNode = {
    typeNodeName: 'select';
    type: 'select';
    placeholder: string;
    emptyOption?: string;
    options: { key: string, value: string, label?: string }[];
}

export type GenericFormField = {
    labelName: string;
    name: string;
    typeNode: InputNode | SelectNode;
    isRequired?: boolean;
}

type FormProps = {
    handleSubmit: (formData: GenericFormData) => void;
    handleCancel: (formData?: GenericFormData) => void;
    handleOnChange?: (formData: GenericFormData) => void;
    initialData: GenericFormData;
    fields: GenericFormField[];
    cancelLabel: string;
    submitLabel: string;
}


function GenericForm(props: FormProps) {
    const [formData, setFormData] = useState<GenericFormData>(props.initialData);

    useEffect(() => {
        setFormData(props.initialData);
    }, [props.initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((formData) => {
            return {
                ...formData,
                [e.target.name]: (e.target.name === 'canton' || e.target.name === 'country') ? e.target.value.toUpperCase() : e.target.value
            }
        });

        if (props.handleOnChange) {
            props.handleOnChange({
                ...formData,
                [e.target.name]: (e.target.name === 'canton' || e.target.name === 'country') ? e.target.value.toUpperCase() : e.target.value
            });
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.handleSubmit(formData);
        setFormData({})
    }

    const handleCancel = () => {
        props.handleCancel(formData);
        setFormData({})
    }

    const validOptionSelected = (fieldName: string) => {
        const selectedValue = formData[fieldName];
        const selectNode = props.fields.find(field => field.name === fieldName)?.typeNode;
        if (!(selectNode && selectNode.typeNodeName === 'select')) {
            return false;
        }

        const ret = selectNode.options.some(option => option.value === selectedValue) || false;
        console.log(ret);
        return ret;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="form-control">
                {props.fields.map((field) => {
                    switch (field.typeNode.typeNodeName) {
                        case 'input':
                            return <label key={field.name} className="label" style={{ justifyContent: "normal" }}>
                                <span className="w-1/3 label-text">{field.labelName}</span>
                                <input
                                    type={field.typeNode.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="w-2/3 input input-bordered grow"
                                    placeholder={field.typeNode.placeholder}
                                    maxLength={field.typeNode.maxLength}
                                    required={field.isRequired} />
                            </label>
                        case 'select':
                            return <label key={field.name} className="label" style={{ justifyContent: "normal" }}>
                                <span className="w-1/3 label-text">{field.labelName}</span>
                                <select className="select select-bordered w-2/3" onChange={handleChange} name={field.name} value={formData[field.name] || ''} >
                                    {
                                        field.typeNode.emptyOption &&
                                        <option selected={!validOptionSelected(field.name)}>{field.typeNode.emptyOption}</option>
                                    }
                                    {
                                        field.typeNode.options.map((option) => (
                                            <option key={option.key} value={option.value}>{option.label || option.key}</option>
                                        ))
                                    }
                                </select>
                            </label>
                    }
                }
                )}
                <div className="divider"></div>
                <div className="flex w-full justify-between ">
                    <button type="button" onClick={handleCancel} className="btn btn-outline btn-error w-1/3">{props.cancelLabel}</button>
                    <button type="submit" className="btn btn-outline btn-primary w-1/3">{props.submitLabel}</button>
                </div>
            </form>
        </>
    )
}

export default GenericForm;
