import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
    title: "AI Interview Prep Platform",
    description: "Practice technical interviews with AI feedback",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}