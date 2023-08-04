# E-Commerce Website

An end-to-end E-Commerce website with a customer and admin view, allowing customers to view and order items, and admins to add, edit and delete existing shop items.
<hr>
<h3>Tech Stack:</h3>
<ul>
  <li>Backend: NodeJS</li>
  <li>Database: MongoDB</li>
  <li>Frontend: 
    <ul>
      <li>Pug to generate dynamic HTML pages</li>
      <li>CSS for styling</li>
      <li>JavaScript for client side scripting</li>
    </ul>
  </li>
</ul>
<hr/>
<h3>Features and functionality:</h3>
<ul>
  <li>Website offers both a customer and admin view</li>
  <li>Customers being able to add items to their cart, place orders and upon processing of an order, are generated with an invoice</li>
  <li>Admins have the option to add, edit and delete existing items from the store page</li>
  <li>User login details are verified using sessions and users that are not logged in are only allowed to view items</li>
  <li>Passwords are hashed and stored in a secure manner</li>
  <li>Website is protected from CORS and CSRF attacks</li>
  <li>Store items are displayed in a paginated format in order to not clutter the screen with too many items at once</li>
</ul>
<hr>
<h3>Prominent Libraries:</h3>
<ul>
  <li>Mongoose is used to work with mongo schemas more easily and in a more flexible manner</li>
  <li>Express is used for the numerous features it provides</li>
  <li>Express-session in order to store user login details for authentication while routing</li>
  <li>Bcryptjs in order to hash user passwords and verify them upon login attempt</li>
  <li>CORS and CSURF are used to protect from CORS and CSRF attacks respectively</li>
  <li>Multer for working with file upload and download</li>
  <li>Express-validator in order to construct body validation middlewares</li>
  <li>PDFKit is used in order to generate an invoice to users upon placing an order</li>
</ul>
<br>and many other different packages
