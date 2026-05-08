import StudentSidebar from "@/components/Dashboard/StudentSidebar";

export default function StudentLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#020617]">
            <StudentSidebar />
            <main className="flex-1">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
