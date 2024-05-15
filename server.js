const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "192.168.1.213",
    port: 3306,
    user: "amir",
    password: "@mirc@nteetu!",
    database: "sourcepro",
  },
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

///////////////////////////TENDERS///////////////////

//Create a new tender
app.post("/api/tenders", async (req, res) => {
  try {
    const newTender = req.body;

    // Use Knex to perform the insertion
    const [insertedTender] = await knex("tenders").insert(newTender);

    res.status(201).json({
      message: "Tender created successfully",
      id: insertedTender,
    });
  } catch (err) {
    console.error("Error creating tender:", err);
    res.status(500).json({ error: "Failed to create tender" });
  }
});

// READ ALL tenders --  with pagination, sorting, and filtering
app.get("/api/tenders", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  console.log(req.query);

  try {
    const results = await knex("tenders")
      .select("*")
      .orderBy(req.query.sortBy || "id", req.query.sortOrder || "ASC")
      .where((builder) => {
        if (req.query.location) {
          builder.where("location", req.query.location);
        }
      })
      .limit(limit)
      .offset(offset);

    console.log(results);

    res.json(results);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});

// READ a single tender by ID
app.get("/api/tenders/:id", async (req, res) => {
  const tenderId = req.params.id;

  try {
    const tender = await knex("tenders")
      .select("*")
      .where("id", tenderId)
      .first();

    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    res.json(tender);
  } catch (error) {
    console.error("Error fetching tender:", error);
    res.status(500).json({ error: "Failed to fetch tender" });
  }
});

// UPDATE a specific tender by ID
app.patch("/api/tenders/:id", async (req, res) => {
  const tenderId = req.params.id;
  const updates = req.body;

  console.log(typeof updates);
  console.log(updates);

  // Validate if there are any updates to apply
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    // Construct SQL query to update tender fields based on provided updates
    const updateFields = [];
    const values = [];

    for (const key in updates) {
      updateFields.push(`${key} = ?`);
      values.push(updates[key]);
    }

    console.log("values...");
    console.log(values);
    console.log("updates...");
    console.log(updates);
    console.log("updateFields...");
    console.log(updateFields);

    const updateQuery = knex("tenders").where({ id: tenderId }).update(updates);

    console.log("updateQuery...");
    console.log(updateQuery);

    // Execute the SQL query to update the tender
    const result = await updateQuery;

    console.log("result...");
    console.log(result);

    if (result === 0) {
      return res.status(404).json({ error: "Tender not found" });
    }

    return res.json({ message: "Tender updated successfully" });
  } catch (err) {
    console.error("Error updating tender:", err);
    return res.status(500).json({ error: "Failed to update tender" });
  }
});

app.delete("/api/tenders/:id", async (req, res) => {
  const tenderId = req.params.id;

  try {
    // Construct SQL query to update tender_status to NULL
    const updateQuery = knex("tenders")
      .where({ id: tenderId })
      .update({ tender_status: "deleted" });

    // Execute the SQL query to update the tender_status
    const result = await updateQuery;

    if (result === 0) {
      return res.status(404).json({ error: "Tender not found" });
    }

    return res.json({ message: "Tender deleted successfully" });
  } catch (err) {
    console.error("Error updating tender status:", err);
    return res
      .status(500)
      .json({ error: "Failed to update tender status", message: err });
  }
});

///////////////////////////End Of TENDERS///////////////////

///////////////////////////USERS/////////////////////////

