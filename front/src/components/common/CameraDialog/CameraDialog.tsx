import React, { MouseEventHandler, useState } from "react";
import Webcam from "react-webcam";
import CameraIcon from "@material-ui/icons/Camera";
import "./camera.css";
import { SwitchCamera } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Dialog,
	Grid,
	Tooltip,
} from "@material-ui/core";
import { ModalProps } from "@material-ui/core/Modal";

type CameraDialogType = {
	open: boolean,
	handleClose: Function
}

export const CameraDialog = ({ open, handleClose }: CameraDialogType) => {

	const webcamRef = React.useRef<Webcam>(null);
	const [error, setError] = useState(true);

	const { innerWidth: width, innerHeight: height } = window;
	const [videoConstraints, setVideoConstraints] = useState({
		width,
		height,
		facingMode: "user"
	});

	const capture: () => string = () => {
		const imageSrc = webcamRef?.current?.getScreenshot();
		return imageSrc ? imageSrc : "";
	};

	const dataUrlToFile = async (dataUrl: string, fileName: string) => {
		const res = await fetch(dataUrl);
		const blob = await res.blob();
		return new File([blob], fileName, { type: "image/jpeg" });
	};
	const takeImage = async (url: string) => {
		const image = await dataUrlToFile(url, "test.jpeg");
		handleClose(image);
	};

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose as ModalProps['onClose']}
		>
			<div>
				<Webcam className="webcam" style={error ? { display: "none" } : { display: "inherit" }} audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} onUserMedia={() => setError(false)} onUserMediaError={() => setError(true)} />
			</div>
			{error &&
				<div className="webcam-unavailable">
					<h1>Caméra indisponible</h1>
				</div>
			}
			<div className="full-size position-absolute p-20">
				<Grid
					container
					className="full-size"
					direction="column"
					justifyContent="space-between"
					alignItems="center"
				>
					<Grid
						item
						container
						direction="row"
						justifyContent="flex-end"
						alignItems="center"
					>
						<Grid item>
							<FontAwesomeIcon
								icon={faTimes}
								size="2x"
								className="color-white"
								onClick={handleClose as MouseEventHandler}
							/>
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="row"
						justifyContent="center"
						alignItems="center"
						className="pb-20"
						spacing={3}
					>
						<Grid item>
							<Tooltip title="Capturer">
								<div className="rounded-outlined-white">
									<CameraIcon
										onClick={() => {
											takeImage(capture());
										}}
										aria-label="cameraIcon"
										className="cameraIcon"
										//   fontSize="large"
										style={{ width: "35px", height: "35px" }}
									/>
								</div>
							</Tooltip>
						</Grid>
						<Grid item className="color-white cursor-pointer">
							<Tooltip title="Changer la caméra">
								<SwitchCamera
									fontSize="large"
									onClick={() => {
										setVideoConstraints({
											width,
											height,
											facingMode: videoConstraints.facingMode === "user" ? "environment" : "user"
										})
									}}
								/>
							</Tooltip>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</Dialog>
	);
}
