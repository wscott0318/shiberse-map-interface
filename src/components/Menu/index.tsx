/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { classNames } from '../../functions/styling'
import { ExternalLink } from '../Link'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { Link, NavLink } from 'react-router-dom'
const solutions = [
    // {
    //     name: 'DOGPARK',
    //     // description: 'Documentation for users of Sushi.',
    //     href: ''
    // },
    {
        name: 'WHITEPAPER',
        //description: 'Tools to optimize your workflow.',
        href: 'https://github.com/shytoshikusama/woofwoofpaper/raw/main/SHIBA_INU_WOOF_WOOF.pdf'
    },
    {
        name: 'AUDIT',
        //description: 'Join the community on Discord.',
        href: 'https://www.certik.org/projects/shib'
    },
    {
        name: 'BONEFOLIO',
        //description: 'Documentation for developers of Sushi.',
        href: 'https://analytics.shibaswap.com'
    },
    // {
    //     name: 'ROADMAP',
    //     //description: 'Sushi is a supporter of Open Source.',
    //     href: ''
    // },

    {
        name: 'FAQ',
        //description: 'Join the community on Discord.',
        href: '/faq'
    }
]

export default function Menu() {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className="n-color-black">
                        <p className="nav-menu-name"> MENU </p>
                    </Popover.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className="absolute z-10 bottom-12 md:top-12 left-full transform -translate-x-full mt-3 px-2 w-screen max-w-xs sm:px-0"
                        >
                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden nav-menu-submenu pt-4 pb-4">
                                <div className="relative text-left">
                                    {/* {solutions.map(item => (
                                        <NavLink
                                        key={item.name}
                                        className="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                                        to={item.href}
                                        target="_blank">
                                        <p className="nav-menu-submenu-text">{item.name}</p>
                                    </NavLink>
                                    ))} */}
                                    <a
                                        className="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                                        target="_blank"
                                        href="https://github.com/shytoshikusama/woofwoofpaper/raw/main/SHIBA_INU_WOOF_WOOF.pdf"
                                        rel="noreferrer"
                                    >
                                        <p className="nav-menu-submenu-text">WHITEPAPER</p>
                                    </a>
                                    <a
                                        className="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                                        href="https://www.certik.org/projects/shib"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <p className="nav-menu-submenu-text">AUDIT</p>
                                    </a>
                                    <a
                                        className="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                                        target="_blank"
                                    >
                                        <p className="nav-menu-submenu-text">DOGGY DAO</p>
                                    </a>
                                    <NavLink
                                        className="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                                        to=""
                                    >
                                        <p className="nav-menu-submenu-text">FAQ</p>
                                    </NavLink>

                                    <NavLink
                                        className="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                                        exact
                                        strict
                                        to="/map"
                                    >
                                        <p className="nav-menu-submenu-text">MAP</p>
                                    </NavLink>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
