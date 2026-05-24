import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Always save to Supabase as a reliable record
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.from('contact_messages').insert({ name, email, message })
  } catch {
    // Table may not exist yet — that's okay, we still try email below
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
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_EMAIL}>`,
        replyTo: email,
        to: process.env.SMTP_EMAIL,
        subject: `New Query from ${name}`,
        text: message,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br />${message}</p>
        `,
      })
    } catch (error) {
      console.error('Nodemailer error:', error)
      // Don't fail the request — message was saved to Supabase
    }
  }

  return NextResponse.json({ success: true })
}
