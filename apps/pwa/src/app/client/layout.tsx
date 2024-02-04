"use client";
import Header from "@/components/client/Header";
import NavBar from "@/components/client/NavBar";
import { ThemeProvider } from "@/components/theme-provider"

export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <Header />
                <section className="container max-w-[50rem] mt-20">
                    {children}
                </section>
                <NavBar />
            </ThemeProvider>
        </>
    );
}
