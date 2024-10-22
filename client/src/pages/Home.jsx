import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    if (currentUser) {
      navigate('/appointments/book');
    } else {
      navigate('/sign-up');
    }
  };

  const handleButtonClick1 = () => {
    if (currentUser) {
      navigate('/');
    } else {
      navigate('/sign-up');
    }
  };

  useEffect(() => {
    const swiperContainer = document.querySelector('.swiper-container');
    if (swiperContainer) {
      swiperContainer.style.pointerEvents = isDropdownOpen ? 'none' : 'auto';
    }
  }, [isDropdownOpen]);

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative h-[75vh] w-full">
        {/* Slideshow in the background */}
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="absolute inset-0 w-full h-full z-0 swiper-container"
        >
          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-photo/businessman-pointing-with-medical-icons-analysis-technology-equipment-medicine-healthy-business-healthcare-concept_44868-1062.jpg?w=996"
              alt="Healthcare Services"
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-photo/healthcare-medical-doctor-working-with-professional-team-physician-nursing_1177174-1173.jpg?w=996"
              alt="Medical Consultation"
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-photo/health-banner-care-healthcare-management-risk-security_488220-69877.jpg?w=996"
              alt="Professional Care"
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-photo/health-care-medical-technology-services-concept-with-cinematography-screen-ar-interface_103164-385.jpg?w=996"
              alt="Professional Care"
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-photo/doctor-diagnose-digital-patient-record-virtual-medical-network-computing-electronic-medical_34200-714.jpg?w=996"
              alt="Professional Care"
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
          
        </Swiper>

        {/* Text overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
          <h1 className="text-6xl font-bold mb-4">Welcome to MediZen</h1>
          <p className="text-2xl mb-8 text-center px-4">
            Seamless healthcare services, appointments, and consultations at your fingertips.
          </p>
          <button
            onClick={handleButtonClick1}
            className="bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 text-lg"
          >
            Get Started
          </button>
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-5"></div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto py-20 px-5">
        <h2 className="text-4xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <img
              src="https://img.freepik.com/free-photo/indian-doctor-receives-patient-tells-him-about-results-tests-medicine-health_496169-2765.jpg?t=st=1729161016~exp=1729164616~hmac=15a0ab074ce56ddf1dcc08212e2784dccbebcbe2561deeb4783f1a9f8b7a2b73&w=996"
              alt="Doctor Consultation"
              className="w-full h-44 mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">Doctor Appointments</h3>
            <p className="text-gray-600">
              Book an appointment with specialists across various fields easily.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <img
              src="https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329000.jpg?t=st=1729161149~exp=1729164749~hmac=7b794ce46be47a454c61794d84642d09fdc7c053bc6b1c13ba96f03e0736a46d&w=996"
              alt="Live Consultations"
              className="w-full h-44 mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">Live Consultations</h3>
            <p className="text-gray-600">
              Connect with doctors via live chat for real-time consultations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <img
              src="https://img.freepik.com/free-photo/information-instrument-write-health-equipment-exam_1421-696.jpg?t=st=1729161213~exp=1729164813~hmac=c328d501dc9a2824039a21a4f6bca39b13ce6ed47a735f1cf19b2a9e49dfa8c3&w=996"
              alt="Medical Records"
              className="w-full h-44 mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">Medical Records</h3>
            <p className="text-gray-600">
              Access and upload your medical records securely and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto py-20 px-5 text-center bg-blue-50">
        <h2 className="text-4xl font-bold mb-10">About MediZen</h2>
        <p className="text-xl mb-8">
          MediZen provides a seamless way for patients to manage their healthcare. From scheduling appointments to live consultations, and accessing medical records, we make healthcare management easy and efficient.
        </p>
        <button
          onClick={() => navigate('/about')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 text-lg"
        >
          Learn More
        </button>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-10">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg shadow-lg bg-blue-50">
              <p className="text-gray-600 mb-4">"MediZen made it easy for me to schedule appointments and consult my doctor from home."</p>
              <h4 className="font-semibold text-xl">- Sarah Lee</h4>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-blue-50">
              <p className="text-gray-600 mb-4">"The live consultation feature was a lifesaver during a recent health scare."</p>
              <h4 className="font-semibold text-xl">- Alex Kumar</h4>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-blue-50">
              <p className="text-gray-600 mb-4">"I could easily keep track of my medical records and access them anytime."</p>
              <h4 className="font-semibold text-xl">- John Doe</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-300 text-white py-20 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-6">Your Health, Our Priority</h2>
          <p className="text-xl mb-8">Book your appointment today or connect with our doctors online for a consultation.</p>
          <button
            onClick={handleButtonClick}
            className="bg-white text-blue-600 px-8 py-4 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
          >
            Book Appointment
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-6 text-center">
        <p>&copy; 2024 MediZen. Empowering Your Health.</p>
      </footer>
    </div>
  );
}
