import { Doc, Id } from "@/convex/_generated/dataModel";
import { NavigationContext } from "@/lib/NavigationProvider";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

const ChatRow = ({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) => {
  const router = useRouter();
  const { closeMobileNav } = use(NavigationContext);

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  return (
    <div
      className="group rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          Chat
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-200 border border-gray-200"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onDelete(chat._id);
            }}
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
          </Button>
        </div>
        {/* Last message appears at the top */}
        {/* {lastMessage && (
          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            <TimeAgo date={lastMessage.createdAt} />
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ChatRow;
