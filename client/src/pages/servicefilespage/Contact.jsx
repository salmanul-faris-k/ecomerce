import Ourspace from "../../components/shopingview/Ourspace";

export default function StoreAndContact() {
 

  return (
    
<>

 <div className="px-4 py-12 bg-white mt-10">
      {/* Section: GRAZIE Store Contact Info */}
      <div className="bg-white px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-14 transition duration-700 font-mono">
            Contact Us
          </h2>

          <div className="flex justify-center sm:justify-start ">
            <div className="inline-block text-left ml-0 sm:ml-12 md:ml-16 lg:ml-24">
              <p className="black">GRAZIE</p>
              <p className="black">1st Floor</p>
              <p className="black">Gokulam Building</p>
              <p className="black">Near SBI Bank</p>
              <p className="black">Elamakkara</p>
              <p className="black">Kochi - 682026</p>

              <p className="black font-medium mt-4">
                Timings: Monday to Saturday, 10:00 am to 6:00 pm (IST)
              </p>

              <div className="black space-y-1 mt-2">
                {/* <p>
                  Phone 1: <a href="tel:8893804142">8893804142</a>
                </p>
                <p>
                  Phone 2: <a href="tel:9567760206" >9567760206</a>
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
<Ourspace/>
     
    </div>
</>

   
  );
}
