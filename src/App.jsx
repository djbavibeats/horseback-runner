import Experience from "./Experience/Experience"

function App() {
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center bg-slate-700">
        <h1 
        className="stroke-black text-4xl font-bold text-slate-100 mb-4"
        >
          Horseback Runner
        </h1>
        <div className="border-4 border-slate-500">
          <Experience />
        </div>
      </div>
    </>
  )
}

export default App
