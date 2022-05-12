const firebase = require("firebase/app");
const multer = require('multer');


const { ref, uploadBytes, getDownloadURL, getStorage } = require("firebase/storage");

const { firebaseConfig } = require("../../configs/firebase/config");
const AppError = require("../../utils/Errors/Error");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImages = upload.array('multi-files');

const getPhotoURL = async (file) =>
  new Promise((res, rej) => {
    try {
      firebase.initializeApp(firebaseConfig);
      const timestamp = Date.now();
      const name = file.originalname.split(".")[0];
      const type = file.originalname.split(".")[1];
      const fileName = `${name}_${timestamp}.${type}`;
      const storageRef = ref(getStorage(), fileName);
      uploadBytes(storageRef, file.buffer).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          res(downloadURL);
        });
      });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });

exports.getPhotosURLsFirebase = async (req, res) => {
  try {
    const urls = await Promise.all(req.files.map((file) => getPhotoURL(file)));
    res.status(200).json({ photos: urls });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
