# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

Users can register to the app, and access their shortened URL library. Tha app allows users to create new URLs, and edit or delete the existing ones.

Only logged users can access, edit or delete the URLs library. The shortened URL redirects the user to the correspondent website. 

Security measures were implemented such as hashed passwords and encrypted cookies. 

## Final Product

!["Only logged users can access and see their URLs. They can edit and delete existing URLs from their database"](https://github.com/marcelaamf/tinyapp-/blob/main/docs/urls-page.png?raw=true)
!["New users can register to the app"](https://github.com/marcelaamf/tinyapp-/blob/main/docs/register-page.png?raw=true)
!["Users can create new shortened urls and save them in the database"](https://github.com/marcelaamf/tinyapp-/blob/main/docs/create-short-urls-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- morgan

## Getting Started

- Install all dependencies (using the `npm install` command). 
- Run the development web server using the `node express_server.js` command.
- On your browser, navigate to the localhost:8080/register.
  - If the 8080 Port is in use, select the Port of your choice and update the const PORT on the express_server.js file.
  - Create a new user to login 
  - This project requires cookies to be enabled