//Create a user
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;

    // Use Knex to perform the insertion
    const [insertedUser] = await knex("users").insert(newUser);

    res.status(201).json({
      message: "User created successfully",
      id: insertedUser,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/api/users/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email already exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    await knex('users').insert({ email, password_hash: passwordHash });

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ ALL users --  with pagination, sorting, and filtering
app.get("/api/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const results = await knex("users")
      .select("*")
      .orderBy(req.query.sortBy || "id", req.query.sortOrder || "ASC")
      .where((builder) => {
        if (req.query.location) {
          builder.where("location", req.query.location);
        }
      })
      .limit(limit)
      .offset(offset);

    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// READ a single user by ID
app.get("/api/users/:id", async (req, res) => {

  const userId = req.params.id;

  try {
    const user = await knex("users")
      .select("*")
      .where("id", userId)
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// UPDATE a specific user by ID
app.patch("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  // Validate if there are any updates to apply
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    // Construct SQL query to update user fields based on provided updates
    const updateFields = [];
    const values = [];

    for (const key in updates) {
      updateFields.push(`${key} = ?`);
      values.push(updates[key]);
    }

    const updateQuery = knex("users").where({ id: userId }).update(updates);

    // Execute the SQL query to update the user
    const result = await updateQuery;

    if (result === 0) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Construct SQL query to update user_status to NULL
    const updateQuery = knex("users")
      .where({ id: userId })
      .update({ user_status: "deleted" });

    // Execute the SQL query to update the user_status
    const result = await updateQuery;

    if (result === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error updating user status:", err);
    return res
      .status(500)
      .json({ error: "Failed to update user status", message: err });
  }
});


///////////////////////////End Of BIDS/////////////////////////

///////////////////////////Users///////////////////////////////


// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const newbid = req.body;

    // Use Knex to perform the insertion
    const [insertedbid] = await knex("bids").insert(newbid);

    res.status(201).json({
      message: "Bid created successfully",
      id: insertedbid,
    });
  } catch (err) {
    console.error("Error creating bid:", err);
    res.status(500).json({ error: "Failed to create bid" });
  }
});

// Retrieve all users
app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific user by ID
app.get("/api/users/:userId", (req, res) => {
  const userId = req.params.userId;
  connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Partially update a specific user by ID
app.patch("/api/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const updatedFields = req.body;
  connection.query(
    "UPDATE users SET ? WHERE user_id = ?",
    [updatedFields, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Failed to update user" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Delete a specific user by ID
app.delete("/api/users/:userId", (req, res) => {
  const userId = req.params.userId;
  connection.query(
    "DELETE FROM users WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Failed to delete user" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({ message: "User deleted successfully" });
    }
  );
});

///////////////////////////End Of Users/////////////////////////

///////////////////////////Companies////////////////////////////

app.get("/api/companies", (req, res) => {
  connection.query("SELECT * FROM companies", (err, results) => {
    if (err) {
      console.error("Error fetching companies:", err);
      res.status(500).json({ error: "Failed to fetch companies" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  connection.query(
    "SELECT * FROM companies WHERE company_id = ?",
    [companyId],
    (err, results) => {
      if (err) {
        console.error("Error fetching company:", err);
        res.status(500).json({ error: "Failed to fetch company" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

app.post("/api/companies", (req, res) => {
  const newCompany = req.body;
  connection.query(
    "INSERT INTO companies SET ?",
    newCompany,
    (err, results) => {
      if (err) {
        console.error("Error creating company:", err);
        res.status(500).json({ error: "Failed to create company" });
        return;
      }
      res.status(201).json({
        message: "Company created successfully",
        companyId: results.insertId,
      });
    }
  );
});

app.patch("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE companies SET ? WHERE company_id = ?",
    [updatedFields, companyId],
    (err, results) => {
      if (err) {
        console.error("Error updating company:", err);
        res.status(500).json({ error: "Failed to update company" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.json({ message: "Company updated successfully" });
    }
  );
});

app.delete("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  connection.query(
    "DELETE FROM companies WHERE company_id = ?",
    [companyId],
    (err, results) => {
      if (err) {
        console.error("Error deleting company:", err);
        res.status(500).json({ error: "Failed to delete company" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.json({ message: "Company deleted successfully" });
    }
  );
});

///////////////////////////End Of Companies/////////////////////////

///////////////////////////Tender Contact Persons/////////////////////////

app.get("/api/tender-contact", (req, res) => {
  connection.query("SELECT * FROM tender_contact_persons", (err, results) => {
    if (err) {
      console.error("Error fetching tender contact persons:", err);
      res.status(500).json({ error: "Failed to fetch tender contact persons" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/tender-contact/:id", (req, res) => {
  const contactId = req.params.id;
  connection.query(
    "SELECT * FROM tender_contact_persons WHERE tender_contact_id = ?",
    [contactId],
    (err, results) => {
      if (err) {
        console.error("Error fetching tender contact person:", err);
        res
          .status(500)
          .json({ error: "Failed to fetch tender contact person" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Tender contact person not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

app.post("/api/tender-contact", (req, res) => {
  const newContactPerson = req.body;
  connection.query(
    "INSERT INTO tender_contact_persons SET ?",
    newContactPerson,
    (err, results) => {
      if (err) {
        console.error("Error creating tender contact person:", err);
        res
          .status(500)
          .json({ error: "Failed to create tender contact person" });
        return;
      }
      res.status(201).json({
        message: "Tender contact person created successfully",
        contactId: results.insertId,
      });
    }
  );
});

app.patch("/api/tender-contact/:id", (req, res) => {
  const contactId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE tender_contact_persons SET ? WHERE tender_contact_id = ?",
    [updatedFields, contactId],
    (err, results) => {
      if (err) {
        console.error("Error updating tender contact person:", err);
        res
          .status(500)
          .json({ error: "Failed to update tender contact person" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Tender contact person not found" });
        return;
      }
      res.json({ message: "Tender contact person updated successfully" });
    }
  );
});

app.delete("/api/tender-contact/:id", (req, res) => {
  const contactId = req.params.id;
  connection.query(
    "DELETE FROM tender_contact_persons WHERE tender_contact_id = ?",
    [contactId],
    (err, results) => {
      if (err) {
        console.error("Error deleting tender contact person:", err);
        res
          .status(500)
          .json({ error: "Failed to delete tender contact person" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Tender contact person not found" });
        return;
      }
      res.json({ message: "Tender contact person deleted successfully" });
    }
  );
});

///////////////////////////End Of Tender Contact Persons/////////////////

///////////////////////////Tender Invitations/////////////////////////

// Retrieve all tender invitations
app.get("/api/tender-invitations", (req, res) => {
  connection.query("SELECT * FROM tender_invitations", (err, results) => {
    if (err) {
      console.error("Error fetching tender invitations:", err);
      res.status(500).json({ error: "Failed to fetch tender invitations" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific tender invitation by ID
app.get("/api/tender-invitations/:id", (req, res) => {
  const invitationId = req.params.id;
  connection.query(
    "SELECT * FROM tender_invitations WHERE invitation_id = ?",
    [invitationId],
    (err, results) => {
      if (err) {
        console.error("Error fetching tender invitation:", err);
        res.status(500).json({ error: "Failed to fetch tender invitation" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Tender invitation not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Create a new tender invitation
app.post("/api/tender-invitations", (req, res) => {
  const newInvitation = req.body;
  connection.query(
    "INSERT INTO tender_invitations SET ?",
    newInvitation,
    (err, results) => {
      if (err) {
        console.error("Error creating tender invitation:", err);
        res.status(500).json({ error: "Failed to create tender invitation" });
        return;
      }
      res.status(201).json({
        message: "Tender invitation created successfully",
        invitationId: results.insertId,
      });
    }
  );
});

// Partially update a specific tender invitation by ID
app.patch("/api/tender-invitations/:id", (req, res) => {
  const invitationId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE tender_invitations SET ? WHERE invitation_id = ?",
    [updatedFields, invitationId],
    (err, results) => {
      if (err) {
        console.error("Error updating tender invitation:", err);
        res.status(500).json({ error: "Failed to update tender invitation" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Tender invitation not found" });
        return;
      }
      res.json({ message: "Tender invitation updated successfully" });
    }
  );
});

// Delete a specific tender invitation by ID
app.delete("/api/tender-invitations/:id", (req, res) => {
  const invitationId = req.params.id;
  connection.query(
    "DELETE FROM tender_invitations WHERE invitation_id = ?",
    [invitationId],
    (err, results) => {
      if (err) {
        console.error("Error deleting tender invitation:", err);
        res.status(500).json({ error: "Failed to delete tender invitation" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Tender invitation not found" });
        return;
      }
      res.json({ message: "Tender invitation deleted successfully" });
    }
  );
});

///////////////////////////End Of Tender Invitations/////////////////////////

///////////////////////////Private Messages/////////////////////////////////

// Retrieve all private messages
app.get("/api/messages", (req, res) => {
  connection.query("SELECT * FROM private_messages", (err, results) => {
    if (err) {
      console.error("Error fetching private messages:", err);
      res.status(500).json({ error: "Failed to fetch private messages" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific private message by ID
app.get("/api/messages/:id", (req, res) => {
  const messageId = req.params.id;
  connection.query(
    "SELECT * FROM private_messages WHERE message_id = ?",
    [messageId],
    (err, results) => {
      if (err) {
        console.error("Error fetching private message:", err);
        res.status(500).json({ error: "Failed to fetch private message" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Private message not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Create a new private message
app.post("/api/messages", (req, res) => {
  const newMessage = req.body;
  connection.query(
    "INSERT INTO private_messages SET ?",
    newMessage,
    (err, results) => {
      if (err) {
        console.error("Error creating private message:", err);
        res.status(500).json({ error: "Failed to create private message" });
        return;
      }
      res.status(201).json({
        message: "Private message created successfully",
        messageId: results.insertId,
      });
    }
  );
});

// Partially update a specific private message by ID
app.patch("/api/messages/:id", (req, res) => {
  const messageId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE private_messages SET ? WHERE message_id = ?",
    [updatedFields, messageId],
    (err, results) => {
      if (err) {
        console.error("Error updating private message:", err);
        res.status(500).json({ error: "Failed to update private message" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Private message not found" });
        return;
      }
      res.json({ message: "Private message updated successfully" });
    }
  );
});

// Delete a specific private message by ID
app.delete("/api/messages/:id", (req, res) => {
  const messageId = req.params.id;
  connection.query(
    "DELETE FROM private_messages WHERE message_id = ?",
    [messageId],
    (err, results) => {
      if (err) {
        console.error("Error deleting private message:", err);
        res.status(500).json({ error: "Failed to delete private message" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Private message not found" });
        return;
      }
      res.json({ message: "Private message deleted successfully" });
    }
  );
});

///////////////////////////Bid Attachments/////////////////////////////////

// Retrieve all bid attachments
app.get("/api/bid_attachments", (req, res) => {
  connection.query("SELECT * FROM bid_attachments", (err, results) => {
    if (err) {
      console.error("Error fetching bid attachments:", err);
      res.status(500).json({ error: "Failed to fetch bid attachments" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific bid attachment by ID
app.get("/api/bid_attachments/:id", (req, res) => {
  const attachmentId = req.params.id;
  connection.query(
    "SELECT * FROM bid_attachments WHERE attachment_id = ?",
    [attachmentId],
    (err, results) => {
      if (err) {
        console.error("Error fetching bid attachment:", err);
        res.status(500).json({ error: "Failed to fetch bid attachment" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Bid attachment not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Create a new bid attachment
app.post("/api/bid_attachments", (req, res) => {
  const newAttachment = req.body;
  connection.query(
    "INSERT INTO bid_attachments SET ?",
    newAttachment,
    (err, results) => {
      if (err) {
        console.error("Error creating bid attachment:", err);
        res.status(500).json({ error: "Failed to create bid attachment" });
        return;
      }
      res.status(201).json({
        message: "Bid attachment created successfully",
        attachmentId: results.insertId,
      });
    }
  );
});

// Partially update a specific bid attachment by ID
app.patch("/api/bid_attachments/:id", (req, res) => {
  const attachmentId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE bid_attachments SET ? WHERE attachment_id = ?",
    [updatedFields, attachmentId],
    (err, results) => {
      if (err) {
        console.error("Error updating bid attachment:", err);
        res.status(500).json({ error: "Failed to update bid attachment" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Bid attachment not found" });
        return;
      }
      res.json({ message: "Bid attachment updated successfully" });
    }
  );
});

// Delete a specific bid attachment by ID
app.delete("/api/bid_attachments/:id", (req, res) => {
  const attachmentId = req.params.id;
  connection.query(
    "DELETE FROM bid_attachments WHERE attachment_id = ?",
    [attachmentId],
    (err, results) => {
      if (err) {
        console.error("Error deleting bid attachment:", err);
        res.status(500).json({ error: "Failed to delete bid attachment" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Bid attachment not found" });
        return;
      }
      res.json({ message: "Bid attachment deleted successfully" });
    }
  );
});

///////////////////////////Notifications/////////////////////////////////

// Retrieve all notifications
app.get("/api/notifications", (req, res) => {
  connection.query("SELECT * FROM notifications", (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Failed to fetch notifications" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific notification by ID
app.get("/api/notifications/:id", (req, res) => {
  const notificationId = req.params.id;
  connection.query(
    "SELECT * FROM notifications WHERE notification_id = ?",
    [notificationId],
    (err, results) => {
      if (err) {
        console.error("Error fetching notification:", err);
        res.status(500).json({ error: "Failed to fetch notification" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Create a new notification
app.post("/api/notifications", (req, res) => {
  const newNotification = req.body;
  connection.query(
    "INSERT INTO notifications SET ?",
    newNotification,
    (err, results) => {
      if (err) {
        console.error("Error creating notification:", err);
        res.status(500).json({ error: "Failed to create notification" });
        return;
      }
      res.status(201).json({
        message: "Notification created successfully",
        notificationId: results.insertId,
      });
    }
  );
});

// Partially update a specific notification by ID
app.patch("/api/notifications/:id", (req, res) => {
  const notificationId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE notifications SET ? WHERE notification_id = ?",
    [updatedFields, notificationId],
    (err, results) => {
      if (err) {
        console.error("Error updating notification:", err);
        res.status(500).json({ error: "Failed to update notification" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }
      res.json({ message: "Notification updated successfully" });
    }
  );
});

// Delete a specific notification by ID
app.delete("/api/notifications/:id", (req, res) => {
  const notificationId = req.params.id;
  connection.query(
    "DELETE FROM notifications WHERE notification_id = ?",
    [notificationId],
    (err, results) => {
      if (err) {
        console.error("Error deleting notification:", err);
        res.status(500).json({ error: "Failed to delete notification" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }
      res.json({ message: "Notification deleted successfully" });
    }
  );
});

///////////////////////////FAQs/////////////////////////////////

// Retrieve all FAQs
app.get("/api/faqs", (req, res) => {
  connection.query("SELECT * FROM faqs", (err, results) => {
    if (err) {
      console.error("Error fetching FAQs:", err);
      res.status(500).json({ error: "Failed to fetch FAQs" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific FAQ by ID
app.get("/api/faqs/:id", (req, res) => {
  const faqId = req.params.id;
  connection.query(
    "SELECT * FROM faqs WHERE faq_id = ?",
    [faqId],
    (err, results) => {
      if (err) {
        console.error("Error fetching FAQ:", err);
        res.status(500).json({ error: "Failed to fetch FAQ" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "FAQ not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Create a new FAQ
app.post("/api/faqs", (req, res) => {
  const newFAQ = req.body;
  connection.query("INSERT INTO faqs SET ?", newFAQ, (err, results) => {
    if (err) {
      console.error("Error creating FAQ:", err);
      res.status(500).json({ error: "Failed to create FAQ" });
      return;
    }
    res
      .status(201)
      .json({ message: "FAQ created successfully", faqId: results.insertId });
  });
});

// Partially update a specific FAQ by ID
app.patch("/api/faqs/:id", (req, res) => {
  const faqId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE faqs SET ? WHERE faq_id = ?",
    [updatedFields, faqId],
    (err, results) => {
      if (err) {
        console.error("Error updating FAQ:", err);
        res.status(500).json({ error: "Failed to update FAQ" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "FAQ not found" });
        return;
      }
      res.json({ message: "FAQ updated successfully" });
    }
  );
});

// Delete a specific FAQ by ID
app.delete("/api/faqs/:id", (req, res) => {
  const faqId = req.params.id;
  connection.query(
    "DELETE FROM faqs WHERE faq_id = ?",
    [faqId],
    (err, results) => {
      if (err) {
        console.error("Error deleting FAQ:", err);
        res.status(500).json({ error: "Failed to delete FAQ" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "FAQ not found" });
        return;
      }
      res.json({ message: "FAQ deleted successfully" });
    }
  );
});

///////////////////////////Audit Logs/////////////////////////////////

// Retrieve all audit logs
app.get("/api/audit-logs", (req, res) => {
  connection.query("SELECT * FROM audit_logs", (err, results) => {
    if (err) {
      console.error("Error fetching audit logs:", err);
      res.status(500).json({ error: "Failed to fetch audit logs" });
      return;
    }
    res.json(results);
  });
});

// Retrieve a specific audit log by ID
app.get("/api/audit-logs/:id", (req, res) => {
  const logId = req.params.id;
  connection.query(
    "SELECT * FROM audit_logs WHERE log_id = ?",
    [logId],
    (err, results) => {
      if (err) {
        console.error("Error fetching audit log:", err);
        res.status(500).json({ error: "Failed to fetch audit log" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Audit log not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Create a new audit log
app.post("/api/audit-logs", (req, res) => {
  const newAuditLog = req.body;
  connection.query(
    "INSERT INTO audit_logs SET ?",
    newAuditLog,
    (err, results) => {
      if (err) {
        console.error("Error creating audit log:", err);
        res.status(500).json({ error: "Failed to create audit log" });
        return;
      }
      res.status(201).json({
        message: "Audit log created successfully",
        logId: results.insertId,
      });
    }
  );
});

// Partially update a specific audit log by ID
app.patch("/api/audit-logs/:id", (req, res) => {
  const logId = req.params.id;
  const updatedFields = req.body;
  connection.query(
    "UPDATE audit_logs SET ? WHERE log_id = ?",
    [updatedFields, logId],
    (err, results) => {
      if (err) {
        console.error("Error updating audit log:", err);
        res.status(500).json({ error: "Failed to update audit log" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Audit log not found" });
        return;
      }
      res.json({ message: "Audit log updated successfully" });
    }
  );
});

// Delete a specific audit log by ID
app.delete("/api/audit-logs/:id", (req, res) => {
  const logId = req.params.id;
  connection.query(
    "DELETE FROM audit_logs WHERE log_id = ?",
    [logId],
    (err, results) => {
      if (err) {
        console.error("Error deleting audit log:", err);
        res.status(500).json({ error: "Failed to delete audit log" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Audit log not found" });
        return;
      }
      res.json({ message: "Audit log deleted successfully" });
    }
  );
});










//////////////AUTH////////////////////////////////

// POST route for user login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);


  try {
    // Check if user with the provided email exists
    const user = await knex.raw('SELECT id, email FROM users WHERE email = ?', [email])
    .then(result => result.rows[0]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Password is correct; create session or token for authentication
    // Here you can generate a JWT token and send it back to the client

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: true, message: error, code: 4 });
  }
});

// POST route for user registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email already exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    await knex('users').insert({ email, password_hash: passwordHash });

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//////////////End Of AUTH////////////////////////


