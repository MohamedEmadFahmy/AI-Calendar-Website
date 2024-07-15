/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";

const Login = ({
	setLoginSuccesful,
	setSchedule,
	setUsername,
	setPassword,
	username,
	password,
}) => {
	const handleUsernameChange = (e) => {
		const value = e.target.value;
		setUsername(value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		if (username.length <= 2) {
			alert("username must be atleast 3 characters long");
		}
		if (password.length <= 2) {
			alert("password must be atleast 3 characters long");
		}

		try {
			// console.log({
			// 	username,
			// 	password,
			// });

			const response = await axios.post("http://localhost:3000/login", {
				username,
				password,
			});

			if (response.data.exists) {
				// alert("Login successful");
				setLoginSuccesful(true);

				setUsername(username);
				setPassword(password);
				if (response.data.schedule) {
					setSchedule(response.data.schedule);
				}

				console.log(response.data.schedule);
			} else {
				alert("User does not exist");
			}
		} catch (error) {
			console.error("Error checking user existence:", error);
		}
	};

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className=" bg-blue-300 rounded-lg flex flex-col items-center px-32 py-16">
				<h1 className="text-5xl text-white font-bold mb-8 text-shadow-lg">
					Login
				</h1>
				<form className="max-w-xs flex flex-col justify-center items-center">
					<input
						type="text"
						placeholder="Username"
						className="w-full p-3 mb-4 border rounded-lg"
						value={username}
						onChange={handleUsernameChange}
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full p-3 mb-6 border rounded-lg"
						value={password}
						onChange={handlePasswordChange}
					/>
					<button
						onClick={handleLogin}
						className="w-1/2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
