#
# CSCI-E 64 / CS 171: Data Visualization
# Harvard University Extension School
# Spring 2013
#
# PROJECT 2 - Scraper for Isle of Man TT competitor/rider data for Web Visualization
#
# Team:
# 	David Killeffer <rayden7@gmail.com>
#	Leo Mejia <kolopaisa@gmail.com>
#
# scraping data for "Isle of Man TT" competitor information from the Isle of Man TT Database;
# creates a combined CSV datafile with all information from individual rider pages
#
# (source: http://www.iomtt.com/TT-Database/competitors.aspx)
#
# __author__ = 'dkilleffer'


import csv, re, cStringIO, codecs, unicodedata, string, HTMLParser, time

from pattern.web import abs, URL, DOM, plaintext, strip_between
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
from pattern.web import URL, DOM, plaintext, strip_between, NODE, TEXT, COMMENT, ELEMENT, DOCUMENT



# use the unicodedata.normalize() function to convert special Unicode characters into their ASCII equivalents
def convertUnicodeToAscii(stringToConvert):
	if (isinstance(stringToConvert, unicode)):
		stringToConvert = unicodedata.normalize('NFKD', stringToConvert).encode('ascii','ignore')
	return stringToConvert


# remove any superscript links
def removeSuperscripts(stringToClean):
	stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	found_sup = re.match( '^(.*)(\<sup.*\/sup\>)(.*?)$', stringToClean)
	if ( found_sup and found_sup.group(2)) :
		stringToClean = found_sup.group(1) + found_sup.group(3)
		stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	return convertUnicodeToAscii(stringToClean)


# remove all occurrences of a given tag from the stringToClean
def removeTags(stringToClean, tagTypeToRemove):
	stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	found_sup = re.match( '^(.*)(\<'+re.escape(tagTypeToRemove)+'.*\/'+re.escape(tagTypeToRemove)+'\>)(.*)$', stringToClean)
	if ( found_sup and found_sup.group(2)) :
		stringToClean = found_sup.group(1) + found_sup.group(3)
		stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	return convertUnicodeToAscii(stringToClean)


# borrowed from:  http://stackoverflow.com/questions/354038/how-do-i-check-if-a-string-is-a-number-in-python
def is_number(s):
	try:
		float(s)
		return True
	except ValueError:
		return False



#unicode writer
class UnicodeWriter:
	"""
	A CSV writer which will write rows to CSV file "f",
	which is encoded in the given encoding.
	"""

	def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
		# Redirect output to a queue
		self.queue = cStringIO.StringIO()
		self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
		self.stream = f
		self.encoder = codecs.getincrementalencoder(encoding)()

	def writerow(self, row):
		# since we're including integers, they will bomb on the "s.encode("utf-8") line,
		# so we need to "stringify" those integers and create a new list for output to the CSV
		convertedRow = []
		for s in row :
			if (not isinstance(s, int) ) :
				convertedRow.append(s.encode("utf-8"))
			else:
				convertedRow.append(str(s))

		#self.writer.writerow([s.encode("utf-8") for s in row])
		self.writer.writerow( convertedRow )

		# Fetch UTF-8 output from the queue ...
		data = self.queue.getvalue()
		data = data.decode("utf-8")
		# ... and reencode it into the target encoding
		data = self.encoder.encode(data)
		# write to the target stream
		self.stream.write(data)
		# empty queue
		self.queue.truncate(0)

	def writerows(self, rows):
		for row in rows:
			self.writerow(row)


# define the BASE_URL for the Isle of Man TT Database website so
# that we can prepend this to relative URIs to get absolute URIs
BASE_URL = "http://www.iomtt.com"

