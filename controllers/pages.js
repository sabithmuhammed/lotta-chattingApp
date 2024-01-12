const initialRender = (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error.message);
  }
};


const registerUser = (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({status:"success"})
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  initialRender,
  registerUser,
};
