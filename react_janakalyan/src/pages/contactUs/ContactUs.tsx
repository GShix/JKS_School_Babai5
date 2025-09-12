
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'

const ContactUs = () => {
  return (
    <div>
        <Header/>
        <main className='min-h-screen p-2'>
            <h1 className='font-bold text-2xl text-[#035CB0]'>Contact US</h1>
            <h2 className='font-semibold text-2xl'>Location on Google Map:</h2>
        </main>
        <Footer/>
    </div>
  )
}

export default ContactUs