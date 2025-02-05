import {determineTextColor} from "../src/utils";

describe('determineTextColor', () => {
    it('should determine text color based on background color', () => {
        expect(determineTextColor('#000000')).toBe('white');
        expect(determineTextColor('#FFFFFF')).toBe('black');
        expect(determineTextColor('#FFA500')).toBe('black');
        expect(determineTextColor('#00FFFF')).toBe('black');
        expect(determineTextColor('#184bd0')).toBe('white');
        expect(determineTextColor('#3ad018')).toBe('black');
    });
});