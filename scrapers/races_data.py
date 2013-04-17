#
# CSCI-E 64 / CS 171: Data Visualization
# Harvard University Extension School
# Spring 2013
#
# PROJECT 2 - Scraper for Isle of Man TT events data for Web Visualization
#
# Team:
#	Leo Mejia <kolopaisa@gmail.com>
# 	David Killeffer <rayden7@gmail.com>
#
# Scrapes event statistics from the Isle of Man TT database.
# Scans their website for each year and records the following data.
# Race	Year	POS	Num	 rider_id Rider_URL Rider01	rider02	Machine	Time	Speed
#
# (source: http://www.iomtt.com/TT-Database)
#
# __author__ = 'lmejia'
# Remember to add comments
#


import csv
import unicodedata
import string
import HTMLParser
from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import time

def clean_unicode(s):
    return string.strip(s.encode('ascii','ignore'))
	
	
def convertUnicodeToAscii(stringToConvert):
	if (isinstance(stringToConvert, unicode)):
		stringToConvert = unicodedata.normalize('NFKD', stringToConvert).encode('ascii','ignore')
	return stringToConvert

# Create csv and add a header row	
output = open("races_data.csv", "wb")
writer = csv.writer(output)
writer.writerow(["Race","Year", "POS", "Num", "rider ID", "Rider URL", "Rider01", "rider02" , "Machine", "Time", "Speed" ])				

# Set up base URL and main URL. ERA 5 = 1991 - 2012
url = URL("http://www.iomtt.com/TT-Database/Events.aspx?meet_code=TT2012&era=5")
text_url = "http://www.iomtt.com"

# Get a hold of the dom and then Grab each Year's URL which is embeded on li tags.
dom = DOM(url.download(cached=True))
years = dom.by_class("ttDatabasePipeSeparator floatleft")[0].by_tag("li")

# Iterate over each year
for year in years:
	#Print commands are useful to monitor progress.
	print("")
	print year.by_tag("a")[0].attributes.get('href','')
	
	#Find the current year's URL and download its DOM.
	new_url = URL(text_url + year.by_tag("a")[0].attributes.get('href',''))
	year_url = URL(new_url)
	year_dom = DOM(year_url.download(cached=True))
	races = year_dom.by_class("grid_10 alpha hideoverflow")[0].by_tag("li")
	
	# The first 22 URLs belong to the year and this is consistent across the site so those URLs will be skipped.
	for race in races[22:-4]:
		#Download the DOM for the current Race-year combination.
		race_url_text = text_url + race.by_tag("a")[0].attributes.get('href','')
		race_url = URL(race_url_text)
		race_dom = DOM(race_url.download(cached=True))
		# The race statistics are nicely define on a HTML table. The folowing lines of code extra the data from that table.
		race_date = race_dom.by_class("grid_7 alpha floatleft")[0]
		title = HTMLParser.HTMLParser().unescape(race_date.by_tag("h1")[0].content)
		title02 = race_date.by_tag("li")[0].by_tag("a")[0].content
		race_stats = race_date.by_tag("tbody")[0].by_tag("tr")
		# More print commands to monitor progress.
		print title
		print title02
		# Go over each row in the table and write it on the csv file
		for stat in race_stats:
			pos = stat.by_tag("td")[0].content
			num = stat.by_tag("td")[1].content
			# riderstest = stat.by_tag("td")[2]
			riders = stat.by_tag("td")[2].by_tag("a")
			rider01_url = riders[0].attributes.get('href','')
			rider_id = rider01_url[38:]	
			rider01 = convertUnicodeToAscii(riders[0].content);
			# Handle cases were there are two rider who finish on the same position. Mostly true just for side car races.
			if len(riders) > 1:
				rider02 = riders[1].content
			else:
				rider02 = ""
			machine = stat.by_tag("td")[3].by_tag("a")[0].content
			race_time = stat.by_tag("td")[4].content
			avg_speed = HTMLParser.HTMLParser().unescape(stat.by_tag("td")[5].content)
			speed_02 = float(stat.by_tag("td")[5].content)
			# Write row to CSV file
			writer.writerow([string.strip(clean_unicode(title)), clean_unicode(title02),clean_unicode(pos), clean_unicode(num), clean_unicode(rider_id), clean_unicode(rider01_url),  clean_unicode(rider01), clean_unicode(rider02) , clean_unicode(machine), clean_unicode(race_time), speed_02 ])
	time.sleep(2)
	
#test_url = URL("http://www.iomtt.com/TT-Database/Events.aspx?meet_code=TT94%20%20&era=5")

output.close()

