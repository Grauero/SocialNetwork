# SocialNetwork [![Build Status](https://travis-ci.org/Grauero/SocialNetwork.svg?branch=master)](https://travis-ci.org/Grauero/SocialNetwork) [![Coverage Status](https://coveralls.io/repos/github/Grauero/SocialNetwork/badge.svg)](https://coveralls.io/github/Grauero/SocialNetwork)
https://net-work.herokuapp.com/

![landing](http://i.piccy.info/i9/6123cac0d42adfdad33b4cf740be1672/1552073275/63323/1306333/network_landing.jpg) 
Network application for developers, built on React+Redux/Node+Express

Registration/Authorization done with email/password + JWT tokens

Application connected to github API for fetching users repositories

Project tested with Jest+Enzyme

Application audit with Google Chrome audits on mobile devices with simulated fast 3G, 4x CPU Slowdown:
- /feed page: ![feed](http://i.piccy.info/i9/318980764f69b59e33badb9adf251d49/1552308747/14074/1306765/network_feed_page_mobile_simulatedFast3G.jpg)

- /profile page: ![profile](http://i.piccy.info/i9/244550f9b20a01b9673edf3c31c045e0/1552309510/14415/1306780/network_profile_page_mobile_simulatedFast3G.jpg)

- /profiles page: ![profiles](http://i.piccy.info/i9/a98a398e576a63179783fd9786dae218/1552309559/15686/1306780/network_profiles_page_mobile_simulatedFast3G.jpg)

## Application features:
### - users can create and fill up profile with their skills, experience, education
  
![dashboard](http://i.piccy.info/i9/644ede192b31b9ddf6c00623a420be29/1552073747/52218/1306335/network_dashboard.jpg)

 
 
### - users can create and like posts, write comments

![post](http://i.piccy.info/i9/e5a5d22e1a55b629a1a1766c15903881/1552074003/48702/1306335/network_post.jpg)
  
 
 
### - users can message other users and see their profiles and latest github repositories
  
 ![profile](http://i.piccy.info/i9/e8a3313c5297bef3b38c2d6445ef200b/1552074318/42482/1306335/network_profile.jpg)

## Scripts:
  - ```npm run dev``` - to launch local dev-server (client+backend)
  - ```npm run server``` - to launch ONLY backend part
  - ```npm run client``` - to launch ONLY client part
  - ```npm run test``` - to launch test run in watch mode
  - ```npm run test:coverage``` - to launch test-coverage

### Used tools:
  1. [React](https://reactjs.org/) + [Redux](https://redux.js.org/) on front
  2. [Node](https://nodejs.org/) + [Experss](https://expressjs.com/) on back
  3. Auth with [JWT](https://jwt.io/) tokens
  4. [MongoDB](https://www.mongodb.com/) for database
  5. [Jest](https://jestjs.io/)/[Enzyme](https://github.com/airbnb/enzyme) for testing

