import { useEffect, useState } from "react";

export function useApi(fetcher, deps = [], intervalMs = 0) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetcher();
        if (active) { setData(result); setError(null); }
      } catch (e) {
        if (active) setError(e.message);
      }
    };
    load();
    const id = intervalMs ? setInterval(load, intervalMs) : null;
    return () => { active = false; if (id) clearInterval(id); };
  }, deps);

  return { data, error };
}