import cloudscraper
import sys
scraper = cloudscraper.create_scraper()
url = sys.argv[1]
result = scraper.get(url).text
print(result)
# python scraper.py <url>