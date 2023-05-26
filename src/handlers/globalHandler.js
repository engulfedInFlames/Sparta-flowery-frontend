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

// GET "/"
export const getHome = async (req, res, next) => {
  const { access } = req.cookies;
  const me = await apiGetMe({ access });
  const { articles } = await apiGetArticles();

  return res.render("pages/index", me ? { articles, me } : { articles });
};

// GET "/write"
export const getWrite = async (req, res, next) => {
  const { access } = req.cookies;
  const me = await apiGetMe({ access });

  return res.render("pages/write", me ? { me } : null);
};

// POST "/write"
export const postWrite = async (req, res, next) => {
  const { access } = req.cookies;
  const {
    body: { title, content },
    file: image,
  } = req;
  await apiPostArticle({ access, title, content, image });

  return res.redirect(req.headers.referer || "/");
};

// GET "/detail"
export const getDetail = async (req, res, next) => {
  const pk = req.params.pk;
  const { access } = req.cookies;
  const me = await apiGetMe({ access });
  const detail = await apiGetArticleDetail({ pk });

  return res.render("pages/detail", me ? { ...detail, me } : { ...detail });
};

// POST "/detail"
export const postComment = async (req, res, next) => {
  const pk = req.params.pk;
  const { access } = req.cookies;
  const { content } = req.body;
  await apiPostComment({ access, pk, content });

  return res.redirect(req.headers.referer || "/");
};

// GET "/login"
export const getLogin = async (req, res, next) => {
  const { access } = req.cookies;
  const me = await apiGetMe({ access });

  if (me) return res.redirect("/");

  // 카카오 로그인
  const kakaoParams = {
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: "http://3.38.105.28/kakao-login",
    response_type: "code",
  };
  const kakaoSeacrhParams = new URLSearchParams(kakaoParams).toString(
    kakaoParams
  );

  // 깃허브 로그인
  const githubParams = {
    client_id: process.env.GH_CLIENT_ID,
    redirect_uri: "http://3.38.105.28/github-login",
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

// GET "/logout"
export const getLogout = async (req, res, next) => {
  res.clearCookie("access");
  res.clearCookie("refresh");

  return res.redirect(req.headers.referer || "/");
};

// POST "/login"
export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const { access, refresh } = await apiPostLogin({
    email,
    password,
  });
  if (access && refresh) {
    res.cookie("access", access, cookieOption);
    res.cookie("refresh", refresh, cookieOption);
  } else {
    const error = "로그인에 실패했습니다.";

    return res.render("pages/login", error);
  }

  return res.redirect("/");
};

//
export const getKakakoLogin = async (req, res) => {
  return res.send("<h1>Kakao Login</h1>");
};

export const getGithubLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const { access, refresh } = await apiGithubLogin({ code });
    res.cookie("access", access, cookieOption);
    res.cookie("refresh", refresh, cookieOption);
  } catch (e) {
    console.log(e);
  }

  return res.redirect("/");
};

export const getGoogleLogin = async (req, res) => {
  return res.send("<h1>Google Login</h1>");
};
