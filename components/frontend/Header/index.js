import TopHeader from "./TopHeader";
import BottomHeader from "./BottomHeader";

const Header = ({ sidebarOpenButton, providerSidebarButton, allGamesPages }) => {
    return (
        <header className="header">
            <TopHeader
                sidebarOpenButton={sidebarOpenButton}
                providerSidebarButton={providerSidebarButton}
                allGamesPages={allGamesPages}
            />
            <BottomHeader sidebarOpenButton={sidebarOpenButton} />
        </header>
    );
};

export default Header;
