useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      const accessToken = await getAccessToken(accounts, instance);
      headers = isAuthorizationRequired
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...headers,
          }
        : { "Content-Type": "application/json", ...headers };
  
      try {
        const res = await fetch(url, {
          method: method,
          headers,
        });
  
        if (!res.ok) {
          setError(res.status);
  
          // Check if the response is HTML
          const contentType = res.headers.get("content-type");
          let jsonStatus;
  
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const json = await res.json();
            jsonStatus = json;
            jsonStatus.status = res.status;
          } else {
            // Create a JSON array with only the response status
            jsonStatus = { status: res.status };
          }
  
          RoleCtx.setAuthoAccess(jsonStatus);
        } else {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        setError(e.status);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [url]);
  
  return error ? [null, loading, error] : [data, loading, null];
  