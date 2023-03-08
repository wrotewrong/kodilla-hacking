const Photo = require('../models/photo.model');
const Voter = require('../models/voter.model');
const validate = require('../utils/validate');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;
    const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
    const fileExt = fileName.split('.').slice(-1)[0];
    const validExtenstions = ['gif', 'jpg', 'png'];

    if (
      title &&
      author &&
      email &&
      file &&
      validExtenstions.includes(fileExt)
    ) {
      // if fields are not empty and file extension is correct...

      const newPhoto = new Photo({
        title: validate.validateText(title),
        author: validate.validateText(author),
        email: validate.validateEmail(email),
        src: fileName,
        votes: 0,
      });
      await newPhoto.save(); // ...save new photo in DB
      res.json(newPhoto);
    } else {
      throw new Error('Wrong input!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {
  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** VOTE FOR PHOTO ********/

// exports.vote = async (req, res) => {
//   try {
//     const photoToUpdate = await Photo.findOne({ _id: req.params.id });
//     if (!photoToUpdate) res.status(404).json({ message: 'Not found' });
//     else {
//       photoToUpdate.votes++;
//       photoToUpdate.save();
//       res.send({ message: 'OK' });
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

exports.vote = async (req, res) => {
  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if (!photoToUpdate) {
      res.status(404).json({ message: 'Not found' });
    }

    const voter = await Voter.findOne({ user: req.ip });

    if (!voter) {
      const newVot = new Voter({
        user: req.ip,
        votes: [req.params.id],
      });
      await newVot.save();
      photoToUpdate.votes++;
      await photoToUpdate.save();
      res.send({ message: 'OK' });
    } else {
      if (voter.votes.includes(req.params.id)) {
        res.status(500).json({ message: 'Already voted for this photo' });
      } else {
        voter.votes.push(req.params.id);
        await voter.save();
        photoToUpdate.votes++;
        await photoToUpdate.save();
        res.send({ message: 'OK' });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
