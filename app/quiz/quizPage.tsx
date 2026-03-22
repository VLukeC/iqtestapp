import { Link } from "react-router";
import "../styles/styles.css";


export function QuizPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="flex justify-between items-center px-8 py-4">
                <Link to="/" className="text-white font-semibold text-lg">
                IQ Test App
                </Link>
                 <div className="flex gap-6">
                    <Link to='/' className="text-gray-300 hover:text-white transition">Home</Link>
                </div>
            </div>
        </main>
    );

}