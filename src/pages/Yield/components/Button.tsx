import React from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'

const FILLED = {
    default: 'border-2  border-solid border-gray-700 w-full rounded px-4 py-3',
    blue: 'w-full rounded px-4 py-3',
    pink: 'w-full rounded px-4 py-3',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const OUTLINED = {
    default: 'bg-opacity-20  rounded text-xs text-blue px-2 py-1',
    blue: 'bg-opacity-20  rounded text-xs text-blue px-2 py-1',
    pink: 'bg-opacity-20  rounded text-xs text-pink px-2 py-1',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const VARIANT = {
    outlined: OUTLINED,
    filled: FILLED
    // gradient: 'bg-gradient-to-r from-blue to-pink'
}

export type ButtonColor = 'blue' | 'pink' | 'gradient' | 'default'

export type ButtonVariant = 'outlined' | 'filled'

export interface ButtonProps {
    children?: React.ReactChild | React.ReactChild[]
    color?: ButtonColor
    variant?: ButtonVariant
}

function Button({
    children,
    className,
    color = 'default',
    variant = 'filled',
    ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
    return (
        <button
            className={`${VARIANT[variant][color]} yield-button focus:outline-none disabled:opacity-50 ${className} `}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button

export function BackButton({ defaultRoute }: { defaultRoute: string }): JSX.Element {
    const history = useHistory()
    return (
        <Button
            onClick={() => {
                history.push(defaultRoute)
            }}
            className="p-2 mr-4 rounded-full bg-dark-900 w-10 h-10"
        >
            <ChevronLeft className={'w-6 h-6'} />
        </Button>
    )
}
