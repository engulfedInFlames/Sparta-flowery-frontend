import {
  apiGetArticleDetail,
  apiGetArticles,
  apiGetMe,
  apiGithubLogin,
  apiPostArticle,
  apiPostComment,
  apiPostLogin,
} from "../api";

require("dotenv").config();

const cookieOption = {
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
};

export const getHome = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });
  try {
    const { articles } = await apiGetArticles({ csrftoken });
    return res.render("pages/index", me ? { articles, me } : { articles });
  } catch (e) {
    const error = "게시글을 가지고 올 수 없습니다.";
    return res.render("pages/index", { error });
  }
};

export const getWrite = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });

  if (!me) return res.redirect("/");

  return res.render("pages/write", { me });
};

export const postWrite = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const {
    body: { title, content },
    file: image,
  } = req;
  try {
    await apiPostArticle({ csrftoken, access, title, content, image });

    return res.redirect("/");
  } catch (e) {
    const error = "글쓰기에 실패했습니다.";
    return res.render("pages/write", { error });
  }
};

export const getDetail = async (req, res, next) => {
  const pk = req.params.pk;
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });

  try {
    const article = await apiGetArticleDetail({ csrftoken, pk });
    const {
      article: { result: jsonString },
    } = article;

    const validJsonString = jsonString.replace(/'/g, '"');
    const jsonObject = JSON.parse(validJsonString);

    article.article.result = { ...jsonObject };

    return res.render("pages/detail", me ? { ...article, me } : { ...article });
  } catch (e) {
    return res.render("404");
  }
};

export const postComment = async (req, res, next) => {
  const pk = req.params.pk;
  const { csrftoken, access } = req.cookies;
  const { content } = req.body;
  try {
    await apiPostComment({ csrftoken, access, pk, content });

    return res.redirect(req.headers.referer || "/");
  } catch (e) {
    const error = "댓글 작성에 실패했습니다.";
    return res.render("pages/detail", { error });
  }
};

export const getLogin = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });

  if (me) return res.redirect("/");

  // 카카오 로그인
  const kakaoParams = {
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: "http://127.0.0.1:4000/kakao-login",
    response_type: "code",
  };
  const kakaoSeacrhParams = new URLSearchParams(kakaoParams).toString(
    kakaoParams
  );

  // 깃허브 로그인
  const githubParams = {
    client_id: process.env.GH_CLIENT_ID,
    redirect_uri: "http://127.0.0.1:4000/github-login",
    scope: "read:user,user:email",
  };

  const githubSeacrhParams = new URLSearchParams(githubParams).toString();

  // 구글 로그인
  // const googleParams = {
  //   client_id: process.env.GOOGLE_API_KEY,
  //   redirect_uri: "",
  //   response_type: "",
  // };
  // const googleSeacrhParams = new URLSearchParams(googleParams).toString(
  //   googleParams
  // );
  const oauthUrls = {
    kakao: `https://kauth.kakao.com/oauth/authorize?${kakaoSeacrhParams}`,
    github: `https://github.com/login/oauth/authorize?${githubSeacrhParams}`,
    google: ``,
  };
  return res.render("pages/login", oauthUrls);
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const { csrftoken } = req.cookies;
  try {
    const { access, refresh } = await apiPostLogin({
      email,
      password,
      csrftoken,
    });
    res.cookie("access", access, cookieOption);
    res.cookie("refresh", refresh, cookieOption);

    return res.redirect("/");
  } catch (e) {
    const error = "로그인에 실패했습니다.";
    return res.render("pages/login", { error });
  }
};

export const getLogout = async (req, res, next) => {
  res.clearCookie("access");
  res.clearCookie("refresh");
  return res.redirect(req.headers.referer || "/");
};

export const getGithubLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const { csrftoken } = req.cookies;
    const { access, refresh } = await apiGithubLogin({ code, csrftoken });

    res.cookie("access", access, cookieOption);
    res.cookie("refresh", refresh, cookieOption);

    return res.redirect("/");
  } catch (e) {
    const error = "깃허브 로그인에 실패했습니다.";
    return res.render("pages/login", { error });
  }
};

export const getKakakoLogin = async (req, res) => {
  try {
    return res.send("<h1>KaKao Login</h1>");
  } catch (e) {
    const error = "카카오 로그인에 실패했습니다.";
    return res.render("pages/login", { error });
  }
};

export const getGoogleLogin = async (req, res) => {
  try {
    return res.send("<h1>Google Login</h1>");
  } catch (e) {
    const error = "구글 로그인에 실패했습니다.";
    return res.render("pages/login", { error });
  }
};

export const get404 = async (req, res) => {
  return res.render("404");
};
