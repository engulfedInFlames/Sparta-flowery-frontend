import axios from "axios";

require("dotenv").config();

const ax = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true,
});

export const apiPostLogin = async ({ email, password, csrftoken }) => {
  const res = await ax.post(
    "users/token/",
    {
      email,
      password,
    },
    {
      headers: {
        "X-CSRFToken": csrftoken || "",
      },
    }
  );
  const { access, refresh } = res.data;
  return { access, refresh };
};

export const apiGetMe = async ({ csrftoken, access }) => {
  if (!(csrftoken && access)) return;

  const res = await ax.get("users/me/", {
    headers: {
      "X-CSRFToken": csrftoken || "",
      Authorization: `Bearer ${access}`,
    },
  });
  return res.data;
};

export const apiGithubLogin = async ({ code, csrftoken }) => {
  const res = await ax.post(
    "users/github-login/",
    {
      code,
    },
    {
      headers: {
        "X-CSRFToken": csrftoken || "",
      },
    }
  );
  return res.data;
};
