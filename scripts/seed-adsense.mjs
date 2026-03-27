import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate diverse dates for blogs
const getPastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const getFutureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};

const blogs = [
  {
    title: "10 Proven Strategies to Win Fully Funded Scholarships in 2026",
    slug: "10-strategies-fully-funded-scholarships-2026",
    content: `
# Mastering the Scholarship Game in 2026

Applying for scholarships can be a daunting process, but with the right strategy, your chances of securing full funding skyrocket. Here are 10 proven strategies...

## 1. Start Early
The early bird gets the scholarship. Begin your search at least 12 months before your intended start date.

## 2. Personalize Your SOP
A generic Statement of Purpose is a fast-track to rejection. Tailor every SOP to the specific organization's values and mission.

## 3. Strong Recommendations
Choose recommenders who know your work ethic and character deeply, not just those with impressive titles.

... (This is a comprehensive guide aimed at helping students globally).
`,
    excerpt: "Discover the top 10 strategies that successful applicants use to secure fully funded international scholarships.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["Scholarships", "Tips", "2026"],
    is_published: true,
    published_at: getPastDate(5),
  },
  {
    title: "How to Write a Winning Statement of Purpose (SOP)",
    slug: "how-to-write-winning-sop",
    content: "Writing a strong SOP is critical. In this comprehensive guide, we cover the structure, tone, and key elements that make an SOP stand out to admission committees...",
    excerpt: "Learn the secrets to writing a Statement of Purpose that grabs attention and secures acceptance.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["SOP", "Applications"],
    is_published: true,
    published_at: getPastDate(15),
  },
  {
    title: "Top 5 European Countries with Free Universities for International Students",
    slug: "top-5-european-countries-free-universities",
    content: "Europe offers some of the best higher education systems in the world, and many are tuition-free or extremely affordable. Let's explore Germany, Norway, Iceland, and others...",
    excerpt: "A comprehensive guide to studying in Europe without the heavy burden of tuition fees.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["Europe", "Study Abroad", "Free Education"],
    is_published: true,
    published_at: getPastDate(25),
  },
  {
    title: "Understanding the F-1 Visa Process: A Step-by-Step Guide",
    slug: "understanding-f1-visa-process",
    content: "The US F-1 student visa process involves several critical steps: getting your I-20, paying the SEVIS fee, completing the DS-160, and acing the visa interview...",
    excerpt: "Everything you need to know about successfully applying for a US student visa.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["USA", "Visa", "F-1"],
    is_published: true,
    published_at: getPastDate(35),
  },
  {
    title: "The Ultimate Guide to DAAD Scholarships in Germany",
    slug: "ultimate-guide-daad-scholarships",
    content: "DAAD is the world's largest funding organization for international exchange. In this guide, we break down the eligibility, application process, and tips for DAAD scholarships...",
    excerpt: "Your complete roadmap to securing a fully funded DAAD scholarship in Germany.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["Germany", "DAAD", "Scholarships"],
    is_published: true,
    published_at: getPastDate(45),
  },
  {
    title: "Chevening Scholarship 2026: Everything You Need to Know",
    slug: "chevening-scholarship-2026-guide",
    content: "The UK's prestigious Chevening Scholarship opens doors for future leaders. Learn about the leadership essays, networking requirements, and the interview process...",
    excerpt: "Prepare for the Chevening scholarship with our deep-dive analysis of the application requirements.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["UK", "Chevening", "Leadership"],
    is_published: true,
    published_at: getPastDate(55),
  },
  {
    title: "IELTS vs TOEFL: Which English Test Should You Take?",
    slug: "ielts-vs-toefl-guide",
    content: "Choosing between IELTS and TOEFL can be confusing. We compare the test formats, scoring systems, and widespread acceptance to help you decide...",
    excerpt: "A detailed comparison of the two most popular English proficiency tests for international students.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["IELTS", "TOEFL", "English Proficiency"],
    is_published: true,
    published_at: getPastDate(65),
  },
  {
    title: "Erasmus Mundus Joint Master Degrees: A Gateway to Europe",
    slug: "erasmus-mundus-joint-master-degrees",
    content: "Study in at least two different European countries with full funding. Discover how the Erasmus Mundus program works and how to apply...",
    excerpt: "Explore Europe while earning a world-class master's degree with the fully funded Erasmus Mundus program.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["Erasmus", "Europe", "Masters"],
    is_published: true,
    published_at: getPastDate(75),
  },
  {
    title: "How to Ask for a Strong Letter of Recommendation",
    slug: "how-to-ask-for-lor",
    content: "A strong Letter of Recommendation (LOR) can make or break your application. Learn whom to ask, when to ask, and how to provide them with the right information...",
    excerpt: "Master the art of securing compelling recommendation letters from your professors and employers.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["LOR", "Applications", "Tips"],
    is_published: true,
    published_at: getPastDate(85),
  },
  {
    title: "Top 10 Fully Funded Internships for International Students",
    slug: "top-10-fully-funded-internships",
    content: "Gain international work experience without breaking the bank. From the UN to top tech companies, these 10 internship programs offer full financial support...",
    excerpt: "Discover the best fully funded internship opportunities available globally for students and recent graduates.",
    image_url: "/placeholder.png",
    author_name: "ScholarsPoint Team",
    tags: ["Internships", "Fully Funded", "Career"],
    is_published: true,
    published_at: getPastDate(95),
  }
];

