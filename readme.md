# Notes
My framework of choice is React, but I figured I'd take the plunge and complete the rest of this project in Vue (which I have no experience with). Working without a build step was very refreshing, but did make it difficult to follow along with tutorials, where they were leveraging files with the .vue extension. 2 things I wasn't able to figure out: Emit and Importing. As such there isn't any live reloading and everything lives in the one login.js file. Overall it was nice to get my hands dirty with something new under some pressure. The permission system isn't complete, but the backend makes sure that only the user that created the comment/post can update/delete the respective item. Desktop styling could be a little better, it was one of the last things that I did, and because of that I relied more on selectors rather than classes. 


Create a blog where a user may register, sign in, view all blog entries, post new / edit existing / delete existing blog entry, and log out.

#### Task

Using the included assets 'from the client' (assets_from_client.zip), please re-create the screens detailed in the mockup. Build out the user functionality (registration, login, logout) utilizing the language of your choice (PHP / Laravel would be ideal). Please try to levrage the base level Vue functionality in `login.js` and templating in `index.html`. If you are not comfortable using Vue, you may use another language in its place.

Make sure to review all of the files to famaliarize yourself with the project. When / if you see an opportunity to clean up existing functionality please do so, and leave a comment detailing your changes.

#### Asks

# Users and user registration
- Create users with first name, last name, email, and password

# CRUD for blog entries
- Create a new post with title, blog content
- Ability to edit and delete existing posts
- List of all posts upon login

# End goal
- User reigstration and sign in
- Create, edit, and delete blog posts
- View a list of all blog posts
- Align all screens to mock up
- Take a mobile-first approach to create responsive content

#### Bonus

- Add the ability to see all users blog posts in the same feed
- Add commenting to blog posts so users can create, edit, and delete comments
- Can the password validation be updated or refactored?
- Are all of the screens detailed in the mock up? Make sure to run through both the register and sign in flow. For anything that is not detailed in the mock up, please follow the same style guidelines. 
