// src/app/terms/page.tsx
export const metadata = {
  title: 'Terms of Service | 🎓 ScholarsPoint',
  description: 'Review the terms and conditions for using ScholarsPoint.',
}

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700">Terms of Service</h1>

      <p>
        These terms govern your use of the ScholarsPoint platform. By accessing our site, you agree
        to comply with the following rules and conditions.
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Use of Service</h2>
        <p>
          You agree to use the platform for personal, non-commercial use. Misuse or unauthorized use
          may result in account termination.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">2. Content Ownership</h2>
        <p>
          All content on the site is owned by ScholarsPoint or its partners. You may not duplicate or
          redistribute any content without permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">3. Liability</h2>
        <p>
          ScholarsPoint is not liable for inaccuracies in opportunity listings or third-party content.
          Users should verify details with the respective organizations.
        </p>
      </section>
    </main>
  )
}
