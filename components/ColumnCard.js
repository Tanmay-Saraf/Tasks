import React from 'react'

const ColumnCard = ({tasks}) => {
    return (
        <div className="column bg-zinc-100 border border-neutral-200 p-4 rounded-xl h-[75vh] overflow-y-auto w-80 shrink-0 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="headings text-xl text-center">ABCD</div>
            <hr className='mx-2 my-2' />
            <div className="tasks flex flex-col gap-2 mt-4">
                
            </div>
        </div>
    )
}

export default ColumnCard
