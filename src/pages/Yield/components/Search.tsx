import React from 'react'
import { Search as SearchIcon } from 'react-feather'
import styled from 'styled-components'

const InputSearchBar = styled.div`
background: transparent;
border: 2px solid #b7b9bc;
border-radius: 2px
`;

export default function Search({ term, search }: any) {
    return (
        <InputSearchBar className="relative rounded w-full sm:max-w-xl md:max-w-sm float-right">
            <input
                className="py-3 pl-4 pr-14 text-white rounded w-full focus:outline-none focus:ring border-0 italic font-medium"
                onChange={e => search(e.target.value)}
                style={{ background: 'transparent' }}
                value={term}
                placeholder="Search by name, symbol, address"
            />
            {/* <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                <SearchIcon size={16} />
            </div> */}
        </InputSearchBar>
    )
}
