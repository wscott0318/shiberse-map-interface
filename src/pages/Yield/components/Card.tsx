import React from 'react'
import { BackButton } from '../components/Button'

export default function Card({
    header = undefined,
    footer = undefined,
    backgroundImage = '',
    title = '',
    description = '',
    children,
    className,
    padding = undefined
}: any) {

    return (
        <div
            className={`relative ${className}`}
        >
        {/*<BackButton defaultRoute=""/>*/}
            <div>
                {header && <>{header}</>}

                <div className="px-2 py-4 sm:p-2 pb-0">
                    {title && <div className="text-2xl text-high-emphesis mb-4">{title}</div>}
                    {description && <div className="text-base text-secondary">{description}</div>}
                    {children}
                </div>

                {footer && <>{footer}</>}
            </div>
        </div>
    )
}
