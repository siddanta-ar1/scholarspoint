import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, message } = body

  // Presence check
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Format + length validation
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 })
  }

  // Always save to Supabase as a reliable record
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.from('contact_messages').insert({ name, email, message })
  } catch {
    // Non-fatal — still try email
  }

  // Try SMTP email only when credentials are configured
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      })
      // Escape user input before embedding in HTML to prevent injection
      const safeName = escapeHtml(name)
      const safeEmail = escapeHtml(email)
      const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

      await transporter.sendMail({
        from: `"ScholarsPoint Contact" <${process.env.SMTP_EMAIL}>`,
        replyTo: email,
        to: process.env.SMTP_EMAIL,
        subject: `New Query from ${safeName}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong><br />${safeMessage}</p>
        `,
      })
    } catch (error) {
      console.error('Nodemailer error:', error)
    }
  }

  return NextResponse.json({ success: true })
}
