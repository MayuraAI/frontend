import { ContentType, DataListType } from "@/types"
import { FC, useState } from "react"
import { SidebarCreateButtons } from "./sidebar-create-buttons"
import { SidebarDataList } from "./sidebar-data-list"

interface SidebarContentProps {
  contentType: ContentType
  data: DataListType
}

export const SidebarContent: FC<SidebarContentProps> = ({
  contentType,
  data
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData: any = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    // Subtract 50px for the height of the workspace settings
    <div className="flex max-h-[calc(100%-50px)] grow flex-col">
      <div className="mt-4 flex items-center mb-6">
        <SidebarCreateButtons
          contentType={contentType}
          hasData={data.length > 0}
        />
      </div>

      <SidebarDataList contentType={contentType} data={filteredData} />
    </div>
  )
}
