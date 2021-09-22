# RestAPI Mysql CRUD Operations

A RestAPI Mysql CRUD Operations build using [Nodejs](https://nodejs.org) & [Express](https://expressjs.com) & [Mysql](https://www.npmjs.com/package/mysql)

## Installation

API requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and start the server.

```sh
cd crudAPI-MongoDB
npm install
npm start or npm run devStart
```
## Usage
### List users
Lists all users
```endpoint
GET /api/v1/
```
#### Example response
```json
{
	"status": 200,
	"response": [
		{
			"id": 142,
			"fullname": "Chevy",
			"username": "clere1a",
			"email": "coreagan1a@csmonitor.com",
			"ip_address": "11.54.64.241",
			"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.45 Safari/535.19"
		},
		{
			"id": 160,
			"fullname": "Nicki",
			"username": "npennaccid",
			"email": "ncounselld@cyberchimps.com",
			"ip_address": "48.209.155.119",
			"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10"
		}
	]
}
```
### Add user
Registring a new user
```endpoint
POST /api/v1/addUser
```
#### Example request body
```json
{
  "fullname": "Ysn Irix",
  "username": "ysnirix",
  "email": "mzottoli0@ysnirix.com",
  "password": "20212021"
}
```
#### Example response
```json
{
  "status": 200,
  "response": "User Added Successfully"
}
```
### Retrieve a user
Get a user by ID
```endpoint
GET /api/v1/getUser/{UserID}
```
#### Example response
```json
{
  "status": 200,
  "response": [
    {
      "id": 142,
      "fullname": "Chevy",
      "username": "clere1a",
      "email": "coreagan1a@csmonitor.com",
      "password": "$2b$16$MztRF4qCWmO4XwbHV9C37.ZBm4wPWyf4eKm4aL2Lw29",
      "ip_address": "11.54.64.241",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.45 Safari/535.19"
    }
  ]
}
```
### Update a user
Updates the properties of a particular users.
```endpoint
PATCH /api/v1/updateUser/{user_id}
```
#### Example request body
```json
{
  "fullname": "anothername"
}
```
#### Example response
```json
{
  "status": 200,
  "response": "User with the record ID: 142 has been updated"
}
```
### Delete a user
Deletes a user by id
```endpoint
DELETE /api/v1/deleteUser/{user_id}
```
#### Example response
```json
{
  "status": 200,
  "response": "User with the record ID: 1007 has been removed"
}
```

## License

MIT