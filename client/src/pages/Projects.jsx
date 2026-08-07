import CallToAction from "../components/CallToAction"

const Projects = () => {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 p-3 text-center">
       <h1 className="text-3xl font-semibold">Projet</h1>
       <p className="text-md text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Vitae amet ducimus impedit? Iusto, repellat tempore dolores
       </p>
       <CallToAction />
    </div>
  )
}

export default Projects
