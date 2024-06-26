const userService = require('../../service/v1/user-service');

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  const { username } = req.user;
  try {
    const result = await userService.get(username);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { username } = req.user;
  const request = req.body;
  request.username = username;

  try {
    const result = await userService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logout(req.user.username);
    res.status(200).json({
      data: 'OK',
    });
  } catch (e) {
    next(e);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const result = await userService.createAdmin(req.body);
    res.status(201).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  get,
  update,
  logout,
  createAdmin,
};
