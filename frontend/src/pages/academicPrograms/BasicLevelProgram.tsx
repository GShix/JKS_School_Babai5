import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { Link } from "react-router-dom";

const BasicLevelProgram = () => {
	return (
		<div className="program-page">
			<Header />
			<main className="min-h-screen">
				{/* Banner / Breadcrumb */}
				{/* <div className="program-banner bg-[#f5f8fb] px-4 sm:px-12 py-8">
					<div className="container mx-auto">
						<nav className="text-sm text-gray-500 mb-4">
							<Link to="/" className="hover:underline">Home</Link>
							<span className="mx-2">/</span>
							<Link to="/academic-programs" className="hover:underline">Program</Link>
							<span className="mx-2">/</span>
							<span className="text-gray-700">Education</span>
						</nav>

						<h2 className="text-4xl font-semibold text-gray-800">Education</h2>
						<p className="text-sm text-gray-600 mt-3"><i className="ri-calendar-line mr-2"></i> Last Update .. 23, 2025</p>
					</div>
				</div> */}
				 <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
                	<h1 className="text-5xl font-medium text-center my-8 text-white">Education</h1>
                </div>

				{/* Content + Sidebar */}
				<div className="container mx-auto px-4 sm:px-10 py-2 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-5">
					{/* Main content */}
					<div className="lg:col-span-8">
						{/* Tabs */}
						<div className="bg-[#f1f4f7] rounded-md sm:px-2 py-2 mb-3">
							<div className="flex gap-3 sm:gap-4">
								<button className="px-3 max-sm:text-sm sm:px-6 sm:py-2 bg-white rounded-md shadow-sm text-[#035CB0] font-medium">Overview</button>
								<button className="px-3 max-sm:text-sm sm:px-6 sm:py-2 text-gray-500">Curriculum</button>
								<button className="px-3 max-sm:text-sm sm:px-6 sm:py-2 text-gray-500">Faculty Members</button>
							</div>
						</div>

						<div className="prose max-w-none text-gray-700 text-justify">
							<p>
								The Education Program at our school is structured to prepare students for careers in teaching and educational leadership. Our faculty comprises experienced and passionate educators committed to delivering a high-quality and impactful learning experience. Below are the course details for students in the Education Faculty:
							</p>

							<h3 className="mt-8 text-2xl font-bold">Class XI Subjects:</h3>
							<ol className="list-decimal pl-6 mt-4 space-y-2">
								<li><strong>English</strong> <span className="text-gray-500">(Subject Code: 003)</span></li>
								<li><strong>Nepali</strong> <span className="text-gray-500">(Subject Code: 0021)</span></li>
								<li><strong>Education</strong> <span className="text-gray-500">(Subject Code: 5011)</span></li>
								<li><strong>Social Studies and Life Skills Education</strong> <span className="text-gray-500">(Subject Code: 5031)</span></li>
								<li>
									<strong>Optional Subject:</strong> Choose one from:
									<ul className="list-disc pl-6 mt-2">
										<li><strong>Mathematics</strong> <span className="text-gray-500">(Subject Code: 0071)</span></li>
										<li><strong>Economics</strong> <span className="text-gray-500">(Subject Code: 3061)</span></li>
										<li><strong>Population Studies</strong> <span className="text-gray-500">(Subject Code: 6061)</span></li>
                                        <li><strong>Health, Population and Environment</strong> <span className="text-gray-500">(Subject Code: 6051)</span></li>
									</ul>
								</li>
							</ol>

                            <h3 className="mt-8 text-2xl font-bold">Class XII Subjects:</h3>
							<ol className="list-decimal pl-6 mt-4 space-y-2">
								<li><strong>English</strong> <span className="text-gray-500">(Subject Code: 003)</span></li>
								<li><strong>Nepali</strong> <span className="text-gray-500">(Subject Code: 0021)</span></li>
								<li><strong>Education</strong> <span className="text-gray-500">(Subject Code: 5011)</span></li>
								<li><strong>Social Studies and Life Skills Education</strong> <span className="text-gray-500">(Subject Code: 5031)</span></li>
								<li>
									<strong>Optional Subject:</strong> Choose one from:
									<ul className="list-disc pl-6 mt-2">
										<li><strong>Mathematics</strong> <span className="text-gray-500">(Subject Code: 0071)</span></li>
										<li><strong>Economics</strong> <span className="text-gray-500">(Subject Code: 3061)</span></li>
										<li><strong>Population Studies</strong> <span className="text-gray-500">(Subject Code: 6061)</span></li>
                                        <li><strong>Health, Population and Environment</strong> <span className="text-gray-500">(Subject Code: 6051)</span></li>
									</ul>
								</li>
							</ol>
						</div>
					</div>

					{/* Sidebar */}
					<aside className="lg:col-span-4">
						<div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
							<img src="/img/aca-education.jpg" alt="Education" className="w-full h-40 object-cover" />
							<div className="p-4">
								<div className="flex items-center justify-between border-b pb-3 mb-3">
									<div className="flex items-center gap-3 text-gray-600">
										<i className="ri-settings-3-line"></i>
										<span>Level</span>
									</div>
									<div className="text-gray-800">Secondary</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-gray-600">
										<i className="ri-book-open-line"></i>
										<span>Faculty</span>
									</div>
									<div className="text-gray-800">Education</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-md shadow-sm p-4">
							<h4 className="font-semibold mb-3">Other Programs</h4>
							<ul className="space-y-2 text-gray-700">
								<li><Link to="#" className="hover:underline">Science</Link></li>
								<li><Link to="#" className="hover:underline">Management</Link></li>
								<li><Link to="#" className="hover:underline">Humanities</Link></li>
								<li><Link to="#" className="hover:underline">आधारभूत शिक्षा</Link></li>
								<li><Link to="#" className="hover:underline">माध्यमिक शिक्षा</Link></li>
							</ul>
						</div>
					</aside>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default BasicLevelProgram;
