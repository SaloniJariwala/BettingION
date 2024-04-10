/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import sha1 from "sha1";
import DataTable, { createTheme } from "react-data-table-component";
import AdminLayout from "@/components/admin/AdminLayout";
import ChangePassword from "@/components/admin/Modals/ChangePassword";
import DecreaseModal from "@/components/admin/Modals/DecreaseModal";
import PlayerDecreaseModal from "@/components/admin/Modals/PlayerDecreaseModal";
import EditUser from "@/components/admin/Modals/EditUserModal";
import IncreaseModal from "@/components/admin/Modals/IncreaseModal";
import PlayerIncreaseModal from "@/components/admin/Modals/PlayerIncreaseModal";
import UserInfoModal from "@/components/admin/Modals/UserInfoModal";
import LockUserModal from "@/components/admin/Modals/LockUserModal";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import UserTree from "@/components/admin/UserTree";
import ReferralModal from "@/components/admin/Modals/ReferralModal";
import Loader from "@/components/admin/UI/Loader";
import UserTreeModal from "@/components/admin/Modals/UserTreeModal";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import AddUserModal from "@/components/admin/Modals/AddUserModal";
import UserHeader from "@/components/admin/User/UserHeader";
import UserTab from "@/components/admin/User/UserTab";
import CreditAction from "@/components/admin/User/CreditAction";
import { Col, Row } from "react-bootstrap";
import { BalanceState } from "@/context/BalanceProvider";
import letterA from "@/assets/admin/images/alphabets/a-solid.svg";
import letterS from "@/assets/admin/images/alphabets/s-solid.svg";
import Image from "next/image";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import CreditDebitRollover from "@/components/admin/User/CreditDebitRollover";
import AddRolloverModal from "@/components/admin/Modals/AddRolloverModal";
import DeductRolloverModal from "@/components/admin/Modals/DeductRolloverModal";

createTheme(
    "solarized",
    {
        text: {
            primary: "#ffffff",
            secondary: "#ffffff",
        },
        background: {
            default: "#0B0C27",
        },
        context: {
            background: "#bd57fb",
            text: "#FFFFFF",
        },
        divider: {
            default: "transparent",
        },
    },
    "dark"
);

