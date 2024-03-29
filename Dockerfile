FROM node:20.9.0-alpine

# Install dependencies
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && \
    apk add --no-cache cairo-dev pango-dev giflib-dev && \
    npm ci

# Install fonts
RUN mkdir -p /usr/share/fonts/truetype/lato
ADD https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf /usr/share/fonts/truetype/lato/
ADD https://github.com/google/fonts/raw/main/ofl/lato/Lato-Bold.ttf /usr/share/fonts/truetype/lato/
ADD https://github.com/google/fonts/raw/main/ofl/lato/Lato-Italic.ttf /usr/share/fonts/truetype/lato/
ADD https://github.com/google/fonts/raw/main/ofl/lato/Lato-BoldItalic.ttf /usr/share/fonts/truetype/lato/
RUN fc-cache -f -v

# Copy sources and build
COPY . ./

# Set up environment variables
ARG ENVIRONMENT=production
ARG BOT_CLIENT_ID=EMPTY
ARG BOT_TOKEN=EMPTY
ARG API_PORT=3000
ARG MONGODB_URI=mongodb://localhost:27017/mcarcades
ARG DATABASE_PREFIX=prod_
ARG PERSPECTIVE_API_TOKEN=EMPTY
ARG OPENAI_API_TOKEN=EMPTY
ARG TAG_SALT=EMPTY
ARG GUILD_ID=EMPTY
ARG ROLE_PLAYER_ID=EMPTY
ARG ROLE_LINKED_ID=EMPTY
ARG ROLE_MODERATOR_ID=EMPTY
ARG ROLE_ADMINISTRATOR_ID=EMPTY
ARG CHANNEL_WELCOME_ID=EMPTY
ARG CHANNEL_STAFF_ALERT_ID=EMPTY
ARG FORBIDDEN_SUBJECTS=EMPTY

ENV NODE_ENV=${ENVIRONMENT}
ENV ENVIRONMENT=${ENVIRONMENT}
ENV BOT_CLIENT_ID=${BOT_CLIENT_ID}
ENV BOT_TOKEN=${BOT_TOKEN}
ENV API_PORT=${API_PORT}
ENV MONGODB_URI=${MONGODB_URI}
ENV DATABASE_PREFIX=${DATABASE_PREFIX}
ENV PERSPECTIVE_API_TOKEN=${PERSPECTIVE_API_TOKEN}
ENV OPENAI_API_TOKEN=${OPENAI_API_TOKEN}
ENV TAG_SALT=${TAG_SALT}
ENV GUILD_ID=${GUILD_ID}
ENV ROLE_PLAYER_ID=${ROLE_PLAYER_ID}
ENV ROLE_LINKED_ID=${ROLE_LINKED_ID}
ENV ROLE_MODERATOR_ID=${ROLE_MODERATOR_ID}
ENV ROLE_ADMINISTRATOR_ID=${ROLE_ADMINISTRATOR_ID}
ENV CHANNEL_WELCOME_ID=${CHANNEL_WELCOME_ID}
ENV CHANNEL_STAFF_ALERT_ID=${CHANNEL_STAFF_ALERT_ID}
ENV FORBIDDEN_SUBJECTS=${FORBIDDEN_SUBJECTS}

# Run the app
EXPOSE ${API_PORT}
CMD [ "npm", "run", "start" ]
