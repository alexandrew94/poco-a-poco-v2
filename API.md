# poco a poco API Documentation

### This is a guide to all the endpoints available in the API for *poco a poco*.

All fields listed under "Data Params" are required unless stated otherwise.

All endpoints except authentication endpoints require the user to be authenticated via a token in the request header. The token value can be acquired by logging in or signing up.

#### Base Path
* Heroku: `https://poco-a-poco.herokuapp.com/`

#### Required request header
* Header: `Authorization`
* Value: `Bearer some-token-value-1234567890`

---

## Contents

* [Authentication](#authentication)
  * [Login](#login)
  * [Sign Up](#sign-up)
* [Users](#users)
  * [Users Index](#users-index)
  * [Users Show](#users-show)
  * [Users Edit](#users-edit)
* [Pieces](#pieces)
  * [Pieces Index](#pieces-index) 
  * [Pieces Create](#pieces-create)
  * [Pieces Show](#pieces-show)
  * [Pieces Update](#pieces-update)
  * [Pieces Delete](#pieces-delete)
* [Diaries](#diaries)
  * [Diaries Create](#diaries-create)
  * [Diaries Update](#diaries-update)
  * [Diaries Delete](#diaries-delete)

---

## <a name="authentication">Authentication</a>

Accessing all resource endpoints requires authentication and a token. Each session expires after 6 hours.

#### <a name="login">Login</a>

Logs you in and gives you the token required for all non-authentication endpoints.

* URL: `/api/login`
* Method: `POST`
* Data Params:
  * `usernameOrEmail: 'string'`
  * `password: 'string'`
* Success Response:
  * Code: `200 Success`
  * Content:

	```javascript
	{
		"message": "Welcome back, Andrew! 😊😊",
		"token": "some-token-value-1234567890",
		"user": {
			"instruments": [
				{
					"name": "violin",
					"playingTime": 10
				},
				{
					"name": "piano",
					"playingTime": 20
				}
			],
			"_id": "abcdefg-1234567",
			"email": "someemail@someemail",
			"username": "Andrew",
			"accountCreated": "2018-05-20",
			"pieces": null,
			"id": "abcdefg-1234567"
		}
	}
	```
	\* Note that `pieces` is not populated here.
	
* Error Response:
  * Code: `401 Unauthorized`
  * Content:

	```javascript
	{
		"message": "Unauthorized"
	}
	```

#### <a name="sign-up">Sign Up</a>

Creates your account and gives you the token required for all non-authentication endpoints.

* URL: `/api/signup`
* Method: `POST`
* Data Params:
  * `username: 'string'` (must be unique)
  * `email: 'string@string'` (must be unique and have an @)
  * `password: 'string'`
  * `passwordConfirmation: 'string'`
  * `instruments: [ { name: 'string' }, { name: 'string' } ]` (must have length of at least 1)
* Success Response:
  * Code: `200 Success`
  * Content:

	```javascript
	{
		"message": "You've successfully registered, Andrew! 👏🎉",
		"token": "some-token-value-1234567890",
		"user": {
			"instruments": [
				"violin",
				"piano"
			],
			"_id": "abcdefg-1234567",
			"username": "Andrew",
			"email": "someemail@someemail",
			"pieces": null,
			"id": "abcdefg-1234567"
		}
	}
	```
	\* Note that `pieces` is not populated here.
	
* Error Response:
  * Code: `422 Unprocessable Entity`
  * Content:

  	```javascript
	{
		"message": "Unprocessable Entity",
		"errors": {
			"email": "Some error message"
		}
	}
	```
	
## <a name="users">Users</a>

Endpoints are available for indexing, showing and editing user resources.

#### <a name="users-index">All Users</a>

Gets all data for all users. This particular endpoint is mostly for the purposes of getting a quick overview of all the users' data - no request is made to it from the front-end in ordinary use of the app.

* URL: `/api/users`
* Method: `GET`
* Success Response:
  * Code: `200 Success`
  * Content:

	```javascript
	[
		{
			"instruments": [
				{
					"name": "violin",
					"playingTime": 30
				},
				{
					"name": "piano",
					"playingTime": 30
				}
			],
			"_id": "abcdefg-1234567",
			"email": "a@a",
			"username": "a",
			"accountCreated": "2018-05-20",
			"__v": 0,
			"pieces": [
				{
					"_id": "abcdefg-1234567",
					"title": "piece1",
					"composer": "composer1",
					"description": "description1",
					"user": "abcdefg-1234567",
					"instrument": "piano",
					"startedAt": "2018-05-28",
					"diary": [
						{
							"_id": "abcdefg-1234567",
							"timeLogged": "2018-05-28",
							"timePracticed": 10,
							"notes": "diaryentry1",
							"id": "abcdefg-1234567",
							"shortNotes": "diaryentry1"
						},
						{
							"_id": "abcdefg-1234567",
							"timeLogged": "2018-05-27",
							"timePracticed": 20,
							"notes": "diaryentry2",
							"id": "abcdefg-1234567",
							"shortNotes": "diaryentry2"
						}
					],
					"__v": 0,
					"totalPracticed": 30,
					"shortDescription": "description1",
					"id": "abcdefg-1234567"
				},
				{
					"_id": "abcdefg-1234567",
					"title": "piece2",
					"composer": "composer2",
					"description": "description2",
					"instrument": "violin",
					"user": "abcdefg-1234567",
					"startedAt": "2018-05-24",
					"diary": [
						{
							"_id": "abcdefg-1234567",
							"timeLogged": "2018-05-26",
							"timePracticed": 10,
							"notes": "diaryentry3",
							"id": "abcdefg-1234567",
							"shortNotes": "diaryentry3"
						},
						{
							"_id": "abcdefg-1234567",
							"timeLogged": "2018-05-25",
							"timePracticed": 20,
							"notes": "diaryentry4",
							"id": "abcdefg-1234567",
							"shortNotes": "diaryentry4"
						}
					],
					"__v": 0,
					"totalPracticed": 30,
					"shortDescription": "description2",
					"id": "abcdefg-1234567"
				}
			],
			"totalPracticed": 60,
			"practiceLog": {
				"2018-05-28": 10,
				"2018-05-27": 20,
				"2018-05-26": 10,
				"2018-05-25": 20
			},
			"composersLog": {
				"composer1": 30,
				"composer2": 30
			},
			"id": "abcdefg-1234567"
		},
		{
			"instruments": [
				{
					"name": "violin",
					"playingTime": 0
				}
			],
			"_id": "abcdefg-1234567",
			"email": "b@b",
			"username": "b",
			"accountCreated": "2018-05-20",
			"__v": 0,
			"pieces": [
				{
					"_id": "abcdefg-1234567",
					"title": "piece3",
					"composer": "composer3",
					"description": "description3",
					"instrument": "violin",
					"startedAt": "2018-05-24",
					"user": "abcdefg-1234567",
					"diary": [],
					"__v": 0,
					"totalPracticed": 0,
					"shortDescription": "description3",
					"id": "abcdefg-1234567"
				},
				{
					"_id": "abcdefg-1234567",
					"title": "piece4",
					"composer": "composer4",
					"description": "description4",
					"instrument": "violin",
					"startedAt": "2018-05-24",
					"user": "abcdefg-1234567",
					"diary": [],
					"__v": 0,
					"totalPracticed": 0,
					"shortDescription": "description4",
					"id": "abcdefg-1234567"
				}
			],
			"totalPracticed": 0,
			"id": "abcdefg-1234567"
		},
		{
			"instruments": [
				{
					"name": "violin",
					"playingTime": 0
				}
			],
			"_id": "abcdefg-1234567",
			"email": "c@c",
			"username": "c",
			"accountCreated": "2018-05-20",
			"__v": 0,
			"pieces": [],
			"totalPracticed": 0,
			"id": "abcdefg-1234567"
		}
	]
	```
	
#### <a name="users-show">Users Show</a>

Like the Users Index, but showing all the data for a single user. Here is a user with 2 instruments, 2 pieces and 2 practice diary entries inside of each piece.

* URL: `/api/users/<userid>`
* Method: `GET`
* Success Response:
  * Code: `200 Success`
  * Content:

	```javascript
	{
		"instruments": [
			{
				"name": "violin",
				"playingTime": 30
			},
			{
				"name": "piano",
				"playingTime": 30
			}
		],
		"_id": "abcdefg-1234567",
		"email": "a@a",
		"username": "a",
		"accountCreated": "2018-05-20",
		"__v": 0,
		"pieces": [
			{
				"_id": "abcdefg-1234567",
				"title": "piece1",
				"composer": "composer1",
				"description": "description1",
				"user": "abcdefg-1234567",
				"instrument": "piano",
				"startedAt": "2018-05-28",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-28",
						"timePracticed": 10,
						"notes": "diaryentry1",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry1"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-27",
						"timePracticed": 20,
						"notes": "diaryentry2",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry2"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description1",
				"id": "abcdefg-1234567"
			},
			{
				"_id": "abcdefg-1234567",
				"title": "piece2",
				"composer": "composer2",
				"description": "description2",
				"instrument": "violin",
				"user": "abcdefg-1234567",
				"startedAt": "2018-05-24",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-26",
						"timePracticed": 10,
						"notes": "diaryentry3",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry3"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-25",
						"timePracticed": 20,
						"notes": "diaryentry4",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry4"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description2",
				"id": "abcdefg-1234567"
			}
		],
		"totalPracticed": 60,
		"practiceLog": {
			"2018-05-28": 10,
			"2018-05-27": 20,
			"2018-05-26": 10,
			"2018-05-25": 20
		},
		"composersLog": {
			"composer1": 30,
			"composer2": 30
		},
		"id": "abcdefg-1234567"
	}
	```

#### <a name="users-edit">Users Edit</a>

Returns an edited user. Note that editing a user will also update the user's `instruments`. It returns the same data as the Users Show endpoint, with the updated user.

* URL: `/api/users/<userid>/edit`
* Method: `PUT`
* Data Params:
  * `username: 'string'`
  * `email: 'string@string'` 
  * ```instruments: [ { name: 'string', playingTime: number }, { name: 'string', playingTime: number } ]```
* Success Response:
  * Code: `200 Success`
  * Content:

	```javascript
	{
		"instruments": [
			{
				"name": "violin",
				"playingTime": 30
			},
			{
				"name": "piano",
				"playingTime": 30
			}
		],
		"_id": "abcdefg-1234567",
		"email": "a@a",
		"username": "a",
		"accountCreated": "2018-05-20",
		"__v": 0,
		"pieces": [
			{
				"_id": "abcdefg-1234567",
				"title": "piece1",
				"composer": "composer1",
				"description": "description1",
				"user": "abcdefg-1234567",
				"instrument": "piano",
				"startedAt": "2018-05-28",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-28",
						"timePracticed": 10,
						"notes": "diaryentry1",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry1"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-27",
						"timePracticed": 20,
						"notes": "diaryentry2",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry2"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description1",
				"id": "abcdefg-1234567"
			},
			{
				"_id": "abcdefg-1234567",
				"title": "piece2",
				"composer": "composer2",
				"description": "description2",
				"instrument": "violin",
				"user": "abcdefg-1234567",
				"startedAt": "2018-05-24",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-26",
						"timePracticed": 10,
						"notes": "diaryentry3",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry3"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-25",
						"timePracticed": 20,
						"notes": "diaryentry4",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry4"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description2",
				"id": "abcdefg-1234567"
			}
		],
		"totalPracticed": 60,
		"practiceLog": {
			"2018-05-28": 10,
			"2018-05-27": 20,
			"2018-05-26": 10,
			"2018-05-25": 20
		},
		"composersLog": {
			"composer1": 30,
			"composer2": 30
		},
		"id": "abcdefg-1234567"
	}
	```

## <a name="pieces">Pieces</a>

#### <a name="pieces-index">Pieces Index</a>

An index of all the pieces for a given user.

* URL: `/api/users/<userid>/pieces`
* Method: `GET`
* Success Response:
  * Code: `200 Success`
  * Content:

	```javascript
	[
			{
				"_id": "abcdefg-1234567",
				"title": "piece1",
				"composer": "composer1",
				"description": "description1",
				"user": "abcdefg-1234567",
				"instrument": "piano",
				"startedAt": "2018-05-28",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-28",
						"timePracticed": 10,
						"notes": "diaryentry1",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry1"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-27",
						"timePracticed": 20,
						"notes": "diaryentry2",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry2"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description1",
				"id": "abcdefg-1234567"
			},
			{
				"_id": "abcdefg-1234567",
				"title": "piece2",
				"composer": "composer2",
				"description": "description2",
				"instrument": "violin",
				"user": "abcdefg-1234567",
				"startedAt": "2018-05-24",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-26",
						"timePracticed": 10,
						"notes": "diaryentry3",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry3"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-25",
						"timePracticed": 20,
						"notes": "diaryentry4",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry4"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description2",
				"id": "abcdefg-1234567"
			}
	]
	```
	
#### <a name="pieces-create">Pieces Create</a>

Creates a new piece within a given user. It returns the entire user data, including the new piece.

* URL: `/api/users/<userid>/pieces`
* Method: `POST`
* Data Params:
  * `title: 'string'` 
  * `composer: 'string'` (optional)
  * `decription: 'string'` (optional)
  * `instrument: 'string'`
* Success Response:
  * Code: `201 Created`
  * Content:

	```javascript
	{
		"instruments": [
			{
				"name": "violin",
				"playingTime": 30
			},
			{
				"name": "piano",
				"playingTime": 30
			}
		],
		"_id": "abcdefg-1234567",
		"email": "a@a",
		"username": "a",
		"accountCreated": "2018-05-20",
		"__v": 0,
		"pieces": [
			{
				"_id": "abcdefg-1234567",
				"title": "piece1",
				"composer": "composer1",
				"description": "description1",
				"user": "abcdefg-1234567",
				"instrument": "piano",
				"startedAt": "2018-05-28",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-28",
						"timePracticed": 10,
						"notes": "diaryentry1",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry1"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-27",
						"timePracticed": 20,
						"notes": "diaryentry2",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry2"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description1",
				"id": "abcdefg-1234567"
			},
			{
				"_id": "abcdefg-1234567",
				"title": "piece2",
				"composer": "composer2",
				"description": "description2",
				"instrument": "violin",
				"user": "abcdefg-1234567",
				"startedAt": "2018-05-24",
				"diary": [
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-26",
						"timePracticed": 10,
						"notes": "diaryentry3",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry3"
					},
					{
						"_id": "abcdefg-1234567",
						"timeLogged": "2018-05-25",
						"timePracticed": 20,
						"notes": "diaryentry4",
						"id": "abcdefg-1234567",
						"shortNotes": "diaryentry4"
					}
				],
				"__v": 0,
				"totalPracticed": 30,
				"shortDescription": "description2",
				"id": "abcdefg-1234567"
			}
		],
		"totalPracticed": 60,
		"practiceLog": {
			"2018-05-28": 10,
			"2018-05-27": 20,
			"2018-05-26": 10,
			"2018-05-25": 20
		},
		"composersLog": {
			"composer1": 30,
			"composer2": 30
		},
		"id": "abcdefg-1234567"
	}
	```
* Error Response
  * Code: `422 Unprocessable Entity`
  * Content:

    ```
    {
	 	 "message": "Unprocessable Entity",
		 "errors": {
			 "instrument": "Instrument is required",
			 "title": "Title is required"
	    }
	}
	```
	
#### <a name="pieces-show">Pieces Show</a>

Shows the data for one piece.

* URL: `/api/users/<userid>/pieces/<pieceid>`
* Method: `GET`
* Success Response:
  * Code: `200 Success`
  * Content:

   ```javascript
	{
		"_id": "abcdefg-1234567",
		"title": "piece1",
		"composer": "composer1",
		"description": "description1",
		"user": "abcdefg-1234567",
		"instrument": "piano",
		"startedAt": "2018-05-28",
		"diary": [
			{
				"_id": "abcdefg-1234567",
				"timeLogged": "2018-05-28",
				"timePracticed": 10,
				"notes": "diaryentry1",
				"id": "abcdefg-1234567",
				"shortNotes": "diaryentry1"
			},
			{
				"_id": "abcdefg-1234567",
				"timeLogged": "2018-05-27",
				"timePracticed": 20,
				"notes": "diaryentry2",
				"id": "abcdefg-1234567",
				"shortNotes": "diaryentry2"
			}
		],
		"__v": 0,
		"totalPracticed": 30,
		"shortDescription": "description1",
		"id": "abcdefg-1234567"
	}
	```
	
#### <a name="pieces-update">Pieces Update</a>

Updates the data for one piece.

* URL: `/api/users/<userid>/pieces/<pieceid>`
* Method: `PUT`
* Data Params:
  * `title: 'string'` 
  * `composer: 'string'` (optional)
  * `decription: 'string'` (optional)
  * `instrument: 'string'`
* Success Response:
  * Code: `201 Created`
  * Content:

   ```javascript
	{
		"_id": "abcdefg-1234567",
		"title": "piece1",
		"composer": "composer1",
		"description": "description1",
		"user": "abcdefg-1234567",
		"instrument": "piano",
		"startedAt": "2018-05-28",
		"diary": [
			{
				"_id": "abcdefg-1234567",
				"timeLogged": "2018-05-28",
				"timePracticed": 10,
				"notes": "diaryentry1",
				"id": "abcdefg-1234567",
				"shortNotes": "diaryentry1"
			},
			{
				"_id": "abcdefg-1234567",
				"timeLogged": "2018-05-27",
				"timePracticed": 20,
				"notes": "diaryentry2",
				"id": "abcdefg-1234567",
				"shortNotes": "diaryentry2"
			}
		],
		"__v": 0,
		"totalPracticed": 30,
		"shortDescription": "description1",
		"id": "abcdefg-1234567"
	}
	```

#### <a name="pieces-delete">Pieces Delete</a>

Deletes one piece.

* URL: `/api/users/<userid>/pieces/<pieceid>`
* Method: `DELETE`
* Data Params:
  * `title: 'string'` 
  * `composer: 'string'` (optional)
  * `decription: 'string'` (optional)
  * `instrument: 'string'`
* Success Response:
  * Code: `204 No Content`
  * Content:

   ```javascript
	{
		"message": "Piece successfully deleted!"
	}
	```

## <a name="diaries">Diaries</a>

Diaries are used to log the practice progress for each piece.

#### <a name="diaries-create">Diaries Create</a>

* URL: `/api/users/<userid>/pieces/<pieceid>/diary`
* Method: `POST`
* Data Params:
  * `timePracticed: number` (amount of time practiced in minutes)
  * `timeLogged: '00-00-00'` (date string in DD-MM-YY format)
  * `notes: 'string'` (optional)
* Success Response:
  * Code: `201 Created`
  * Content:

   ```javascript
	{
		"_id": "abcdefg-1234567",
		"title": "piece1",
		"composer": "composer1",
		"description": "description1",
		"user": "abcdefg-1234567",
		"instrument": "piano",
		"startedAt": "2018-05-28",
		"diary": [
			{
				"_id": "abcdefg-1234567",
				"timeLogged": "2018-05-28",
				"timePracticed": 10,
				"notes": "diaryentry1",
				"id": "abcdefg-1234567",
				"shortNotes": "diaryentry1"
			},
			{
				"_id": "abcdefg-1234567",
				"timeLogged": "2018-05-27",
				"timePracticed": 20,
				"notes": "diaryentry2",
				"id": "abcdefg-1234567",
				"shortNotes": "diaryentry2"
			}
		],
		"__v": 0,
		"totalPracticed": 30,
		"shortDescription": "description1",
		"id": "abcdefg-1234567"
	}
	```
	(Returns all the data for the piece the diary has been added to)

#### <a name="diaries-update">Diaries Update</a>

* URL: `/api/users/<userid>/pieces/<pieceid>/diary/<diaryid>`
* Method: `PUT`
* Data Params:
  * `timePracticed: number` (amount of time practiced in minutes)
  * `timeLogged: '00-00-00'` (date string in DD-MM-YY format)
  * `notes: 'string'` (optional)
* Success Response:
  * Code: `200 Success`
  * Content:

   ```javascript
	{
		"_id": "abcdefg-1234567",
		"timePracticed": 10,
		"timeLogged": "00-00-00",
		"notes": "diary-entry",
		"id": "abcdefg-1234567",
		"shortNotes": "diary-entry"
	}
	```
	
#### <a name="diaries-delete">Diaries Delete</a>

* URL: `/api/users/<userid>/pieces/<pieceid>/diary/<diaryid>`
* Method: `DELETE`
* Success Response:
  * Code: `204 No Content`
  * Content:

   ```javascript
	{
		"message": "Deletion successful!"
	}
	```