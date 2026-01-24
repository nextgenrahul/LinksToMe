This is project is going to build a social media Applications. 







## Learnings 
# Access Token vs Refresh Token : 

Access tokens are short-lived credentials used to authenticate API requests. Their limited lifetime improves security by reducing the impact of token theft. However, frequent expiration would require users to log in repeatedly.
To solve this, refresh tokens are used. Refresh tokens are long-lived and are only used to obtain new access tokens, not to access APIs directly. They allow users to stay logged in without compromising security.

Because refresh tokens are sensitive, they are stored securely (usually as hashed values on the server and in HTTP-only cookies on the client) and rotated on every use. This combination of short-lived access tokens and securely managed refresh tokens provides both strong security and a smooth user experience.