import ChatInterface from "@/components/ChatInterface";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ChatPageProps {
  params: Promise<{
    chatId: Id<"chats">;
  }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const { chatId } = await params;

  const { userId } = await auth();

  // No user then send him/her to the landing page to authenticate
  if (!userId) {
    redirect("/");
  }

  try {
    // Create a convex instance "helper function" based on the client we created in the lib folder to fetch chats and messages
    const convex = getConvexClient();

    // If the user has ID then fetch all messages that belong to him/her
    const thresholdMessages = await convex.query(api.messages.list, { chatId });

    return (
      <div className="flex-1 overflow-hidden">
        <ChatInterface chatId={chatId} thresholdMessages={thresholdMessages} />
      </div>
    );
  } catch (error) {
    console.error("Error loading the chat:", error);
    redirect("/dashboard");
  }
};

export default ChatPage;
