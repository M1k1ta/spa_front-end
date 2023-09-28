# Links
[DEMO](https://m1k1ta.github.io/spa_front-end/)\n
[BACK-END](https://github.com/M1k1ta/spa_back-end)\n
[SHEMA_BD](https://www.figma.com/file/xBjjAgeCtjX7x5Kv4mYBNf/Untitled?type=whiteboard&node-id=0%3A1&t=UhbXXTrGos1xJOHf-1)\n

# Tehnologies
Front-end: React, React Router, React Material UI, classNames, SCSS(SASS), Axios, Draft-js, Contenido, TypeScript.
Back-end: Node, Express, Sequlize, PostgreSQL, NeonDB, Render.com, Cors, TypeScropt.
Also: ESLint, Prettier.

# History
I started the development with the backend, specifically with the data storage design. There were a few initial ideas, such as creating a "Conversation" database to store an array of messages for each conversation and using an additional value to calculate the message level. The idea was that, for instance, when rendering on the front end, the first level would be multiplied by 20 and used as the "margin-left" value (I was thinking ahead about visualization). While this approach might have looked right visually, it had issues, such as incorrect message sequencing and a lack of logic. So, I chose a different data storage approach.

I opted for storing messages with a "relatedId," which could be the ID of the comment to which the message was replied or null if the message didn't relate to any comment. Initially, I had some concerns about gathering the data together, but I eventually settled on this solution.

Next, after finalizing the idea, I started implementing it. I created data storage and retrieval systems. In the first version, I didn't include all the necessary data. I developed a function that took an array of data with "relatedId" and returned an array where "relatedId" was null and an additional "messages" key containing all the messages related to that comment. This function had a straightforward, quadratic time complexity. It created a new array with all the values where "relatedId" was null and added related messages to the current message, directly modifying the message objects. This approach worked well, and the core of the backend was ready at this point.

Moving on to the frontend, I first worked on creating a form for adding messages and visualizing messages. Using recursion, I built a component that rendered messages and their replies. Before that, I retrieved the data from my server. For the text input in the form, I decided to use "draft-js" and "contentido" since I needed to implement font type changes, adding links, and code blocks.

Problems started to arise after this point. From Friday to Tuesday, I implemented everything mentioned above, along with styles and possibly more that I haven't mentioned. However, when I got to adding code within the text, development significantly slowed down. I searched for additional libraries and even considered using custom block functions with "contentido," but I couldn't find a suitable solution. I came across "draft-js-code," but it was in native JavaScript, and there were no additional modules for the TypeScript version. So, I decided to postpone this issue after spending a lot of hours on it.

Next, I delved into handling file uploads and storage on the server. This took me 1-2 days in total. After resolving issues with the reCAPTCHA library, which I used in multiple forms, development started to flow smoothly. The problem was due to the Reapcha library I was initially using. I switched to the original reCAPTCHA, and the error disappeared.

Regarding pagination, it didn't take much time, and most of my time was spent on the frontend, especially on styling. I created custom-styled inputs with error handling, but I didn't implement error handling on the server because I couldn't think of what needed to be handled. If I had user data to check against the database, I would have implemented it.

# Fails
Adding code to the text is not implemented; the technology I have chosen does not have this capability under the hood, and it is not possible to customize it to include this functionality, at least from the information I found on the internet.
CAPTCHA - implemented reCaptcha V2 because it is more reliable and up-to-date.


