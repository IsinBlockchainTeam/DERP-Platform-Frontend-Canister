import React, {useState} from "react";

interface Props {
    dropdownName: string;
    items: string[];
    onSelectedItem: (selectedItem: string) => void;
}

function Dropdown ({dropdownName, items, onSelectedItem} : Props) {
    const [isContentVisible, setIsContentVisible] = useState(false);

    return(
        <div className="dropdown">
            <button className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    type="button" onClick={() => setIsContentVisible(!isContentVisible)}>
                {dropdownName}
                <svg className="w-3 h-3 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {
                isContentVisible &&
                <ul tabIndex={0} className="dropdown-content menu m-2 p-2 shadow bg-base-100 rounded-box w-52">
                    {
                        items.map((item, index) => {
                            return <li key={index} onClick={() => {
                                onSelectedItem(item);
                                setIsContentVisible(!isContentVisible);
                            }}><a>{item}</a></li>
                        })
                    }
                </ul>
            }
        </div>
    );
}

export default Dropdown;