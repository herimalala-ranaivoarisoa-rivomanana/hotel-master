import React, { useState } from 'react'
import Image from 'next/image'

export const ROOM_IMAGE_FALLBACK = '/images/room-unavailable.svg'

const RoomImage = ({ src, alt, ...props }) => {
    const [failedSource, setFailedSource] = useState(null)
    const source = typeof src === 'string' && src.trim() ? src : ROOM_IMAGE_FALLBACK
    const displayedSource = failedSource === source ? ROOM_IMAGE_FALLBACK : source

    return (
        <Image
            {...props}
            src={displayedSource}
            alt={alt}
            unoptimized
            onError={() => setFailedSource(source)}
        />
    )
}

export default RoomImage
