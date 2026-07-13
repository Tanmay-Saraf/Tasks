import React from 'react'
import { intlFormatDistance } from 'date-fns'
import Link from 'next/link'

const BoardCard = ({title,createdAt,id}) => {
  return (
    <Link href={`/boards/${encodeURIComponent(id)}`} className='bg-white p-4 rounded-xl border border-neutral-300 hover:translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer'>
      <h1 className='text-xl font-semibold'>{title}</h1>
      <p className='text-neutral-500 mt-5 text-sm text-end' title={new Date(createdAt).toLocaleString()}>Created <span className='font-semibold'>{intlFormatDistance(new Date(createdAt),Date.now())}</span></p>
    </Link>
  )
}

export default BoardCard
