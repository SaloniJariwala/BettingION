import Image from "next/image";

const Title = ({ title, icon, className, customComponent }) => {
    return (
        <div className="sec_title_wp">
            <h2 className={`sec_title h4_title ${className ? className : ""}`}>
                {icon && (
                    <span>
                        <Image loading="lazy" src={icon} alt="Popular Slots" />
                    </span>
                )}

                {title}
            </h2>
            {customComponent && customComponent}
        </div>
    );
};

export default Title;
