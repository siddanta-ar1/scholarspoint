// components/MobileSlideshow.tsx
'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const images = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500',
  'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=500',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400',
]

export default function MobileSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-64 md:hidden rounded-xl overflow-hidden shadow-lg">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          sizes="100vw"
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
    </section>
  )
}
