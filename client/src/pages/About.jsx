import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="text-white py-24 relative"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/diverse-businesspeople-having-meeting_53876-103954.jpg?t=st=1728115006~exp=1728118606~hmac=6fda9cdf274169200534d801b0696485b0a299ab7eb51ae7a993473ba21f28dc&w=996')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '600px',
        }}
      >
        <div className="absolute inset-0 bg-opacity-70"></div> {/* Blue overlay for better readability */}
        <div className="container mx-auto px-5 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in mt-32">About MediZen</h1>
          <p className="text-2xl mb-8 max-w-3xl mx-auto">
            Revolutionizing healthcare management with seamless, patient-centered solutions.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="container mx-auto py-20 px-5 text-center">
        <h2 className="text-4xl font-bold mb-10">Our Mission & Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Our Mission</h3>
            <p className="text-gray-600">
              To provide accessible, high-quality healthcare management that empowers patients and healthcare professionals alike. We aim to simplify the process of booking appointments, managing treatments, and accessing medical records.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Our Vision</h3>
            <p className="text-gray-600">
              To become the leading digital platform in healthcare management, creating a seamless experience for patients and doctors across the world.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-4xl font-bold mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Care</h3>
              <p className="text-gray-600">
                We put patients first, ensuring they receive the care and attention they deserve.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Trust</h3>
              <p className="text-gray-600">
                We maintain transparency and trust in every aspect of our services, ensuring secure and reliable healthcare solutions.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Innovation</h3>
              <p className="text-gray-600">
                We leverage technology to innovate and improve the healthcare experience for all users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="container mx-auto py-20 px-5">
        <h2 className="text-4xl font-bold text-center mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <img src="https://img.freepik.com/premium-photo/medicine-healthcare-people-concept-happy-doctor-with-clipboard-young-male-patient-meeting-hospital_380164-191858.jpg?w=996" alt="Doctor Appointment" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">Doctor Appointments</h3>
            <p>
              Book appointments with leading specialists in various fields effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <img src="https://img.freepik.com/free-photo/medical-teleconsultation-sick-patient-home_23-2149329047.jpg?t=st=1729162360~exp=1729165960~hmac=6d3d862f6434c8b9bad6dc66a107a118d11d2190cc7f35ccbf76bd6ed377bc5a&w=996" alt="Live Consultations" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">Live Consultations</h3>
            <p>
              Experience real-time video consultations with trusted healthcare professionals.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <img src="https://img.freepik.com/premium-photo/person-is-writing-piece-paper-with-pen-it_1034058-100950.jpg?w=996" alt="Manage Medical Records" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
            <p>
              Easily upload, view, and download your medical records securely.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <img src="https://img.freepik.com/free-photo/doctor-filling-up-life-insurance-form_53876-20493.jpg?t=st=1729162457~exp=1729166057~hmac=2e4b7e0beea753e50355ddcc4e0e40bdbcf06145c841d1c08893ddba2729632c&w=996" alt="Treatment Plans" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">Treatment Plans</h3>
            <p>
              Manage personalized treatment plans, updated by doctors in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-10">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Team Member 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
              <img src="https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?t=st=1729162514~exp=1729166114~hmac=e776552421769066d2477f85971cbd0c7f7d6631a30839d0d19201362ef3f960&w=826" alt="Team Member 1" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Dr. Andrew Smith</h3>
              <p className="text-gray-600">Chief Medical Officer</p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
              <img src="https://img.freepik.com/free-photo/young-beautiful-woman-looking-camera-trendy-girl-casual-summer-white-t-shirt-jeans-shorts-positive-female-shows-facial-emotions-funny-model-isolated-yellow_158538-15796.jpg?t=st=1729162739~exp=1729166339~hmac=b318bb573979a33b5330943cd8416dc84df350f2ccce21e497cdb10b4476457e&w=996" 
              alt="Team Member 2" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Jessica Doe</h3>
              <p className="text-gray-600">Operations Manager</p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
              <img src="https://img.freepik.com/free-photo/man-wearing-waistcoat_1368-2886.jpg?t=st=1729162859~exp=1729166459~hmac=3aeb8aba3afadec717b556ec1e6f68667bb571f7e42f3239795242266161ce17&w=826" 
              alt="Team Member 3" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">John Williams</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
              <img src="https://img.freepik.com/free-photo/portrait-young-businesswoman-holding-eyeglasses-hand-against-gray-backdrop_23-2148029483.jpg?t=st=1729162829~exp=1729166429~hmac=04ed74c4cfd447e81871f3993a683413b611daa535b3189e384b002cfbfae238&w=826" 
              alt="Team Member 4" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Emily Davis</h3>
              <p className="text-gray-600">Marketing Head</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-6 text-center">
        <p>&copy; 2024 MediZen. Empowering Your Health.</p>
      </footer>
    </div>
  );
}
