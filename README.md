# Custom Survey Maker
## Set-up
1. Create a .env file in the root directory.  The .env file should contain the following
```
REACT_APP_SERVER_URL=<server_url>
REACT_APP_API_KEY=<api_key>
REACT_APP_AUTH_DOMAIN=<auth_domain>
REACT_APP_DATABASE_URL=<database_url>
REACT_APP_PROJECT_ID=<project_id>
REACT_APP_STORAGE_BUCKET=<storage_bucket>
REACT_APP_MESSAGING_SENDER_ID=<messaging_sender_id>
REACT_APP_APP_ID=<app_id>
REACT_APP_MEASUREMENT_ID=<measurement_id>
```
All of these values can be obtained through the Firebase console (Settings -> Your apps - > Firebase SDK snippet -> Config)  
2. Run ```yarn```  
3. Run ```yarn start```

## Deploying to Firebase
Run ```yarn deploy```

## Adding a new account
1. Go into the Firebase console and add a new user
2. Go into the database, and add a new document in ```roles``` collection, where the title is the user uuid, which contains the following schema
```
{
    role: <role>
}
```

## Updating an account's role
2. Obtain the user's UID, then modify the role property for the user's document in the ```roles``` collection

## Adding a new role
1. Follow the steps to create a new account
2.  click on the "Rules" tab under the database section of firebase, and add the new role into the appropriate array to give it permissions.  
NOTE: For the website to work in the first place, you MUST give the "read" permission to the new role.
