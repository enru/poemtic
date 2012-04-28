import web
import re
import base64
from visipo import Visipo

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
		v = Visipo('1c9999f58ecae73d1fcb474014fa1edc')
		return v.image(i.words)

if __name__=='__main__':
    app.run()

