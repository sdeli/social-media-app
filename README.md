# social-media-app
It is a social media web app developed with Node (Express), React, and MySQL DB with sequelize.js for ORM. It has common features of posts, comments, live chat, audio, and video call. For the live chat, it uses Web socket (socket.io). And, for accomplishing the audio and video calls, it employs WebRTC technology. Moreover, GraphQL is used from the backend whereas the frontend is built with Mui react components to give it a robust and responsive UI with redux for state management. Both frontend and backend are developed with Typescript.

# Create Random User
```sql
INSERT INTO "Users" (name, email, password, picture, "createdAt", "updatedAt")
VALUES (
  'John Doe ' || floor(random() * 10000)::int,
  'user' || floor(random() * 10000)::int || '@example.com',
  '$2a$10$Pomgrfp2NDsGXHHJZTkt6eCx54LSU.47U59oMK01E5y2rxSqtoVvy',
  NULL,
  now(),
  now()
);
```