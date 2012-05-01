import web
import re
import base64
from poemtic import Poemtic
import os

urls = (
	'/','Index',
	'/word', 'Word',
)

app = web.application(urls,globals())
render = web.template.render('templates/')

class Index:
	def GET(self):
		return render.index()

class Word:
	def POST(self):
		i = web.input()
		p = Poemtic(os.environ['FLICKR_API_KEY'])
		return p.image(i.words)

if __name__=='__main__':
	app.run()

