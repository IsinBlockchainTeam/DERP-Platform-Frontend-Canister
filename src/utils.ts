import {DEFAULT_FONT} from './constants';
import i18n from './i18n/i18n'

export const copyToClipboard = (el: HTMLElement | null, text?: string, sub?: string) => {
  if(navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(() => {
          alert(`${sub ?? 'Text'} ${i18n.t('copiedToClipboard')}!`);
      });
  } else if(el) {
      const range = document.createRange();
      range.selectNode(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      alert(`${sub ?? 'Text'} ${i18n.t('copiedToClipboard')}!`);
  } else {
    throw new Error('No element or text to copy')
  }
}

export const getMidnightDate = (): Date => {
    const now = new Date();
    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
    );
}

export const determineTextColor = (backgroundColor: string) => {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness > 128)
        return 'black';
    else
        return 'white';
}

export const insertFontCSSRule = (font: string) => {
    const fontFaceRule = `
            @font-face {
              font-family: '${font}';
              src: url('${window.location.origin}/stores/fonts/${font}');
            }
        `;

    const styleSheets = document.styleSheets[0];
    if (font !== DEFAULT_FONT)
        styleSheets.insertRule(fontFaceRule);
}

export const parseSearchParamSafe = (searchParams: URLSearchParams, name: string) => {
    const value = searchParams.get(name);
    if(value === null)
        throw new Error(`Missing search param ${name}`);
    return value;
}



import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useStoreUrl() {
  const location = useLocation();
  const [storeUrl, setStoreUrl] = useState(() => {
    // Initial parsing when the hook is first called
    const searchParams = new URLSearchParams(location.search);
    return parseSearchParamSafe(searchParams, 'storeUrl');
  });

  useEffect(() => {
    // Whenever the location changes, update the storeUrl
    const searchParams = new URLSearchParams(location.search);
    setStoreUrl(parseSearchParamSafe(searchParams, 'storeUrl'));
  }, [location.search]);

  return storeUrl;
}


