/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { TimePicker } from "antd";
import moment from "moment";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

const Schedule = ({ schedule, setSchedule, username, password }) => {
	const [timeRanges, setTimeRanges] = useState({
		Saturday: [null, null],
		Sunday: [null, null],
		Monday: [null, null],
		Tuesday: [null, null],
		Wednesday: [null, null],
		Thursday: [null, null],
		Friday: [null, null],
	});

	const [aiMessage, setAiMessage] = useState("");

	const [loading, setLoading] = useState(false);

	const [aiDone, setAiDone] = useState(false);

	const backendURL = import.meta.env.VITE_BACKEND_URL;

	// const handleTimeChange = (day, times) => {
	// 	// Ensure times is always an array, even if null or undefined
	// 	console.log(times);

	// 	if (times != null && times.length > 0) {
	// 		console.log(times[0] === times[1]);
	// 	}

	// 	const formattedTimes = times
	// 		? times.map((time) => (time ? time.format("HH:mm") : null))
	// 		: [];

	// 	// Update the state correctly by spreading the previous state
	// 	setTimeRanges((prevTimeRanges) => ({
	// 		...prevTimeRanges,
	// 		[day]: formattedTimes,
	// 	}));
	// 	// console.log(timeRanges);
	// };

	const handleTimeChange = (day, index, time) => {
		const updatedTimeRanges = { ...timeRanges };
		updatedTimeRanges[day][index] = time ? time.format("HH:mm") : null;
		setTimeRanges(updatedTimeRanges);
	};

	useEffect(() => {
		console.log(schedule);
	}, [schedule]);

	const renderTimePickers = () => {
		return (
			<>
				<h1 className="text-white text-5xl font-bold">Confirm</h1>
				{Object.keys(timeRanges).map((day) => {
					const [startTime, endTime] = timeRanges[day].map((time) =>
						time ? moment(time, "HH:mm") : null
					);
					return (
						<div key={day} className="mb-4 flex gap-10">
							<div className="text-2xl w-[10vw]">{day}</div>
							{/* <TimePicker.RangePicker
								format="h:mm A"
								onChange={(times) =>
									handleTimeChange(day, times)
								}
								value={[startTime, endTime]}
							/> */}

							<div className="flex gap-4">
								<TimePicker
									format="h:mm A"
									value={startTime}
									onChange={(time) =>
										handleTimeChange(day, 0, time)
									}
								/>
								<TimePicker
									format="h:mm A"
									value={endTime}
									onChange={(time) =>
										handleTimeChange(day, 1, time)
									}
								/>
							</div>

							{/* <div className="w-[10vw]">
								<div>Start Time: {timeRanges[day][0]}</div>
								<div>End Time: {timeRanges[day][1]}</div>
							</div> */}
						</div>
					);
				})}
				<button
					onClick={saveToDatabase}
					className="text-white bg-blue-500 py-3 px-10 rounded-lg hover:bg-blue-600 outline-none"
				>
					Submit
				</button>
			</>
		);
	};

	const saveToDatabase = async () => {
		let hasIncompleteTimeSlot = false;
		let hasInvalidTimeSlot = false;

		Object.entries(timeRanges).forEach(([day, times]) => {
			if (
				(times[0] === null && times[1] !== null) ||
				(times[0] !== null && times[1] === null)
			) {
				alert(`Please fill all the time slots for ${day}`);
				hasIncompleteTimeSlot = true;
			}

			if (times[0] !== null && times[0] == times[1]) {
				alert(`Invalid time slot for ${day}`);
				hasInvalidTimeSlot = true;
			}
		});

		if (hasIncompleteTimeSlot || hasInvalidTimeSlot) {
			return;
		}

		try {
			setLoading(true);
			console.log(username, password, timeRanges);
			await axios.post(`${backendURL}/update_schedule`, {
				username: username,
				password: password,
				schedule: timeRanges,
			});
			setLoading(false);
			setSchedule({ ...timeRanges });
		} catch (error) {
			console.error("Error checking user existence:", error);
		}
	};

	const handleStartAi = async () => {
		try {
			if (aiMessage.length === 0) {
				alert("Please enter some text");
				return;
			}

			setLoading(true);

			const response = await axios.post(
				`${backendURL}/parse_availability`,
				{ message: aiMessage },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			setLoading(false);
			setTimeRanges({ ...response.data });
			setAiDone(true);

			console.log(response.data);
		} catch (error) {
			console.error("Error checking user existence:", error);
		}
	};

	const renderMissingSchedule = () => {
		return (
			<div className="flex flex-col items-center h-[100%] gap-10">
				<h1 className="text-4xl font-bold mb-8 text-shadow-lg">
					You don't currently have a schedule
				</h1>

				<div className="flex items-center flex-col gap-3 w-full">
					<label htmlFor="box" className="block">
						Tell us when you're free and we'll create a schedule
						that suits you
					</label>
					<input
						type="text"
						id="box"
						className="w-full pl-3 px-6 pb-72 pt-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
						placeholder="Enter text here..."
						value={aiMessage}
						onChange={(e) => setAiMessage(e.target.value)}
					/>
				</div>
				<button
					onClick={handleStartAi}
					className="w-50 bg-blue-500 px-4 py-2 text-white font-bold rounded-lg text-center hover:bg-blue-600 hover:text-gray-100"
				>
					Submit
				</button>
			</div>
		);
	};

	const daysOfWeek = [
		"Saturday",
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
	];

	return (
		<>
			<div className="bg-white w-full h-screen flex items-center justify-center">
				<div className="bg-blue-300 w-1/2 flex flex-col p-5 items-center rounded-2xl gap-3">
					{Object.keys(schedule).length > 0 ? (
						<>
							<h1 className="text-3xl font-bold mb-5 text-white">
								Current Schedule:
							</h1>
							<div className="flex flex-col gap-5">
								{daysOfWeek.map((day) => {
									// const [startTime, endTime] = schedule[day];
									const startTime = moment(
										schedule[day][0],
										"HH:mm"
									).format("h:mm A");
									const endTime = moment(
										schedule[day][1],
										"HH:mm"
									).format("h:mm A");
									return (
										<div
											key={day}
											className="mb-4 flex gap-10 p-2 border rounded-lg bg-white shadow-md items-center"
										>
											<div className="text-2xl w-[10vw] font-medium text-gray-700">
												{day}
											</div>
											<div className="w-[10vw]">
												<div className="text-lg text-gray-800">
													Start Time:
													{startTime != "Invalid date"
														? startTime
														: "N/A"}
												</div>
												<div className="text-lg text-gray-800">
													End Time:
													{endTime != "Invalid date"
														? endTime
														: "N/A"}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</>
					) : aiDone ? (
						renderTimePickers()
					) : (
						renderMissingSchedule()
					)}

					<PulseLoader loading={loading} size={20} color="white" />
					{/* <div key={1} className="mb-4 flex gap-10 bg-gray-400">
						<div className="text-2xl w-[10vw]">MoskiDay</div>
						<TimePicker.RangePicker format="h:mm A" disabled />
						<div className="w-[10vw]">
							<div>Start Time: {timeRanges[0]}</div>
							<div>End Time: {timeRanges[1]}</div>
						</div>
					</div> */}
				</div>
			</div>
		</>
	);
};

export default Schedule;
