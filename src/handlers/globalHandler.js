import { apiGetMe, apiGithubLogin, apiPostLogin } from "../api";

require("dotenv").config();

const cookieOption = {
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
};

export const getHome = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });

  return res.render("pages/home", me ? me : null);
};

export const getMe = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });

  return res.render("pages/me", me ? me : null);
};

export const getWrite = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });

  return res.render("pages/write", me ? me : null);
};

export const postWrite = async (req, res, next) => {
  return res.end();
};

export const getDetail = async (req, res, next) => {
  const { csrftoken, access } = req.cookies;
  const me = await apiGetMe({ csrftoken, access });
  const pk = req.params.pk;

  return res.render("pages/detail", me ? { pk, ...me } : null);
};

export const postComment = async (req, res, next) => {
  const pk = req.params.pk;
  return res.end();
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

export const getLogout = async (req, res, next) => {
  res.clearCookie("access");
  res.clearCookie("refresh");
  return res.redirect(req.headers.referer || "/");
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const { csrftoken } = req.cookies;
  const { access, refresh } = await apiPostLogin({
    email,
    password,
    csrftoken,
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

export const getKakakoLogin = async (req, res) => {
  return res.render("pages/kakaoLogin");
};

export const getGithubLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const { csrftoken } = req.cookies;
    const { access, refresh } = await apiGithubLogin({ code, csrftoken });

    res.cookie("access", access, cookieOption);
    res.cookie("refresh", refresh, cookieOption);
  } catch (e) {
    console.log(e);
  }
  return res.redirect("/");
};

export const getGoogleLogin = async (req, res) => {
  return res.render("pages/googleLogin");
};
