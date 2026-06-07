import { streamText, convertToModelMessages, type UIMessage } from "ai"

export const maxDuration = 30

type ChatRequestBody = {
  messages: UIMessage[]
  mode?: "chat" | "generate-personality" | "preview-identity"
  selectedNft?: {
    name?: string
    contractAddress?: string
    tokenId?: string
    image?: string
    description?: string
    traits?: Record<string, string | number>
  }
  identitySettings?: {
    tone?: string
    role?: string
    memoryStyle?: string
    autonomyLevel?: string
    creativity?: string
    boundaries?: string
  }
}

const personalityFormat = `
Return personality profiles in this exact JSON-style format:

{
  "name": "",
  "title": "",
  "coreIdentity": "",
  "personalityTraits": [],
  "speakingStyle": "",
  "knowledgeFocus": [],
  "behaviorRules": [],
  "boundaries": [],
  "exampleGreeting": "",
  "visualIdentityPrompt": "",
  "systemPrompt": ""
}
`

export async function POST(req: Request) {
  const {
    messages,
    mode = "chat",
    selectedNft,
    identitySettings,
  }: ChatRequestBody = await req.json()

  const nftContext = selectedNft
    ? `
Selected NFT Context:
Name: ${selectedNft.name ?? "Unknown"}
Contract: ${selectedNft.contractAddress ?? "Unknown"}
Token ID: ${selectedNft.tokenId ?? "Unknown"}
Description: ${selectedNft.description ?? "None"}
Traits: ${JSON.stringify(selectedNft.traits ?? {}, null, 2)}
`
    : "No NFT selected."

  const settingsContext = identitySettings
    ? `
User Identity Settings:
${JSON.stringify(identitySettings, null, 2)}
`
    : "No custom identity settings provided."

  const system =
    mode === "generate-personality"
      ? `
You are the personality architect for Universal Autonomous Accounts.

The user is creating an AI identity connected to an NFT they own.
Use the NFT as inspiration, but do not claim the NFT itself is alive.
Create a usable AI personality profile that can later become metadata for an AI identity NFT.

${nftContext}

${settingsContext}

${personalityFormat}

Keep the output structured, imaginative, and usable in an app.
`
      : mode === "preview-identity"
        ? `
You are roleplaying as the user's generated Universal Autonomous Account identity.

Use the selected NFT and identity settings as inspiration.
Stay in character.
Be helpful, concise, and distinct.
Do not mention that you are only a simulation unless directly asked.

${nftContext}

${settingsContext}
`
        : `
You are a helpful assistant inside Universal Autonomous Accounts.
Help the user create, test, refine, and understand AI identity NFTs.
Keep responses clear and concise.
`

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}