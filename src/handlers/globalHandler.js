export const handleHome = (req, res, next) => {
  return res.render("pages/home");
};

export const handleLogin = (req, res, next) => {
  return res.render("pages/login");
};

export const handleMe = (req, res, next) => {
  return res.render("pages/me");
};

export const handleWrite = (req, res, next) => {
  return res.render("pages/write");
};

export const handleDetail = (req, res, next) => {
  return res.render("pages/detail");
};
