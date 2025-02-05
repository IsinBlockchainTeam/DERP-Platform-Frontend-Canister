import {fireEvent, render} from "@testing-library/react";
import RowProduct from "./RowProduct";

describe('RowProduct', () => {
    describe('changeStatus', () => {
        const mockChangedQuantity = jest.fn();
        const mockChangedStatus = jest.fn();
        const mockProps = {
            id: 1,
            description: 'Test Product',
            onChangedQuantity: mockChangedQuantity,
            onChangedStatus: mockChangedStatus,
        };

        it('should toggle status on checkbox click', () => {
            const { getByRole } = render(<table><tbody><RowProduct {...mockProps} /></tbody></table>);
            const checkbox = getByRole('checkbox');
            fireEvent.click(checkbox);
            expect(checkbox).toBeChecked();
            expect(mockChangedStatus).toHaveBeenCalledWith(true);
            fireEvent.click(checkbox);
            expect(checkbox).not.toBeChecked();
            expect(mockChangedStatus).toHaveBeenCalledWith(false);
        });
    });
});