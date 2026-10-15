'use strict';
// Handpicked classroom-appropriate quotations; no live or unmoderated quote feed.
// Quotes remain paired with their speaker. Portrait sources and licenses are retained.
window.SCIENTISTS = [
  {
    "id": "curie",
    "name": "Marie Curie",
    "image": "assets/scientists/curie.webp",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Marie_Curie_c1920.jpg",
    "imageCredit": "Henri Manuel, c. 1920 · Public domain",
    "quotes": [
      {
        "text": "I was entirely absorbed in the joy of learning and understanding.",
        "source": "https://history.aip.org/exhibits/curie/brief/06_quotes/quotes_04.html",
        "sourceLabel": "Autobiographical Notes, pp. 170–171 · American Institute of Physics"
      },
      {
        "text": "All that I saw and learned that was new delighted me.",
        "source": "https://history.aip.org/exhibits/curie/brief/06_quotes/quotes_04.html",
        "sourceLabel": "Autobiographical Notes, pp. 170–171 · American Institute of Physics"
      }
    ]
  },
  {
    "id": "newton",
    "name": "Isaac Newton",
    "image": "assets/scientists/newton.webp",
    "quote": "If I have seen farther, it is by standing on the shoulders of giants.",
    "source": "https://newtonproject.ox.ac.uk/view/texts/normalized/OTHE00101",
    "sourceLabel": "Letter to Robert Hooke, 1676, reproduced in Brewster’s Memoirs · The Newton Project",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Portrait_of_Sir_Isaac_Newton,_1689.jpg",
    "imageCredit": "Godfrey Kneller, 1689 · Public domain"
  },
  {
    "id": "darwin",
    "name": "Charles Darwin",
    "image": "assets/scientists/darwin.webp",
    "quote": "There is grandeur in this view of life",
    "source": "https://darwin-online.org.uk/Variorum/1859/1859-490-dns.html",
    "sourceLabel": "On the Origin of Species, 1859, p. 490 (excerpt) · Darwin Online",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Charles_Darwin_photograph_by_Leonard_Darwin,_circa_1874.jpg",
    "imageCredit": "Leonard Darwin, c. 1874 · Public domain"
  },
  {
    "id": "faraday",
    "name": "Michael Faraday",
    "image": "assets/scientists/faraday.webp",
    "quote": "Nothing is too wonderful to be true if it be consistent with the laws of nature.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Faraday/quotations/",
    "sourceLabel": "Quoted in Des MacHale’s Wisdom (2002) · University of St Andrews, MacTutor",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Faraday.jpg",
    "imageCredit": "Thomas Phillips, 1842 · Public domain"
  },
  {
    "id": "lovelace",
    "name": "Ada Lovelace",
    "image": "assets/scientists/lovelace.webp",
    "quote": "If you can’t give me poetry, can’t you give me poetical science?",
    "source": "https://www.adalovelaceinstitute.org/blog/celebrating-ada-lovelace-day/",
    "sourceLabel": "Celebrating Ada Lovelace Day · Ada Lovelace Institute",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Ada_Lovelace_Chalon_portrait.jpg",
    "imageCredit": "Alfred Edward Chalon, 1840 · Public domain"
  },
  {
    "id": "johnson",
    "name": "Katherine Johnson",
    "image": "assets/scientists/johnson.webp",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Katherine_Johnson_1983.jpg",
    "imageCredit": "NASA, 1983 · Public domain (U.S. government work)",
    "quotes": [
      {
        "text": "Like what you do and then you will do your best.",
        "source": "https://science.nasa.gov/people/katherine-johnson/",
        "sourceLabel": "Katherine Johnson interview · NASA"
      },
      {
        "text": "I like the stars and the stories we were telling.",
        "source": "https://science.nasa.gov/people/katherine-johnson/",
        "sourceLabel": "Katherine Johnson interview · NASA"
      }
    ]
  },
  {
    "id": "einstein",
    "name": "Albert Einstein",
    "image": "assets/scientists/einstein.webp",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Einstein_1921_portrait2.jpg",
    "imageCredit": "Ferdinand Schmutzer, 1921 · Public domain",
    "quotes": [
      {
        "text": "The important thing is not to stop questioning.",
        "source": "https://www.pbs.org/wgbh/nova/einstein/wisd-nf.html",
        "sourceLabel": "William Miller’s memoir, LIFE, 2 May 1955 · Quoted by PBS NOVA"
      },
      {
        "text": "Curiosity has its own reason for existing.",
        "source": "https://www.pbs.org/wgbh/nova/einstein/wisd-nf.html",
        "sourceLabel": "William Miller’s memoir, LIFE, 2 May 1955 · Quoted by PBS NOVA"
      }
    ]
  },
  {
    "id": "feynman",
    "name": "Richard Feynman",
    "image": "assets/scientists/feynman.webp",
    "quote": "What I cannot create, I do not understand.",
    "source": "https://magazine.caltech.edu/post/biology-through-the-eyes-of-a-physicist",
    "sourceLabel": "Feynman’s blackboard · Caltech Magazine",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Richard_Feynman_Los_Alamos_ID_badge_(cropped).jpg",
    "imageCredit": "United States Army, c. 1943 · Public domain (U.S. government work)"
  },
  {
    "id": "galileo",
    "name": "Galileo Galilei",
    "quote": "In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Galileo/quotations/",
    "sourceLabel": "University of St Andrews — MacTutor quotations",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Galileo_Galilei_(1564-1642)_RMG_BHC2700.tiff",
    "imageCredit": "Justus Sustermans; Royal Museums Greenwich, BHC2700; Wikimedia Commons; portrait crop for this gallery · Public domain",
    "image": "assets/scientists/galileo.webp"
  },
  {
    "id": "kepler",
    "name": "Johannes Kepler",
    "quote": "Therefore the path of the planet is an Ellipse.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Kepler/quotations/",
    "sourceLabel": "University of St Andrews — MacTutor quotations",
    "imageSource": "https://commons.wikimedia.org/wiki/File:JKepler.jpg",
    "imageCredit": "August Köhler; Kepler-Museum, Weil der Stadt; Wikimedia Commons; portrait crop for this gallery · Public domain",
    "image": "assets/scientists/kepler.webp"
  },
  {
    "id": "oersted",
    "name": "Hans Christian Ørsted",
    "quote": "To experiment is not to set up experiments blindly, but rather a great scientific art.",
    "source": "https://nbi.ku.dk/english/www/hco/oersted/det_hele_haenger_sammen/",
    "sourceLabel": "University of Copenhagen — Niels Bohr Institute",
    "imageSource": "https://commons.wikimedia.org/wiki/File:C.A._Jensen_-_Portrait_of_the_Physicist_Hans_Christian_Ørsted_-_KMS8176_-_Statens_Museum_for_Kunst.jpg",
    "imageCredit": "C. A. Jensen; Statens Museum for Kunst, KMS8176; Wikimedia Commons; portrait crop for this gallery · Public domain",
    "image": "assets/scientists/oersted.webp"
  },
  {
    "id": "maxwell",
    "name": "James Clerk Maxwell",
    "quote": "Thoroughly conscious ignorance is the prelude to every real advance in science.",
    "source": "https://www.acs.org/content/dam/acsorg/events/popular-chemistry/Slides/2013-01-24-ignorance.pdf",
    "sourceLabel": "American Chemical Society — Ignorance webinar, slide 14 (PDF page 7)",
    "imageSource": "https://commons.wikimedia.org/wiki/File:James-Clerk-Maxwell-1831-1879.jpg",
    "imageCredit": "Unknown photographer; Wikimedia Commons · Public domain",
    "image": "assets/scientists/maxwell.webp"
  },
  {
    "id": "planck",
    "name": "Max Planck",
    "quote": "It is not the possession of truth, but the success which attends the seeking after it, that enriches the seeker and brings happiness to him.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Planck/quotations/",
    "sourceLabel": "University of St Andrews — MacTutor quotations",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Max_Planck_1901.GIF",
    "imageCredit": "Unknown photographer, 1901; Wikimedia Commons · Public domain",
    "image": "assets/scientists/planck.webp"
  },
  {
    "id": "bohr",
    "name": "Niels Bohr",
    "quote": "An expert is a man who has made all the mistakes, which can be made, in a very narrow field.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Bohr_Niels/quotations/",
    "sourceLabel": "University of St Andrews — MacTutor quotations",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Niels_Bohr.jpg",
    "imageCredit": "AB Lagrelius & Westphal; Nobel Foundation, 1922; Wikimedia Commons · Public domain",
    "image": "assets/scientists/bohr.webp"
  },
  {
    "id": "heisenberg",
    "name": "Werner Heisenberg",
    "quote": "Thus, the more precisely the position is determined, the less precisely the momentum is known, and conversely.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Heisenberg/quotations/",
    "sourceLabel": "University of St Andrews — MacTutor quotations",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Werner_Heisenberg_Portrait_(3x4_cropped).jpg",
    "imageCredit": "Bundesarchiv, Bild 183-R57262 / Unknown author / CC BY-SA 3.0 DE; cropped image via Wikimedia Commons; resized",
    "imageLicense": "https://creativecommons.org/licenses/by-sa/3.0/de/",
    "image": "assets/scientists/heisenberg.webp"
  },
  {
    "id": "schrodinger",
    "name": "Erwin Schrödinger",
    "quote": "I belong to those theoreticians who know by direct observation what it means to make a measurement.",
    "source": "https://mathshistory.st-andrews.ac.uk/Biographies/Schrodinger/quotations/",
    "sourceLabel": "University of St Andrews — MacTutor quotations",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Erwin_Schrödinger_-_Narodowe_Archiwum_Cyfrowe_(1-E-939).jpg",
    "imageCredit": "Unknown photographer; Narodowe Archiwum Cyfrowe, 1-E-939; Wikimedia Commons · Public domain",
    "image": "assets/scientists/schrodinger.webp"
  },
  {
    "id": "pasteur",
    "name": "Louis Pasteur",
    "quote": "Chance favors the prepared mind.",
    "source": "https://www.pasteur.fr/en/whats-new/latest-news/features/institut-pasteur-2018-legacy-excellence",
    "sourceLabel": "Institut Pasteur — A legacy of excellence",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Louis_Pasteur_portrait_photo.jpg",
    "imageCredit": "Unattributed photographer / Hulton Archive, 1891; Wikimedia Commons · Public domain",
    "image": "assets/scientists/pasteur.webp"
  },
  {
    "id": "franklin",
    "name": "Rosalind Franklin",
    "quote": "Science and everyday life cannot and should not be separated.",
    "source": "https://www.kcl.ac.uk/photo-51-and-the-discovery-of-dna",
    "sourceLabel": "King’s College London — Photo 51",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Rosalind-franklin-in-paris_crop.jpg",
    "imageCredit": "CSHL; crop and tonal edits by Lämpel / Wikimedia Commons; portrait crop for this gallery",
    "imageLicense": "https://creativecommons.org/licenses/by-sa/4.0/",
    "image": "assets/scientists/franklin.webp"
  },
  {
    "id": "mcclintock",
    "name": "Barbara McClintock",
    "quote": "I am very much interested in the nature of changes in the genome when the genome meets something very unexpected.",
    "source": "https://www.cshl.edu/barbara-mcclintock-free-to-discover/",
    "sourceLabel": "Cold Spring Harbor Laboratory — Free to discover",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Portrait_of_Barbara_McClintock_%28by_Bernard_Gotfryd%29_%E2%80%93_LOC.jpg",
    "imageCredit": "Bernard Gotfryd / Library of Congress; Wikimedia Commons crop; portrait crop for this gallery · No known copyright restrictions (Library of Congress / Flickr Commons)",
    "image": "assets/scientists/mcclintock.webp"
  },
  {
    "id": "hodgkin",
    "name": "Dorothy Hodgkin",
    "quote": "I was captured for life by chemistry and by crystals.",
    "source": "https://royalsociety.org/about-us/who-we-are/diversity-inclusion/case-studies/scientists-with-disabilities/dorothy-hodgkin/",
    "sourceLabel": "The Royal Society — Dorothy Hodgkin FRS",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Dorothy_Hodgkin_im_Talar_%28cropped%29.jpg",
    "imageCredit": "University of Bristol; Wikimedia Commons crop by Kaletrosa~eswiki",
    "imageLicense": "https://creativecommons.org/licenses/by-sa/2.5/",
    "image": "assets/scientists/hodgkin.webp"
  },
  {
    "id": "salk",
    "name": "Jonas Salk",
    "quote": "Hope lies in dreams, in imagination and in the courage of those who dare to make dreams into reality.",
    "source": "https://www.salk.edu/about/history-of-salk/jonas-salk/",
    "sourceLabel": "Salk Institute — About Jonas Salk",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Jonas_Salk_1988.jpg",
    "imageCredit": "CDC Public Health Image Library, photo 7356 / Wikimedia Commons; portrait crop for this gallery · Public domain — U.S. government",
    "image": "assets/scientists/salk.webp"
  },
  {
    "id": "carson",
    "name": "Rachel Carson",
    "quote": "Those who contemplate the beauty of the earth find reserves of strength that will endure as long as life lasts.",
    "source": "https://archive.epa.gov/publicinvolvement/web/html/rachelcarsonsenseofwonder_article.html",
    "sourceLabel": "U.S. EPA — Rachel Carson Sense of Wonder",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Rachel-Carson.jpg",
    "imageCredit": "U.S. Fish and Wildlife Service / Wikimedia Commons · Public domain — U.S. government",
    "image": "assets/scientists/carson.webp"
  },
  {
    "id": "meitner",
    "name": "Lise Meitner",
    "quote": "Science makes people reach selflessly for truth and objectivity…",
    "source": "https://calderon.faculty.ucdavis.edu/teaching/",
    "sourceLabel": "UC Davis — Manuel Calderón de la Barca Sánchez teaching page",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Lise_Meitner_NatGeo.jpg",
    "imageCredit": "Harris & Ewing / Library of Congress; Wikimedia Commons; portrait crop for this gallery · Public domain / no known copyright restrictions",
    "image": "assets/scientists/meitner.webp"
  },
  {
    "id": "elion",
    "name": "Gertrude B. Elion",
    "quote": "Don’t be afraid of hard work. Nothing worthwhile comes easily.",
    "source": "https://interfaces.che.wisc.edu/gertrude-b-elion/",
    "sourceLabel": "University of Wisconsin–Madison — Gertrude B. Elion",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Nci-vol-8236-300_Gertrude_Elion.jpg",
    "imageCredit": "National Cancer Institute, Visuals Online image 8236 / Wikimedia Commons · Public domain",
    "image": "assets/scientists/elion.webp"
  },
  {
    "id": "sagan",
    "name": "Carl Sagan",
    "quote": "We are a way for the cosmos to know itself.",
    "source": "https://www.loc.gov/collections/finding-our-place-in-the-cosmos-with-carl-sagan/about-this-collection/",
    "sourceLabel": "Library of Congress — Carl Sagan collection",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Carl_Sagan_Planetary_Society_cropped.png",
    "imageCredit": "NASA/JPL; public domain · Public domain",
    "image": "assets/scientists/sagan.webp"
  },
  {
    "id": "hubble",
    "name": "Edwin Hubble",
    "quote": "Equipped with his five senses, man explores the universe around him and calls the adventure science.",
    "source": "https://blog.galaxyzoo.org/2010/08/16/edwin-hubble-the-man-behind-hst/",
    "sourceLabel": "Galaxy Zoo / Zooniverse — Edwin Hubble",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Studio_portrait_photograph_of_Edwin_Powell_Hubble_%28cropped%29.JPG",
    "imageCredit": "Johan Hagemeyer (1931), Huntington Library; public domain · Public domain",
    "image": "assets/scientists/hubble.webp"
  },
  {
    "id": "hawking",
    "name": "Stephen Hawking",
    "quote": "So remember to look up at the stars and not down at your feet.",
    "source": "https://www.cam.ac.uk/stories/stephen-hawking",
    "sourceLabel": "University of Cambridge — Professor Stephen Hawking",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Stephen_hawking_2008_nasa_cropped.jpg",
    "imageCredit": "NASA/Paul Alers (2008); public domain; portrait crop for this gallery · Public domain",
    "image": "assets/scientists/hawking.webp"
  },
  {
    "id": "goodall",
    "name": "Jane Goodall",
    "quote": "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    "source": "https://janegoodall.org/news/the-work-continues-the-jane-goodall-institute-carrying-forward-janes-mission/",
    "sourceLabel": "Jane Goodall Institute — Carrying Forward Jane’s Mission",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Jane_Goodall_2015.jpg",
    "imageCredit": "U.S. Department of State (2015); public domain · Public domain",
    "image": "assets/scientists/goodall.webp"
  },
  {
    "id": "wu",
    "name": "Chien-Shiung Wu",
    "quote": "A glimpse of this wonder can be the reward of a lifetime.",
    "source": "https://www.nationalgeographic.com/premium/article/chien-shiung-wu-chinese-american-woman-physics-manhattan-project",
    "sourceLabel": "National Geographic — How Chien-Shiung Wu changed the laws of physics",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Chien-shiung_Wu_(1912-1997)_(cropped).jpg",
    "imageCredit": "Smithsonian Institution / Flickr Commons; no known copyright restrictions",
    "imageLicense": "https://www.flickr.com/commons/usage/",
    "image": "assets/scientists/wu.webp"
  },
  {
    "id": "raman",
    "name": "C. V. Raman",
    "quote": "The essence of Science is independent thinking, hard work and not equipment.",
    "source": "https://www.ias.ac.in/public/Resources/Other_Publications/e-Publications/003/Chandrasekhara_Venkata_Raman.pdf",
    "sourceLabel": "Indian Academy of Sciences — C. V. Raman: A Memoir",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Sir_CV_Raman.JPG",
    "imageCredit": "Nobel Foundation (1930); public domain · Public domain",
    "image": "assets/scientists/raman.webp"
  },
  {
    "id": "ramanujan",
    "name": "Srinivasa Ramanujan",
    "quote": "An equation means nothing to me unless it expresses a thought of God.",
    "source": "https://arxiv.org/abs/1707.03379",
    "sourceLabel": "Frank Aiello — Ramanujan’s Thoughts from God (2017)",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Srinivasa_Ramanujan-_Add._MS_a947.jpg",
    "imageCredit": "Unknown photographer (1913), Trinity College Cambridge; public domain · Public domain",
    "image": "assets/scientists/ramanujan.webp"
  },
  {
    "id": "tesla",
    "name": "Nikola Tesla",
    "quote": "The present is theirs; the future, for which I really worked, is mine.",
    "source": "https://expo.teslasciencecenter.org/2026/",
    "sourceLabel": "Tesla Science Center at Wardenclyffe",
    "imageSource": "https://commons.wikimedia.org/wiki/File:Nikola_Tesla_by_Sarony_c1893.jpg",
    "imageCredit": "Napoleon Sarony (c. 1893), Harvard Art Museums; public domain · Public domain",
    "image": "assets/scientists/tesla.webp"
  }
];
