### Environment Variables

To run the backend application, you need to set the following environment variables:

- `DB_USER` - The username used to authenticate with the database.
- `DB_HOST` - The hostname or IP address of the database server.
- `DB_DB` - The name of the database you want to connect to.
- `DB_PASSWORD` - The password used to authenticate with the database.
- `DB_PORT` - The port number on which the database server is running.
- `EMAIL` - The email address used for sending system emails.
- `EMAIL_PASSWORD` - The password associated with the email address for email authentication.
- `JWT_SECRET` - A secret key used for signing JSON Web Tokens (JWT) for authentication and authorization.
- `CLOUDINARY_CLOUD_NAME` - The cloud name associated with your Cloudinary account for media storage and management.
- `CLOUDINARY_API_KEY` - The API key provided by Cloudinary for API authentication.
- `CLOUDINARY_API_SECRET` - The API secret provided by Cloudinary for API authentication and secure transactions.

Create a `.env` file in the root directory of the project and assign values to these variables based on your environment. Ensure not to expose sensitive information in your version control system.
