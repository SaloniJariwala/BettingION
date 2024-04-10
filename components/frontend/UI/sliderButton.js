export const PrevButton = (props) => {
    const { className, onClick } = props;

    return (
        <button type="button" aria-label="Pervious Slide" className={`slide-arrow prev-arrow ${className}`} onClick={onClick}>
            <i className="fa fa-angle-left" aria-hidden="true"></i>
        </button>
    );
};

export const NextButton = (props) => {
    const { className, onClick } = props;

    return (
        <button type="button" aria-label="Next Slide" className={`slide-arrow next-arrow ${className}`} onClick={onClick}>
            <i className="fa fa-angle-right" aria-hidden="true"></i>
        </button>
    );
};
