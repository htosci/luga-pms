// hooks/useTableData.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const useTableData = (tableName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient()

  const fetchData = async () => {

    const { data, error } = await supabase.from(tableName).select("*");
    if (error) console.error(error);
    else setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const sub = supabase
      .channel(`${tableName}-changes`)
      .on("postgres_changes", { event: "*", schema: "public", table: tableName }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [tableName]);

  return { data, loading, fetchData };
};