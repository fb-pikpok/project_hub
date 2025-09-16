import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            ML Games Playground
          </h1>
          <p className="text-lg mb-12 text-gray-600 dark:text-gray-300">
            Interactive demos showcasing machine learning and algorithmic experiments.
            Explore different projects and see AI in action!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Warehouse RL Project Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3">Warehouse RL</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Watch a robot learn to navigate through obstacles using Q-learning 
                reinforcement learning algorithm.
              </p>
              <Link 
                href="/projects/warehouse"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Launch Demo
              </Link>
            </div>

            {/* Dummy Project Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3">Dummy Project</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A placeholder project demonstrating the basic structure 
                and navigation of the playground.
              </p>
              <Link 
                href="/projects/dummy"
                className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View Project
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
