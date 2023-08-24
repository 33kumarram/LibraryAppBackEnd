# LibraryApp

  [![License](https://img.shields.io/static/v1?label=License&message=MIT&color=blue&?style=plastic&logo=appveyor)](https://opensource.org/license/MIT)



## Table Of Content

- [Description](#description)
- [Deployed website link](#deployedWebsite)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contribution)

- [GitHub](#github)
- [Contact](#contact)
- [License](#license)




![GitHub repo size](https://img.shields.io/github/repo-size/33kumarram/NodeOtpLoginApi?style=plastic)

  ![GitHub top language](https://img.shields.io/github/languages/top/33kumarram/NodeOtpLoginApi?style=plastic)



## Description

  The LibraryApp is application to manage library books and their borrowers list.
  
  
  
  Key Features:
  
      1. User sign up and login
      
      2. Administrators approval required to start borrowing.
      
      3. User can borrow limited books only.

      4. Administrator account can be created by providing administrator key

      5. Administrator can verify user accounts and can add new book details







<p>Deployed website: <strong><a href="https://libraryappbackend.onrender.com/">https://libraryappbackend.onrender.com/</a></strong>








## Installation

1. Clone the repository:

       git clone https://github.com/33kumarram/LibraryAppBackEnd.git


2. Install dependencies:

       cd LibraryAppBackEnd

       npm install


3. Set up environment variables:
  
      You will need to create a .env file in the root of the project directory, containing the following environment variables:

        MONGODB_URI= your MongoDB connection string

        JWT_SECRET=a secret key for JSON Web Token (JWT) encryption

        ADMIN_KEY = Secret key which is used by administrators to create administrator  account 

        PORT = Port on which you want to run the server

4. Finally, start the server:

     npm start

     The server should now be running on port mentioned in the .env file





LibraryAppBackEnd is built with the following tools and libraries: <ul><li>Node js </li><li>Express js </li><li>MongoDB </li><li>Jsonwebtoken</li></ul>





## Usage
 
1. Send OTP to your mail id: 


   End point = https://nodeotploginapi.onrender.com/users/sendotp

   Request Type = POST

   Body = 
   
          {
   
            "email":<Your Mail Id>
  
          }

2. Validate OTP:

   End point = https://nodeotploginapi.onrender.com/users/login

   Request Type = POST

   Body = 
   
          {
   
            "email":<Your Mail Id>,
  
            "otp":<OTP sent to your Mail Id>
  
          }









## Contribution
 
If you would like to contribute to this project, please follow these steps:

1.Fork the repository

2.Create a new branch for your changes

3.Make your changes and commit them with descriptive commit messages

4.Push your changes to your forked repository

5.Open a pull request to merge your changes into the master branch








## GitHub

<a href="https://github.com/33kumarram"><strong>33kumarram</a></strong>



<a href="https://www.linkedin.com/in/ramesh-kumar-33613a174/">LinkedIn</a></strong></p>


<a href="https://leetcode.com/kumarram/">Leetcode</a></strong></p>





## Contact

Feel free to reach out to me on my email:
rk3790690@gmail.com





## License

[![License](https://img.shields.io/static/v1?label=Licence&message=MIT&color=blue)](https://opensource.org/license/MIT)


