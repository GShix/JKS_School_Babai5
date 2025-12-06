import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { Link } from "react-router-dom";

const programs = [
	{
		id: "education",
		title: "Education",
		href: "/academic-programs/education",
		img: "/img/aca-education.jpg",
		excerpt: "Preparing students for careers in teaching and educational leadership.",
	},
	{
		id: "management",
		title: "Management",
		href: "/academic-programs/management",
		img: "/img/aca-management.jpg",
		excerpt: "Business and management pathways for practical and theoretical skills.",
	},
	{
		id: "agriculture",
		title: "Agriculture",
		href: "/academic-programs/agriculture",
		img: "/img/aca-agriculture.jpg",
		excerpt: "Hands-on agricultural training and modern farming techniques.",
	},
	{
		id: "basic-level",
		title: "आधारभूत शिक्षा",
		href: "/academic-programs/आधारभूत शिक्षा",
		img: "/img/aca-basic-level.jpeg",
		excerpt: "Basic level education programs for early academic development.",
	},
	{
		id: "secondary",
		title: "माध्यमिक शिक्षा",
		href: "/academic-programs/माध्यमिक शिक्षा",
		img: "/img/aca-secondary.jpg",
		excerpt: "Secondary-level courses and extracurricular development.",
	},
];

const AcademicPrograms = () => {
	return (
		<div className="programs-page">
			<Header />
			<main className="min-h-screen">
				<div className="bg-[#f5f8fb] py-8 px-4 sm:px-12">
					<div className="container mx-auto">
						<h1 className="text-4xl font-semibold text-gray-800">
							Academic Programs
						</h1>
						<p className="text-gray-600 mt-2">
							Explore the programs we offer. Click a program to view details.
						</p>
					</div>
				</div>

				<div className="container mx-auto px-4 sm:px-12 py-8 mb-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{programs.map((p) => (
									<Link
										key={p.id}
										to={p.href}
										className="block bg-white rounded-md shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
									>
										<div className="h-40 w-full overflow-hidden">
											<img
												src={p.img}
												alt={p.title}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="p-4">
											<h3 className="text-lg font-semibold text-gray-800">
												{p.title}
											</h3>
											<p className="text-sm text-gray-600 mt-2">
												{p.excerpt}
											</p>
										</div>
									</Link>
								))}
							</div>
						</div>

						<aside className="lg:col-span-1">
							<div className="bg-white rounded-md shadow p-4 mb-6">
								<h4 className="font-semibold mb-3">Featured Program</h4>
								<Link
									to="/academic-programs/education"
									className="flex gap-3 items-center"
								>
									<img
										src="/img/janakalyan_ma_vi.jpg"
										alt="Education"
										className="w-20 h-16 object-cover rounded"
									/>
									<div>
										<div className="font-semibold">Education</div>
										<div className="text-sm text-gray-500">
											Secondary level
										</div>
									</div>
								</Link>
							</div>

							<div className="bg-white rounded-md shadow p-4">
								<h4 className="font-semibold mb-3">Other Links</h4>
								<ul className="space-y-2 text-gray-700">
									<li>
										<Link
											to="/downloads"
											className="hover:underline"
										>
											Downloads
										</Link>
									</li>
									<li>
										<Link to="/gallery" className="hover:underline">
											Gallery
										</Link>
									</li>
									<li>
										<Link to="/notices" className="hover:underline">
											Notices
										</Link>
									</li>
								</ul>
							</div>
						</aside>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default AcademicPrograms;