const pages = [
  { title: "/" },
  { title: "/cramer-tracker" },
  { title: "/reddit-tracker" },
  { title: "/corporate-lobbying-tracker" },
  { title: "/most-shorted-stocks" },
  { title: "/stocks" },
  { title: "/etf" },
  { title: "/crypto" },
  { title: "/etf/etf-providers" },
  { title: "/etf/new-launches" },
  //{ title: "/trending" },
  { title: "/price-alert" },
  { title: "/heatmaps" },
  { title: "/donation" },
  //{title: "/portfolio"},
  { title: "/sentiment-tracker" },
  { title: "/insider-tracker" },
  { title: "/industry" },
  { title: "/industry/sectors" },
  { title: "/industry/all" },
  { title: "/newsletter" },
  { title: "/options-flow" },
  { title: "/ipos" },
  { title: "/list" },
  { title: "/list/dividend-kings" },
  { title: "/list/dividend-aristocrats" },
  { title: "/list/magnificent-seven" },
  { title: "/list/market-cap/mega-cap-stocks" },
  { title: "/list/market-cap/large-cap-stocks" },
  { title: "/list/market-cap/mid-cap-stocks" },
  { title: "/list/market-cap/small-cap-stocks" },
  { title: "/list/market-cap/micro-cap-stocks" },
  { title: "/list/market-cap/nano-cap-stocks" },
  { title: "/list/bitcoin-etfs" },
  { title: "/stock-screener" },
  { title: "/market-news" },
  { title: "/market-news/general" },
  { title: "/earnings-calendar" },
  { title: "/economic-calendar" },
  { title: "/dividends-calendar" },
  { title: "/market-mover/gainers" },
  { title: "/market-mover/losers" },
  { title: "/market-mover/active" },
  { title: "/market-mover/premarket/gainers" },
    { title: "/market-mover/premarket/losers" },
  { title: "/market-mover/afterhours/gainers" },
   { title: "/market-mover/afterhours/losers" },
  { title: "/hedge-funds" },
  { title: "/login" },
  { title: "/register" },
  { title: "/watchlist/stocks" },
  { title: "/watchlist/options" },
  //{ title: "/leaderboard" },
  //{ title: "/tournament-rules" },
  { title: "/pricing" },
  { title: "/terms-of-use" },
  { title: "/privacy-policy" },
  { title: "/imprint" },
  { title: "/about" },
  { title: "/contact" },
  //{ title: "/blog" },
  { title: "/politicians" },
  { title: "/politicians/flow-data" },
  { title: "/analysts" },
  { title: "/analysts/top-stocks" },
];

const site = "https://stocknear.com";
const website = "https://stocknear.com";

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
  //get all posts;
  const { apiKey, apiURL } = locals;



  const rawData = await fetch(apiURL + "/searchbar-data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
  });

  const outputStocks = await rawData.json();
  const stocks = outputStocks?.map((item) => ({
    id: item?.symbol,
    type: item?.type,
  }));

  const body = sitemap(stocks, pages);
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}

// Modified sitemap function
const sitemap = (
  stocks,
  pages,
) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${website}${page.title}</loc>
  </url>
  `,
    )
    .join("")}
  ${stocks
    .map((ticker) => {
      // Determine the path based on the type of the ticker
      const path =
        ticker.type === "Stock"
          ? "/stocks/"
          : ticker.type === "ETF"
            ? "/etf/"
            : "/crypto/";
      return `
    <url>
      <loc>${website}${path}${ticker.id}</loc>
    </url>
    `;
    })
    .join("")}
</urlset>`;
