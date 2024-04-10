import Link from "next/link";
import { useRouter } from "next/router";

const AccountTab = (props) => {
    const router = useRouter();

    return (
        <div className="account_box_tabbing">
            <ul>
                {props?.data?.map((data) => {
                    const { id, link, icon, key, title } = data;
                    return (
                        <li key={id}>
                            <Link
                                href={link}
                                className={link === router.pathname ? "active_account_tab" : ""}
                            >
                                {icon && <i className={icon}></i>}
                                <span>{props?.getKey(key, title)}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AccountTab;
