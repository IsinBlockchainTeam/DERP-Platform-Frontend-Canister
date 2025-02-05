import StoreCard from "../StoreCard/StoreCard";
import React from "react";
import {StoreDto} from "../../dto/stores/StoreDto";
import {useTranslation} from "react-i18next";

type Props = {
  store: StoreDto,
  isMySupplier: boolean,
  onChangeIsSupplier?: (isFavorite: boolean) => void | Promise<void>
}

export default ({store, isMySupplier, onChangeIsSupplier}: Props) => {
  const {t} = useTranslation(undefined, {keyPrefix: 'mySuppliers'});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const changeIsSupplier = async () => {
    setIsLoading(true);
    try {
      await onChangeIsSupplier?.(!isMySupplier);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <StoreCard store={store}
               actions={() => <>
                 <div className={'flex flex-row flex-1 mt-4'}>
                   {/* Details button */}
                   <button className={'btn btn-outline flex-1 mr-3'}>
                     Details
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                       <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                     </svg>


                   </button>

                   {/* Favorite button */}
                   <div className={'tooltip'} data-tip={isMySupplier ? t('removeSupplier') : t('addSupplier')}>
                     <button className={`btn btn-circle btn-outline ${isLoading && 'loading'} ${isMySupplier ? 'btn-error' : 'btn-primary'}`} onClick={changeIsSupplier}>
                       {isLoading ? <span className="loading loading-spinner"></span> :
                         isMySupplier ?
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                stroke="currentColor" className="w-6 h-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                           </svg>
                           :
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                stroke="currentColor" className="w-6 h-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                           </svg>
                       }
                     </button>
                   </div>
                 </div>
               </>}/>
  )
}