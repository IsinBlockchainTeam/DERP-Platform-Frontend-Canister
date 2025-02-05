import React from "react";
import RowProduct from "../RowProduct/RowProduct"
import {OfferDto} from "../../dto/OfferDto";
import {useTranslation} from "react-i18next";

interface Props {
  offer: OfferDto;
  onChangedQuantity: (offerLineId: number, quantity: number) => void;
  onChangedStatus: (offerLineId: number, newStatus: boolean) => void;
}

export default function RowOffer({
  offer,
  onChangedQuantity,
  onChangedStatus
}: Props) {

  const {t} = useTranslation(undefined, {keyPrefix: "offers.row"});
  const [open, setOpen] = React.useState(false);

  return (
    <div className="collapse border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" onChange={e => setOpen(e.target.checked)} />
      <div className="collapse-title text-xl font-medium col px-2">
        <div className="flex items-center align-center justify-center">
        <div className="flex justify-start align-stretch">
          <div className="mr-2">{ offer.description }</div>
          {
          !open ? 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="self-center w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg> :
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="self-center w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        
          }
          
        </div>
        </div>
      </div>
      <div className="collapse-content overflow-x-scroll !p-0">
        <table className="table table-offer-products w-full text-center table-pin-cols">
          <thead className="bg-base-200">
          <tr>
              <th className="z-0"></th>
              <td>{t('id')}</td>
              <td>{t('description')}</td>
              <td style={{minWidth: '7rem'}}>{t('quantity')}</td>
          </tr>
          </thead>
          <tbody className="overflow-y-scroll">
          {
              offer.offerLines.map(line => <RowProduct
                  key={line.id}
                  id={+line.productId}
                  description={line.description}
                  onChangedQuantity={(quantity) => {
                    onChangedQuantity(+line.id, quantity);
                  }}
                  onChangedStatus={(status) => {
                    onChangedStatus(+line.id, status);
                  }}
              />)
          }
          </tbody>
          <tfoot className="bg-base-200">
          <tr>
              <th></th>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
  
}