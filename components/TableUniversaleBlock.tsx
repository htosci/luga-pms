import { UniversalTable } from "./UniversalTable";
import { useTableData } from "@/hooks/useTableData";

interface BlockTableUniProp{
    tableName: string
    showAll?: boolean
    createble?: boolean
    editeble?: boolean
}

export default function BlockTableUni({tableName, showAll, createble, editeble}: BlockTableUniProp){
    const {data, loading} = useTableData(tableName)
    

}