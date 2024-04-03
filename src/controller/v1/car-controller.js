const fs = require('fs');
const path = require('path');
const carService = require('../../service/v1/car-service');
const { uploadDirectory } = require('../../middleware/v1/upload-middleware');
const { fileUploadPath } = require('../../utils/path');

const fileToURL = (req, filename) => `${req.protocol}://${req.get('host')}${fileUploadPath}${filename}`;

const create = async (req, res, next) => {
  try {
    const result = await carService.create(req);
    result.image = fileToURL(req, result.image);
    res.status(201).json({
      data: result,
    });
  } catch (e) {
    if (req.file) {
      const filePath = path.join(uploadDirectory, req.file.filename);
      fs.unlinkSync(filePath);
    }
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await carService.update(req);
    result.image = fileToURL(req, result.image);
    res.status(201).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const cars = await carService.list();
    const formattedCars = cars.map((car) => ({
      id: car.id,
      name: car.name,
      cost_per_day: car.cost_per_day,
      size: car.size,
      image: fileToURL(req, car.image),
      updated_at: car.updated_at,
    }));
    res.status(200).json({
      data: formattedCars,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const cars = await carService.get(req.params.carId);
    const formattedCars = cars.map((car) => ({
      id: car.id,
      name: car.name,
      cost_per_day: car.cost_per_day,
      size: car.size,
      image: `${req.protocol}://${req.get('host')}${car.image}`,
      updated_at: car.updated_at,
    }));
    res.status(200).json({
      data: formattedCars,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await carService.remove(req.params.carId);
    res.status(200).json({
      data: 'OK',
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
  list,
  update,
  remove,
  get,
};
