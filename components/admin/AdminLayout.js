/* react-hooks/exhaustive-deps */
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

// Components
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";

// Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "./UI/Loader";

const AdminLayout = ({ children }) => {
    const router = useRouter();

    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) {
            router.push("/admin");
        } else {
            setLoggedInUser(localStorage.getItem("User"));
        }
    }, []);

    return (
        <>
            {loggedInUser ? (
                <>
                    <Header />
                    <Sidebar />
                    <main className="main_container">
                        <div className="main_content_box">{children}</div>
                    </main>
                </>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default AdminLayout;
