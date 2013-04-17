#
# HW5 - Scraper for Problem 2 - Web Visualization
#
# scraping data for "Isle of Man TT - List of Snaefell Mountain Course fatal accidents" at Wikipedia
#
# (source: http://en.wikipedia.org/wiki/List_of_Snaefell_Mountain_Course_fatal_accidents)
#
__author__ = 'dkilleffer'

# We are first importing from the csv, re, unicodedata, and pattern libraries
import csv
import re
import unicodedata
from pattern.web import URL, DOM, plaintext, strip_between, NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
#from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT


# use the unicodedata.normalize() function to convert special Unicode characters into their ASCII equivalents
def convertUnicodeToAscii(stringToConvert):
	if (isinstance(stringToConvert, unicode)):
		stringToConvert = unicodedata.normalize('NFKD', stringToConvert).encode('ascii','ignore')
	return stringToConvert


# remove any superscript links
def removeSuperscripts(stringToClean):
	stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	#found_sup = re.match( '^(.*)(\<sup.*\/sup\>)(.*)$', stringToClean)
	#found_sup = re.match( '^(.*)(\<sup.*\/sup\>)', stringToClean)
	found_sup = re.match( '^(.*)(\<sup.*\/sup\>)(.*?)$', stringToClean)

	#found_sup2 = re.match( '^(.*)(\<sup.*\/sup\>)(.*)?$', stringToClean)
	#found_sup2 = re.match( '^(.*)(\<sup.*\/sup\>)', stringToClean)

	if ( found_sup and found_sup.group(2)) :
		stringToClean = found_sup.group(1) + found_sup.group(3)
		stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	return convertUnicodeToAscii(stringToClean)


# remove all occurrences of a given tag from the stringToClean
def removeTags(stringToClean, tagTypeToRemove):
	stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces

	#found_sup = re.match( '^(.*)(\<'+tagTypeToRemove+'.*\/'+tagTypeToRemove+'\>)(.*)$', stringToClean)
	#found_sup = re.match( '^(.*)?(\<'+re.escape(tagTypeToRemove)+'.*\/'+re.escape(tagTypeToRemove)+'\>)(.*)?$', stringToClean)
	found_sup = re.match( '^(.*)(\<'+re.escape(tagTypeToRemove)+'.*\/'+re.escape(tagTypeToRemove)+'\>)(.*)$', stringToClean)

	if ( found_sup and found_sup.group(2)) :
		stringToClean = found_sup.group(1) + found_sup.group(3)
		stringToClean = stringToClean.replace('\n','').strip()  # remove any newlines or spaces
	return convertUnicodeToAscii(stringToClean)





#####

wikipedia_url = "http://en.wikipedia.org/wiki/List_of_Snaefell_Mountain_Course_fatal_accidents"

# Creating the csv output file for writing into as well as defining the writer
output = open("csv/hw5-isle-of-man-tt-race-deaths.csv", "wb")
writer = csv.writer(output)

# Get the DOM object.
url = URL(wikipedia_url)
dom = DOM(url.download(cached=True))

# header row
writer.writerow([
	"Number",
	"Rider Name",
	"Rider Country",
	"Rider Country Flag",
	"Date",
	"Year",
	"Place",
	"Race",
	"Event",
	"Machine"
])


deathsTable = dom.by_tag("table.wikitable")[0]
allRows = deathsTable.by_tag("tr")

