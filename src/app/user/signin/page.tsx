import SignupAndSiginForUser from "@/components/SignupAndSiginForUser";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function UserSigninPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24">
                <SignupAndSiginForUser />
            </div>
            <Footer />
        </main>
    );
}
