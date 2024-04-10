import Image from "next/image";
import Link from "next/link";
import Title from "@/frontend/ui/Title";
import slotBoxShape from "@/frontend/images/slots_box_shape.svg";
import popularSlotIcon from "@/frontend/images/popular_slot_icon.svg";
import sportsImg from "@/frontend/images/sports_slot.png";
import casinoImg from "@/frontend/images/casino_slot.png";
import liveCasinoImg from "@/frontend/images/live_casino_slot.png";
import crashGamesImg from "@/frontend/images/crash_games_slot.png";
import { LanguageState } from "@/context/FrontLanguageProvider";

const PopularSlot = () => {
    const { languageData } = LanguageState();

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.main_page) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData.main_page[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    const slotBoxData = [
        {
            title: "Virtual Sports",
            icon: sportsImg,
            link: "/virtual-sports",
            key: "virtual_sports_card",
        },
        {
            title: "Casino",
            icon: casinoImg,
            link: "/casino",
            key: "casino_card",
        },
        {
            title: "Live Casino",
            icon: liveCasinoImg,
            link: "/live-dealer",
            key: "live_casino_card",
        },
        {
            title: "Crash Games",
            icon: crashGamesImg,
            link: "/casino/CrashGames",
            key: "crash_games_card",
        },
    ];

    const SlotBox = ({ data }) => {
        const { link, title, icon, key } = data;
        return (
            <div className="slots_box">
                <Image className="slots_box_shape" src={slotBoxShape} alt={getKey(key, title) || title} />
                <Link href={link} title={getKey(key, title) || title}>
                    <Image loading="lazy" quality={40} className="slots_box_icon" src={icon} alt={getKey(key, title) || title} />
                    <h3 className="h2_title">{getKey(key, title) || title}</h3>
                </Link>
            </div>
        );
    };

    return (
        <section className="popular_slots_sec">
            <Title className="mb_0" title={languageData?.main_page?.popular_games?.value || "Popular"} icon={popularSlotIcon} link="/" />

            <div className="slots_box_wp">
                {slotBoxData?.map((data, index) => (
                    <SlotBox key={index} data={data} />
                ))}
            </div>
        </section>
    );
};

export default PopularSlot;