#for r in allRows[1:]:
#for r in allRows[15:17]:
#for r in allRows[21:]:
#for r in allRows[3:]:
#for r in allRows[27:]:
#for r in allRows[1:]:
#for r in allRows[22:]:
#for r in allRows[25:]:
#for r in allRows[180:185]:
for r in allRows[1:]:

	number = 0
	rider_name = ""
	rider_country = ""
	rider_country_flag = ""
	date = ""
	year = ""
	place = ""
	race = ""
	event = ""
	machine = ""

	############### CELL 1: RIDER DEATH NUMBER ###############
	if (r.by_tag("td")[0]):
		number = r.by_tag("td")[0].content

	############### CELL 2: RIDER INFO: NAME, COUNTRY, FLAG ICON ###############
	rider_info = r.by_tag("td")[1]
	if (rider_info) :

		rider_name = removeSuperscripts(rider_info.content)
		rider_name = removeTags(rider_name, "span")

		match = re.match('^\<a.*\>(.*)\</a\>$', rider_name.strip())
		if (match):
			rider_name = match.group(1)



		#rider_name = plaintext(rider_info.content, keep={}, replace={'a':''}, linebreaks=0, indentation=False)
		#rider_name = plaintext(rider_info, keep={}, replace={'a':''}, linebreaks=0, indentation=False)
		#rider_name = plaintext(rider_info.content, keep={}, replace={'a':[]}, linebreaks=0, indentation=False)
		#rider_name = plaintext(rider_info.content, keep={}, replace={'a':[]}, linebreaks=0, indentation=False)
		#rider_name = plaintext(rider_info.content, keep=[], replace=blocks, linebreaks=0, indentation=False)


		if (rider_info.by_tag("span.flagicon")[0]) :
			rider_country = rider_info.by_tag("span.flagicon")[0].by_tag("img")[0].attributes["alt"]
			rider_country = convertUnicodeToAscii(rider_country)

			rider_country_flag = convertUnicodeToAscii(rider_info.by_tag("img")[0].attributes["src"])
			rider_country_flag = "http:" + rider_country_flag


		#if ( (len(rider_info.by_tag("a")) > 1) and rider_info.by_tag("a")[1] ) :
		#if ( isinstance( rider_name, ELEMENT) and len(rider_name.by_tag("a")) > 0 and rider_name.by_tag("a")[0] ) :
		#if ( len(rider_name.by_tag("a")) > 0 and rider_name.by_tag("a")[0] ) :

		#	rider_name = rider_name.by_tag("a")[0].content

			#rider_name = removeTags(rider_info.by_tag("a")[1].content, "span")

			#rider_name = convertUnicodeToAscii(rider_info.by_tag("a")[1].content)
			#rider_name = convertUnicodeToAscii(rider_name)
			#rider_name = removeSuperscripts(rider_name)
			#rider_name = removeTags(rider_name, "span")
		#else :
		#	rider_name = removeSuperscripts(rider_info.content)
			#rider_name = removeTags(rider_name, "span")




#<tr>
#<td>3</td>
#<td><span class="flagicon"><a href="/wiki/United_Kingdom" title="United Kingdom"><img alt="United Kingdom" src="//upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/22px-Flag_of_the_United_Kingdom.svg.png" width="22" height="11" class="thumbborder" srcset="//upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/33px-Flag_of_the_United_Kingdom.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/44px-Flag_of_the_United_Kingdom.svg.png 2x" /></a></span> <a href="/wiki/Fredrick_James_Walker" title="Fredrick James Walker" class="mw-redirect">Fred Walker</a></td>
#<td>19 May 1914<sup id="cite_ref-6" class="reference"><a href="#cite_note-6"><span>[</span>6<span>]</span></a></sup></td>
#<td><a href="/wiki/St_Ninian%27s_Crossroads" title="St Ninian's Crossroads">Ballaquayle Road</a><sup id="cite_ref-7" class="reference"><a href="#cite_note-7"><span>[</span>7<span>]</span></a></sup></td>
#<td><a href="/wiki/1914_Isle_of_Man_TT" title="1914 Isle of Man TT">1914 Isle of Man TT</a></td>
#<td>Junior TT</td>
#<td>Royal Enfield</td>
#</tr>
#<tr>
#<td>4</td>
#<td>
#    <span class="flagicon">
#        <a href="/wiki/England" title="England">
#            <img alt="England" src="//upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/22px-Flag_of_England.svg.png" width="22" height="13" class="thumbborder" srcset="//upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/33px-Flag_of_England.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/44px-Flag_of_England.svg.png 2x" />
#        </a>
#     </span> J H H Veasey</td>
#<td>15 June 1923<sup id="cite_ref-8" class="reference"><a href="#cite_note-8"><span>[</span>8<span>]</span></a></sup></td>
#<td><a href="/wiki/Greeba_Bridge" title="Greeba Bridge">Greeba Bridge</a></td>
#<td><a href="/wiki/1923_Isle_of_Man_TT" title="1923 Isle of Man TT">1923 Isle of Man TT</a></td>
#<td>Senior TT</td>
#<td>500cc Douglas</td>
#</tr>
#<tr>












	############### CELL 1: DATE OF DEATH ###############
	if (r.by_tag("td")[2] and len(r.by_tag("td")[2].content) > 0) :
		date = r.by_tag("td")[2].content.replace('\n','').strip()  # remove any newlines or spaces
		date = re.sub(r'^(.*)\<sup.*$', r'\1', date).encode('ascii', 'ignore')
		date = removeSuperscripts(date);
		if (len(date) > 1) :
			year_match = re.match('^.*(\d\d\d\d)$', date)
			if (year_match and year_match.group(1)):
				year = year_match.group(1)




	############### CELL 1: PLACE ON COURSE DIED ###############
	if (r.by_tag("td")[3]) :


