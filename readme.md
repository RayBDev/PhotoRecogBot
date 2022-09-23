<p align="center">
    <img alt="Photo RecogBot Frontend" src="https://github.com/RayBDev/PhotoRecogBot/blob/main/client/public/android-chrome-512x512.png" width="80" />
</p>
<h1 align="center">
  Photo RecogBot
</h1>

Photo RecogBot is a full stack application utilizing React on the frontend and ExpressJS + PostgreSQL for the backend. It allows users to create an account and submit an image URL for either "general", "face" or "apparel" detection. The app will draw bounding boxes around the items or faces detected within the image.

## :bookmark_tabs: Technologies Used

1.  **ExpressJS + PostgreSQL**

    ExpressJS was used for all the backend endpoints which includes account creation, authentication, image detection, and dynamic gallery returned to the frontend. PostgreSQL was used for the database.

2.  **Railway**

    The application is hosted on Railway due to it's fantastic developer experience and CI/CD relationship with Github.

## :computer: Getting Started

The easiest way to view this project is to follow [this link](https://photorecogbot.rbernard.ca/).

You may also clone this repo to view the code and run it directly on your local machine.

1.  **Clone the repo**

    Clone the repo to your local computer.

    ```sh
    # cd to your desired directory
    git clone https://github.com/RayBDev/PhotoRecogBot.git
    ```

2.  **Install Dependencies**

    Navigate to the root project directory

    ```sh
    npm install && npm client-install
    ```

3.  **Set Up Your PostgreSQL Database**

    Install PostgreSQL locally or on a cloud service and run the following query to set up the appropriate tables:

    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100),
        name VARCHAR(100),
        hash VARCHAR(300),
        entries INTEGER,
        created_at TIMESTAMP
    );
    CREATE TABLE photos (
        id SERIAL PRIMARY KEY,
        url VARCHAR(300),
        type VARCHAR(10),
        created_at TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
    ```

4.  **Add Environment Variables**

    Get your Carifai API key [here](https://www.clarifai.com) which is the AI used for image detection.
    Now create your own `.env` file in the root and client folders. See `dotenv_example` in both folders for all the environment variables that need to be added.

5.  **Start the Server**

    ```sh
    npm run dev
    ```

## :email: Contact Me

Contact me and view my portfolio at <https://rbernard.ca>
