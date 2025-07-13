'use client'

import { useState } from 'react'

import { toast } from 'sonner'

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      toast.success('Message sent successfully!')
      setForm({ name: '', email: '', message: '' })
    } else {
      toast.error('Failed to send message.')
    }
  }

  return (
    <form
  onSubmit={handleSubmit}
  className="max-w-lg mx-auto p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl space-y-6 border border-neutral-200 dark:border-neutral-800 transition-all duration-300"
>
  <div className="space-y-1">
    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      Your Name
    </label>
    <input
      id="name"
      name="name"
      type="text"
      placeholder="John Doe"
      value={form.name}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
    />
  </div>

  <div className="space-y-1">
    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      Your Email
    </label>
    <input
      id="email"
      name="email"
      type="email"
      placeholder="you@example.com"
      value={form.email}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
    />
  </div>

  <div className="space-y-1">
    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      Your Message
    </label>
    <textarea
      id="message"
      name="message"
      placeholder="Write your message here..."
      value={form.message}
      onChange={handleChange}
      rows={5}
      required
      className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 resize-none"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className={`w-full py-2 rounded-xl font-semibold text-white transition-all duration-300 ${
      loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
    }`}
  >
    {loading ? 'Sending...' : 'Send Message'}
  </button>
</form>

  )
}
