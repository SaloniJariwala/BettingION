import { useState } from "react";

const CheckBoxGroup = (props) => {
    const checkList = ["sports", "casino", "poker"];

    const handleCheck = (event) => {
        var updatedList = props.methods.getValues("permissions") || [];
        if (event.target.checked) {
            updatedList = [...updatedList, event.target.value];
        } else {
            updatedList.splice(updatedList.indexOf(event.target.value), 1);
        }
        props.methods.setValue("permissions", updatedList);
    };

    return (
        <>
            <div className="form_checkbox-sec-wp">
                {checkList.map((item, index) => (
                    <div className="form_checkbox-sec" key={index}>
                        <div className="form_checkbox">
                            <input
                                name={props.name}
                                value={item}
                                type="checkbox"
                                onChange={(event) => handleCheck(event)}
                                checked={
                                    props.methods.getValues("permissions")?.includes(item) ? "checked" : ""
                                }
                            />
                            <div className="form_checkbox-header">
                                <span style={{ textTransform: "capitalize" }}>{item}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CheckBoxGroup;
