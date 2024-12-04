// const User = require("../models/users");
// const sendEmail = require("../utils/emailService");
// const mongoose = require("mongoose");

// exports.saveUser = async (req, res) => {
//     console.log("Saving user");
//   // Validate request body to ensure all required fields are present and valid
//   let { name, email, phoneNumber, intrests, projectRequirements, date } =
//     req.body;

   

//   // Basic validation
//   const missingFields = [];
//   if (!name) missingFields.push("name");
//   if (!email) missingFields.push("email");
//   if (!phoneNumber) missingFields.push("phoneNumber");
//   if (!intrests) missingFields.push("intrests");
//   if (!projectRequirements) missingFields.push("projectRequirements");
//   if (!date) missingFields.push("date");
  
//   if (missingFields.length) {
//     return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
//   }

//   // Saving user in database
//   try {
//     console.log("initiating user saving in database : ",name, email, phoneNumber, intrests, projectRequirements, date )
   
//     const user = new User({
//       _id: new mongoose.Types.ObjectId(),
//       name,
//       email,
//       phoneNumber,
//       intrests,
//       projectRequirements,
//       date,
//     });

//     console.log("USER:::",user);

//     // Sending mail to the new user who have asked for the query
//      await sendEmail(
//       email,
//       "",
//       "Welcome to Anarish Innovation - We are excited to Connect!",
//       `
//       Hi ${name} <br/>
//       Welcome to Our Platform! We're thrilled to have the opportunity to work with you! <br/>
//       We have received your inquiry and one of our team members will get in touch with you soon to discuss your needs in more detail.
//       <br/><br/>
//       Warm Regards,<br/> Team Anarish
//     `
//     );

//     // Sending mainlto the anarish of new user who have asked for the query
//    await sendEmail(
//       "kumartech0102@gmail.com",
//       "kumargorav2000@gmail.com",
//       "New Query from Website",
//       `
//         Following user has tried to contact Anarish on ${date} : <br/><br/>
//         <p><b>Name:</b> ${name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Phone Number:</b> ${phoneNumber}</p>
//         <p><b>Interested In:</b> ${intrests}</p>
//         <p><b>Message Shared:</b> ${projectRequirements}</p>
//       `
//     );

    
//     await user.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to save user", error: error });
//   }
// };











const User = require("../models/users");
const sendEmail = require("../utils/emailService");
const mongoose = require("mongoose");

exports.saveUser = async (req, res) => {
  console.log("Saving user");

  // Extracting data from the request body
  let { name, email, phoneNumber, intrests, projectRequirements, date } = req.body;

  // Basic validation for required fields
  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!phoneNumber) missingFields.push("phoneNumber");
  if (!intrests) missingFields.push("intrests");
  if (!projectRequirements) missingFields.push("projectRequirements");
  if (!date) missingFields.push("date");

  if (missingFields.length) {
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
  }


  try {
    // Create a new user object
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      phoneNumber,
      intrests,
      projectRequirements,
      date,
    });

    console.log("User to save:", user);

    // Define tasks that will run concurrently
    const tasks = [
      // Task 1: Send email to the admin
      sendEmail(
        "kumartech0102@gmail.com",
        "kumargorav2000@gmail.com",
        "New Query from Website",
        `
          Following user has tried to contact Anarish on ${date}: <br/><br/>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone Number:</b> ${phoneNumber}</p>
          <p><b>Interested In:</b> ${intrests}</p>
          <p><b>Message Shared:</b> ${projectRequirements}</p>
        `
      ),
      // Task 2: Send thank you email to the user
      sendEmail(
        email,
        "",
        "Welcome to Anarish Innovation - We are excited to Connect!",
        `
          Hi ${name}, <br/>
          Welcome to Our Platform! We're thrilled to have the opportunity to work with you! <br/>
          We have received your inquiry and one of our team members will get in touch with you soon to discuss your needs in more detail.
          <br/><br/>
          Warm Regards,<br/> Team Anarish
        `
      ),
      // Task 3: Save user data to the database
      user.save(),
    ];

    // Wait for all tasks to complete
    await Promise.all(tasks);

    // Send success response after all tasks are complete
    res.status(201).json({ message: "User created successfully and emails sent" });
  } catch (error) {
    // If any task fails, return an error
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Failed to save user or send emails", error: error.message });
  }
};


exports.getUser = async (req, resp) => {
    User.find()
      .then((result) => {
        console.log(result);
        resp.status(200).json({
          message: "User fetched successfully",
          users: result,
        });
      })
      .catch((err) => resp.status(500).json({ error: err.message }));
  }

exports.getUserById = async (req, resp) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }
    resp.status(200).json({
      message: `User with id : ${id} fetched successfullt`,
      user,
    });
  } catch (error) {
    resp.status(500).json({ error: "Failed to retrieve user" });
  }
};

exports.updateUser = async (req, resp) => {
    const id = req.params.id;
    User.findById(id)
      .then((result) => {
        if (result != null) {
          User.update({ _id: id }, { $set: req.body });
        } else {
          resp.status(500).json({
            message: `No user present with this id`,
          });
        }
      })
      .catch((err) => resp.status(500).json({ error: err.message }));
  }

exports.deleteUser = async (req, resp) => {
    const id = req.params.id;
    User.findById(id)
      .then((result) => {
        if (result != null) {
          User.remove({ _id: id });
        } else {
          resp.status(500).json({
            message: `No user present with this id`,
          });
        }
      })
      .catch((err) => resp.status(500).json({ error: err.message }));
  }