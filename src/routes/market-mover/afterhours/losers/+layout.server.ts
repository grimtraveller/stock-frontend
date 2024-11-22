export const load = async ({ locals, setHeaders }) => {
  const { apiURL, apiKey } = locals;


  const getMarketMover = async () => {
    const postData = { category: "afterhours", params: 'losers' };
    const response = await fetch(apiURL + "/pre-after-market-movers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(postData),
    });

    const output = await response.json();
    setHeaders({ "cache-control": "public, max-age=60*5" });

    return output;
  };

  return {
    getMarketMover: await getMarketMover(),
  };
};