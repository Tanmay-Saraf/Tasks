import React from 'react'

const BoardCardSkeleton = () => {
    return (
        <div className='animate-pulse rounded-xl border border-neutral-200 bg-white p-4 shadow'>
            <div className='h-6 w-2/3 rounded bg-neutral-300'></div>
            <div className='mt-8 flex justify-end'>
                <div className='h-4 w-24 rounded bg-neutral-200 '></div>
            </div>
        </div>
    )
}

export default BoardCardSkeleton
