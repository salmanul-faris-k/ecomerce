import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createContactMessage } from '../../store/newsletterSlice'; // adjust the path
import { toast } from 'sonner';

function Ourspace() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.newsletter);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill all required fields.');
      return;
    }

    dispatch(createContactMessage(formData))
      .unwrap()
      .then(() => {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to send message.');
      });
  };

  return (
    <>
      <div className="px-4 py-12 bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-14">Our Spaces</h2>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="rounded-lg overflow-hidden shadow-lg relative">
            <a
              href="https://maps.app.goo.gl/GNVG8qRdYQn6Uucv6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://kharakapas.com/cdn/shop/files/Untitled_4_x_5.3_in_736x992.png?v=1735295477"
                alt="Grand View High Street"
                className="w-full h-[36rem] object-cover transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 text-white text-xl font-medium px-3 py-1">
                Elamakkara
              </div>
            </a>
          </div>
        </div>

        {/* Section: Contact Form */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">Contact Form</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium text-gray-700">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-gray-700">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="message" className="mb-1 font-medium text-gray-700">
                Message<span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                placeholder="Message"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1e81b0] hover:bg-[#1e81b0] text-white px-6 py-2 rounded shadow-md"
              >
                {loading ? 'Sending...' : 'SEND'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Ourspace;
