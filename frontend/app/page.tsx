export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-4">🏨 Smart Hospitality</h1>
            <p className="text-lg text-gray-600 mb-8">AI-Powered Hotel Management</p>
            <div className="flex gap-4">
                <a href="/guest/login" className="px-6 py-2 bg-blue-600 text-white rounded">Guest Portal</a>
                <a href="/staff/login" className="px-6 py-2 bg-green-600 text-white rounded">Staff Dashboard</a>
                <a href="/admin/login" className="px-6 py-2 bg-purple-600 text-white rounded">Admin Panel</a>
            </div>
        </main>
    );
}