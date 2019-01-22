const fs = require('fs');
const _ = require('lodash');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'tahsin-cloudinary-storage',
  api_key: '653833988154654',
  api_secret: '1J3q6ijzpOxcjRQh_nlAf7-L0-w',
});

exports.uploadMedia = (req, res, next) => {
  const newURLs = [];
  req.files.forEach((image) => {
    cloudinary.v2.uploader.upload(image.path, (uploadError, result) => {
      if (!uploadError) {
        // console.log(result);
        fs.unlinkSync(image.path);
        newURLs.push(_.pick(result, ['url', 'public_id']));
        if (newURLs.length === req.files.length) {
          return res.status(200).send(newURLs);
        }
      }
    });
  });
};
