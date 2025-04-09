This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

#### We are using Watsonx.ai Flows Engine - link: https://wxflows.ibm.stepzen.com/

#### Convex for Database.

- 1st step: Created account
- 2nd step: Created a project called ailien-agent
- 3rd step: installed convex on my project using the command: pnpm add convex
- 4th step: Started development environment to configure convex on my project using the command: npx convex dev
- 5th step: By doing so 2 env variables will be added to the .env.local file

#### Convex & Clerk

Now we are going to connect Clerk to Convex on Convex's website

- 1st step: Go to Convex website and find Convex and Clerk and follow the steps
- 2nd step: Go to Clerk website and go to JWT templates and select Convex in the dialog box that will open
- 3rd step: Now create a file called auth.config.ts and paste the code from Convex 4th step
- 4th step: Paste the issuer URL provided by Clerk and paste it in the auth.config.ts file
- 5th step: Open the Convex dashboard dev to the Personal Deployment Settings and there is where you will paste the issuer URL
- 6th step: Install clerk-react package with the comman pnpm install @clerk/clerk-react
- 7th step: Wrap our app in the layout file with the ConvexClientProvider

## Steps to run the project

I need 3 terminals running

1 - For Next.js - pnpm dev
2 - Convex - npx convex dev
3 - A spare one - for extra things

## Getting started with Langchain

Check the docs: [Langchain: Chat models and prompts](https://js.langchain.com/docs/tutorials/llm_chain).
Install via pnpm: pnpm add langchain @langchain/core @langchain/anthropic @langchain/langgraph.

- 1st step - Create a file named langgraph.ts inside the lib folder
- 2nd step - Initialize the model
- 3rd step - Top up 💰 Anthropic API in order to use it, it is a very advanced model, there are a lot free but I sticked to Anthropic
- 4th step - Go to Claude website [Claude](https://claude.ai)
- 5th step - Create your account in both [Anthropic](https://www.anthropic.com/) and also [Claude](https://claude.ai)
- 6th step - Buy credits [Anthropic Console](https://console.anthropic.com/dashboard). It's just 5 dollars.
- 7th step - Once you buy your credits then you can grab your API key and store it in the .env file. Name the variable ANTHROPIC_API_KEY=???

## Configuring the langgraph.ts file

There was some config made and I had to install a package by wxflows

1st step - Install the package - pnpm add @wxflows/sdk or the beta version pnpm add@wxflows/sdk@beta
2nd step - Make the appropriate configs in the langgraph.ts file
3rd step - Create w wxflows folder cd into this folder and run the command wxflows init. This will create a file called wxflows.config.json
4th step - Create our first data source by running the command wxflows import tool https://raw.githubusercontent.com/IBM/wxflows/refs/heads/main/tools/wikipedia.zip provided in the IBM Stepzen website. The command has to be in the wxflows folder. This command will generate a wikipedia folder and some graphql files. I also installed Google Books wxflows import tool https://raw.githubusercontent.com/IBM/wxflows/refs/heads/main/tools/google_books.zip
5th step - Run the command: wxflows import curl: https://dummyjson.com/comments to make tool. This will create a folder called curl in the wxflows folder with a file called index.graphql. We also added Youtube Transcript wxflows import tool https://raw.githubusercontent.com/IBM/wxflows/refs/heads/main/tools/youtube_transcript.zip
6th step - Once you are done with your tools we have to deploy the tools with the command: wxflows deploy. Still in the wxflows directory
7th step - The command above will generate a WXFLOWS_ENDPOINT which will be the 1st of the 2 urls that appear once you have executed the deploy command above. And we need another env variable the WXFLOWS_APIKEY which we can get by running the command wxflows whoami --apikey

<!-- Repo: https://github.com/sonnysangha/ai-agent-langchain-langgraph-convex-clerk-ibm-wxtools-nextjs15/ -->
