# Cheez Trivia

Cheez Trivia is a real-time multiplayer trivia game built with TypeScript, Next.js, and Socket.IO. Players can join a game, answer trivia questions, and compete against others in real time.

## Tech Stack

### Frontend
- **Next.js** (App Router)
- **React 19**
- **TypeScript**
- **Zustand** (for state management)
- **TanStack Query v5** (for data fetching and caching)
- **Socket.IO Client** (for real-time communication)
- **Tailwind CSS** (for styling)
- **Radix UI** (for accessible UI components)

### Backend (Trivia API)
- **Express.js**
- **Socket.IO** (WebSocket-based real-time communication)
- **PostgreSQL** (database for storing trivia questions and game data)
- **Redis** (for caching and real-time event handling)

## Features
- **Real-time gameplay** powered by WebSockets (Socket.IO)
- **Multiplayer support** with room-based games
- **Automatic game progression** with a countdown timer for each question
- **Reconnect support** for players to rejoin their games
- **Dark mode support**
- **Animations and sound effects** for an engaging user experience

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- npm or [Yarn](https://yarnpkg.com/)
- A running instance of the Trivia API [`cheez-trivia.api`](https://github.com/ocheezyy/cheez-trivia.api)
- A [Redis](https://redis.io/) instance

### Installation

#### 1. Clone the repository:
```sh
git clone https://github.com/ocheezyy/cheez-trivia.git
cd cheez-trivia
```

#### 2. Install dependencies:
```sh
npm install  # or yarn install
```

#### 3. Create an `.env.local` file:
```sh
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GAME_ROOM_KEY=any-string-here
```

#### 4. Start the development server:
```sh
npm run dev # or yarn dev
```

The application will be available at `http://localhost:3000`

## Running the Trivia API
Ensure you have the trivia backend [`cheez-trivia.api`](https://github.com/ocheezyy/cheez-trivia.api) running. If not, clone and set it up:
```sh
git clone https://github.com/ocheezyy/trivia.api.git
cd cheez-trivia.api
npm install
npm run dev
```
The API should be running at `http://localhost:3001`.

## Deployment
To build and deploy the project:
```sh
npm run build
```
Then run:
```sh
npm start
```

## Contributing
Pull requests are welcome! Feel free to submit issues or feature requests.

## License
MIT License. See [`LICENSE`](https://github.com/ocheezyy/cheez-trivia.web/LICENSE) file for details.

