import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO = ({ title, description, keywords, image, url, type = 'website' }: SEOProps) => {
    const siteTitle = "Janakalyan Secondary School";
    // Ensure this points to your actual deployed domain
    const siteUrl = "https://jkssp5padampur.vercel.app";
    const defaultImage = `${siteUrl}/img/jkss_logo.png`;

    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{`${title} | ${siteTitle}`}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords || "school, education, janakalyan secondary school, babai, padampur, dang, nepal, education stream, agriculture stream, management stream, best school in dang"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={`${title} | ${siteTitle}`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={`${title} | ${siteTitle}`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImage} />

            <link rel="canonical" href={fullUrl} />

            {/* Structured Data for School */}
            <script type="application/ld+json">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "School",
                    "name": "Janakalyan Secondary School",
                    "image": "${metaImage}",
                    "@id": "${siteUrl}",
                    "url": "${siteUrl}",
                    "telephone": "+9779844929502",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Babai-5, Padampur",
                        "addressLocality": "Dang",
                        "addressCountry": "NP"
                    },
                    "sameAs": [
                        "https://www.facebook.com/janakalyana.ma.bi.padamapura.dana"
                    ]
                }
            `}
            </script>
        </Helmet>
    );
};

export default SEO;
