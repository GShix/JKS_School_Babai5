interface TeamCardProps {
  fullName: string;
  position: string;
  department?: string;
  profileImage?: string;
  email?: string;
  highlighted?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ fullName, position, department, profileImage, highlighted = false }) => {
  return (
    <div className={`team-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
      highlighted ? 'ring-2 ring-blue-600 shadow-xl' : ''
    }`}>
        <div className="img overflow-hidden">
            <img 
              src={profileImage || '/img/default-avatar.svg'} 
              alt={fullName} 
              className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
                highlighted ? 'h-64' : 'h-48'
              }`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/img/default-avatar.svg';
              }}
            />
        </div>
        <div className="info p-3 text-center">
            <h3 className={`font-semibold text-gray-800 line-clamp-1 ${
              highlighted ? 'text-xl' : 'text-lg'
            }`}>{fullName}</h3>
            <p className={`text-sm mt-1 ${
              highlighted ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}>{position}</p>
            {department && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{department}</p>}
        </div>
    </div>
  )
}

export default TeamCard