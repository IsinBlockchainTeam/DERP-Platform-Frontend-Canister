import {useEffect} from 'react';
import {DEFAULT_FONT} from '../../constants';
import {insertFontCSSRule} from '../../utils';

interface Props {
    fontName: string;
    checked: boolean;
    onSelect: (selected: string) => void;
}

function FontCheckbox({fontName, checked, onSelect}: Props) {
    useEffect(() => {
        insertFontCSSRule(fontName);
    }, []);

    return (
        <div className="flex flex-row cursor-pointer px-6 items-center" onClick={() => onSelect(fontName)}>
            <input type="checkbox" checked={checked} onChange={()=> {return;}} className="checkbox checkbox-success"/>
            <span className="text-left text-4xl ml-12" style={{fontFamily: `${fontName}`}}>{fontName}</span>
        </div>
    );
}

export default FontCheckbox;
