import Button from "@/components/frontend/UI/Button";
import AdminModal from "../../AdminModal";
import axios from "axios";
import sha1 from "sha1";
import { useState } from "react";

var closeIdentifier;
const PostDeleteModal = ({ show, setShow, refreshData }) => {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const clearMessages = () => {
		setErrorMessage("");
		setSuccessMessage("");
	};

	const handleClose = () => {
		clearMessages();
		clearTimeout(closeIdentifier);
		if (show?.refreshStatus) refreshData();
		setShow({ status: false, id: 0 });
	};

	const handleDeletePost = () => {
		clearMessages();
		setLoading(true);

		const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

		axios.put(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/delete-blog-post?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&postId=${show?.id}&authKey=${authKey}`)
			.then((response) => {
				if (response.data?.status === 200) {
					setSuccessMessage(response.data?.data);

					setShow(prev => {
						return {
							...prev,
							refreshStatus: true
						}
					});
					closeIdentifier = setTimeout(handleClose, 5000);
				} else {
					setErrorMessage(response.data?.message);
				}
			})
			.catch((error) => {
				setErrorMessage(error?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<AdminModal show={show?.status} closeModal={handleClose}>
			<div div className="reward_modal">
				<h4 className="h4_title">Are you sure?</h4>
				<p>This post will be deleted permanently!</p>

				<div className="button_group">
					<Button type="button" onClick={handleDeletePost}>
						Confirm
					</Button>
				</div>

				{loading && (
					<span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
						<i className="fad fa-spinner-third fa-spin"></i>
					</span>
				)}

				<div className="error-msg player-bet-loss mt_20" style={{ display: errorMessage && "block" }}>
					{errorMessage}
				</div>
				<div className="error-msg player-bet-won mt_20" style={{ display: successMessage && "block" }}>
					{successMessage}
				</div>
			</div>
		</AdminModal>
	);
};

export default PostDeleteModal;
