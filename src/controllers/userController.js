const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  isValidStatus,
  isValidPassword,
  isValidInputValue,
  isValidEmail,
  isValidRequestBody,
  isValidGender,
  isValidOnlyCharacters,
  isValidPhone,
  isValidCountryCode,
} = require("../validations/validation.js");

const registerUser = async (req, res) => {
  let body = req.body;
  if (!isValidRequestBody(body)) {
    return res.status(400).send({
      status: false,
      message: "Invalid request parameters please provide user details",
    });
  }

  let required = [
    "name",
    "user_name",
    "gender",
    "country_code",
    "mobile",
    "email_id",
    "password",
    "statuss",
  ];
  let keys = Object.keys(body);

  for (let i = 0; i < required.length; i++) {
    if (keys.includes(required[i])) continue;
    else
      return res
        .status(400)
        .send({ status: false, msg: `Required field - ${required[i]}` });
  }

  const {
    name,
    user_name,
    gender,
    country_code,
    mobile,
    email_id,
    password,
    statuss,
  } = req.body;

  if (!isValidOnlyCharacters(name)) {
    return res
      .status(400)
      .send({ status: false, message: "Name can only be alphabetical" });
  }

  const notUniqueUserName = await userModel
    .findOne({ user_name })
    .collation({ locale: "en", strength: 2 });
  if (notUniqueUserName) {
    return res
      .status(400)
      .send({ status: false, message: "User Name already exist" });
  }

  if (!isValidGender(gender)) {
    return res
      .status(400)
      .send({ status: false, message: "Please provide right gender" });
  }

  if (!isValidCountryCode(country_code)) {
    return res
      .status(400)
      .send({ status: false, message: "Please provide right Country Code" });
  }

  if (!isValidPhone(mobile)) {
    return res
      .status(400)
      .send({ status: false, message: "Please provide correct mobile number" });
  }

  if (!isValidInputValue(email_id) || !isValidEmail(email_id)) {
    return res.status(400).send({
      status: false,
      message: "email address should be a valid email address",
    });
  }

  const notUniqueEmail = await userModel
    .findOne({ email_id })
    .collation({ locale: "en", strength: 2 });
  if (notUniqueEmail) {
    return res
      .status(400)
      .send({ status: false, message: "Email address already exist" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).send({
      status: false,
      message:
        "Password should be of min 8 characters, must have atleast 1 number, 1st character should be capital and min 1 special charater",
    });
  }

  const saltRounds = 10;
  let encryptedPassword = bcrypt
    .hash(body.password, saltRounds)
    .then((hash) => {
      console.log(`Hash: ${hash}`);
      return hash;
    });

  body.password = await encryptedPassword;

  if (!isValidStatus(statuss)) {
    return res
      .status(400)
      .send({ status: false, message: "Please provide right Status" });
  }

  let savedData = await userModel.create(body);
  return res.status(201).send({
    status: true,
    message: "User created successfully",
    data: savedData,
  });
};

const loginUser = async (req, res) => {
  try {
    let data = req.body;
    let { email_id, password } = data;

    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "User data is required for login",
      });
    }
    if (!isValidInputValue(email_id) || !isValidEmail(email_id)) {
      return res.status(400).send({
        status: false,
        message: "Email is required and should be a valid email",
      });
    }
    if (!isValidInputValue(password)) {
      return res.status(400).send({
        status: false,
        message: "Password is required ",
      });
    }
    let hash = await userModel
      .findOne({ email_id: email_id })
      .collation({ locale: "en", strength: 2 });
    if (hash == null) {
      return res
        .status(400)
        .send({ status: false, msg: "Email does not exist" });
    }

    let compare = await bcrypt.compare(password, hash.password).then((res) => {
      return res;
    });

    if (!compare) {
      return res.status(401).send({ status: false, msg: "Incorrect Password" });
    }

    const token = jwt.sign(
      {
        user_name: hash.user_name,
        status: hash.status,
      },
      "wowTalent-Assignment",
      { expiresIn: "10hr" }
    );

    res.header("Authorization", "Bearer : " + token);
    return res.status(200).send({
      status: true,
      msg: "User logged in successfully",
      data: { message: ` welcome👽👽 ${hash.name}` },
    });

    return res.status(201).send({ msg: "done" });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

const followUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    let followId = req.body.follow_id;
    
    if (!followId) {
      return res.status(400).send({
        status: false,
      message: "Please provide userid to follow",
    });
  }
  if (userId == followId)
  return res.status(409).send({ status: false, message: " Not Allowed! " });
  
  const followers = await userModel.findOneAndUpdate(
    { _id: followId },
    { $addToSet: { followers: userId },$inc: { followerCount: 1 } },
    { new: true }
  );
  if (!followers)
    return res
      .status(404)
      .send({ status: false, message: "follower profile doesn't exists" });

  const followings = await userModel.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { following: followId },$inc: { followingCount: 1 } },
    { new: true }
  );
  if (!followings)
    return res
      .status(404)
      .send({ status: false, message: "userId  doesn't exists" });

  return res.status(200).send({ msg: "Followed" });

  }
  catch (err) {
      res.status(500).send({ status: false, message: 'err.Message' })
  }
}

const unfollowUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    let unFollowId = req.body.unFollow_id;
    
    if (!unFollowId) {
      return res.status(400).send({
        status: false,
      message: "Please provide userid to follow",
    });
  }
  if (userId == unFollowId)
    return res.status(409).send({ status: false, message: " Not Allowed! " });
    
    const followList = await userModel.findOne({ _id: userId })
    let followerArr = followList.following
    if (!followerArr.includes(unFollowId) || !followerArr.length) {
      return res.status(400).send({
        status: false,
        message: "You are not following this user"
      })
    }

    const newArr = [...followerArr].filter(f => f !== unFollowId );
    followList.following = newArr
    followList.followingCount = followList.followingCount - 1
    // console.log(followList);
    followList.save()
    // console.log(followList)


  return res.status(200).send({msg: "Unfollow done"})
    
  }
  catch (err) {
    res.status(500).send({ status: false, message: 'err.Message' })
}
}

const updateUser = async (req, res) => {
  try {
    let userId = req.params.userId;

    let userDetail = await userModel.findOne({ _id: userId })
    if (!userDetail) {
      return res
        .status(400)
        .send({ status: false, message: "User does not exist" });
    }

    let data = req.body;

    if (data["user_name"]) {
      let user = await userModel.findOne({ user_name: data["user_name"] })
      if (user) {
        return res.status(400).send({ status: false, message: "User Name already exist" })
      }
    }
    if (data["email_id"]) {
      return res
        .status(400)
        .send({ status: false, message: "Email can't be updated" });
    }
    if (data["password"]) {
      return res
        .status(400)
        .send({ status: false, message: "Password can't be updated" });
    }

    const userUpdate = await userModel.findOneAndUpdate({ _id: userId }, data, {
      new: true,
    });
    return res
      .status(200)
      .send({ status: true, message: "Updated", data: userUpdate });
  }
  catch (err) {
    res.status(500).send({ status: false, message: 'err.Message' })
}
};


module.exports = { registerUser, loginUser, followUser, unfollowUser, updateUser };
