# ShopAPI
[To be updated...]
A badly coded RESTful API
And equally bad docs

Current Roles in the API include
-admin
-user

and main features in this include 
-cart
-products
-users

## Endpoints 
tldr :
- /products/
- /cart/
- /users/


### For Users 
#### Unauthenticated Users
POST
- /users/signup
- /users/login

GET
- /products/
- /products/:id

#### Authenticated Users
POST
- /cart/new
- /cart/

GET
- /cart/:CardId

DELETE
- /cart/:ProductId

#### Admin
POST 
- /products/
- 

GET
- /users/
- /users/:userId
- /cart/
- /cart/:cartId

DELETE
- /users/:userId
- /products/:id
- /cart/:cartId

PATCH
- /products/:id