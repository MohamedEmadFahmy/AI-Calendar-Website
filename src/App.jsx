/* eslint-disable no-unused-vars */
import Schedule from "./components/Schedule";
import Login from "./components/Login";
import { useState } from "react";

const App = () => {
	const [isLoginSuccessful, setLoginSuccesful] = useState(false);
	const [schedule, setSchedule] = useState({});
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		// <div className="w-full h-screen">
		// {
		/* <Schedule /> */
		// }

		isLoginSuccessful ? (
			<Schedule
				schedule={schedule}
				setSchedule={setSchedule}
				username={username}
				password={password}
			/>
		) : (
			<Login
				setLoginSuccesful={setLoginSuccesful}
				setSchedule={setSchedule}
				setUsername={setUsername}
				setPassword={setPassword}
				username={username}
				password={password}
			/>
		)
	);
};

export default App;
