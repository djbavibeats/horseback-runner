// import Experience from "./Experience/Experience"
import Vanilla from "./Experience/Vanilla.jsx"

function App() {
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="bg-[rgba(0,0,0,0.5)] flex flex-col justify-center items-center p-4 md:p-8 rounded-2xl border-2 border-color-[#afb9ca]">
          <h1 
          className="stroke-black text-2xl font-bold text-slate-100 mb-4 text-center font-press-start"
          >
            Horseback Runner
          </h1>
          <div className="">
            {/* <Experience /> */}
            <Vanilla />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
