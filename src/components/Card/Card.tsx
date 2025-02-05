import React from "react";

type Props = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}
export default function Card({title, children, subtitle = ''}: Props) {
    return (
        <div className="card bg-base-100 shadow-xl text-center border border-primary">
            <div className="card-body">
                <h2 className="card-title text-center justify-center">{title}</h2>
                <p className="text-left text-sm">{subtitle}</p>
                {children}
            </div>
        </div>
    );
}