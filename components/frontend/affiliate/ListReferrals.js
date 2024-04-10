import Image from "next/image";
import coin from "@/frontend/images/coin/btc.svg";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";

const ListReferrals = ({ referral }) => {
    return (
        <tr>
            <td>
                <p>{referral?.tag}</p>
            </td>
            <td>
                <span className="coin_info">
                    {/* <Image src={coin} width={20} height={20} alt="BTC" /> */}
                    {renderAmountWithCurrency(referral?.withdrawAmount?.toFixed(2))}
                </span>
            </td>
            <td>
                <p className="coin_info balance_available">
                    {/* <Image src={coin} width={20} height={20} alt="BTC" /> */}
                    {renderAmountWithCurrency(referral?.availableAmount?.toFixed(2))}
                </p>
            </td>
        </tr>
    );
};

export default ListReferrals;