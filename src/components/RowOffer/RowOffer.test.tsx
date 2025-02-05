import { act, render } from "@testing-library/react";
import RowOffer from "./RowOffer";
import { OfferDto } from "../../dto/OfferDto";

describe('RowOffer', () => {
  const onChangedQuantityMock = jest.fn();
  const onChangedStatusMock = jest.fn();

  const mockOffer: OfferDto = {
    id: '1',
    description: 'Test',
    offerLines: [
      {
        id: '1',
        productId: '1',
        description: 'Test',
        groups: [
          'Test'
        ],
        price: 1,
        quantity: 1,
      },
      {
        id: '2',
        productId: '2',
        description: 'Test',
        groups: [
          'Test2'
        ],
        price: 2,
        quantity: 1,
      }
    ],
  };

  it('should render successfully', () => {
    const { baseElement } = render(<RowOffer offer={mockOffer} onChangedQuantity={onChangedQuantityMock} onChangedStatus={onChangedStatusMock}/>);
    expect(baseElement).toBeTruthy();
  });

  it('should render child products successfully on open', async () => {
    const { baseElement } = render(<RowOffer offer={mockOffer} onChangedQuantity={onChangedQuantityMock} onChangedStatus={onChangedStatusMock}/>);
    expect(baseElement).toBeTruthy();

    const openCheckbox = baseElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await act(() => {
      openCheckbox.click();
    })

    const tds = baseElement.querySelectorAll('tr>td');

    const productDescriptions = [];
    tds.forEach((td) => {
      if(td.textContent === 'Test') {
        productDescriptions.push(td.textContent);
      }
    });

    expect(productDescriptions.length).toBe(mockOffer.offerLines.length);
  });

  it('should emit events for the correct offerLine', async () => {
    const { baseElement, getByTitle } = render(<RowOffer offer={mockOffer} onChangedQuantity={onChangedQuantityMock} onChangedStatus={onChangedStatusMock}/>);
    expect(baseElement).toBeTruthy();

    const openCheckbox = baseElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await act(() => openCheckbox.click());

    const selectCheckbox = baseElement.querySelector('th>label>input[role="checkbox"]') as HTMLInputElement;
    await act(() => selectCheckbox.click());
    expect(onChangedStatusMock).toHaveBeenCalledWith(+mockOffer.offerLines[0].id, true);

    const incrementButton = getByTitle('increment');
    await act(() => incrementButton.click());
    expect(onChangedQuantityMock).toHaveBeenCalledWith(+mockOffer.offerLines[0].id, 2);

    const decrementButton = getByTitle('decrement');
    await act(() => decrementButton.click());
    expect(onChangedQuantityMock).toHaveBeenCalledWith(+mockOffer.offerLines[0].id, 1);

    await act(() => selectCheckbox.click());
    expect(onChangedStatusMock).toHaveBeenCalledWith(+mockOffer.offerLines[0].id, false);
  });
})