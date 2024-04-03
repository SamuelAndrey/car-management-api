const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const { validate } = require('../../validation/v1/validation');
const {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} = require('../../validation/v1/user-validation');
const { prismaClient } = require('../../application/database');
const { ResponseError } = require('../../error/response-error');

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, 'Username already exist');
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, 'Username or password wrong');
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Username or password wrong');
  }

  const token = uuid().toString();
  return prismaClient.user.update({
    data: {
      token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const get = async (username) => {
  const validatedUsername = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: validatedUsername,
    },
    select: {
      username: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'user is not found');
  }

  return user;
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, 'user is not found');
  }

  const data = {};

  if (user.name) {
    data.name = user.name;
  }

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  if (user.email) {
    data.email = user.email;
  }

  return prismaClient.user.update({
    where: {
      username: user.username,
    },
    data,
    select: {
      username: true,
      name: true,
      email: true,
    },
  });
};

const logout = async (username) => {
  const validatedUsername = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: validatedUsername,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'user is not found');
  }

  return prismaClient.user.update({
    where: {
      username: validatedUsername,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

const createAdmin = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, 'Username already exist');
  }

  user.role = 'admin';
  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

module.exports = {
  register,
  login,
  get,
  update,
  logout,
  createAdmin,
};
