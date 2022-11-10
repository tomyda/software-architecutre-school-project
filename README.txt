This readme is intended to describe the npm modules used inside this project (and their purpose).

-------------------
  NPM MODULES USED
-------------------

---- A U T H   S E R V I C E ----
- express       (for server)
- mongoose      (for mongodb connection)
- nodemon       (for faster/easyer development)
- validator     (for validations)
- jsonwebtoken  (for jwt generation and validation)
- uuid          (for unique identifiers)
- redis         (for storing tokens -as a white list-)
- stringify     (for converting objects to string -for saving them to redis-)


---- R E S E R V A A T I O N   D A T A ----
- mongoose      (for mongodb connection, saving reservations db)
- nodemon       (for faster/easyer development)
- node-fetch    (for requesting the receiver service)


---- R E S E R V A A T I O N   R E C E I V E R ----
- nodemon       (for faster/easyer development)
- bull          (for MQ usage)

--- A D M I N    S E R V I C E ---
-- uuid               (used for generating vaccination center uuid -"code"-)
-- generate-password  (used for generating admins random, secure, password)
-- bcryptjs           (used for hashing user password -for security-)
-- validator          (used for validating email structurally)