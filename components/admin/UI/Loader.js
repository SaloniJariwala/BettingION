const Loader = (props) => {
    return (
        <div
            className={`common_page_loader ${props.fullScreen ? "fullscreen_loader" : ""}`}
            style={props.style}>
            <i className="fad fa-spinner-third fa-spin"></i>
        </div>
    );
};

export default Loader;
