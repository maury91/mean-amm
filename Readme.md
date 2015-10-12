# Mean AMM

This is a remake of the project i've doed for Amm, it's built using MongoDB Express AngularJS and NodeJS. The Node App is developed using the Test Driven Development

## What is AMM ?

AMM is a course of my collage that teaches how to build a website using PHP+Mysql+jQuery.

You can see the old project here : https://github.com/maury91/amm

## State of the project

Currently all the Node (and MongoDB + Express) part is doed, i've disabled some parameters in the search to make the website always return some data (the parameter days, search only the events in the next days, and obviusly the current events in the near future disappear)

This website is deployed on Heroku and you can visit it here : https://thawing-scrubland-7417.herokuapp.com/

## What is ToDo

 - Login under Angular.js
 - Insert events under Angular
 - Show my events
 - Change __static_ to __development_
    - Serve _development if the script is under development mode
    - Build _development to _static using gulp


## What is doed

  - All the test under Mocha
  - Node application
    - Search events near a position
    - Events,Position and User model
    - Events,Positions,User routes
    - Login and logout
  - Navigation animations under Angular
  - First page under Angular
  - Search under Angular
  - Navigation history under Angular
  - Changable Language
  - Some testing for Angular
  - Testing and opening (with live reload) with gulp
  - Use bower to lower the size on GIT

# How to use it

## Production

Simply execute **npm start** or **./bin/www**

## Testing enviroment

**./bin/www --NODE_ENV=test**

## Run tests

**npm test**