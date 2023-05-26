import axios from "axios";

const ax = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true,
});

export const apiPostLogin = async ({ email, password, csrftoken }) => {
  try {
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
  } catch (e) {
    console.log("apiPostLogin Error");
  }
};

export const apiGetMe = async ({ csrftoken, access }) => {
  if (!(csrftoken && access)) return;
  try {
    const res = await ax.get("users/me/", {
      headers: {
        "X-CSRFToken": csrftoken || "",
        Authorization: `Bearer ${access}`,
      },
    });
    return res.data;
  } catch (e) {
    console.log("apiGetMe Error");
  }
};

export const apiGithubLogin = async ({ code, csrftoken }) => {
  try {
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
  } catch (e) {
    console.log("apiGithubLogin Error");
  }
};

export const apiGetArticles = async ({ csrftoken }) => {
  try {
    const res = await ax.get("articles/", {
      headers: {
        "X-CSRFToken": csrftoken || "",
      },
    });
    return res.data;
  } catch (e) {
    console.log("apiGetArticles Error");
  }
};

export const apiGetArticleDetail = async ({ csrftoken, pk }) => {
  try {
    const res = await ax.get(`articles/${pk}`, {
      headers: {
        "X-CSRFToken": csrftoken || "",
      },
    });
    return res.data;
  } catch (e) {
    console.log("apiGetArticleDetail Error");
  }
};

export const apiPostArticle = async ({
  csrftoken,
  access,
  title,
  content,
  image,
}) => {
  try {
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
  } catch (e) {
    console.log("apiPostArticle Error");
  }
};

export const apiPostComment = async ({ csrftoken, access, pk, content }) => {
  try {
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
  } catch (e) {
    console.log("apiPostComment Error");
  }
};
