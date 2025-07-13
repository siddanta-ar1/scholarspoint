// components/HeroSection.tsx
'use client'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative rounded-lg overflow-hidden h-96 shadow-lg">
      <video
        className="absolute inset-0 w-full h-full object-cover brightness-75"
        src="/video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4">
        <div className="bg-white/0 p-4 md:p-8 rounded-xl text-center shadow-lg max-w-3xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Discover Global Scholarships, Internships, and Visa Guidance 🎓
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white">
            Scholarspoint helps students worldwide access opportunities and guidance.
          </p>
          <Link
            href="/scholarships"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow-md"
          >
            Browse Scholarships
          </Link>
        </div>
      </div>
    </section>
  )
}
