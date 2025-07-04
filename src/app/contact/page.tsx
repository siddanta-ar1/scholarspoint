// src/app/contact/page.tsx
import { ContactForm } from '@/components/ContactForm'
import React from 'react'

export const metadata = {
  title: 'Contact |  ScholarsPoint',
  description: 'Get in touch with the ScholarsPoint team for queries, feedback, or partnership opportunities.',
}

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Contact Us</h1>
        <p className="text-gray-600 text-base">
          Have a question or want to get in touch? Fill out the form and we’ll respond shortly.
        </p>
      </div>

      <div className="mt-10 max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}

export default ContactPage
