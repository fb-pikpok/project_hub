import Link from "next/link";

export default function WarehouseProject() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link 
              href="/"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              ← Back to Hub
            </Link>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Warehouse RL Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Q-Learning Reinforcement Learning for Robot Navigation
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This will be an interactive demonstration where you can watch a robot 
                learn to navigate through a warehouse environment using Q-learning.
              </p>
              
              <div className="text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Features to implement:</h3>
                <ul className="space-y-2 text-sm">
                  <li>🤖 Intelligent agent with Q-learning algorithm</li>
                  <li>🏗️ Grid-based warehouse environment</li>
                  <li>📦 Obstacles and goal positions</li>
                  <li>🎮 Interactive controls (play/pause/reset)</li>
                  <li>📊 Real-time learning visualization</li>
                  <li>⚡ Speed controls and parameter tuning</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-300">
                The routing and basic structure is working! ✅<br/>
                Ready to implement the actual ML demo in the next development phase.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}