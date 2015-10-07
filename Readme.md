# Mean AMM

This is a remake of the project i've doed for Amm, it's built using MongoDB Express AngularJS and NodeJS.

## What is AMM ?

AMM is a course of my collage that teaches how to build a website using PHP+Mysql+jQuery.

## State of the project

Currently all the Node (and MongoDB + Express) part is doed, i've disabled some parameters in the search to make the website always return some data (the parameter days, search only the events in the next days, and obviusly the current events in the near future disappear)

This website is deployed on Heroku and you can visit it here : https://thawing-scrubland-7417.herokuapp.com/

## What is ToDo

 - Login under Angular.js
 - Insert events under Angular
 - Show my events
 - Add change language flag in the home

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

# How to use it

## Production

Simply execute **npm start** or **./bin/www**

## Testing enviroment

**./bin/www --NODE_ENV=test**

## Run tests

**npm test**