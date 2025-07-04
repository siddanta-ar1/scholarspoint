// src/app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy | 🎓 ScholarsPoint',
  description: 'Understand how ScholarsPoint handles your data and privacy.',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700">Privacy Policy</h1>

      <p>
        At ScholarsPoint, your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal information.
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email address when signing in</li>
          <li>Saved opportunities and preferences</li>
          <li>Usage data and feedback</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Your Data</h2>
        <p>
          We use your information to provide personalized services, improve platform performance, and
          communicate updates. We do not sell or share your data with third parties.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">3. Your Choices</h2>
        <p>
          You can manage or delete your account at any time. For any privacy-related queries, please
          contact us.
        </p>
      </section>
    </main>
  )
}
