import axios from "axios";
import { JSDOM } from "jsdom";

export class DataController {
  static async getData(req, res) {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        return res.status(400).json({
          error: "keyword query parameter is required.",
        });
      }
      const HEADERS = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        Referer: "https://www.amazon.com/",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      };

      const url = `https://www.amazon.com/s?k=${keyword}`;
      const response = await axios.get(url, { headers: HEADERS });
      const html = response.data;
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const productsElements = document.querySelectorAll(
        '.s-result-item[data-component-type="s-search-result"]'
      );

      const products = [];

      productsElements.forEach((productEl) => {
        const title =
          productEl.querySelector("h2.a-text-normal span").innerHTML ??
          "Not found";
        const rating = productEl.querySelector("i span")
          ? productEl.querySelector("i span").innerHTML
          : "Not found";
        const reviews = productEl.querySelector(
          '[data-csa-c-content-id="alf-customer-ratings-count-component"] span'
        )
          ? productEl.querySelector(
              '[data-csa-c-content-id="alf-customer-ratings-count-component"] span'
            ).innerHTML
          : "Not found";
        const imageUrl =
          productEl.querySelector(".s-image").getAttribute("src") ?? "";

        const url = productEl.querySelector("a").getAttribute("href");
        const productUrl = `https://www.amazon.com${url}`;

        const product = {
          title,
          rating,
          reviews,
          imageUrl,
          productUrl,
        };
        products.push(product);
      });

      return res.json({
        keyword,
        productsCount: products.length,
        products,
      });
    } catch (error) {
      return res.json({
        error: error.message,
      });
    }
  }
}
