import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import About from '../components/About'
import Resume from '../components/Resume'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Gokul K — PHP Laravel Developer | REST API | MySQL | Coimbatore</title>
        <meta name="description" content="Gokul K — Junior PHP Laravel Developer (6 months) — ERP, Billing & E-Commerce with Laravel, MySQL, REST APIs. MCA 8.1. Available in Coimbatore." />
        <meta name="keywords" content="Gokul K, Laravel Developer Coimbatore, PHP Developer, MySQL, REST API, ERP, Billing System, E-Commerce" />
        <meta property="og:title" content="Gokul K — PHP Laravel Developer" />
        <meta property="og:description" content="Junior Laravel Developer shipping production ERP, billing & e-commerce systems." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gokulk.netlify.app/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Gokul K",
            "jobTitle": "PHP Laravel Developer",
            "address": { "@type": "PostalAddress", "addressLocality": "Coimbatore", "addressRegion": "Tamil Nadu", "addressCountry": "IN" },
            "email": "mailto:gokulgokul4457@gmail.com",
            "telephone": "+91-6380531946",
            "url": "https://gokulk.netlify.app",
            "sameAs": ["https://github.com/GokulK-24MCA26", "https://linkedin.com/in/gokulk887016"]
          })}
        </script>
      </Helmet>
      <Hero />
      <About />
      <Resume />
      <Projects />
      <Skills />
      <Contact />
    </>
  )
}
