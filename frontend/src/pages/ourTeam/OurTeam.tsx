import TeamCard from "../../components/TeamCard"
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"


const OurTeam = () => {
  return (
    <div className="OurTeam-page min-h-screen bg-[#F7F7F7]">
      <Header/>
      <main className="min-h-screen">
        <div className="OurTeam-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
          <h1 className="text-5xl font-medium text-center my-8 text-white">Our Team</h1>
        </div>
        <div className="team-members w-full mx-auto px-6 py-10 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <TeamCard/>
          <TeamCard/>
          <TeamCard/>
          <TeamCard/>
          <TeamCard/>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default OurTeam
