import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline"
import { SavedHistory } from "@/data/savedHistory"

interface SidebarProps {
  searchHistory: SavedHistory[];
  className: string;
  onHistorySelect: (historyItem: any) => void;
}

export function Sidebar({ className, searchHistory, onHistorySelect }: SidebarProps) {
  return (
    <div className={cn("pb-6", className)}>
      <div className="space-y-2">
        <div className="py-2">
          <h2 className="relative flex items-center gap-2 px-4 text-lg font-semibold tracking-tight">
            <ClockIcon className="size-5 text-primary" />
            Saved Graphs
          </h2>
          <ScrollArea className="h-[650px] px-1">
            <div className="space-y-1 p-2">
              {searchHistory?.length > 0 ? (
                searchHistory.map((searchItem, i) => (
                  <div key={`${searchItem.searchValue}-${i}`} className="mb-1 flex items-center justify-between rounded-md transition-colors hover:bg-accent/50">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-md px-4 py-5 font-medium"
                      onClick={() => onHistorySelect(searchItem)}
                    >
                      <span className="truncate">
                        {searchItem.searchValue}
                      </span>
                    </Button>
                    {/* Delete Button (Commented out for now) */}
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      className="mr-1 size-9 p-0"
                      // onClick={() => handleDelete(searchItem)}
                    >
                      <TrashIcon className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button> */}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No saved graphs yet</p>
                  <p className="mt-1 text-sm">Search for a topic to create a graph</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}