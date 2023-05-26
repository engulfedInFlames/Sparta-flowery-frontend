import axios from "axios";

const ax = axios.create({
  baseURL: "http://3.38.105.28/api/v1/",
  withCredentials: true,
});

export const apiPostLogin = async ({ email, password }) => {
  const res = await ax.post(
    "users/token/",
    {
      email,
      password,
    },
    {
      headers: {},
    }
  );
  const { access, refresh } = res.data;
  return { access, refresh };
};

export const apiGetMe = async ({ access }) => {
  if (!access) return;

  const res = await ax.get("users/me/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return res.data;
};

export const apiGithubLogin = async ({ code }) => {
  const res = await ax.post(
    "users/github-login/",
    {
      code,
    },
    {}
  );
  return res.data;
};

export const apiGetArticles = async () => {
  const res = await ax.get("articles/", {
    headers: {
      "X-CSRFToken": csrftoken || "",
    },
  });
  return res.data;
};

export const apiGetArticleDetail = async ({ pk }) => {
  const res = await ax.get(`articles/${pk}`, {});
  return res.data;
};

export const apiPostArticle = async ({ access, title, content, image }) => {
  const res = await ax.post(
    "articles/",
    { title, content, image },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return res.status;
};

export const apiPostComment = async ({ access, pk, content }) => {
  const res = await ax.post(
    `articles/${pk}/comments/`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return res.status;
};
