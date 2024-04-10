import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CampaignsOverview = () => {
    const router = useRouter();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ['administrator'].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    return <div>CampaignsOverview</div>;

    // {!isNotAccessible ? (
    //     <Col lg={12}>
    //         <div className="use_main_form">
    //             <p className="error-msg" style={{ display: "block" }}>
    //                 You don&apos;t have permissions to access this page
    //             </p>
    //         </div>
    //     </Col>
    // ) : (
    //     <>

    //     </>
    // )}
};

export default CampaignsOverview;