#<tr>
#    <td>206</td>
#    <td>
#        <span class="flagicon">
#            <a href="/wiki/England" title="England">
#                <img alt="England" src="//upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/22px-Flag_of_England.svg.png" width="22" height="13" class="thumbborder" srcset="//upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/33px-Flag_of_England.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/44px-Flag_of_England.svg.png 2x" />
#            </a>
#        </span>
#        <a href="/wiki/David_Jefferies" title="David Jefferies">David Jefferies</a>
#   </td>
#	<td>29 May 2003<sup id="cite_ref-188" class="reference"><a href="#cite_note-188"><span>[</span>188<span>]</span></a></sup></td>
#	<td>
#       <a href="/wiki/Crosby,_Isle_of_Man" title="Crosby, Isle of Man">Crosby</a>
#       <sup id="cite_ref-189" class="reference">
#           <a href="#cite_note-189">
#               <span>[</span>189<span>]</span>
#           </a>
#       </sup>
#       <sup id="cite_ref-190" class="reference">
#           <a href="#cite_note-190">
#               <span>[</span>190<span>]</span>
#           </a>
#       </sup>
#   </td>
#	<td><a href="/w/index.php?title=2003_Isle_of_Man_TT&amp;action=edit&amp;redlink=1" class="new" title="2003 Isle of Man TT (page does not exist)">2003 Isle of Man TT</a></td>
#	<td>Practice</td>
#	<td><a href="/wiki/Suzuki_GSX-R1000" title="Suzuki GSX-R1000">Suzuki GSX-R1000</a><sup id="cite_ref-191" class="reference"><a href="#cite_note-191"><span>[</span>191<span>]</span></a></sup></td>
#	</tr>

		place = removeSuperscripts(r.by_tag("td")[3].content)
		place = removeTags(place, "span")

		match = re.match('^\<a.*\>(.*)\</a\>$', place.strip())
		if (match):
			place = match.group(1)

		#if(len(r.by_tag("td")[3].by_tag("a")) > 0 and r.by_tag("td")[3].by_tag("a")[0]) :
		#	place = convertUnicodeToAscii(r.by_tag("td")[3].by_tag("a")[0].content)
		#	place = removeSuperscripts(place)
		#else:
		#	place = removeSuperscripts(r.by_tag("td")[3].content)
		#	place = convertUnicodeToAscii(place)







	############### CELL 1: RACE NAME ###############
	if (r.by_tag("td")[4] and r.by_tag("td")[4].by_tag("a")[0]) :
		race = convertUnicodeToAscii(r.by_tag("td")[4].by_tag("a")[0].content)
		race = removeSuperscripts(race)

	############### CELL 1: EVENT NAME ###############
	if (r.by_tag("td")[5]) :
		event = convertUnicodeToAscii(r.by_tag("td")[5].content)
		event = removeSuperscripts(event)

	############### CELL 1: RIDER MOTORCYCLE ###############
	if (r.by_tag("td")[6]) :
		# check if there's any anchor tags
		if ( len(r.by_tag("td")[6].by_tag("a")) > 0 ) :
			machine = convertUnicodeToAscii(r.by_tag("td")[6].content)
			machine = removeSuperscripts(machine)
		else :
			machine = removeSuperscripts(r.by_tag("td")[6].content)
			machine = convertUnicodeToAscii(machine)


	writer.writerow([
		number,
		rider_name,
		rider_country,
		rider_country_flag,
		date,
		year,
		place,
		race,
		event,
		machine
	])

output.close()
