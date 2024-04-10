import homeIcon from "@/frontend/images/sidebar/home_icon.svg";
import promotionsIcon from "@/frontend/images/sidebar/promotion_icon.svg";
import casinoIcon from "@/frontend/images/sidebar/casino_icon.svg";
import accountIcon from "@/frontend/images/sidebar/account_icon.svg";
import cashierIcon from "@/frontend/images/sidebar/cashier_icon.svg";
import virtualSportsIcon from "@/frontend/images/sidebar/virtual_sports_icon.svg";
import liveDealerIcon from "@/frontend/images/sidebar/live_dealer_icon.svg";
import onlinePoker from "@/frontend/images/sidebar/online_poker_icon.svg";
import sportsBettingIcon from "@/frontend/images/sidebar/sports_betting_icon.svg";
import storeIcon from "@/frontend/images/sidebar/store_icon.svg";
import blogIcon from "@/frontend/images/sidebar/blog_icon.svg";

export const SidebarData = [
    {
        id: "1",
        title: "Main Page",
        link: "/",
        key: "main_page",
        default_icon: homeIcon,
        access: true,
    },
    {
        id: "2",
        title: "Promotions",
        link: "/welcome-bonus",
        key: "promotions",
        default_icon: promotionsIcon,
        access: true,
    },
    {
        id: "3",
        title: "Account",
        link: { javascript: void 0 },
        default_icon: accountIcon,
        key: "account",
        access: "user",
        child: [
            {
                id: "3.5",
                title: "Favorite Games",
                link: "/my-account/favorite-games",
                key: "favorite_games",
                access: "user",
            },
            {
                id: "3.6",
                title: "Active Bonus",
                link: "/my-account/active-bonus",
                key: "active_bonus",
                access: "user",
            },
            {
                id: "3.1",
                title: "Deposit",
                link: "/my-account/deposit",
                key: "deposit",
                access: "user",
            },
            {
                id: "3.2",
                title: "Withdraw",
                link: "/my-account/wallet-withdrawal",
                key: "withdraw",
                access: "user",
            },
            {
                id: "3.3",
                title: "Settings",
                link: "/my-account/edit-account",
                key: "settings",
                access: "user",
            },
            {
                id: "3.4",
                title: "Transactions",
                link: "/my-account/wallet",
                key: "transactions",
                access: "user",
            },
        ],
    },
    {
        id: "4",
        title: "Cashier",
        link: "/my-account/deposit",
        default_icon: cashierIcon,
        key: "cashier",
        access: "visitor",
    },
    {
        id: "5",
        title: "Casino",
        link: "/casino",
        default_icon: casinoIcon,
        key: "casino",
        access: true,
    },
    {
        id: "6",
        title: "Virtual Sports",
        link: "/virtual-sports",
        default_icon: virtualSportsIcon,
        key: "virtual_sports",
        access: true,
    },
    {
        id: "7",
        title: "Live Dealer",
        link: "/live-dealer",
        default_icon: liveDealerIcon,
        key: "live_dealer",
        access: true,
    },
//    {
//       id: "8",
//        title: "online Poker",
//        link: "/online-poker",
//        default_icon: onlinePoker,
//        key: "online_poker",
//        access: true,
//    },
//   {
//        id: "9",
//        title: "Sports Betting",
//        link: "/sports-betting",
//        default_icon: sportsBettingIcon,
//        key: "sports_betting",
//        access: true,
//    },
    {
        id: "10",
        title: "Store",
        link: "/store",
        default_icon: storeIcon,
        key: "store",
        point: true,
        access: "user",
    },
    {
        id: "11",
        title: "Blogs",
        link: "/blogs",
        default_icon: blogIcon,
        key: "blogs",
        access: true,
    },
];
