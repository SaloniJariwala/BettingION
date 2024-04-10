import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Col, Row } from "react-bootstrap";

const UserTab = ({ currentUserAccountType, setSelectedTab, setUsername, selectedTab }) => {
    const { adminLanguageData } = AdminLanguageState();

    return (
        <div className="table_filter_topbar">
            <Row className="align-items-center">
                <Col sm={12}>
                    <div className="table_custom_filter">
                        <div className="modal_tablist">
                            <ul>
                                <li
                                    data-sort-value="everyone"
                                    className={selectedTab === "everyone" ? "active_modal_tab" : ""}
                                    onClick={() => setSelectedTab("everyone")}>
                                    {adminLanguageData?.users_page?.account_filter_everyone?.value}
                                </li>
                                {currentUserAccountType === "administrator" && (
                                    <>
                                        <li
                                            data-sort-value="administrator"
                                            className={
                                                selectedTab === "administrator" ? "active_modal_tab" : ""
                                            }
                                            onClick={() => setSelectedTab("administrator")}>
                                            {
                                                adminLanguageData?.users_page?.account_filter_administrators
                                                    ?.value
                                            }
                                        </li>
                                        <li
                                            data-sort-value="super-agent"
                                            className={
                                                selectedTab === "super-agent" ? "active_modal_tab" : ""
                                            }
                                            onClick={() => setSelectedTab("super-agent")}>
                                            {
                                                adminLanguageData?.users_page?.account_filter_super_agents
                                                    ?.value
                                            }
                                        </li>
                                    </>
                                )}
                                <li
                                    data-sort-value="agent"
                                    className={selectedTab === "agent" ? "active_modal_tab" : ""}
                                    onClick={() => setSelectedTab("agent")}>
                                    {adminLanguageData?.users_page?.account_filter_agents?.value}
                                </li>
                                <li
                                    data-sort-value="player"
                                    className={selectedTab === "player" ? "active_modal_tab" : ""}
                                    onClick={() => setSelectedTab("player")}>
                                    {adminLanguageData?.users_page?.account_filter_players?.value}
                                </li>
                                <li
                                    data-sort-value="hidden"
                                    className={selectedTab === "hide" ? "active_modal_tab" : ""}
                                    onClick={() => setSelectedTab("hide")}>
                                    {adminLanguageData?.users_page?.account_filter_hidden?.value}
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col sm={12}>
                    <div id="user_data_filter" className="dataTables_filter">
                        <label>
                            <input
                                type="search"
                                className="form_input"
                                placeholder={adminLanguageData?.users_page?.user_name_placeholder?.value}
                                aria-controls="user_data"
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </label>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default UserTab;
