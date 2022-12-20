# Tweeter API REST

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Jacky16_Tweeter-Back&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Jacky16_Tweeter-Back)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Jacky16_Tweeter-Back&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=Jacky16_Tweeter-Back)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Jacky16_Tweeter-Back&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Jacky16_Tweeter-Back)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Jacky16_Tweeter-Back&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Jacky16_Tweeter-Back)

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=Jacky16_Tweeter-Back)](https://sonarcloud.io/summary/new_code?id=Jacky16_Tweeter-Back)

Welcome to the Tweeter REST API! This API allows you to access and manipulate data on the Tweeter platform. This API is developed using CD/CI with the follow technologies:

- TypeScript
- Express
- Supertest
- Multer
- Supabase
- JSON Web Token (JWT)
- Sharp
- MongoDB
- bcrypt
- Express validation
- Jest

This API is used by the [Tweeter frontend project](https://github.com/Jacky16/Tweeter-Front).

## Endpoints

Here is a list of the available endpoints:

### Protected Endpoints

These endpoints require authentication. To authenticate your request, you will need to provide a valid JSON Web Token (JWT) in the Authorization header of your request. The value of the Authorization header should be Bearer <YOUR_JWT>.

- ### /tweets/create:

  - This endpoint allows you to create a new tweet. You can include an image with your tweet by providing the image file in the request body as form data.

    The image format to webp and upload to supabase as security copy

- ### /tweets/:idTweet:

  - This endpoint allows you to view a specific tweet by its ID. You will need to provide the ID of the tweet in the URL path.

- ### /tweets/delete/:idTweet:

  - This endpoint allows you to delete a tweet by its ID. You will need to provide the ID of the tweet in the URL path.

- ### /tweets/update/:idTweet:

  - This endpoint allows you to update the content of a tweet by its ID. You can also include an image with your updated tweet by providing the image file in the request body as form data. You will need to provide the ID of the tweet in the URL path.

- ### /tweets/category/:category:

  - This endpoint allows you to view all tweets in a specific category. You will need to provide the category name in the URL path. This endpoint supports pagination and you can provide the limit and page parameters in the query string to control the number of results returned.

- ### /tweets:
  - This endpoint allows you to view all tweets. This endpoint supports pagination and you can provide the limit and page parameters in the query string to control the number of results returned.

### Unprotected Endpoints

These endpoints do not require authentication.

- ### /login:
  - This endpoint allows you to log in to your Tweeter account. You will need to provide your username and password to authenticate your request. Upon successful login, a JSON Web Token (JWT) will be returned that you can use to authenticate future requests.
- ### /register:
  - This endpoint allows you to create a new Tweeter account. You will need to provide your name, email address, and desired username and password to complete the registration process.

## Images

### Create Tweet

- When you create a tweet with image, the image format to webp using sharp, and image uploads to Supabase and also saved to the server

### Get Tweet/s

- When you get a list of tweets that contain images or get a tweet with image, if the image doesn't exist in server, the server redirect de url of image to Supabase
