import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useNavigation } from "@/lib/context/navigation";
import { NavigationContext } from "@/lib/NavigationProvider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ReactTimeago from "react-timeago";

const ChatRow = ({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) => {
  const router = useRouter();
  const { closeMobileNav } = use(NavigationContext);
  const lastMessage = useQuery(api.messages.getLastMessage, {
    chatId: chat._id,
  });

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  return (
    <div
      className="group rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-2 pl-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate flex-1 font-medium -mt-2">
            {lastMessage ? (
              <>
                {lastMessage.role === "user" ? "You: " : "AI: "}
                {lastMessage.content.replace(/\\n/g, "\n")}
              </>
            ) : (
              <span className="text-gray-400">New Conversation</span>
            )}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-200 border border-gray-200 mt-1.5"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onDelete(chat._id);
            }}
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
          </Button>
        </div>
        {/* Last message appears at the top */}
        {lastMessage && (
          <p className="text-[11px] text-gray-400 -mt-3 font-medium">
            <ReactTimeago date={lastMessage.createdAt} />
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRow;
