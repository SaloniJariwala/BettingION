import homeIcon from "@/frontend/images/sidebar/home_icon.svg";
import casinoIcon from "@/frontend/images/sidebar/casino_icon.svg";
import cashierIcon from "@/frontend/images/sidebar/cashier_icon.svg";
import liveDealerIcon from "@/frontend/images/sidebar/live_dealer_icon.svg";
import sportsBettingIcon from "@/frontend/images/sidebar/sports_betting_icon.svg";
import virtualSportsIcon from "@/frontend/images/sidebar/virtual_sports_icon.svg";

export const bottomHeaderData = [
    {
        id: "1",
        title: "Main Page",
        link: "/",
        default_icon: homeIcon,
        key: "main_page",
    },
    {
        id: "2",
        title: "Cashier",
        link: "/my-account/deposit",
        default_icon: cashierIcon,
        key: "cashier",
    },
    {
        id: "3",
        title: "Casino",
        link: "/casino",
        default_icon: casinoIcon,
        key: "casino",
    },
    {
        id: "4",
        title: "Live Dealer",
        link: "/live-dealer",
        default_icon: liveDealerIcon,
        key: "live_dealer",
    },
    {
        id: "5",
        title: "Virtual Sports",
        link: "/virtual-sports",
        default_icon: virtualSportsIcon,
        key: "virtual_sports",
    },
 //   {
 //       id: "6",
 //       title: "Sports Betting",
 //       link: "/sports-betting",
 //       default_icon: sportsBettingIcon,
 //       key: "sports_betting",
 //   },
];
