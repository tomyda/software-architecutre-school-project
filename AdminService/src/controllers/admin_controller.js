const adminService = require("../services/admin_service");

const registerAdmin = async (req, res) => {
  try {
    let result = await adminService.registerAdmin(req, res);
    res.status(200).json({ new_password: result });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const registerVaccinator = async (req, res) => {
  try {
    let result = await adminService.registerVaccinator(req, res);
    res.status(200).json({ new_password: result });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const logIn = async (req, res) => {
  try {
    let token = await adminService.logIn(req, req.query);
    res.status(200).json(token);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const logOut = async (req, res) => {
  try {
    const accessToken = req.header("auth-token");
    if (!accessToken) {
      return res
        .status(401)
        .json({
          message: "Invalid Token (when verify, failed): no token received",
          status: 401,
        });
    }
    await adminService.logOut(req, accessToken);
    res.status(200).json();
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  registerAdmin,
  registerVaccinator,
  logIn,
  logOut,
};
