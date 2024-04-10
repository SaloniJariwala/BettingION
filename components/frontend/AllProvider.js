import Title from "@/frontend/ui/Title";
import Dropdown from "@/frontend/ui/Dropdown";
import { useState } from "react";
import GameBox from "@/frontend/common/GameBox";
import InfiniteScroll from "react-infinite-scroll-component";
import { GamesProviderState } from "@/context/GamesProvider";
import GameBoxLoader from "./UI/GameBoxLoader";

const AllProviderTitle = ({
    activeProvider = false,
    allGames,
    errorMessage,
    page,
    setPage,
    allGamesCount,
    currentGameCount,
    onPageLoad,
    allProviders,
    setProviderId,
    pageSlug = false,
}) => {
    const { setProviderTitle, providerTitle } = GamesProviderState();
    const [dropDown, setDropDown] = useState();

    let providerOptions = [{ option: "All Providers", value: "", count: "" }];
    allProviders?.map((provider) => {
        providerOptions?.push({ option: provider?.name, value: provider?.id, count: provider?.gamesCount });
    });

    const handleDropdownChange = (option) => {
        providerOptions?.map((provider) => {
            if (option === provider.option) {
                setProviderTitle(option);
                setProviderId(provider.value);
                return;
            }
        });
    };

    const ProviderDropDown = () => (
        <Dropdown
            show={dropDown}
            setShow={setDropDown}
            data={providerOptions}
            selected={providerTitle}
            handleDropdownChange={handleDropdownChange}
            value={true}
            overlay
        />
    );

    const getInfiniteData = () => {
        setPage(page + 1);
    };

    return (
        <section className="all_provider_sec">
            <Title
                className="mb_0"
                title={activeProvider ? activeProvider : providerTitle}
                customComponent={pageSlug !== "provider-page" ? <ProviderDropDown /> : ""}
            />

            {errorMessage ? (
                <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                    {errorMessage}
                </p>
            ) : (
                <>
                    <InfiniteScroll
                        dataLength={allGames?.length}
                        next={getInfiniteData}
                        hasMore={currentGameCount !== 0}
                        loader={allGamesCount === 0 ? null : <GameBoxLoader />}
                        style={{ height: onPageLoad ? "auto" : "auto", overflow: "hidden" }}>
                        <div className="game_box_loader" style={{ display: onPageLoad ? "block" : "none" }}>
                            <GameBoxLoader />
                        </div>
                        <div className="game_wrap">
                            {Array.isArray(allGames) ? (
                                allGames?.map((data, index) => {
                                    if (
                                        data.providerId !== "6" ||
                                        data.providerId !== "4" ||
                                        data.gameType !== "Virtual" ||
                                        data.gameType !== "OnlinePoker"
                                    ) {
                                        return <GameBox key={index} data={data} />;
                                    }
                                })
                            ) : (
                                <></>
                            )}
                        </div>
                    </InfiniteScroll>
                </>
            )}
        </section>
    );
};

export default AllProviderTitle;