header_row = [
	"Rider Name",
	"TT Database Webpage",
	"UPPERCASE Rider",
	"Biography",
	"Picture 1",
	"Picture 2",
	"Picture 3",
	"Weight",
	"Height",
	"Website",
	"TT Career Summary Position 1",
	"TT Career Summary Position 2",
	"TT Career Summary Position 3",
	"TT Career Summary Position 4",
	"TT Career Summary Position 5",
	"TT Career Summary Position 6",
	"TT Career Summary Position 7",
	"TT Career Summary Position 8",
	"TT Career Summary Position 9",
	"TT Career Summary Position 10",
	"TT Career Summary Position 11",
	"TT Career Summary Position 12",
	"TT Career Summary Position 13",
	"TT Career Summary Position 14",
	"TT Career Summary Position 15",
	"TT Career Summary Position 16",
	"TT Career Summary Position 17",
	"TT Career Summary Position 18",
	"TT Career Summary Position 19",
	"TT Career Summary Position 20",
	"TT Career Summary Position 21",
	"TT Career Summary Position 22",
	"TT Career Summary Position 23",
	"TT Career Summary Position 24",
	"TT Career Summary Position 25",
	"TT Career Summary Position 26",
	"TT Career Summary Position 27",
	"TT Career Summary Position 28",
	"TT Career Summary Position 29",
	"TT Career Summary Position 30",
	"TT Career Summary Position 31",
	"TT Career Summary Position 32",
	"TT Career Summary Position 33",
	"TT Career Summary Position 34",
	"TT Career Summary Position 35",
	"TT Career Summary Position 36",
	"TT Career Summary Position 37",
	"TT Career Summary Position 38",
	"TT Career Summary Position 39",
	"TT Career Summary Position 40",
	"TT Career Summary Position 41",
	"TT Career Summary Position 42",
	"TT Career Summary Position 43",
	"TT Career Summary Position 44",
	"TT Career Summary Position 45",
	"TT Career Summary Position 46",
	"TT Career Summary Position 47",
	"TT Career Summary Position 48",
	"TT Career Summary Position 49",
	"TT Career Summary Position 50",
	"TT Career Summary Position 51",
	"TT Career Summary Position 52",
	"TT Career Summary Position 53",
	"TT Career Summary Position 54",
	"TT Career Summary Position 55",
	"TT Career Summary Position 56",
	"TT Career Summary Position 57",
	"TT Career Summary Position 58",
	"TT Career Summary Position 59",
	"TT Career Summary Position 60",
	"TT Career Summary Position 61",
	"TT Career Summary Position 62",
	"TT Career Summary Position 63",
	"TT Career Summary Position 64",
	"TT Career Summary Position 65",
	"TT Career Summary Position 66",
	"TT Career Summary Position 67",
	"TT Career Summary Position 68",
	"TT Career Summary Position 69",
	"TT Career Summary Position 70",
	"TT Career Summary Position 71",
	"TT Career Summary Position DNF",
	######## highest summary position goes up to 71
]


# The Isle Of Man TT Database section on "Competitors" lists the riders alphabetically by last name, so there
# are 26 pages of competitor info, and then each competitor is linked from the listing page according to the
# first letter of their last name
#
# http://www.iomtt.com/TT-Database/Competitors.aspx?filter=A
# http://www.iomtt.com/TT-Database/Competitors.aspx?filter=B
# http://www.iomtt.com/TT-Database/Competitors.aspx?filter=C
#    ...   ...   ...
# http://www.iomtt.com/TT-Database/Competitors.aspx?filter=X
# http://www.iomtt.com/TT-Database/Competitors.aspx?filter=Y
# http://www.iomtt.com/TT-Database/Competitors.aspx?filter=Z
#
competitor_urls =	[
						#"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=A",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=B",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=C",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=D",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=E",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=F",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=G",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=H",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=I",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=J",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=K",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=L",
						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=M"
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=N",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=O",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=P",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=Q",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=R",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=S",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=T",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=U",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=V",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=W",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=X",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=Y",
#						"http://www.iomtt.com/TT-Database/Competitors.aspx?filter=Z",
					];


