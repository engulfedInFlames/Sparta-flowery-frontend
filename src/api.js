import axios from "axios";

const ax = axios.create({
  baseURL: "http://52.78.101.127/api/v1/",
  withCredentials: true,
});

export const apiPostLogin = async ({ email, password }) => {
  try {
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
  } catch (e) {
    console.log("apiPostLogin Error");
  }
};

export const apiGetMe = async ({ access }) => {
  if (!access) return;

  try {
    const res = await ax.get("users/me/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return res.data;
  } catch (e) {
    console.log("apiGetMe Error");
  }
};

export const apiGetArticles = async () => {
  try {
    const res = await ax.get("articles/", {});
    return res.data;
  } catch (e) {
    console.log("apiGetArticles Error");
  }
};

export const apiGetArticleDetail = async ({ pk }) => {
  try {
    const res = await ax.get(`articles/${pk}`, {});
    return res.data;
  } catch (e) {
    console.log("apiGetArticleDetail Error");
  }
};

export const apiPostArticle = async ({ access, title, content, image }) => {
  try {
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
  } catch (e) {
    console.log("apiPostArticle Error");
  }
};

export const apiPostComment = async ({ access, pk, content }) => {
  try {
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
  } catch (e) {
    console.log("apiPostComment Error");
  }
};

export const apiGithubLogin = async ({ code }) => {
  try {
    const res = await ax.post(
      "users/github-login/",
      {
        code,
      },
      {}
    );
    return res.data;
  } catch (e) {
    console.log("apiGithubLogin Error");
  }
};