const opportunities = [];

// Generate 25 opportunities
const orgs = ["Oxford University", "Harvard University", "United Nations", "World Bank", "Stanford University", "Max Planck Institute", "Google", "Microsoft", "MIT", "Cambridge University"];
const countries = ["UK", "USA", "Switzerland", "USA", "USA", "Germany", "USA", "USA", "USA", "UK"];
const types = ["scholarship", "internship", "fellowship", "competition"];

for(let i=0; i<25; i++) {
  const orgIndex = i % orgs.length;
  const oppType = types[i % types.length];
  
  opportunities.push({
    title: `Global Excellence ${oppType.charAt(0).toUpperCase() + oppType.slice(1)} ${2026 + (i%2)}`,
    slug: `global-excellence-${oppType}-${i}-${Date.now()}`,
    type: oppType,
    organization: orgs[orgIndex],
    country: countries[orgIndex],
    location: "Main Campus",
    image_url: "/placeholder.png",
    deadline: getFutureDate((i * 15) + 30),
    is_active: true,
    is_featured: i % 5 === 0,
    description: `This is a highly competitive, fully funded ${oppType} offered by ${orgs[orgIndex]}. It is designed for outstanding international candidates who demonstrate exceptional academic and leadership potential in their respective fields. Candidates will undergo a rigorous selection process.`,
    content: `
# Program Overview
This ${oppType} provides an unparalleled opportunity to advance your career and academic journey at ${orgs[orgIndex]}.

## Benefits
- Full tuition coverage
- Monthly living stipend
- Travel allowance
- Health insurance

## Eligibility
- Must be an international candidate
- Demonstrated leadership skills
- High academic standing

## Application Process
Applications must be submitted through the official portal before the deadline. Late submissions will not be considered.
    `,
    application_url: "https://example.com/apply",
    scholars_point_tips: `When applying for this ${oppType} at ${orgs[orgIndex]}, make sure to highly emphasize your cross-cultural communication skills and precise alignment with their core research/work objectives. A tailored application is key here.`,
    who_should_apply: `Ideal candidates are those with a proven track record of community impact, top 10% academic standing, and a clear vision of how this ${oppType} will contribute to their long-term goals in their home country.`,
    visa_difficulty: "Medium / Standard Processing",
    details: oppType === "scholarship" ? { funding_type: "fully_funded", degree: "Masters" } :
             oppType === "internship" ? { stipend: "$3000/month", duration: "3 months" } :
             oppType === "fellowship" ? { duration: "1 year", fellowship_value: "$50,000" } :
             { prizes: ["$10,000 First Prize"] }
  });
}

async function seed() {
  console.log("Seeding Blogs with varied dates...");
  
  for (const blog of blogs) {
    const { error } = await supabase.from('blogs').insert(blog);
    if (error) {
           if(error.code !== '23505') { // ignore unique constraints
                console.error("Error inserting blog:", blog.title, error.message);
           }
    } else {
      console.log(`Inserted blog: ${blog.title}`);
    }
  }

  console.log("Seeding 25 Opportunities...");
  for (const opp of opportunities) {
    const { error } = await supabase.from('opportunities').insert(opp);
    if (error) {
       if(error.code !== '23505') {
            console.error("Error inserting opp:", opp.title, error.message);
       }
    } else {
      console.log(`Inserted opportunity: ${opp.title}`);
    }
  }
  
  console.log("Seeding complete. Run the site to check.");
}

seed();
