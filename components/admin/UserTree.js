import axios from "axios";
import sha1 from "sha1";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "./UI/Loader";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const UserTree = ({ getTreeUserId, currentId, success }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [userDropDown, setUserDropDown] = useState(true);
    const [agentData, setAgentData] = useState();
    const [loading, setLoadingTreeData] = useState(true);
    const [userHide, setUserHide] = useState(false);
    const [error, setError] = useState(false);
    const [parentAgentIds, setParentAgentIds] = useState([]);
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        setCurrentUser(currentId);
    }, [currentId]);

    useEffect(() => {
        setLoadingTreeData(true);
        const user = JSON.parse(localStorage.getItem("User"));
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${user?.remoteId}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${user?.remoteId}&hide=${userHide}&authKey=${authkey}&accountType=agent`
            )
            .then((response) => {
                if (response?.data?.status === 200) {
                    setAgentData(response?.data?.data);
                } else {
                    setError(response?.data?.message);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setError(500);
                } else {
                    setError(error.message);
                }
            })
            .finally(() => {
                setLoadingTreeData(false);
            });
    }, [userHide, success]);

    const handleShowHide = (id) => {
        if (parentAgentIds.includes(id)) {
            const arr = parentAgentIds.filter((item) => item !== id);
            setParentAgentIds(arr);
        } else {
            setParentAgentIds([...parentAgentIds, id]);
        }
    };

    const RecursiveComponent = ({ data }) => {
        return (
            <>
                {data?.map((item) => {
                    return (
                        <ul key={item?.id}>
                            <li
                                className={`${item?.child?.length > 0 && "user_dropdown"} ${
                                    parentAgentIds.includes(item?.id) ? "" : "hide"
                                } ${currentUser === item.id && "current_user"} `}>
                                {item?.child?.length > 0 && (
                                    <i
                                        className="far fa-angle-down"
                                        onClick={() => handleShowHide(item?.id)}></i>
                                )}
                                <Link
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setCurrentUser(item?.id);
                                        getTreeUserId(item?.id);
                                    }}>
                                    {item?.name ? item?.name : `#${item?.userId}`}
                                </Link>
                                {item?.child?.length > 0 && parentAgentIds.includes(item?.id) && (
                                    <RecursiveComponent data={item?.child} />
                                )}
                            </li>
                        </ul>
                    );
                })}
            </>
        );
    };

    return (
        <>
            <div className="user_map">
                <>
                    <div className="form_checkbox">
                        <label className="form-check-label">
                            <input
                                type="checkbox"
                                name="user_map_hidden"
                                value={userHide}
                                className="form-check-input"
                                onChange={() => setUserHide(!userHide)}
                            />
                            {adminLanguageData?.users_page?.agent_tree_include_hidden?.value}
                        </label>
                    </div>
                    {loading ? (
                        <Loader />
                    ) : !error ? (
                        <ul className="user_map_main_ul">
                            <li
                                className={`${userDropDown ? "user_dropdown" : "user_dropdown hide"} ${
                                    currentUser === agentData?.remoteId && "current_user"
                                }`}>
                                <i
                                    className="far fa-angle-down"
                                    onClick={() => setUserDropDown(!userDropDown)}></i>
                                <Link
                                    href="#"
                                    title={agentData?.username}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setCurrentUser(agentData?.remoteId);
                                        getTreeUserId(agentData?.remoteId);
                                    }}>
                                    {agentData?.username ? agentData?.username : `#${agentData?.userId}`}
                                </Link>
                                {userDropDown && agentData?.child && (
                                    <RecursiveComponent data={agentData?.child} />
                                )}
                            </li>
                        </ul>
                    ) : (
                        <>
                            {error === 500 ? (
                                <>No Data Found</>
                            ) : (
                                <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                                    {error}
                                </p>
                            )}
                        </>
                    )}
                </>
            </div>
        </>
    );
};

export default UserTree;
