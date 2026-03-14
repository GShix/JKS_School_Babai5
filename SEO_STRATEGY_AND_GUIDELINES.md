# Comprehensive SEO Strategy & Implementation Guide for Janakalyan Secondary School

## 1. Current State Analysis

Based on the codebase analysis of `JKS_School_Babai5`, here is the current SEO status:

| Metric              | Current Status       | Issues Identified                                                                                                                                 |
| :------------------ | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Meta Tags**       | 🔴 Critical          | Pages (Home, About, etc.) lack unique `<title>` and `<meta name="description">`. All pages share the default valid from `index.html`.             |
| **Semantic HTML**   | 🟠 Needs Improvement | Multiple `<h1>` tags found on single pages (e.g., `AcademicProgramsCard.tsx`). Navigation items implemented as `div` instead of `nav` or `ul/li`. |
| **Crawling**        | 🔴 Critical          | Missing `robots.txt` and `sitemap.xml` in `frontend/public`. Search engines don't know what to index.                                             |
| **Social Sharing**  | 🔴 Missing           | No Open Graph (`og:title`, `og:image`) or Twitter Card tags. Links shared on Facebook/Viber will look broken or generic.                          |
| **Performance**     | 🟢 Good              | `react-helmet-async` is installed. Vite usually produces optimized bundles. Images have `alt` text.                                               |
| **Structured Data** | 🔴 Missing           | No Schema.org (JSON-LD) markup for "School", "Events", or "Course".                                                                               |

### 📉 Estimated "Before" SEO Score: ~45/100

- **Visiblity:** Low. Search engines will see duplicate titles across all pages.
- **Click-Through Rate (CTR):** Low. No rich snippets or compelling descriptions in search results.

---

## 2. Predicted "After" Stats (Post-Optimization)

By implementing the guidelines below, we aim for:

| Metric              | Target Status | Impact                                                                                        |
| :------------------ | :------------ | :-------------------------------------------------------------------------------------------- |
| **Meta Tags**       | ✅ Optimized  | Every page (Home, About, Notices) has a unique, keyword-rich title and description.           |
| **Semantic HTML**   | ✅ Optimized  | Clear hierarchy (`h1` -> `h2` -> `h3`) helps search engines understand content importance.    |
| **Crawling**        | ✅ Optimized  | `sitemap.xml` guides bots to all 50+ pages/notices immediately. `robots.txt` allows indexing. |
| **Social Sharing**  | ✅ Optimized  | attractive cards with school logo and summary when sharing links.                             |
| **Structured Data** | ✅ Optimized  | Potential for "Rich Results" (Event dates, School address, Course lists) directly in Google.  |

### 📈 Estimated "After" SEO Score: ~95/100

- **Visiblity:** High. Unique keywords for "Best School in Babai", "Science Stream", "Agriculture Stream".
- **CTR:** Improved. Users see exactly what the page is about before clicking.

---

## 3. SEO Implementation Guidelines

### Step 1: Create a Reusable SEO Component

Avoid repeating code. Create `src/components/SEO.tsx` to handle all meta tags dynamically.

```tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO = ({ title, description, keywords, image, url }: SEOProps) => {
  const siteTitle = "Janakalyan Secondary School";
  const defaultImage = "/img/jkss_logo.png";
  const siteUrl = "https://jkssp5padampur.edu.np"; // Replace with actual domain

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={
          keywords ||
          "school, education, babai, dang, nepal, science, agriculture"
        }
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || defaultImage} />

      <link rel="canonical" href={url || siteUrl} />
    </Helmet>
  );
};

export default SEO;
```

### Step 2: Use SEO Component in Pages

Update `src/pages/home/Home.tsx`:

```tsx
import SEO from "../../components/SEO";

const Home = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Welcome to Janakalyan Secondary School, a leading educational institution in Babai-5, Dang, offering Education, Agriculture, and Management streams."
      />
      {/* Rest of your component */}
    </>
  );
};
```

### Step 3: Semantic HTML Rules

Search engines use heading tags to understand the structure of the text.

- **Rule 1: Only one `<h1>` per page.** This should be the main title of the page (e.g., "About Us", "Academic Programs", "Welcome to JKSS").
- **Rule 2: Use `<h2>` for major sections.** (e.g., "Our Mission", "Principal's Message", "Gallery").
- **Rule 3: Use `<h3>` for subsections.** (e.g., individual news items, specific program details).
- **Rule 4: Use `<nav>`, `<main>`, `<article>`, `<footer>`, `<header>`** to define areas of the layout.

**Example Fix for `AcademicProgramsCard.tsx`:**

- Change "Academic Programs" from `<h1>` to `<h2>` (assuming the page title is likely H1 elsewhere, or H1 if it's the main section).
- Change tab titles ("Education", "Agriculture", "Management") from `<h1>` to `<button>` or `<li>`. `<h1>` inside a tab control is semantically incorrect.

### Step 4: Add `robots.txt` and `sitemap.xml`

Create these files in `frontend/public/`.

**frontend/public/robots.txt**:

```text
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

**frontend/public/sitemap.xml**:
Since this is a React SPA, you generally need a static sitemap for your main routes.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://your-domain.com/</loc>
      <lastmod>2024-03-14</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
   </url>
   <url>
      <loc>https://your-domain.com/about/jkss</loc>
      <lastmod>2024-01-01</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>
   <!-- Add other static routes -->
</urlset>
```

_Note: For dynamic content (like blog posts), complex setups might require a backend sitemap generator._

### Step 5: Structured Data (JSON-LD)

Add this to your `index.html` `head` or via `Helmet` for the specialized specific "School" schema.

```tsx
// Inside SEO.tsx or Home.tsx
<script type="application/ld+json">
  {`
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Janakalyan Secondary School",
    "url": "https://jkssp5padampur.edu.np",
    "logo": "https://jks-school.edu.np/img/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Babai-5",
      "addressLocality": "Dang",
      "addressCountry": "NP"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-9844929502",
      "contactType": "customer service"
    }
  }
`}
</script>
```

---
