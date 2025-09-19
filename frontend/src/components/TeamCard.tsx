
const TeamCard = () => {
  return (
    <div className="team-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="img">
            <img src="/img/headmaster.jpg" alt="team member" className="w-full h-80 object-cover rounded-md"/>
        </div>
        <div className="info mt-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Mr. Ganesh Kumar KC</h3>
            <p className="text-gray-600">Headmaster</p>
        </div>
    </div>
  )
}

export default TeamCard