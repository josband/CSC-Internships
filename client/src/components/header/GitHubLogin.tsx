import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/githubLogin.component.css";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addUser, removeUser, IUser } from "../../features/user/userSlice";
import User from "../../features/user/User";

// Need to refactor this to use http only cookies instead of local storage

// Create a type for the user data that is returned from the GitHub API
type UserData = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: string;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
};

const GitHubLogin = () => {
    const [githubClientId, setGithubClientId] = useState<string>("");
    const [rerender, setRerender] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData>({} as UserData);

    const dispatch = useAppDispatch();

    async function getUserData() {
        await fetch("http://localhost:5000/auth/getUserData", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"), // Make sure "Authorization" is in quotes
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setUserData(data);
                dispatch(addUser({
                    id: data.id,
                    login: data.login,
                    html_url: data.html_url,
                    avatar_url: data.avatar_url,
                } as IUser))
            });
    }

    useEffect(() => {
        async function getGitHubClientID() {
            const fetchedGithubClientId = await fetch(
                "http://localhost:5000/auth/githubClientID"
            ).then((res) => res.json());
            setGithubClientId(fetchedGithubClientId);
        }
        getGitHubClientID();

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");

        console.log(codeParam);

        // Set the href back to /
        window.history.pushState({}, "", "/");

        if (codeParam && localStorage.getItem("accessToken") === null) {
            async function getAccessToken() {
                await fetch(
                    `http://localhost:5000/auth/getAccessToken?code=${codeParam}`,
                    {
                        method: "GET",
                    }
                )
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        console.log(data);
                        if (data.access_token) {
                            localStorage.setItem(
                                "accessToken",
                                data.access_token
                            );
                            setRerender(!rerender);
                        }
                    });
            }
            getAccessToken();
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            getUserData();
        }
    }, [rerender]);

    const onLoginClicked = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;
    };

    return (
        <>
            {localStorage.getItem("accessToken") ? (
                <>
                    {Object.keys(userData).length > 0 ? (
                        <User avatar_url={userData.avatar_url} login={userData.login} />
                    ) : (
                        <></>
                    )}
                    <button
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            dispatch(removeUser());
                            setRerender(!rerender);
                        }}
                    >
                        Log out
                    </button>
                </>
            ) : (
                <div
                    className="github-login-container"
                    onClick={onLoginClicked}
                >
                    <FontAwesomeIcon icon={faGithub} className="github-logo" />
                    <p className="github-login-text">Log in with GitHub</p>
                </div>
            )}
        </>
    );
};

export default GitHubLogin;
