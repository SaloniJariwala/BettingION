import Link from "next/link";

const Button = ({ children, ...props }) => {
    return (
        <>
            {props.type ? (
                <button
                    type={props.type ? props.type : null}
                    onClick={props.onClick}
                    disabled={props.disabled ? props.disabled : null}
                    className={`sec_btn ${props.className ? props.className : ""} ${props.variant === "transparent" ? "transparent_btn" : ""} ${props.variant === "grey" ? "grey_btn" : ""} ${
                        props.size === "sm" ? "sm_btn" : ""
                    }`}
                >
                    {children}
                </button>
            ) : (
                <Link
                    href={props.href ? props.href : "#"}
                    title={props.html ? `${children[0]?.props?.children}${props.title ? props.title : children[1]}` : props.title ? props.title : children}
                    className={`sec_btn ${props.className ? props.className : ""} ${props.variant === "transparent" ? "transparent_btn" : ""} ${props.variant === "grey" ? "grey_btn" : ""} ${
                        props.size === "sm" ? "sm_btn" : ""
                    }`}
                >
                    {children}
                </Link>
            )}
        </>
    );
};

export default Button;
