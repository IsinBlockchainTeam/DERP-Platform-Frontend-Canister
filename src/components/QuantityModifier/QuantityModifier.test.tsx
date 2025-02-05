import QuantityModifier from './QuantityModifier';
import {fireEvent, getByTitle, render} from '@testing-library/react';
import React from 'react';

describe('QuantityModifier', () => {
    describe('incrementation', () => {
        it('should verify initial quantity', async () => {
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={() => {}}  max={1}/>);
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            expect(quantityInput.value).toBe('1');
        });

        it('should verify quantity incrementation', async () => {
            const onChangedQuantityMock = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={onChangedQuantityMock} max={6}/>);
            const incrementButton = getByTitle('increment');
            const quantityInput = getByTitle('input-text') as HTMLInputElement;

            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            expect(quantityInput.value).toBe('3');
            expect(onChangedQuantityMock).toHaveBeenCalledWith(3);
        });

        it('should verify that the quantity does not increment above max', async () => {
            const onChangedQuantityMock = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={onChangedQuantityMock} max={6}/>);
            const incrementButton = getByTitle('increment');
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            expect(quantityInput.value).toBe('6');
            expect(onChangedQuantityMock).toHaveBeenCalledWith(6);

            fireEvent.click(incrementButton);
            expect(quantityInput.value).toBe('6');
            expect(onChangedQuantityMock).toHaveBeenCalledWith(6);
        });

    });
    describe('decrementation', () => {
        it('should verify initial quantity', async () => {
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={() => {}} max={6}/>);
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            expect(quantityInput.value).toBe('1');
        });

        it('should verify quantity decrementation', async () => {
            const onChangedQuantityMock = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={onChangedQuantityMock} max={6}/>);
            const decrementButton = getByTitle('decrement');
            const incrementButton = getByTitle('increment');
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            expect(quantityInput.value).toBe('1');
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            fireEvent.click(incrementButton);
            expect(quantityInput.value).toBe('4');
            fireEvent.click(decrementButton);
            expect(quantityInput.value).toBe('3');
            expect(onChangedQuantityMock).toHaveBeenCalledWith(3);
        });

        it('should verify that the quantity does not decrement below min', async () => {
            const onChangedQuantityMock = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={onChangedQuantityMock} max={6} min={1}/>);
            const decrementButton = getByTitle('decrement');
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            fireEvent.click(decrementButton);
            fireEvent.click(decrementButton);
            expect(quantityInput.value).toBe('1');
            expect(onChangedQuantityMock).toHaveBeenCalledWith(1);
        });
    });
    describe('changedQuantity', () => {
        it('should verify initial quantity', async () => {
            const onChangedQuantityMock = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={onChangedQuantityMock} max={6}/>);
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            expect(quantityInput.value).toBe('1');
            expect(onChangedQuantityMock).toHaveBeenCalledWith(1);
        });

        it('should verify quantity changed via input field', async () => {
            const mockChangedQuantity = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={mockChangedQuantity} max={6}/>);
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            fireEvent.focus(quantityInput);
            fireEvent.change(quantityInput, { target: { value: '5' } });
            fireEvent.blur(quantityInput);
            expect(quantityInput.value).toEqual('5');
            expect(mockChangedQuantity).toHaveBeenCalledWith(5);
        });

        it('should only accept numbers', async () => {
            const mockChangedQuantity = jest.fn();
            const { getByTitle } = render(<QuantityModifier onChangedQuantity={mockChangedQuantity} max={6}/>);
            const quantityInput = getByTitle('input-text') as HTMLInputElement;
            
            fireEvent.focus(quantityInput);
            fireEvent.change(quantityInput, { target: { value: 'asd' } });
            fireEvent.blur(quantityInput);
            expect(quantityInput.value).toEqual('1');
            expect(mockChangedQuantity).toHaveBeenCalledWith(1);

            fireEvent.focus(quantityInput);
            fireEvent.change(quantityInput, { target: { value: '4' } });
            fireEvent.blur(quantityInput);
            expect(quantityInput.value).toEqual('4');
            expect(mockChangedQuantity).toHaveBeenCalledWith(4);
        }); 
    });
});