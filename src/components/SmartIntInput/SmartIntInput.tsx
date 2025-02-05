import React from 'react'

type Props = {
    onChange: (value: number) => void;
    value: number;
    disabled?: boolean;
    min?: number;
    max?: number;
    className?: string;
    placeholder?: string;
    id?: string;
    buttons?: boolean;
    label?: string;
}

export default function SmartIntInput({
    onChange,
    value,
    disabled = false,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    className = '',
    placeholder = '',
    label = undefined,
    id = undefined,
    buttons = false
}: Props) {
    const [inputValue, setInputValue] = React.useState(`${value}`);
    const [textEditing, setTextEditing] = React.useState(false);

    const computeOnChange = (newVal: string) => {
        let finalValue;
        if (!newVal || newVal.length === 0) {
            onChange(min);
            finalValue = min;
        }

        const currentValue = Number(newVal);

        if (!currentValue || currentValue < min) {
            onChange(min);
            finalValue = min;
        } else if (currentValue > max) {
            onChange(max);
            finalValue = max;
        } else {
            onChange(currentValue);
            finalValue = currentValue;
        }

        setInputValue(`${finalValue}`);
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.match(/^[-0-9]*$/)) {
            setInputValue(e.target.value);
        }
    }

    React.useEffect(() => {
        if (!textEditing) {
            // the user has just unfocused the input, so we update the value
            computeOnChange(inputValue);
        }
    }, [textEditing])

    React.useEffect(() => {
        computeOnChange(`${value}`);
    }, [value])

    return (
        <label className={`input input-bordered flex items-center ${buttons ? 'mr-0 pr-0' : ''} ${className}`}>
            {
                label && <span className='label mr-1'>
                    {label}
                </span>
            }
            <input
                title="input-text" type="text" pattern="[0-9]{1,10}"
                className={`w-full`}
                value={inputValue}
                placeholder={placeholder}
                id={id}
                disabled={disabled}
                onChange={onInputChange}
                onFocus={() => setTextEditing(true)}
                onBlur={() => setTextEditing(false)}
            ></input>
            {
                buttons && <div className='flex flex-col bg-base-200 rounded-r-lg'>
                    <button
                        className='btn btn-xs btn-ghost'
                        onClick={() => computeOnChange(`${Number(inputValue) + 1}`)}
                    >+</button>
                    <button
                        className='btn btn-xs btn-ghost'
                        onClick={() => computeOnChange(`${Number(inputValue) - 1}`)}
                    >-</button>
                </div>
            }
        </label>
    )
}