const accountTypeIcons = {
    "super-agent": {
        name: "Super Agent",
        icon: letterS,
    },
    administrator: {
        name: "Administrator",
        icon: letterA,
    },
};
const Users = (props) => {
    const router = useRouter();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [increaseModal, setShowIncreaseModal] = useState(false);
    const [addRolloverModal, setAddRolloverModal] = useState(false);
    const [deductRolloverModal, setDeductRolloverModal] = useState(false);
    const [playerIncreaseModal, setShowPlayerIncreaseModal] = useState(false);
    const [decreaseModal, setShowDecreaseModal] = useState(false);
    const [playerDecreaseModal, setShowPlayerDecreaseModal] = useState(false);
    const [userInfoModal, setUserInfoModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [editUserModal, setEditUserModal] = useState(false);
    const [lockUserModal, setLockUserModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [showRefferalModal, setShowRefferalModal] = useState(false);
    const [userId, setUserId] = useState();
    const [username, setUsername] = useState("");
    const [selectedTab, setSelectedTab] = useState("everyone");
    const [userDetails, setUserDetails] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [currentUserId, setCurrentUserId] = useState();
    const [currentUserAccountType, setCurrentUserAccountType] = useState();
    const [showUserTreeModal, setUserTreeModal] = useState(false);
    const [idForChangePassword, setIdForChangePassword] = useState();
    const [totalRows, setTotalRows] = useState(0);
    const [infoLoading, setInfoLoading] = useState(false);
    const [userInfoId, setUserInfoId] = useState();
    const [userInfoError, setUserInfoError] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, [router]);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem("User"))?.remoteId;
        const accountType = JSON.parse(localStorage.getItem("User"))?.accountType;
        setCurrentUserId(id);
        setCurrentUserAccountType(accountType);
    }, []);

    const setFlag = () => {
        setSuccess(!success);
    };

    const getUsersData = async (page) => {
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${userId || JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/dashboard-users-by-remoteid?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    userId || JSON.parse(localStorage.getItem("User"))?.remoteId
                }&username=${username}&page=${page}&limit=${rowsPerPage}&filterType=${selectedTab}&authKey=${authkey}`
            )
            .then((response) => {
                setUsersData(response.data?.allUsers);
                setTotalRows(response.data?.totalUsers);
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getUsersData(1);
    }, [selectedTab, userId, username, success]);

    const handlePageChange = (page) => {
        getUsersData(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        const user = JSON.parse(localStorage.getItem("User"));
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${user?.remoteId}`);
        setRowsPerPage(newPerPage);
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/dashboard-users-by-remoteid?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${user?.remoteId}&username=${username}&page=${page}&limit=${newPerPage}&filterType=${selectedTab}&authKey=${authkey}`
            )
            .then((response) => {
                setUsersData(response.data?.allUsers);
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getAgentsAndPlayers = (id, filter) => {
        setUserId(id);
        setSelectedTab(filter);
        setUserInfoModal(false);
        setCurrentUserId(id);
    };

    const renderCreditActions = (row) => {
        return (
            <CreditAction
                row={row}
                setUserDetails={setUserDetails}
                setShowPlayerIncreaseModal={setShowPlayerIncreaseModal}
                setShowIncreaseModal={setShowIncreaseModal}
                setShowDecreaseModal={setShowDecreaseModal}
                setShowPlayerDecreaseModal={setShowPlayerDecreaseModal}
            />
        );
    };

    const creditDebitRollover = (row) => {
        return (
            <CreditDebitRollover
                row={row}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                setDeductRolloverModal={setDeductRolloverModal}
                // setShowPlayerIncreaseModal={setShowPlayerIncreaseModal}
                addRolloverModal={addRolloverModal}
                setAddRolloverModal={setAddRolloverModal}
                // setShowPlayerDecreaseModal={setShowPlayerDecreaseModal}
            />
        );
    };

    const handleHideUser = async (row) => {
        const payload = {
            remoteId: row?.remoteId,
            action: "user-hide-action",
            hide: row.hide === false ? true : false,
        };
        setLoading(true);
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${payload?.remoteId}&action=user-hide-action`
        );
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status) {
                    setFlag();
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUnlockUser = async (row) => {
        const payload = {
            remoteId: row?.remoteId,
            action: "user-lock-action",
            lock: row?.lock === false ? true : false,
            lockReason: "",
        };
        setLoading(true);
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${payload?.remoteId}&action=user-lock-action`
        );
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status) {
                    setFlag();
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getUserInfo = (id) => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${id}`);
        setInfoLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-parent-by-remoteId?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${id}&authId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }`
            )
            .then((response) => {
                if (response.status === 200) {
                    setUserDetails(response.data.data);
                    setUserInfoModal(true);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setUserInfoError(500);
                } else {
                    setUserInfoError(error.message);
                }
            })
            .finally(() => {
                setInfoLoading(false);
            });
    };

    const renderUserActions = (row) => {
        return (
            <div className="table_btn_group form_right_group">
                <ul>
                    <li>
                        <NextTooltip
                            title={adminLanguageData?.users_page?.user_action_information_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn modal-html-btn"
                                onClick={() => {
                                    getUserInfo(row.remoteId);
                                }}>
                                <i className="fal fa-info"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip
                            title={adminLanguageData?.users_page?.user_action_change_password_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn modal-html-btn"
                                onClick={() => {
                                    setIdForChangePassword(row?.remoteId);
                                    setPasswordModal(true);
                                }}>
                                <i className="fal fa-key"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip title={adminLanguageData?.users_page?.user_action_edit_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn modal-html-btn"
                                onClick={() => {
                                    setUserInfoId(row.remoteId);
                                    setEditUserModal(true);
                                }}>
                                <i className="fal fa-user-edit"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip
                            title={
                                row.lock
                                    ? adminLanguageData?.users_page?.user_action_unlock_tooltip?.value
                                    : adminLanguageData?.users_page?.user_action_lock_tooltip?.value
                            }>
                            <button
                                type="button"
                                className="sec_btn icon_btn modal-html-btn"
                                onClick={() => {
                                    if (row.lock) {
                                        handleUnlockUser(row);
                                    } else {
                                        setUserDetails({ remoteId: row.remoteId, lock: row.lock });
                                        setLockUserModal(true);
                                    }
                                }}>
                                <i className={`fal fa-${row.lock ? "lock" : "unlock"}`}></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip
                            title={
                                row.hide
                                    ? adminLanguageData?.users_page?.user_action_unhide_tooltip?.value
                                    : adminLanguageData?.users_page?.user_action_hide_tooltip?.value
                            }>
                            <button
                                type="button"
                                className="sec_btn icon_btn modal-html-btn"
                                onClick={() => handleHideUser(row)}>
                                {row.hide ? (
                                    <i className="fal fa-eye-slash"></i>
                                ) : (
                                    <i className="fal fa-eye"></i>
                                )}
                            </button>
                        </NextTooltip>
                    </li>
                </ul>
            </div>
        );
    };

    const playerColor = (row) => {
        if (row?.accountType === "player") {
            return <span style={{ color: "#d083ff" }}>{row?.username}</span>;
        } else {
            const userIdentify = accountTypeIcons?.[row?.accountType] ? (
                <NextTooltip title={accountTypeIcons?.[row?.accountType]?.name}>
                    <Image
                        loading="lazy"
                        width={22}
                        height={22}
                        src={accountTypeIcons?.[row?.accountType]?.icon}
                        alt={accountTypeIcons?.[row?.accountType]?.name}
                    />
                </NextTooltip>
            ) : null;
            return (
                <span className="user-icons-identify">
                    <span>{row?.username}</span> {userIdentify}
                </span>
            );
        }
    };

    const columns = [
        {
            name: adminLanguageData?.users_page?.table_user_cell?.value,
            maxWidth: "400px",
            // selector: (row) => playerColor(row),
            grow: 2,
            cell: (row) => playerColor(row),
        },
        {
            name: "Credits",
            grow: 0.7,
            selector: (row) => renderAmountWithCurrency(row.balance, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: adminLanguageData?.users_page?.table_action_cell?.value,
            minWidth: "110px",
            selector: (row) => renderCreditActions(row),
        },
        {
            name: adminLanguageData?.users_page?.table_user_action_cell?.value,
            grow: 1.5,
            minWidth: "260px",
            selector: (row) => renderUserActions(row),
        },
    ];

    const adminColumns = columns;
    adminColumns.splice(2, 0, {
        name: adminLanguageData?.users_page?.table_parent_cell?.value,
        grow: 1.5,
        selector: (row) => (row?.fatherName === "" ? "-" : row?.fatherName),
    });
    if (currentUserAccountType === "administrator") {
        adminColumns.splice(4, 0, {
            name: "Rollover",
            minWidth: "110px",
            selector: (row) => creditDebitRollover(row),
        });
    }

    let agentColumns;
    agentColumns = columns.at(0);
    delete agentColumns["maxWidth"];
    agentColumns = [agentColumns];

    const getTreeUserId = (id) => {
        setUserId(id);
        setCurrentUserId(id);
    };

    const paginationComponentOptions = {
        rowsPerPageText: adminLanguageData?.common_table_text?.row_per_page_label?.value || "Row Per Page",
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <section className="user_main_sec">
                    <UserHeader
                        setUserTreeModal={setUserTreeModal}
                        setShow={setShow}
                        setShowRefferalModal={setShowRefferalModal}
                    />

                    <div className="user_main_sec_content">
                        <Row>
                            <Col lg={9}>
                                <div className="dataTables_wrapper">
                                    <UserTab
                                        selectedTab={selectedTab}
                                        setSelectedTab={setSelectedTab}
                                        setUsername={setUsername}
                                        currentUserAccountType={currentUserAccountType}
                                    />

                                    {infoLoading ? <Loader /> : null}
                                    <div
                                        className={
                                            usersData?.length > 0
                                                ? "dataTables_wrapper"
                                                : "dataTables_wrapper noData"
                                        }>
                                        {!errorMessage ? (
                                            <DataTable
                                                columns={
                                                    currentUserAccountType === "administrator"
                                                        ? adminColumns
                                                        : currentUserAccountType === "agent"
                                                        ? agentColumns
                                                        : columns
                                                }
                                                data={usersData}
                                                pagination
                                                paginationServer
                                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                progressPending={loading}
                                                progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                                paginationTotalRows={totalRows}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
                                                noDataComponent={adminLanguageData?.no_records_found?.value}
                                                theme="solarized"
                                                paginationComponentOptions={paginationComponentOptions}
                                            />
                                        ) : errorMessage === 500 ? (
                                            <>{adminLanguageData?.no_data_found?.value}</>
                                        ) : (
                                            <p
                                                className="error-msg"
                                                style={{
                                                    display: errorMessage ? "block" : "none",
                                                }}>
                                                {errorMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            <Col lg={3}>
                                <UserTree
                                    getTreeUserId={getTreeUserId}
                                    currentId={currentUserId}
                                    success={success}
                                />
                            </Col>
                        </Row>
                    </div>
                </section>
            </AdminLayout>

            <ReferralModal show={showRefferalModal} setShow={setShowRefferalModal} />

            <AddUserModal setShow={setShow} show={show}></AddUserModal>

            <IncreaseModal
                show={increaseModal}
                setShow={setShowIncreaseModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <AddRolloverModal
                show={addRolloverModal}
                setShow={setAddRolloverModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <PlayerIncreaseModal
                show={playerIncreaseModal}
                setShow={setShowPlayerIncreaseModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <DecreaseModal
                show={decreaseModal}
                setShow={setShowDecreaseModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <DeductRolloverModal
                show={deductRolloverModal}
                setShow={setDeductRolloverModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <PlayerDecreaseModal
                show={playerDecreaseModal}
                setShow={setShowPlayerDecreaseModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <UserInfoModal
                show={userInfoModal}
                setShow={setUserInfoModal}
                userDetails={userDetails}
                getAgentsAndPlayers={getAgentsAndPlayers}
                errorMessage={userInfoError}
            />

            <ChangePassword show={passwordModal} setShow={setPasswordModal} userId={idForChangePassword} />

            <EditUser show={editUserModal} setShow={setEditUserModal} userInfoId={userInfoId} />

            <LockUserModal
                show={lockUserModal}
                setShow={setLockUserModal}
                userDetails={userDetails}
                setFlag={setFlag}
            />

            <UserTreeModal
                show={showUserTreeModal}
                setShow={setUserTreeModal}
                getTreeUserId={getTreeUserId}
                currentId={currentUserId}
            />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Users",
            description: "Users",
        },
    };
}

export default Users;
