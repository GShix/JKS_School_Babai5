import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"

const About = () => {
  return (
    <div className="about-page">
      <Header/>
      <main className="min-h-screen">
        <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
          <h1 className="text-5xl font-medium text-center my-8 text-white">About Us</h1>
        </div>
        <div className="short-about w-full mx-auto px-6 py-10 sm:px-8 lg:px-12 flex max-sm:flex-col gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our organization was founded with the mission to make a positive impact in our community. Over the years, we have grown and evolved, but our core values remain the same.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="/img/running-shield.jpg" alt="Running Shield" className="w-full h-auto object-cover" />
          </div>
        </div>
        <div className="detailed-about w-full bg-gray-100 px-6 py-10 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-semibold mb-6">What We Do</h2>
          <p className="text-lg text-gray-700 mb-4">  
            We are committed to providing high-quality services that meet the needs of our clients. Our team works tirelessly to ensure customer satisfaction and deliver exceptional results.
          </p>
        </div>
        <div className="about-map flex max-sm:flex-col gap-8 px-6 py-10 sm:px-8 lg:px-12 sm:h-[400px]">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4">Location on Google Map</h2>
            <p className="text-lg text-gray-700 mb-6">
              Babai Rural Municipality-5, Padampur, Dang
            </p>
          </div>
          <div className="md:w-1/2">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.6370459737786!2d82.1354621!3d28.187951699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39981ddb63b5812f%3A0x459611dac3a9d5cc!2sJanakalyan%20H.S.S.%20Padampur!5e0!3m2!1sen!2snp!4v1757949161711!5m2!1sen!2snp" width="600" height="320" allowFullScreen={true} loading="lazy" 
            className="border-0 w-full rounded-md"
            referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default About