for competitorLetterUrl in competitor_urls :

	# because each letter of competitors takes a long time to load all the data, spit out separate CSVs per
	# alphabetical letter so we can observe the CSVs being successfully created as the script runs
	csv_format = "csv/rider-data-%s.csv"
	csv_filename = convertUnicodeToAscii(csv_format % competitorLetterUrl[-1])

	# Creating the csv output file for writing into as well as defining the writer
	output = open(csv_filename, "wb")
	writer = UnicodeWriter(output)

	# add header row
	writer.writerow(header_row)

	# load up the current competitors listing URL
	url = URL(competitorLetterUrl)
	dom = DOM(url.download(cached=True))

	riderList = dom.by_id("riderlist")

	#       <div class="ttDatabaseNav">
	#         <h4>A</h4>
	#         <ul id="riderlist">
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=5509&amp;filter=A">A.Domini, AKA</a></li>
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=6016&amp;filter=A">Abbey, Ben</a></li>
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=6876&amp;filter=A">Abbott, Roger</a></li>
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=202&amp;filter=A">Abbott, A R</a></li><li>
	#           ... ... ...
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=9845&amp;filter=A">Aylott, Mike</a></li>
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=3178&amp;filter=A">Ayres, Asa</a></li>
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=9071&amp;filter=A">Ayres, Brian</a></li>
	#           <li><a href="/TT-Database/competitors.aspx?ride_id=7&amp;filter=A">Ayton, R</a></li>
	#         </ul>
	#       </div>
	#     </div>

	# get all the list items
	allListElements = riderList.by_tag("li")

	for li in allListElements :
		riderLinks = li.by_tag("a")

		# make sure we have at least one good link to follow
		if (len(riderLinks) == 1) :

			# determine the URL to use to get each individual rider's information page
			riderLink = BASE_URL + riderLinks[0].attributes["href"]
			riderURL = URL(riderLink)

			# and load up the current rider's page
			riderDOM = DOM(riderURL.download(cached=True))

			# declare all the empty strings that we will use to store each attribute of the rider in the CSV
			rider_name = ""
			tt_database_webpage = convertUnicodeToAscii(riderLink)
			uppercase_rider = ""
			biography = ""
			picture_1 = ""
			picture_2 = ""
			picture_3 = ""
			weight = ""
			height = ""
			website = ""

			# Rider name
			if ( riderDOM.by_id("content") ):
				contentArea = riderDOM.by_id("content")

				if ( contentArea.by_tag("div.ttDatabaseCompetitor") and contentArea.by_tag("div.ttDatabaseCompetitor")[0] ) :

					if ( contentArea.by_tag("div.ttDatabaseCompetitor")[0].by_tag("h1") ) :

						# RIDER NAME, and UPPERCASE RIDER
						if ( contentArea.by_tag("div.ttDatabaseCompetitor")[0].by_tag("h1")[0] ) :
							# remove any newlines, tabs, carriage returns, and spaces
							riderNameBlock = contentArea.by_tag("h1")[0].content.replace('\n','').replace('\t','').replace('\r','').strip()
							name_match = re.match(r'Competitor Profile:(.*)$', riderNameBlock)
							if (name_match and name_match.group(1)) :
								#rider_name = HTMLParser.HTMLParser().unescape(convertUnicodeToAscii(name_match.group(1).replace('&nbsp;','')))
								rider_name = convertUnicodeToAscii(name_match.group(1).replace('&nbsp;',' '))
								# this should match if the rider's last name is all capitalized (and the rider's last name is 2 or more characters in length)
								uppercase_match = re.search(r'\W?([A-Z]){2,}$', rider_name, flags=re.DOTALL|re.MULTILINE)
								if (uppercase_match) :
									uppercase_rider = "Y"
								else:
									uppercase_rider = "N"

						# BIOGRAPHY
						if ( contentArea.by_tag("div.ttDatabaseCompetitor")[0].by_tag("div.grid_7") and contentArea.by_tag("div.ttDatabaseCompetitor")[0].by_tag("div.grid_7")[0] ) :
							allRiderInfo = contentArea.by_tag("div.ttDatabaseCompetitor")[0].by_tag("div.grid_7")[0].content

							# find the string index of the first occurrence of <h1>Biography</h1>
							bioHeader = "<h1>Biography</h1>"
							leftIdx = allRiderInfo.find(bioHeader)
							rightIdx = allRiderInfo.find("<div class=\"clear\"></div>")
							biography = allRiderInfo[leftIdx+len(bioHeader):rightIdx]
							biography = convertUnicodeToAscii(biography.replace('<p>','  ').replace('</p>','').replace('\r','').replace('\n','').strip())

						# PICTURES
						if ( contentArea.by_tag("img.RiderGallery") and len(contentArea.by_tag("img.RiderGallery")) >= 1) :
							photos = []
							for img in contentArea.by_tag("img.RiderGallery") :
								if (img.attributes["src"]) :
									photos.append(convertUnicodeToAscii(BASE_URL + img.attributes["src"]))
							if (len(photos) >= 1) :
								picture_1 = photos[0]
							if (len(photos) >= 2) :
								picture_2 = photos[1]
							if (len(photos) >= 3) :
								picture_3 = photos[2]

						#############################
						#
						# HEIGHT, WEIGHT, WEBSITE
						# these will be manually entered for particular riders of interest (the Isle of Man TT
						# Database does not have this information; we may manually locate this info online and
						# add to the CSV as necessary)
						#
						#############################

						# define the array that holds how many times the rider has placed in each position (1-71 and
						# DNF) here so for riders where it is not present we can at the end populate it with all zeroes
						finishTotals = []
						actualPositionFinishes = []
						actualNumberOfTimesFinishes = []

						# TT Career Summary info
						if ( contentArea.by_attribute(summary="TT Career Summary") and contentArea.by_attribute(summary="TT Career Summary")[0] ) :

							table = contentArea.by_attribute(summary="TT Career Summary")[0]
							rows = table.by_tag("tr")

							# for the first row, we need to find out what "positions" the rider finished in; for example,
							# for GUY MARTIN (http://www.iomtt.com/TT-Database/competitors.aspx?ride_id=8430&filter=M),
							# he has finished in the following places respectively:
							#
							# 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 12th, 13th, 21st, and DNF (Did Not Finish)
							#
							# so we want "actualPositionFinishes" to contain each of those values (as integers,
							# or string in the case of "DNF"
							for row in rows[0:1] :
								for cell in row.by_tag("td") :
									if (cell.content and is_number(cell.content)) :
										actualPositionFinishes.append(int(cell.content))
									elif ( cell.by_tag("abbr") and cell.by_tag("abbr")[0] and cell.by_tag("abbr")[0].content.strip() == "DNF") :
										actualPositionFinishes.append("DNF")
									else :
										continue

							# now get the number of times the rider has finished in each position
							for row in rows[1:] :
								for cell in row.by_tag("td") :
									if (cell.content and is_number(cell.content)) :
										actualNumberOfTimesFinishes.append(int(cell.content))
									#elif ( cell.by_tag("abbr") and cell.by_tag("abbr")[0] and cell.by_tag("abbr")[0].content.strip() == "DNF") :
									#	actualNumberOfTimesFinishes.append("DNF")
									else :
										continue

							# now we need to construct an array that is 72 elements in size - the index of the array
							# corresponds to 1-the number position finish (e.g., index 0 is the number of 1st place
							# finishes, index 1 is the number of 2nd place finishes, ..., index 70 is the number of
							# 71st place finishes, and index 71 is the number of "DNF" (Did Not Finish) race finishes
							finishTotals = []
							actualPositionFinishesIdx = 0
							c = 1
							for pos in actualPositionFinishes:
								if (c > 72):
									break

								while (c < pos and c < 72):
									finishTotals.append(0)
									c += 1

								if (c == pos):
									finishTotals.append( actualNumberOfTimesFinishes[actualPositionFinishesIdx] )
									actualPositionFinishesIdx += 1
									c += 1
									continue

						# if the finishTotals array now has less than 72 elements in it, put in zeroes for all the remaining indexes
						if (len(finishTotals) < 72) :
							missing = 72 - len(finishTotals)
							blankArr = [0] * missing
							finishTotals += blankArr

							# next, process the number of "DNF" finishes
						if ( len(actualPositionFinishes) >= 1 and actualPositionFinishes[-1] == "DNF" ) :
							finishTotals[-1] = actualNumberOfTimesFinishes[-1]


		print "Processed Rider [",rider_name,"] with data from [", tt_database_webpage, "]"

		# we need to combine the two lists for output to the CSV
		rider_info_list = [rider_name, tt_database_webpage, uppercase_rider, biography, picture_1, picture_2, picture_3, weight, height, website]
		combinedArr = rider_info_list + finishTotals

		writer.writerow( combinedArr )


output.close()

print "All done!  Check ", csv_filename, " for results."
print
