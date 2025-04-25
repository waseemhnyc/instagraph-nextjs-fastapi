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
          <h2 className="relative px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            Saved Graphs
          </h2>
          <ScrollArea className="h-[650px] px-1">
            <div className="space-y-1 p-2">
              {searchHistory?.length > 0 ? (
                searchHistory.map((searchItem, i) => (
                  <div key={`${searchItem.searchValue}-${i}`} className="flex justify-between items-center mb-1 rounded-md hover:bg-accent/50 transition-colors">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium py-5 px-4 rounded-md"
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
                      className="h-9 w-9 p-0 mr-1"
                      // onClick={() => handleDelete(searchItem)}
                    >
                      <TrashIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button> */}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No saved graphs yet</p>
                  <p className="text-sm mt-1">Search for a topic to create a graph</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}