# Instructions to Set Up and Populate the Database

Follow these steps to set up the server and populate the database with data from the "data" folder:

## Step 1: Start the Server

Ensure you have all the necessary dependencies installed, and then start the server using the following command:

## Step 2: Populate the Database

Run the following files in the "data" folder in the specified order individually:

1. First, run `permissions.js`:

` node data/permissions.js`

2. Next, run `roles.js`:

` node data/roles.js`

3. Finally, run `user.js`:

` node data/user.js`

Running these files individually ensures that the database is correctly populated in the desired order.

## Step 3: Stop and Rerun the Server

Stop the server using `CTRL+C` in the terminal where the server is running. Then, restart the server with the same command as in Step 1.

## Step 4: Login with Test Credentials

Now that the database is populated, you can log in using the credentials specified in the `user.js` file. Use these credentials to test the functionality of your application.

Note: It is important to stop and rerun the server in Step 3 to ensure that the database is properly updated with the data from the "data" folder.

**Please ensure you have followed all the steps correctly to set up the server and populate the database with test data for your application.**
