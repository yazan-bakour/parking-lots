# Parking business application

This is a Parking lots spaces and session desply project. (ReactJs, Context API).

User are able to view the available spaces in the Overview page, start new seassion, end session, track the capacity and see the how full can be with the progress bar.

User are able to review all the parking Sessions in the session page, with ability to filter by vehicle type, date start, date end and the status. 

Folder Structure Conventions
============================

> Folder structure options and naming conventions for software projects

### Directory layout

    .
    ├── ...
    ├── src                     # The main source directory.
    │   ├── common              # It includes reusable components and main layout and also error/success displays toast.
    │   ├── components          # Three main views can be navigate around Login, Sessions and Overview.
    │   ├── api                 # This is the global state storage. Mainly handle the API calles and store the response with state to be dispatched anywhere in the application using contextAPI.
    │   └── App                 # Handling the routes logic to restrict access only for login users.
    └── helper                  # File created to have reuseable function to be imported into any logic.

### Scripts

- npm install
- npm start
- npm run build

### 3rd party libraries

No 3rd party library. There is a App.css file that contains all the colors palletes and global css for typography, inputs and buttons.