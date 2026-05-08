import TeacherSidebar from "@/components/Dashboard/TeacherSidebar";

export default function TeacherLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#020617]">
            <TeacherSidebar />
            <main className="flex-1">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}