import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Params = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const search = searchParams.get("message");
    if (search == "logout") {
      router.refresh();
    }
  }, [router, searchParams, pathname]);
  return null;
};

export default Params;
