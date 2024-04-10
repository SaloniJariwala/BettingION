import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import AdminModal from "../AdminModal";
import DataTable, { createTheme } from "react-data-table-component";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const WithdrawalRequestModal = ({ show, setShow, requestData }) => {
    const { adminLanguageData } = AdminLanguageState();

    const handleClose = () => {
        setShow(false);
    };

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

    const columns = [
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_amount?.value,
            grow: 0,
            maxWidth: "150px",
            selector: (row) => renderAmountWithCurrency(row.amount, row.currency),
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_gateway_charge?.value,
            grow: 1,
            maxWidth: "180px",
            selector: (row) => renderAmountWithCurrency(0, row.currency),
        },

        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_method?.value,
            grow: 1,
            selector: (row) => `${row.withdrawMethod} - ${row.withdrawCoin}`,
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.information_modal_address?.value,
            grow: 1,
            selector: (row) => row.walletAddress,
        },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: adminLanguageData?.common_table_text?.row_per_page_label?.value || "Row Per Page",
    };

    return (
        <AdminModal show={show} setShow={setShow} closeModal={handleClose} size="lg">
            <h3 className="h3-title modal_title">{adminLanguageData?.finance_players_withdrawal_request_page?.information_modal_title?.value}</h3>

            <DataTable
                columns={columns}
                data={[requestData]}
                theme="solarized"
                noDataComponent={adminLanguageData?.no_records_found?.value}
                className="vertical_table"
                paginationComponentOptions={paginationComponentOptions}
            />
        </AdminModal>
    );
};

export default WithdrawalRequestModal;
