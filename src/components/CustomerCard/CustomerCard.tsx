import StoreCard from "../StoreCard/StoreCard";
import React from "react";
import {StoreDto} from "../../dto/stores/StoreDto";

type Props = {
  store: StoreDto,
}

export default ({store}: Props) => {
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
                 </div>
               </>}/>
  )
}
