import Link from "next/link";

export default function DummyProject() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
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
              Dummy Project
            </h1>
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This is a placeholder project that demonstrates the basic structure 
                and navigation of the ML Games Playground.
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-3">What this shows:</h3>
                <ul className="text-left space-y-2">
                  <li>✅ Next.js routing working correctly</li>
                  <li>✅ TypeScript compilation successful</li>
                  <li>✅ Tailwind CSS styling applied</li>
                  <li>✅ Navigation between pages functional</li>
                </ul>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                Future projects will be added here with interactive demos, 
                machine learning algorithms, and engaging visualizations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}