import { Toaster } from '../components/ui/toaster'; // Adjust the path to where your Toaster component is located

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div lang="en">
            <main>{children}</main>
            <Toaster />
        </div>
    );
}

export default RootLayout;
