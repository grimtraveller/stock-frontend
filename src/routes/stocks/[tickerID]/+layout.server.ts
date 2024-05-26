
const usRegion = ['cle1','iad1','pdx1','sfo1'];

let companyName;

function cleanString(input) {
    // Define a list of substrings to remove (case insensitive)
    const substringsToRemove = [
      'Depositary',
      'Inc.',
      'Incorporated',
      'Holdings',
      'Corporation',
      'Corporations',
      'LLC',
      'Holdings plc American Depositary Shares',
      'Holding Corporation',
      'Oyj',
      'Company',
      'The',
      'plc',
    ];
  
    // Create a regular expression pattern that matches any of the substrings surrounded by word boundaries
    const pattern = new RegExp(`\\b(${substringsToRemove?.join('|')})\\b|,`, 'gi');
  
    // Use the replace method to remove the specified substrings and commas, then trim the result
    return input?.replace(pattern, '')?.trim();
  }

const fetchData = async (apiURL, endpoint, ticker) => {

  const postData = {
    ticker: ticker
  };

  const response = await fetch(apiURL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  });

  const output = await response?.json();

  if(endpoint === '/stockdeck')
    {
      companyName = cleanString(output?.at(0)?.companyName);
    }

  return output;
};

const fetchWatchlist = async (fastifyURL, userId) => {

    const postData = {'userId': userId}
    const response = await fetch(fastifyURL+'/all-watchlists', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });


    const output = (await response?.json())?.items;
    return output;
}

async function fetchPortfolio(fastifyURL, userId)
{
  const postData = {'userId': userId};

    const response = await fetch(fastifyURL+'/get-portfolio-data', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    const output = (await response?.json())?.items;
    
    return output
}

export const load = async ({ params, locals}) => {

 
    const userRegion = locals?.region?.split("::")[0];

    let apiURL;
    let fastifyURL;

    if (usRegion?.includes(userRegion)) {
        apiURL = import.meta.env.VITE_USEAST_API_URL;
        fastifyURL = import.meta.env.VITE_USEAST_FASTIFY_URL;
    } else {
        apiURL = import.meta.env.VITE_EU_API_URL;
        fastifyURL = import.meta.env.VITE_EU_FASTIFY_URL;
    };
  
    


    const promises = [
    fetchData(apiURL,'/fair-price',params.tickerID),
    fetchData(apiURL,'/similar-stocks',params.tickerID),
    //fetchData(apiURL,'/price-prediction',params.tickerID),
    //fetchData(apiURL,'/trading-signals',params.tickerID),
    fetchData(apiURL,'/shareholders',params.tickerID),
    fetchData(apiURL,'/stockdeck',params.tickerID),
    fetchData(apiURL,'/revenue-segmentation',params.tickerID),
    fetchData(apiURL,'/stock-correlation',params.tickerID),
    fetchData(apiURL,'/analyst-summary-rating',params.tickerID),
    fetchData(apiURL,'/analyst-estimate',params.tickerID),
    fetchData(apiURL,'/stock-quote',params.tickerID),
    fetchData(apiURL,'/stock-rating',params.tickerID),
    fetchData(apiURL,'/options-bubble',params.tickerID),
    fetchData(apiURL,'/bull-bear-say',params.tickerID),
    fetchData(apiURL,'/wiim',params.tickerID),
    fetchData(apiURL,'/top-etf-ticker-holder',params.tickerID),
    fetchData(apiURL,'/sentiment-analysis',params.tickerID),
    fetchData(apiURL,'/trend-analysis',params.tickerID),
    fetchData(apiURL,'/price-analysis',params.tickerID),
    fetchData(apiURL,'/fundamental-predictor-analysis',params.tickerID),
    fetchData(apiURL,'/value-at-risk',params.tickerID),
    fetchData(apiURL,'/enterprise-values',params.tickerID),
    fetchData(apiURL,'/historical-price',params.tickerID),
    fetchData(apiURL,'/one-day-price',params.tickerID),
    fetchWatchlist(fastifyURL, locals?.user?.id),
    fetchPortfolio(fastifyURL, locals?.user?.id)
  ];

  const [
    getFairPrice,
    getSimilarStock,
    //getPricePrediction,
    //getTradingSignals,
    getShareHolders,
    getStockDeck,
    getRevenueSegmentation,
    getCorrelation,
    getAnalystRating,
    getAnalystEstimate,
    getStockQuote,
    getStockTARating,
    getOptionsData,
    getBullBearSay,
    getWhyPriceMoved,
    getTopETFHolder,
    getSentimentAnalysis,
    getTrendAnalysis,
    getPriceAnalysis,
    getFundamentalAnalysis,
    getVaR,
    getEnterPriseValues,
    getHistoricalPrice,
    getOneDayPrice,
    getUserWatchlist,
    getUserPortfolio,
  ] = await Promise.all(promises);

  /*
  setHeaders({
    'cache-control': 'public, max-age=500'
    });
    */

  return {
    getFairPrice,
    getSimilarStock,
    //getPricePrediction,
    //getTradingSignals,
    getShareHolders,
    getStockDeck,
    getRevenueSegmentation,
    getCorrelation,
    getAnalystRating,
    getAnalystEstimate,
    getStockQuote,
    getStockTARating,
    getOptionsData,
    getBullBearSay,
    getWhyPriceMoved,
    getTopETFHolder,
    getSentimentAnalysis,
    getTrendAnalysis,
    getPriceAnalysis,
    getFundamentalAnalysis,
    getVaR,
    getEnterPriseValues,
    getHistoricalPrice,
    getOneDayPrice,
    getUserWatchlist,
    getUserPortfolio,
    companyName,
  };

  
};