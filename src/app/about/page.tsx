// src/app/about/page.tsx
import Image from "next/image"
export const metadata = {
  title: 'About Us | 🎓 ScholarsPoint',
  description: 'Learn about the mission, vision, and team behind ScholarsPoint.',
}

const teamMembers = [
    {
        name: 'Sumit Suwal',
        role: 'CTO',
        img: '/sumit.jpg',
        bio: 'Tech enthusiast driving our platform’s innovation.',
    },
    {
      name: 'Siddanta Sodari',
      role: 'Founder & CEO',
      img: '/siddanta.jpg',
      bio: 'Passionate about education access and technology.',
    },
  {
    name: 'Sushant Chaudhary',
    role: 'Community Manager',
    img: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hbiUyMHBob3RvfGVufDB8fDB8fHww',
    bio: 'Connecting students and organizations worldwide.',
  },
]

const milestones = [
  {
    title: 'Many Opportunities',
    description: 'Curated scholarships, fellowships, and internships.',
    icon: 'https://media.istockphoto.com/id/471741807/photo/yellow-opportunity-ahead-road-sign-with-sky.webp?a=1&b=1&s=612x612&w=0&k=20&c=IcsZaScAuEdYnwwKR4dSWLEBTk1p9QVeE4s68NaEunI=',
  },
  {
    title: 'Multiple Countries',
    description: 'Connecting students globally across continents.',
    icon: 'https://images.unsplash.com/photo-1651421479704-470a78eef530?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y291bnRyaWVzfGVufDB8fDB8fHww',
  },
  {
    title: ' Passionate Users',
    description: 'Empowering learners and professionals worldwide.',
    icon: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3R1ZGVudHN8ZW58MHx8MHx8fDA%3D',
  },
]

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 text-center">About 🎓 ScholarsPoint</h1>

      {/* Intro paragraph */}
      <p className="max-w-3xl mx-auto text-center text-lg leading-relaxed">
        ScholarsPoint is a platform dedicated to connecting students, researchers, and professionals
        with the best global opportunities — scholarships, internships, fellowships, and visa guides.
        We strive to make education and career growth accessible to everyone, everywhere.
      </p>

      {/* Milestones cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {milestones.map(({ title, description, icon }) => (
          <div
            key={title}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
          >
            <Image width={80}
          height={80} src={icon} alt={title} className="h-48 w-65 mb-4" loading="lazy" />
            <h3 className="text-xl font-semibold text-blue-700">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
        ))}
      </section>

      {/* Mission and Vision with image */}
      <section className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
        <Image
          src="https://images.unsplash.com/photo-1607013407627-6ee814329547?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVuaXZlcnNpdHl8ZW58MHx8MHx8fDA%3D"
          alt="Our Mission"
          width={80}
          height={80}
          className="rounded-lg shadow-lg w-full md:w-1/2 object-cover"
          loading="lazy"
        />
        <div>
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">🎯 Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To empower learners globally by simplifying access to verified and up-to-date academic and
            career opportunities.
          </p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">🌍 Our Vision</h2>
          <p className="text-lg leading-relaxed">
            A world where every deserving individual can achieve their educational dreams regardless of
            geography or background.
          </p>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
          alt="Our Vision"
          width={80}
          height={80}
          className="rounded-lg shadow-lg w-full md:w-1/2 object-cover"
          loading="lazy"
        />
      </section>

      {/* Team cards */}
      <section className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-semibold text-blue-700 text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {teamMembers.map(({ name, role, img, bio }) => (
            <div
              key={name}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <Image
                src={img}
                alt={name}
                width={80}
                 height={80}
                className="mx-auto mb-4 w-32 h-32 object-cover rounded-full border-4 border-blue-600"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-blue-600 font-medium">{role}</p>
              <p className="mt-2 text-gray-600">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact call-to-action */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-4">🤝 Connect With Us</h2>
        <p className="mb-6">
          Have a question, feedback, or want to collaborate?{' '}
          <a href="/contact" className="text-blue-600 underline hover:text-blue-800">
            Contact us here
          </a>
          .
        </p>
      </section>
    </main>
  )
}
