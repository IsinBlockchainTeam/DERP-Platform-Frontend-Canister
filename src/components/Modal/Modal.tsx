import React from "react";

export type ModalProps = {
    children?: React.ReactNode
    open: boolean
    onChangeOpen: (open: boolean) => void
    closeButton?: boolean
    className?: string
}

export const Modal = ({
    children,
    open,
    onChangeOpen,
    className = "max-w-5xl w-11/12",
    closeButton = true
}: ModalProps) => {
    return (
        <dialog className={"modal w-full h-full" + (open && ' modal-open')}>
            <div className={"modal-box " + (className || "")}>
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    {closeButton &&
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => onChangeOpen(false)}>✕</button>
                    }
                </form>
                {children}
            </div>
        </dialog>
    );
}
