import React, { useEffect, useState } from "react";

/**
 * Represents the form data structure used throughout the generic form.
 * Keys are field names and values are their corresponding string values.
 */
export type GenericFormData = {
    [key: string]: string;
};

/**
 * Configuration for an input field (text, email, number, password, url, tel).
 */
type InputNode = {
    /** Identifies this as an input field type */
    typeNodeName: 'input';
    /** The HTML input type */
    type: 'text' | 'email' | 'number' | 'password' | 'url' | 'tel';
    /** Placeholder text shown when the field is empty */
    placeholder: string;
    /** Maximum number of characters allowed in the input */
    maxLength?: number;
    /** Whether the input should be disabled */
    disabled?: boolean;
}

/**
 * Configuration for a select dropdown field.
 */
type SelectNode = {
    /** Identifies this as a select field type */
    typeNodeName: 'select';
    /** The field type (always 'select' for SelectNode) */
    type: 'select';
    /** Placeholder text shown when no option is selected */
    placeholder: string;
    /** Optional text for an empty/default option */
    emptyOption?: string;
    /** Array of options available in the dropdown */
    options: { 
        /** Unique identifier for the option */
        key: string, 
        /** The value that will be stored in form data when selected */
        value: string, 
        /** Display text for the option (defaults to key if not provided) */
        label?: string 
    }[];
}

/**
 * Configuration for a custom field with custom rendering logic.
 */
type CustomNode = {
    /** Identifies this as a custom field type */
    typeNodeName: 'custom';
    /** 
     * Function that renders the custom field component.
     * @param value - Current value of the field
     * @param onChange - Function to call when the field value changes
     * @returns React element to render
     */
    renderCustom: <T>(value: T, onChange: (value: T) => void) => React.ReactNode;
    /** 
     * Optional callback fired when the field value changes.
     * @param value - The new value
     * @param formData - The complete current form data
     */
    onChange?: <T>(value: T, formData: GenericFormData) => void;
}

/**
 * Configuration for a single form field, supporting input, select, or custom field types.
 */
export type GenericFormField = {
    /** Display label for the field */
    labelName: string;
    /** Field name used as the key in form data */
    name: string;
    /** Configuration object defining the field type and behavior */
    typeNode: InputNode | SelectNode | CustomNode;
    /** Whether this field is required for form submission */
    isRequired?: boolean;
}

/**
 * Props for the GenericForm component.
 */
type FormProps = {
    /** 
     * Callback fired when the form is submitted.
     * @param formData - The current form data
     */
    handleSubmit: (formData: GenericFormData) => void;
    /** 
     * Callback fired when the cancel button is clicked.
     * @param formData - The current form data (optional)
     */
    handleCancel: (formData?: GenericFormData) => void;
    /** 
     * Optional callback fired whenever any field value changes.
     * @param formData - The updated form data
     */
    handleOnChange?: (formData: GenericFormData) => void;
    /** Initial values for the form fields */
    initialData: GenericFormData;
    /** Array of field configurations defining the form structure */
    fields: GenericFormField[];
    /** Text label for the cancel button */
    cancelLabel: string;
    /** Text label for the submit button */
    submitLabel: string;
}

/**
 * A generic, configurable form component that can render various field types
 * including inputs, selects, and custom components.
 * 
 * @param props - The form configuration and event handlers
 * @returns A complete form with the specified fields and buttons
 * 
 * @example
 * ```tsx
 * const fields: GenericFormField[] = [
 *   {
 *     labelName: "Email",
 *     name: "email",
 *     typeNode: {
 *       typeNodeName: 'input',
 *       type: 'email',
 *       placeholder: "Enter your email"
 *     },
 *     isRequired: true
 *   }
 * ];
 * 
 * <GenericForm
 *   fields={fields}
 *   initialData={{}}
 *   handleSubmit={(data) => console.log(data)}
 *   handleCancel={() => console.log('cancelled')}
 *   submitLabel="Save"
 *   cancelLabel="Cancel"
 * />
 * ```
 */
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

    const handleCustomChange = (fieldName: string, value: any, customOnChange?: (value: any, formData: GenericFormData) => void) => {
        const newFormData = {
            ...formData,
            [fieldName]: value
        };
        
        setFormData(newFormData);

        if (customOnChange) {
            customOnChange(value, newFormData);
        }

        if (props.handleOnChange) {
            props.handleOnChange(newFormData);
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
                                    required={field.isRequired}
                                    disabled={field.typeNode.disabled} />
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
                        case 'custom':
                            return <label key={field.name} className="label" style={{ justifyContent: "normal" }}>
                                <span className="w-1/3 label-text">{field.labelName}</span>
                                <div className="w-2/3">
                                    {field.typeNode.renderCustom(
                                        formData[field.name],
                                        (value: any) => handleCustomChange(field.name, value, field.typeNode.typeNodeName === 'custom' ? field.typeNode.onChange : undefined)
                                    )}
                                </div>
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
