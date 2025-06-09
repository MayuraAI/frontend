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
    <div className="flex max-h-[calc(100%-50px)] grow flex-col space-y-4">
      <div className="flex items-center">
        <SidebarCreateButtons
          contentType={contentType}
          hasData={data.length > 0}
        />
      </div>

      <SidebarDataList contentType={contentType} data={filteredData} />
    </div>
  )
}
