import React from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    labelOption1?: string;
    onOption1: () => void;
    labelOption2?: string;
    onOption2: (...args: any[]) => void;
}



const DecisionModal = (props:Props) => {
    if (!props.isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-sm">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-base-content mb-2">
                        Scegli un'opzione
                    </h3>
                    <p className="text-base-content/70 mb-8">
                        Seleziona l'azione che desideri eseguire
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        className="btn btn-secondary btn-lg hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onOption1();
                            props.onClose();
                        }}
                    >
                        {props.labelOption1}
                    </button>

                    <button
                        className="btn btn-primary btn-lg hover:scale-105 transition-transform shadow-lg"
                        onClick={() => {
                            props.onOption2();
                            props.onClose();
                        }}
                    >
                        {props.labelOption2}
                    </button>
                </div>
            </div>

            <div className="modal-backdrop bg-black/50" onClick={props.onClose}></div>
        </div>
    );
};

export default DecisionModal;