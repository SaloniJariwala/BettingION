import { getDateAndTime } from "@/utils/getDateAndTime";
import AdminModal from "../AdminModal";

const EventReportModal = ({ show, setShow, data }) => {
    const handleClose = () => {
        setShow(false);
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="md">
            <h3 className="h3-title modal_title">Events</h3>
            {data?.details?.betEvents?.map((item, index) => (
                <table className="bet-events" key={index}>
                    <tbody>
                        <tr>
                            <th>Sport </th>
                            <td>{item?.sport}</td>
                        </tr>
                        <tr>
                            <th>Category </th>
                            <td>{item?.category}</td>
                        </tr>
                        <tr>
                            <th>League </th>
                            <td>{item?.league}</td>
                        </tr>
                        <tr>
                            <th>Event </th>
                            <td>{item?.event}</td>
                        </tr>
                        <tr>
                            <th>Close </th>
                            <td>{getDateAndTime(item?.date)}</td>
                        </tr>
                        <tr>
                            <th>Market </th>
                            <td>{item?.market}</td>
                        </tr>
                        <tr>
                            <th>Selection </th>
                            <td>{item?.selection}</td>
                        </tr>
                        <tr>
                            <th>Live </th>
                            <td>{item?.live ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <th>Time </th>
                            <td>{getDateAndTime(item?.time)}</td>
                        </tr>
                    </tbody>
                </table>
            ))}
        </AdminModal>
    );
};

export default EventReportModal;
