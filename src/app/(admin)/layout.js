import Sidebar from "@/components/Dashboard/Sidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#020617]">
            <Sidebar />
            <main className="flex-1">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}