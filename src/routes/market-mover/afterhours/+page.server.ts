export const load = async ({ locals }) => {
  const { apiURL, apiKey } = locals;

  const getMarketMover = async () => {
    const postData = { params: "afterhours" };
    const response = await fetch(apiURL + "/pre-after-market-movers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(postData),
    });

    const output = await response.json();

    return output;
  };

  return {
    getMarketMover: await getMarketMover(),
  };
};
