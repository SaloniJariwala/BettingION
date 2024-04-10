import Image from "next/image";
import downIcon from "@/frontend/images/down_icon.svg";
import Link from "next/link";
import SimpleBar from "simplebar-react";

const Dropdown = ({
    show,
    setShow,
    data,
    selected,
    overlay,
    handleDropdownChange,
    value,
    radio,
    radioName,
}) => {
    const handleDropdownToggle = () => {
        setShow(!show);
    };

    const handleDropdownOptionClick = (option, value) => {
        handleDropdownChange && handleDropdownChange(option, value);
        setShow(false);
    };

    return (
        <div className={`dropdown ${show ? "active_dropdown" : ""} ${overlay ? "overlay_dropdown" : ""}`}>
            <button className="dropdown_button" type="button" onClick={handleDropdownToggle}>
                <span>{selected ? selected : data?.[0]?.option}</span>{" "}
                <Image src={downIcon} alt="BettingIon" />
            </button>

            {data?.length > 0 && show && (
                <div className="dropdown_items">
                    <SimpleBar>
                        <ul>
                            {data?.map((data, index) =>
                                data.link ? (
                                    <li
                                        key={index}
                                        className={selected === data?.option ? "active_option" : ""}
                                        onClick={() => handleDropdownOptionClick(data.option, data?.value)}>
                                        <Link href={data.link} title={data?.option}>
                                            {data?.option} {value && <span>{data?.count}</span>}
                                        </Link>
                                    </li>
                                ) : radio ? (
                                    <li
                                        key={index}
                                        className={selected === data?.option ? "active_option" : ""}
                                        onClick={() => handleDropdownOptionClick(data.option, data?.value)}>
                                        <div className="form_checkbox">
                                            <input
                                                type="radio"
                                                defaultChecked={selected === data?.option}
                                                name={radioName}
                                            />
                                            {data?.option}
                                        </div>
                                    </li>
                                ) : (
                                    <li
                                        key={index}
                                        className={selected === data?.option ? "active_option" : ""}
                                        onClick={() => handleDropdownOptionClick(data.option, data?.value)}>
                                        {data?.option} {value && <span>{data?.count}</span>}
                                    </li>
                                )
                            )}
                        </ul>
                    </SimpleBar>
                </div>
            )
            }
        </div >
    );
};

export default Dropdown;
