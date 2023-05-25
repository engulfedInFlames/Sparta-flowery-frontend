import axios from "axios";

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

export const apiGetArticles = async ({ csrftoken }) => {
  const res = await ax.get("articles/", {
    headers: {
      "X-CSRFToken": csrftoken || "",
    },
  });
  return res.data;
};

export const apiGetArticleDetail = async ({ csrftoken, pk }) => {
  const res = await ax.get(`articles/${pk}`, {
    headers: {
      "X-CSRFToken": csrftoken || "",
    },
  });
  return res.data;
};

export const apiPostArticle = async ({
  csrftoken,
  access,
  title,
  content,
  image,
}) => {
  const res = await ax.post(
    "articles/",
    { title, content, image },
    {
      headers: {
        "X-CSRFToken": csrftoken || "",
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return res.status;
};

export const apiPostComment = async ({ csrftoken, access, pk, content }) => {
  const res = await ax.post(
    `articles/${pk}/comments/`,
    { content },
    {
      headers: {
        "X-CSRFToken": csrftoken || "",
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return res.status;
};

export const apiPostLike = async ({ csrftoken, access, pk }) => {
  const res = await ax.post(
    `articles/${pk}/like/`,
    {},
    {
      headers: {
        "X-CSRFToken": csrftoken || "",
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return res.status;
};
